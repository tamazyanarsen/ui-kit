// Полный проход по «атомам» (Button, Tag, Badge) против литералов мастера. Проверяются ЗНАЧЕНИЯ:
// замер размеров, отступов и цветов живого DOM, а не имена классов.
import { setArgs } from './fields-lib.mjs'

const BTN = 'button--playground'
const TAG = 'tag--playground'
const BADGE = 'badge--playground'

// ELK / button: [высота, горизонтальный отступ подписи, радиус, размер значка]
const SIZES = {
  'lg-desktop': [56, 32, 16, 24],
  'default-desktop': [48, 24, 16, 16],
  'sm-desktop': [32, 16, 16, 16],
  'lg-mobile': [48, 24, 16, 16],
  'default-mobile': [40, 24, 12, 16],
  'sm-mobile': [32, 16, 16, 16],
}

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`
}

// заливка / цвет подписи по состояниям (литералы get_design_context, ELK / button, L-Desktop)
const COLORS = {
  primary: { default: ['#80E3FF', '#252628'], hover: ['#2FCEEF', '#252628'], active: ['#14B1D1', '#252628'] },
  'secondary-black': { default: ['#012F42', '#FFFFFF'], hover: ['#114870', '#FFFFFF'], active: ['#1368A1', '#FFFFFF'] },
  'secondary-grey': { default: ['#F4F4F4', '#252628'], hover: ['#EFEFEF', '#252628'], active: ['#E6E6E6', '#252628'] },
  'secondary-white': { default: ['#FFFFFF', '#252628'], hover: ['#EFEFEF', '#252628'], active: ['#E6E6E6', '#252628'] },
  destructive: { default: ['#D74B54', '#FFFFFF'], hover: ['#F0535E', '#FFFFFF'], active: ['#FF737D', '#FFFFFF'] },
  'secondary-logo-border-white': { default: ['#FFFFFF', '#252628'], hover: ['#EFEFEF', '#252628'], active: ['#E6E6E6', '#252628'] },
}

const measure = (page) =>
  page.evaluate(() => {
    const b = document.querySelector('[data-slot=button]')
    const r = b.getBoundingClientRect()
    const rg = document.createRange()
    rg.selectNodeContents(b)
    const t = rg.getBoundingClientRect()
    const svg = b.querySelector('svg:not([data-slot=loader])')
    const sr = svg && svg.getBoundingClientRect()
    const cs = getComputedStyle(b)
    return {
      w: r.width,
      h: r.height,
      textL: t.left - r.left,
      textR: r.right - t.right,
      textW: t.width,
      rad: parseFloat(cs.borderTopLeftRadius),
      svg: sr && { w: sr.width, l: sr.left - r.left, r: r.right - sr.right },
      bw: cs.borderTopWidth,
      shadow: cs.boxShadow,
      bg: cs.backgroundColor,
      fg: cs.color,
    }
  })
const near = (expect, got, want, msg, eps = 0.6) =>
  expect(Math.abs(got - want) <= eps, `${msg}: получено ${got}, ожидалось ${want}`)

export default [
  {
    name: 'button: размеры, отступы подписи и радиус по мастеру (обводка не сдвигает подпись и не раздвигает кнопку)',
    story: BTN,
    run: async ({ page, expect, story, step }) => {
      for (const [size, [h, pad, rad]] of Object.entries(SIZES)) {
        step(size)
        await setArgs(page, story, { figmaSize: size, figmaStyle: 'Text', variant: 'primary', state: 'default' })
        const m = await measure(page)
        expect.eq(m.h, h, `${size}: высота`)
        expect.eq(m.rad, rad, `${size}: радиус`)
        expect.eq(m.bw, '0px', `${size}: у кнопки нет рамки, она не входит в отступы`)
        near(expect, m.textL, pad, `${size}: подпись от левого края`)
        near(expect, m.textR, pad, `${size}: подпись от правого края`)
        near(expect, m.w, 2 * pad + m.textW, `${size}: ширина = 2×отступ + текст`)
      }
    },
  },
  {
    name: 'button: значок слева/справа — отступы 16/20 (24/32 у desktop-L) и размер глифа по мастеру',
    story: BTN,
    run: async ({ page, expect, story, step }) => {
      const pads = {
        'lg-desktop': [24, 32],
        'default-desktop': [16, 20],
        'sm-desktop': [16, 20],
        'lg-mobile': [16, 20],
        'default-mobile': [16, 20],
        'sm-mobile': [16, 20],
      }
      for (const [size, [nearPad, farPad]] of Object.entries(pads)) {
        step(size)
        await setArgs(page, story, { figmaSize: size, figmaStyle: 'Icon Left', variant: 'primary', state: 'default' })
        let m = await measure(page)
        expect.eq(m.svg.w, SIZES[size][3], `${size}: размер значка`)
        near(expect, m.svg.l, nearPad, `${size}: значок слева от края`)
        near(expect, m.textR, farPad, `${size}: подпись справа от края`)
        await setArgs(page, story, { figmaStyle: 'Icon Right' })
        m = await measure(page)
        near(expect, m.svg.r, nearPad, `${size}: значок справа от края`)
        near(expect, m.textL, farPad, `${size}: подпись слева от края`)
        await setArgs(page, story, { figmaStyle: 'Icon' })
        m = await measure(page)
        expect.eq([m.w, m.h], [SIZES[size][0], SIZES[size][0]], `${size}: кнопка-значок квадратная`)
      }
    },
  },
  {
    name: 'button: заливка и цвет подписи в Default/Hover/Active по мастеру (реальные наведение и нажатие)',
    story: BTN,
    run: async ({ page, expect, story, step }) => {
      for (const [variant, states] of Object.entries(COLORS)) {
        for (const [state, [bg, fg]] of Object.entries(states)) {
          step(`${variant} ${state}`)
          await setArgs(page, story, { variant, figmaSize: 'lg-desktop', figmaStyle: 'Text', state: 'default' })
          await page.mouse.move(2, 2)
          const b = page.locator('[data-slot=button]')
          if (state !== 'default') await b.hover()
          if (state === 'active') await page.mouse.down()
          await page.waitForTimeout(80)
          const m = await measure(page)
          if (state === 'active') await page.mouse.up()
          expect.eq(m.bg, rgb(bg), `${variant} ${state}: заливка`)
          expect.eq(m.fg, rgb(fg), `${variant} ${state}: подпись`)
        }
      }
    },
  },
  {
    name: 'button: Disabled и Loading — заливка Grey 114, подпись Grey 166; ширина при загрузке не меняется; спиннер 24px у M/L и 16px у S',
    story: BTN,
    run: async ({ page, expect, story, step }) => {
      for (const size of Object.keys(SIZES)) {
        step(size)
        await setArgs(page, story, { variant: 'primary', figmaSize: size, figmaStyle: 'Text', state: 'default' })
        const normal = await measure(page)
        await setArgs(page, story, { state: 'disabled' })
        const dis = await measure(page)
        expect.eq(dis.bg, rgb('#EFEFEF'), `${size}: Disabled заливка`)
        expect.eq(dis.fg, rgb('#C8C8CB'), `${size}: Disabled подпись`)
        expect.eq(dis.w, normal.w, `${size}: ширина в Disabled`)
        await setArgs(page, story, { state: 'loading' })
        const load = await measure(page)
        expect.eq(load.bg, rgb('#EFEFEF'), `${size}: Loading заливка`)
        expect.eq(load.w, normal.w, `${size}: ширина при загрузке не меняется`)
        const spin = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-slot=loader]')).width))
        expect.eq(spin, size.startsWith('sm') ? 16 : 24, `${size}: спиннер`)
      }
    },
  },
  {
    name: 'button: обводка Logo Border и «с обводкой» — кольцо #0D4CD3 (Disabled #C8C8CB) без изменения размера; фокус даёт кольцо',
    story: BTN,
    run: async ({ page, expect, story, step }) => {
      await setArgs(page, story, { variant: 'primary', figmaSize: 'lg-desktop', figmaStyle: 'Text', state: 'default' })
      const base = await measure(page)
      await setArgs(page, story, { figmaStyle: 'Icon Left' })
      const baseIcon = await measure(page)
      for (const variant of ['secondary-outline', 'secondary-logo-border-white']) {
        step(variant)
        await setArgs(page, story, { variant, state: 'default', figmaStyle: 'Text' })
        const m = await measure(page)
        expect(m.shadow.includes('rgb(13, 76, 211)') && m.shadow.includes('inset'), `${variant}: кольцо ${m.shadow}`)
        // у Logo-типов всегда есть глиф Госуслуг слева, их ширина равна кнопке «значок слева»
        expect.eq(m.w, variant === 'secondary-logo-border-white' ? baseIcon.w : base.w, `${variant}: ширина равна ширине обычной кнопки`)
        await setArgs(page, story, { state: 'disabled' })
        const d = await measure(page)
        expect(d.shadow.includes('rgb(200, 200, 203)'), `${variant} Disabled: кольцо Grey 166, получено ${d.shadow}`)
      }
      step('фокус с клавиатуры')
      await setArgs(page, story, { variant: 'primary', state: 'default' })
      await page.keyboard.press('Tab')
      const ring = await page.evaluate(() => {
        const cs = getComputedStyle(document.querySelector('[data-slot=button]'))
        return [cs.outlineStyle, parseFloat(cs.outlineWidth)]
      })
      expect.eq(ring, ['solid', 2], 'кольцо фокуса')
    },
  },
  {
    name: 'tag: обводочные теги той же ширины, что сплошные; высота 22/18, отступ 6, значок с x=6',
    story: TAG,
    run: async ({ page, expect, story, step }) => {
      const info = () =>
        page.evaluate(() => {
          const t = document.querySelector('[data-slot=tag]')
          const r = t.getBoundingClientRect()
          const rg = document.createRange()
          rg.selectNodeContents(t.lastChild)
          const x = rg.getBoundingClientRect()
          const ic = t.querySelector('svg')
          const ir = ic && ic.getBoundingClientRect()
          return { w: r.width, h: r.height, textL: x.left - r.left, icon: ir && [ir.left - r.left, ir.top - r.top, ir.width] }
        })
      for (const [vp, h] of [['desktop', 22], ['mobile', 18]]) {
        step(vp)
        await setArgs(page, story, { viewport: vp, figmaStyle: 'green-main', icon: undefined })
        const filled = await info()
        expect.eq(filled.h, h, `${vp}: высота`)
        near(expect, filled.textL, 6, `${vp}: отступ текста`)
        for (const style of ['green-text', 'orange-text', 'red-text', 'blue-text', 'grey-text', 'white']) {
          await setArgs(page, story, { figmaStyle: style })
          const m = await info()
          near(expect, m.w, filled.w, `${vp} ${style}: ширина как у сплошного`, 0.01)
          near(expect, m.textL, 6, `${vp} ${style}: подпись от края`, 0.01)
        }
      }
      await setArgs(page, story, { viewport: 'desktop', figmaStyle: 'green-text', icon: 'check' })
      const m = await info()
      expect.eq(m.icon, [6, 3, 16], 'значок в обводочном теге: x=6, y=3, 16px')
    },
  },
  {
    name: 'badge: Contra-Red не шире Red при любом числе; точка Contra-Red — красный круг 8px с белым кольцом (всего 10px)',
    story: BADGE,
    run: async ({ page, expect, story, step }) => {
      const width = () => page.evaluate(() => document.querySelector('[data-slot=badge]').getBoundingClientRect().width)
      for (const value of [5, 10, 99, 100]) {
        step(`число ${value}`)
        await setArgs(page, story, { type: 'counter', color: 'red', state: 'default', value })
        const red = await width()
        await setArgs(page, story, { color: 'contra-red' })
        const contra = await width()
        near(expect, contra, red, `значение ${value}: ширина Contra-Red`, 0.01)
      }
      step('точка')
      await setArgs(page, story, { type: 'point', color: 'red', value: 1 })
      const dot = () =>
        page.evaluate(() => {
          const i = document.querySelector('[data-slot=badge]').firstElementChild
          const r = i.getBoundingClientRect()
          const cs = getComputedStyle(i)
          return [r.width, parseFloat(cs.borderTopWidth), cs.backgroundColor]
        })
      expect.eq((await dot()).slice(0, 2), [8, 0], 'красная точка 8px без рамки')
      await setArgs(page, story, { color: 'contra-red' })
      const c = await dot()
      expect.eq([c[0], c[1]], [10, 1], 'Contra-Red: 10px с кольцом 1px, то есть красный круг 8px')
      expect.eq(c[2], rgb('#D74B54'), 'заливка точки')
    },
  },
]
