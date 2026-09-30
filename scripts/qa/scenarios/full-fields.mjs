// Полный проход по группе «поля» (30.09): значения по мастерам Figma, а не классы.
// ELK / input и ELK / select: в колонке Fill подпись (16) и значение стоят вплотную — верх значения = верх подписи + 16
// на обеих формах (десктоп: блок на y=8, мобильная: на y=7); значки S — 16px; Disabled: значение #6D6D6D, подпись #999,
// замок/шеврон #999. ELK / text-area: Locked сужает ВСЕ строки значения под замок (16 + gap 8), Empty+Hover темнит подпись.
// ELK / calendar: подписи дней недели Regular 400, полоса диапазона у крайних дней начинается/кончается на краю плитки.
import { setArgs } from './fields-lib.mjs'

const IN = 'компоненты-input--playground'
const SEL = 'компоненты-select--playground'
const TA = 'компоненты-text-area--playground'
const CAL = 'компоненты-calendar--playground'

const inputRects = (page) =>
  page.evaluate(() => {
    const i = document.querySelector('#storybook-root input')
    const box = i.parentElement
    const label = box.querySelector('label')
    const cs = getComputedStyle(i)
    const r = i.getBoundingClientRect()
    // Верх строки значения: у input текст начинается за padding-top.
    return {
      valueTop: r.y + parseFloat(cs.paddingTop),
      labelTop: label.getBoundingClientRect().y,
      color: cs.color,
      labelColor: getComputedStyle(label).color,
      boxTop: box.getBoundingClientRect().y,
    }
  })

export default [
  {
    name: 'Input L/Desktop: значение вплотную под подписью (верх +16), Disabled — значение #6D6D6D, подпись #999',
    story: IN,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: IN }, { figmaSize: 'lg-desktop', figmaType: 'filled', state: 'default' })
      const a = await inputRects(page)
      expect.eq(a.valueTop - a.labelTop, 16, 'верх значения − верх подписи')
      await setArgs(page, { id: IN }, { state: 'disabled' })
      const d = await inputRects(page)
      expect.eq([d.color, d.labelColor], ['rgb(109, 109, 109)', 'rgb(153, 153, 153)'], 'цвета Disabled')
    },
  },
  {
    name: 'Input L/Mobile: подпись на y=7, значение на 23 (блок 36 на y=7); замок S — 16px и #999 в Disabled',
    story: IN,
    viewport: [375, 900],
    run: async ({ page, expect }) => {
      await setArgs(page, { id: IN }, { figmaSize: 'lg-mobile', figmaType: 'filled', state: 'default' })
      const m = await inputRects(page)
      expect.eq([m.labelTop - m.boxTop, m.valueTop - m.boxTop], [7, 23], 'подпись/значение от верха коробки')
      await setArgs(page, { id: IN }, { figmaSize: 'sm-desktop', figmaType: 'locked', state: 'disabled' })
      const s = await page.evaluate(() => {
        const svg = document.querySelector('#storybook-root svg')
        const r = svg.getBoundingClientRect()
        return [r.width, r.height, getComputedStyle(svg).color]
      })
      expect.eq(s, [16, 16, 'rgb(153, 153, 153)'], 'замок S Disabled')
    },
  },
  {
    name: 'Select: значение под подписью вплотную (24 из 56), S/Mobile 12/16, Disabled — #6D6D6D / #999 / шеврон #999',
    story: SEL,
    run: async ({ page, expect }) => {
      const base = { figmaSize: 'lg-desktop', state: 'default', figmaType: 'Fill', add: 'none', mask: 'Fill', clearable: true }
      const rects = () =>
        page.evaluate(() => {
          const t = document.querySelector('[data-slot=select-trigger]')
          const top = t.getBoundingClientRect().y
          const leaf = (text) => [...t.querySelectorAll('span')].find((s) => s.textContent === text && !s.querySelector('span'))
          const spans = [leaf('Label'), leaf('Apple')]
          const y = (s) => s.getBoundingClientRect().y - top
          const col = (s) => getComputedStyle(s).color
          return { label: y(spans[0]), value: y(spans[1]), vc: col(spans[1]), lc: col(spans[0]), chev: col([...t.querySelectorAll('svg')].pop()) }
        })
      await setArgs(page, { id: SEL }, base)
      const a = await rects()
      expect.eq([a.label, a.value], [8, 24], 'десктоп: подпись/значение')
      await setArgs(page, { id: SEL }, { ...base, state: 'disabled' })
      const d = await rects()
      expect.eq([d.vc, d.lc, d.chev], ['rgb(109, 109, 109)', 'rgb(153, 153, 153)', 'rgb(153, 153, 153)'], 'Disabled')
      await setArgs(page, { id: SEL }, { ...base, figmaSize: 'sm-mobile' })
      const s = await page.evaluate(() => {
        const v = [...document.querySelectorAll('[data-slot=select-trigger] span')].find((x) => x.textContent === 'Apple')
        const c = getComputedStyle(v)
        return [c.fontSize, c.lineHeight]
      })
      expect.eq(s, ['12px', '16px'], 'S/Mobile: значение 12/16')
    },
  },
  {
    name: 'Textarea: Locked сужает значение под замок (правый отступ 24), пустое поле на наведении темнит подпись до #6D6D6D',
    story: TA,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: TA }, { figmaType: 'locked', state: 'default', add: 'none', viewport: 'desktop' })
      const pr = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#storybook-root textarea')).paddingRight))
      expect.eq(pr, 24, 'правый отступ Locked: замок 16 + gap 8')
      await setArgs(page, { id: TA }, { figmaType: 'empty' })
      const label = page.locator('#storybook-root label')
      const color = () => label.evaluate((e) => getComputedStyle(e).color)
      await page.mouse.move(5, 5)
      expect.eq(await color(), 'rgb(153, 153, 153)', 'подпись в покое')
      await page.locator('#storybook-root textarea').hover()
      expect.eq(await color(), 'rgb(109, 109, 109)', 'подпись на наведении')
      await page.locator('#storybook-root textarea').focus()
      expect.eq(await color(), 'rgb(153, 153, 153)', 'поднятая подпись в фокусе не темнеет')
    },
  },
  {
    name: 'Calendar: подписи дней недели Regular 400; полоса диапазона у первого/последнего дня — от/до края плитки',
    story: CAL,
    run: async ({ page, expect }) => {
      await page.locator('[data-slot=calendar-day]').first().waitFor()
      const wd = await page.evaluate(() => {
        const s = [...document.querySelectorAll('[data-slot=calendar] span')].find((e) => e.textContent === 'ПН')
        return getComputedStyle(s).fontWeight
      })
      expect.eq(wd, '400', 'вес подписи дня недели')
      await setArgs(page, { id: CAL }, { mode: 'range', disabledDate: 'none' })
      await page.waitForTimeout(300)
      await page.locator('[data-slot=calendar-day]:text-is("10")').first().click()
      await page.locator('[data-slot=calendar-day]:text-is("20")').first().click()
      const g = await page.evaluate(() => {
        const cell = (n) => [...document.querySelectorAll('[data-slot=calendar-day]')].find((x) => x.textContent === n)
        const band = (n, pseudo) => {
          const cs = getComputedStyle(cell(n).parentElement, pseudo)
          return [parseFloat(pseudo === '::before' ? cs.left : cs.right), parseFloat(cs.width)]
        }
        return { first: band('10', '::before'), last: band('20', '::after') }
      })
      // Плитка 32 в ячейке 36: полоса первого дня начинается на 2px от левого края (край плитки), последнего —
      // кончается за 2px до правого (x=34), ширина обеих 34.
      expect.eq(g.first, [2, 34], 'FirstInRange: слева 2, ширина 34')
      expect.eq(g.last, [2, 34], 'LastInRange: справа 2, ширина 34')
    },
  },
]
