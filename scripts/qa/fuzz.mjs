// Пропсовый фазз (слой 2): случайные сочетания аргументов историй по argTypes, замер DOM после каждого.
// Найденная комбинация сжимается: аргументы по одному возвращаются к исходным, пока аномалия остаётся.
// Результат воспроизводим по сиду: node scripts/qa/fuzz.mjs --sb <url> --out <папка> [--iterations 25] [--seed 1] [--filter подстрока] [--workers 4]
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
import { chromePath } from './chrome.mjs'

const A = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, all) => {
  if (v.startsWith('--')) acc.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
  return acc
}, []))
const SB = A.sb || 'http://localhost:6411'
const OUT = A.out || '.qa/out/fuzz'
const ITER = Number(A.iterations || 25)
const SEED = Number(A.seed || 1)
const WORKERS = Number(A.workers || 4)
const KNOWN_FILE = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'known-findings.json')
const KNOWN = fs.existsSync(KNOWN_FILE) ? JSON.parse(fs.readFileSync(KNOWN_FILE, 'utf-8')) : {}
const VPS = [{ name: '1280', width: 1280, height: 900 }, { name: '375', width: 375, height: 800 }]

const LONG = 'Непрерывноеслововбезпробелов'.repeat(2)
const TEXTS = ['', 'Коротко', 'Средняя подпись для проверки переноса строки', LONG, '0', '   ', 'Ёлки-палки, договор № 000123/45 от 01.02.2026 на сумму 1 200 000,50 ₽']

const index = await (await fetch(SB + '/index.json')).json()
let stories = Object.values(index.entries).filter((e) => e.type === 'story')
if (A.filter) stories = stories.filter((s) => s.id.includes(A.filter))
fs.mkdirSync(OUT, { recursive: true })

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7)

const browser = await chromium.launch({ executablePath: chromePath(), headless: true })

// Замер внутри страницы (тот же, что в audit.mjs); baseWidth — ширина документа при исходных аргументах.
const inspect = (baseWidth) => {
  const root = document.querySelector('#storybook-root') || document.body
  const vw = window.innerWidth
  const out = []
  const limit = Math.max(baseWidth, vw)
  if (document.documentElement.scrollWidth - limit > 1) out.push({ kind: 'page-overflow', detail: `scrollWidth ${document.documentElement.scrollWidth} > ${limit}` })
  if (document.body.classList.contains('sb-show-errordisplay')) out.push({ kind: 'story-error', detail: (document.querySelector('.sb-errordisplay')?.textContent || '').trim().slice(0, 160) })
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const bad = /(^|[\s(])(NaN|undefined|null|Infinity|\[object Object\])([\s).,%₽]|$)/
  let n
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim()
    if (t && bad.test(t) && n.parentElement && n.parentElement.offsetParent !== null) out.push({ kind: 'bad-text', detail: t.slice(0, 80) })
  }
  return out
}

async function openStory(context, story, vp, errors) {
  const page = await context.newPage()
  await page.setViewportSize({ width: vp.width, height: vp.height })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 160)))
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text())) errors.push('console: ' + m.text().slice(0, 160)) })
  await page.goto(`${SB}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'load', timeout: 30000 })
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'), null, { timeout: 15000 })
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.evaluate(() => document.fonts.ready)
  return page
}

// Описание управляемых аргументов истории: { ключ: { type, initial, options? , min?, max? } }
const describeArgs = (page) => page.evaluate(async () => {
  const pv = window.__STORYBOOK_PREVIEW__
  const id = new URLSearchParams(location.search).get('id')
  const s = await pv.storyStore.loadStory({ storyId: id })
  const res = {}
  for (const [k, t] of Object.entries(s.argTypes)) {
    if (/^(className|id|key|ref|children|as|render)$/.test(k) && typeof s.initialArgs[k] !== 'string') continue
    const ctl = typeof t.control === 'string' ? t.control : t.control?.type
    const v = s.initialArgs[k]
    if (['select', 'radio', 'inline-radio'].includes(ctl) && Array.isArray(t.options) && t.options.length) res[k] = { type: 'options', initial: v, options: t.options.filter((o) => ['string', 'number', 'boolean'].includes(typeof o)) }
    else if (ctl === 'boolean' || typeof v === 'boolean') res[k] = { type: 'boolean', initial: v }
    else if (ctl === 'number' || ctl === 'range' || typeof v === 'number') res[k] = { type: 'number', initial: v, min: t.control?.min, max: t.control?.max }
    else if (ctl === 'text' || typeof v === 'string') res[k] = { type: 'text', initial: v }
  }
  return res
})

function randomValue(spec, r) {
  const pick = (a) => a[Math.floor(r() * a.length)]
  if (spec.type === 'boolean') return r() < 0.5
  if (spec.type === 'options') return spec.options.length ? pick(spec.options) : spec.initial
  if (spec.type === 'number') {
    const cand = [spec.initial ?? 0, 0, 1, 5, 100, 12345]
    if (typeof spec.min === 'number') cand.push(spec.min)
    if (typeof spec.max === 'number') cand.push(spec.max)
    const v = pick(cand)
    return typeof spec.min === 'number' ? Math.max(spec.min, typeof spec.max === 'number' ? Math.min(spec.max, v) : v) : v
  }
  return pick([spec.initial ?? '', ...TEXTS])
}

const apply = (page, args) => page.evaluate(async (args) => {
  const pv = window.__STORYBOOK_PREVIEW__
  const id = new URLSearchParams(location.search).get('id')
  pv.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: args })
  await new Promise((r) => setTimeout(r, 130))
}, args)

async function measure(page, args, baseWidth) {
  await apply(page, args)
  return await page.evaluate(inspect, baseWidth)
}

async function fuzzStory(context, story, vp) {
  const errors = []
  let page
  try { page = await openStory(context, story, vp, errors) } catch (e) { return { id: story.id, vp: vp.name, harness: String(e.message).slice(0, 120), failures: [] } }
  const specs = await describeArgs(page)
  const keys = Object.keys(specs)
  const initial = Object.fromEntries(keys.map((k) => [k, specs[k].initial]))
  if (!keys.length) { await page.close(); return { id: story.id, vp: vp.name, skipped: true, failures: [] } }
  const baseWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const r = rng(SEED * 1000003 + hash(story.id) + vp.width)
  const failures = []
  const seen = new Set()
  for (let i = 0; i < ITER; i++) {
    const args = Object.fromEntries(keys.map((k) => [k, randomValue(specs[k], r)]))
    errors.length = 0
    let an = await measure(page, args, baseWidth)
    const errs = [...errors]
    if (!an.length && !errs.length) continue
    // Сжатие: возвращаем аргументы к исходным по одному, пока аномалия того же вида сохраняется.
    const kind = (an[0] || { kind: 'console-error' }).kind
    let cur = { ...args }
    for (const k of keys) {
      if (JSON.stringify(cur[k]) === JSON.stringify(initial[k])) continue
      const trial = { ...cur, [k]: initial[k] }
      errors.length = 0
      const a2 = await measure(page, trial, baseWidth)
      if (kind === 'console-error' ? errors.length : a2.some((x) => x.kind === kind)) cur = trial
    }
    const minimal = Object.fromEntries(Object.entries(cur).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(initial[k])))
    const sig = kind + JSON.stringify(Object.keys(minimal).sort())
    if (!seen.has(sig)) {
      seen.add(sig)
      failures.push({ iter: i, kind, detail: (an.find((x) => x.kind === kind) || {}).detail || errs[0], minimal })
    }
    if (an.some((x) => x.kind === 'story-error')) {
      await page.close()
      page = await openStory(context, story, vp, errors)
    }
  }
  await page.close()
  return { id: story.id, vp: vp.name, failures }
}

const jobs = []
for (const s of stories) for (const vp of VPS) jobs.push([s, vp])
const results = []
let next = 0
await Promise.all(Array.from({ length: WORKERS }, async () => {
  const context = await browser.newContext()
  while (next < jobs.length) {
    const [s, vp] = jobs[next++]
    try { results.push(await fuzzStory(context, s, vp)) } catch (e) { results.push({ id: s.id, vp: vp.name, harness: String(e.message).slice(0, 120), failures: [] }) }
    if (results.length % 40 === 0) console.error(`${results.length}/${jobs.length}`)
  }
  await context.close()
}))
await browser.close()
results.sort((a, b) => (a.id + a.vp).localeCompare(b.id + b.vp))
fs.writeFileSync(path.join(OUT, 'fuzz.json'), JSON.stringify({ seed: SEED, iterations: ITER, results }, null, 1))
// Подпись находки: история, ширина, вид, набор изменённых аргументов. Известные (принятые, с причиной в
// known-findings.json) подписи скрываются, кроме режима --all.
const sigOf = (r, f) => `${r.id.split('--').slice(-2).join('--')}|${r.vp}|${f.kind}|${Object.keys(f.minimal).sort().join(',')}`
let knownHidden = 0
for (const r of results) for (const f of r.failures) { f.sig = sigOf(r, f); f.known = f.sig in KNOWN; if (f.known && !A.all) knownHidden++ }
const bad = results.filter((r) => r.failures.some((f) => A.all || !f.known))
for (const r of bad) {
  console.log(`${r.id} @${r.vp}`)
  for (const f of r.failures.filter((f) => A.all || !f.known)) {
    console.log(`   ${f.known ? '[известно] ' : ''}${f.kind}: ${String(f.detail).slice(0, 100)}\n      args: ${JSON.stringify(f.minimal).slice(0, 220)}\n      sig: ${f.sig}`)
  }
}
console.log(`известных скрыто: ${knownHidden}`)
console.log(`\nисторий×ширин ${results.length}, пропущено ${results.filter((r) => r.skipped).length}, новых сбоев ${bad.length}, seed ${SEED}, итераций ${ITER}`)
