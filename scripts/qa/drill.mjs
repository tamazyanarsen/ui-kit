// По одному текстовому аргументу: какой из них растягивает страницу на 375 и каким элементом.
import { chromium } from 'playwright-core'
import { chromePath } from './chrome.mjs'
import fs from 'node:fs'
const SB = process.env.SB || 'http://localhost:6411'
const ids = process.argv.slice(2)
const LONG = 'Непрерывноеслововбезпробелов'.repeat(3)
const b = await chromium.launch({ executablePath: chromePath(), headless: true })
const ctx = await b.newContext()
const res = {}
for (const id of ids) {
  const page = await ctx.newPage(); await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(`${SB}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`)
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'), null, { timeout: 15000 })
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  const keys = await page.evaluate(async () => {
    const s = await window.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId: new URLSearchParams(location.search).get('id') })
    return Object.keys(s.argTypes).filter((k) => { const v = s.initialArgs[k]; const c = s.argTypes[k].control?.type
      return typeof v === 'string' && (c === 'text' || c === undefined) && !/^(className|id|name|key|href|src|alt|value|defaultValue|type)$/.test(k) })
  })
  const base = await page.evaluate(() => document.documentElement.scrollWidth)
  res[id] = { base, args: {} }
  for (const k of keys) {
    const r = await page.evaluate(async ([k, LONG, id]) => {
      const pv = window.__STORYBOOK_PREVIEW__
      const s = await pv.storyStore.loadStory({ storyId: id })
      pv.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: { [k]: LONG } })
      await new Promise((r) => setTimeout(r, 300))
      const vw = innerWidth; let culprit = ''
      for (const el of document.querySelectorAll('#storybook-root *')) {
        const r = el.getBoundingClientRect()
        if (r.right > vw + 1 && r.width > 0) { culprit = `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)} w=${Math.round(r.width)}`; }
      }
      const sw = document.documentElement.scrollWidth
      pv.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: { [k]: s.initialArgs[k] } })
      await new Promise((r) => setTimeout(r, 200))
      return { sw, culprit }
    }, [k, LONG, id])
    if (r.sw > base + 1) res[id].args[k] = r
  }
  await page.close()
}
await b.close()
for (const [id, v] of Object.entries(res)) {
  console.log(id.split('--')[0].split('-').slice(-2).join('-') + '--' + id.split('--').pop(), 'base', v.base)
  for (const [k, r] of Object.entries(v.args)) console.log('   ', k, r.sw, r.culprit)
}
