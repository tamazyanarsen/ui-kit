// Запуск записанных сценариев взаимодействия в живом Chrome (слой 4).
// Сценарии лежат в scripts/qa/scenarios/*.mjs, каждый файл экспортирует по умолчанию массив:
//   { name, story, viewport?: [w, h], run: async ({ page, expect, step }) => {} }
// `story` — точный id истории или подстрока (берётся первая подходящая). `expect(cond, сообщение)` кидает
// ошибку при ложном условии; `expect.eq(получено, ожидалось, сообщение)` сравнивает значения.
// Ошибки консоли и падения страницы во время сценария считаются провалом.
// node scripts/qa/scenarios.mjs --sb http://localhost:6411 [--filter подстрока-имени] [--workers 3]
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromePath } from './chrome.mjs'

const A = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, all) => {
  if (v.startsWith('--')) acc.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
  return acc
}, []))
const SB = A.sb || 'http://localhost:6411'
const WORKERS = Number(A.workers || 3)
const dir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'scenarios')

const index = await (await fetch(SB + '/index.json')).json()
const stories = Object.values(index.entries).filter((e) => e.type === 'story')
const findStory = (q) => stories.find((s) => s.id === q) || stories.find((s) => s.id.includes(q))

let scenarios = []
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))) {
  const mod = await import(pathToFileURL(path.join(dir, f)).href)
  for (const s of mod.default) scenarios.push({ ...s, file: f })
}
if (A.filter) scenarios = scenarios.filter((s) => s.name.includes(A.filter) || s.file.includes(A.filter))

const browser = await chromium.launch({ executablePath: chromePath(), headless: true })

const expect = (cond, msg) => { if (!cond) throw new Error(msg || 'expect failed') }
expect.eq = (got, want, msg) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`${msg || 'eq'}: получено ${JSON.stringify(got)}, ожидалось ${JSON.stringify(want)}`)
}

async function runScenario(context, sc) {
  const story = findStory(sc.story)
  if (!story) return { ...sc, ok: false, error: `нет истории «${sc.story}»` }
  const page = await context.newPage()
  const [w, h] = sc.viewport || [1280, 900]
  await page.setViewportSize({ width: w, height: h })
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 160)))
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text())) errors.push('console: ' + m.text().slice(0, 160)) })
  let error = null
  try {
    await page.goto(`${SB}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'load', timeout: 30000 })
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main'), null, { timeout: 15000 })
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
    await page.evaluate(() => document.fonts.ready)
    let stepName = ''
    await sc.run({ page, expect, story, step: (n) => { stepName = n } })
    if (errors.length) error = 'ошибки консоли: ' + errors[0]
    if (error && stepName) error += ` (после шага «${stepName}»)`
  } catch (e) {
    error = String(e.message).split('\n')[0].slice(0, 300)
  }
  await page.close()
  return { name: sc.name, file: sc.file, ok: !error, error }
}

const results = []
let next = 0
await Promise.all(Array.from({ length: WORKERS }, async () => {
  const context = await browser.newContext()
  while (next < scenarios.length) {
    const sc = scenarios[next++]
    let r = await runScenario(context, sc)
    if (!r.ok && /Failed to fetch|Timeout/.test(r.error || '')) r = await runScenario(context, sc)
    results.push(r)
  }
  await context.close()
}))
await browser.close()
results.sort((a, b) => (a.file + a.name).localeCompare(b.file + b.name))
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.file.replace('.mjs', '')} · ${r.name}${r.ok ? '' : '\n       ' + r.error}`)
const failed = results.filter((r) => !r.ok).length
console.log(`\nсценариев ${results.length}, провалено ${failed}`)
process.exit(failed ? 1 : 0)
