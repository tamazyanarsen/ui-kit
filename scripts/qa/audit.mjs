// Прогон всех историй Storybook в живом Chrome: скриншоты + замеры DOM.
// Обычно запускается через `npm run qa` (scripts/qa/run.mjs), напрямую:
// node scripts/qa/audit.mjs --sb http://localhost:6411 --mode base|hard --out .qa/out/base [--filter текст] [--workers 4]
import { chromium } from 'playwright-core'
import { chromePath } from './chrome.mjs'
import fs from 'node:fs'
import path from 'node:path'

const A = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, all) => {
  if (v.startsWith('--')) acc.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
  return acc
}, []))
const SB = A.sb || 'http://localhost:6411'
const MODE = A.mode || 'base'
const OUT = A.out || 'out/run'
const WORKERS = Number(A.workers || 4)
const VPS = [{ name: '1280', width: 1280, height: 900 }, { name: '375', width: 375, height: 800 }]
const LONG = 'Непрерывноеслововбезпробелов'.repeat(3)
const VARIANTS = MODE === 'hard' ? ['long', 'empty', 'zero'] : ['base']

const index = await (await fetch(SB + '/index.json')).json()
let stories = Object.values(index.entries).filter((e) => e.type === 'story')
if (A.filter) stories = stories.filter((s) => s.id.includes(A.filter))
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true })

const browser = await chromium.launch({ executablePath: chromePath(), headless: true })

// Замер внутри страницы: возвращает список аномалий.
const inspect = () => {
  const root = document.querySelector('#storybook-root') || document.body
  const vw = window.innerWidth
  const out = []
  if (document.documentElement.scrollWidth - vw > 1) out.push({ kind: 'page-overflow', detail: `scrollWidth ${document.documentElement.scrollWidth} > ${vw}` })
  if (document.body.classList.contains('sb-show-errordisplay')) {
    out.push({ kind: 'story-error', detail: (document.querySelector('.sb-errordisplay').textContent || '').slice(0, 200) })
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const bad = /(^|[\s(])(NaN|undefined|null|Infinity|\[object Object\])([\s).,%₽]|$)/
  let n
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim()
    if (t && bad.test(t) && n.parentElement && n.parentElement.offsetParent !== null) out.push({ kind: 'bad-text', detail: t.slice(0, 80) })
  }
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p)
      if (cs.overflowX !== 'visible' && p.getBoundingClientRect().right <= vw + 1) return true
    }
    return false
  }
  let count = 0
  for (const el of root.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed' || cs.visibility === 'hidden') continue
    if (r.right > vw + 1 && !clipped(el) && count < 4) {
      count++
      out.push({ kind: 'beyond-viewport', detail: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)} w=${Math.round(r.width)}` })
    }
  }
  return out
}

async function applyVariant(page, id, variant) {
  if (variant === 'base') return { applied: 0 }
  return await page.evaluate(async ([id, variant, LONG]) => {
    const pv = window.__STORYBOOK_PREVIEW__
    const s = await pv.storyStore.loadStory({ storyId: id })
    const upd = {}
    for (const [k, t] of Object.entries(s.argTypes)) {
      const v = s.initialArgs[k]
      const ctl = t.control?.type
      if (typeof v === 'string' && (ctl === 'text' || ctl === undefined) && !/^(className|id|name|key|href|src|alt|value|defaultValue|type)$/.test(k)) {
        upd[k] = variant === 'long' ? LONG : variant === 'empty' ? '' : 0
      } else if (typeof v === 'number' && ctl === 'number' && variant === 'zero') upd[k] = 0
    }
    if (!Object.keys(upd).length) return { applied: 0 }
    pv.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: upd })
    return { applied: Object.keys(upd).length, keys: Object.keys(upd) }
  }, [id, variant, LONG])
}

async function runOne(context, story, vp, variant) {
  const page = await context.newPage()
  await page.setViewportSize({ width: vp.width, height: vp.height })
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 200)))
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200))
  })
  const rec = { id: story.id, vp: vp.name, variant, anomalies: [], errors, applied: 0 }
  try {
    await page.goto(`${SB}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'load', timeout: 30000 })
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay'), null, { timeout: 15000 })
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' })
    await page.evaluate(() => document.fonts.ready)
    if (variant !== 'base') {
      const r = await applyVariant(page, story.id, variant)
      rec.applied = r.applied
      if (!r.applied) { rec.skipped = true; await page.close(); return rec }
    }
    await page.waitForTimeout(350)
    rec.anomalies = await page.evaluate(inspect)
    const h = await page.evaluate(() => Math.min(document.documentElement.scrollHeight, 5000))
    const shot = path.join(OUT, 'shots', `${story.id}__${vp.name}__${variant}.png`)
    if (MODE === 'base' || rec.anomalies.length || errors.length) {
      await page.setViewportSize({ width: vp.width, height: h })
      await page.screenshot({ path: shot })
      rec.shot = shot
    }
  } catch (e) {
    rec.errors.push('harness: ' + String(e.message).slice(0, 200))
  }
  await page.close()
  return rec
}

const jobs = []
for (const s of stories) for (const vp of VPS) for (const v of VARIANTS) jobs.push([s, vp, v])
const results = []
let next = 0
await Promise.all(Array.from({ length: WORKERS }, async () => {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  while (next < jobs.length) {
    const j = jobs[next++]
    let r = await runOne(context, ...j)
    for (let t = 0; t < 2 && (r.errors.some((e) => /Failed to fetch dynamically|harness:/.test(e)) || r.anomalies.some((a) => a.kind === 'story-error' && /Failed to fetch/.test(a.detail))); t++) r = await runOne(context, ...j)
    results.push(r)
    if (results.length % 50 === 0) console.error(`${results.length}/${jobs.length}`)
  }
  await context.close()
}))
await browser.close()
results.sort((a, b) => (a.id + a.vp + a.variant).localeCompare(b.id + b.vp + b.variant))
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1))
const bad = results.filter((r) => r.anomalies.length || r.errors.length)
console.log(`jobs ${results.length}, skipped ${results.filter((r) => r.skipped).length}, with anomalies ${bad.length}`)
