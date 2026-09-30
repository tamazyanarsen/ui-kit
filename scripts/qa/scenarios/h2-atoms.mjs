// Группа «атомы», довод по мастеру: Disabled у Logo Border (White) и стрелки ползунка Range Input.
// Проверяются ЗНАЧЕНИЯ живого DOM и пиксели, а не имена классов.
import { setArgs } from './fields-lib.mjs'

const BTN = 'button--playground'
const RANGE = 'компоненты-range-input--playground'

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`
}

// Цвет подписи по computed-стилю и самый тёмный пиксель на прямоугольнике самого текста (без глифа).
const sampleText = async (page) => {
  const box = await page.evaluate(() => {
    const b = document.querySelector('[data-slot=button]')
    const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT)
    const n = w.nextNode()
    const r = document.createRange()
    r.selectNodeContents(n)
    const t = r.getBoundingClientRect()
    return { x: t.left, y: t.top, width: t.width, height: t.height, fg: getComputedStyle(b).color }
  })
  const png = await page.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: box.height } })
  const darkest = await page.evaluate(async (b64) => {
    const img = new Image()
    await new Promise((ok) => ((img.onload = ok), (img.src = 'data:image/png;base64,' + b64)))
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const x = c.getContext('2d')
    x.drawImage(img, 0, 0)
    const d = x.getImageData(0, 0, c.width, c.height).data
    let best = [255, 255, 255]
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] < best[0] + best[1] + best[2]) best = [d[i], d[i + 1], d[i + 2]]
    return best
  }, png.toString('base64'))
  return { fg: box.fg, darkest }
}

export default [
  {
    name: 'button: Disabled у Logo Border (White) — подпись #DEDEDE (Text Grey 166), у остальных Disabled — #C8C8CB; рамка и заливка общие',
    story: BTN,
    run: async ({ page, expect, story, step }) => {
      const cases = [
        ['secondary-logo-border-white', '#DEDEDE'],
        ['secondary-outline', '#C8C8CB'],
        ['primary', '#C8C8CB'],
        ['secondary-logo-black', '#C8C8CB'],
      ]
      for (const size of ['lg-desktop', 'sm-mobile']) {
        for (const [variant, hex] of cases) {
          step(`${size} ${variant}`)
          await setArgs(page, story, { figmaSize: size, figmaStyle: 'Text', variant, state: 'disabled' })
          const { fg, darkest } = await sampleText(page)
          expect.eq(fg, rgb(hex), `${size} ${variant}: цвет подписи в Disabled`)
          const want = parseInt(hex.slice(1, 3), 16)
          // сплошной штрих 16px Medium доходит до полного цвета: самый тёмный пиксель отличается от литерала не больше чем на 6
          expect(Math.abs(darkest[0] - want) <= 6, `${size} ${variant}: самый тёмный пиксель подписи ${darkest}, ожидалось около ${want}`)
        }
      }
      step('заливка и рамка Disabled у Logo Border (White) не менялись')
      await setArgs(page, story, { figmaSize: 'lg-desktop', variant: 'secondary-logo-border-white', state: 'disabled' })
      const cs = await page.evaluate(() => {
        const s = getComputedStyle(document.querySelector('[data-slot=button]'))
        return { bg: s.backgroundColor, shadow: s.boxShadow }
      })
      expect.eq(cs.bg, rgb('#EFEFEF'), 'заливка Disabled')
      expect(cs.shadow.includes('rgb(200, 200, 203)') && cs.shadow.includes('inset'), `рамка Disabled Grey 166: ${cs.shadow}`)
      step('в рабочем состоянии подпись прежняя')
      await setArgs(page, story, { state: 'default' })
      const normal = await page.evaluate(() => getComputedStyle(document.querySelector('[data-slot=button]')).color)
      expect.eq(normal, rgb('#252628'), 'подпись в Default')
    },
  },
  {
    name: 'range-input: стрелки ползунка — глиф 5,5×9 в точке (5,3) коробки 16px, то есть по образцу макета (Box 40×20, отступы 4/2)',
    story: RANGE,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=range-input-thumb] svg')
      const m = await page.evaluate(() => {
        const thumb = document.querySelector('[data-slot=range-input-thumb]')
        const tr = thumb.getBoundingClientRect()
        const svgs = [...thumb.querySelectorAll('svg')]
        return {
          thumb: [tr.width, tr.height],
          arrows: svgs.map((s) => {
            const r = s.getBoundingClientRect()
            const b = s.querySelector('path').getBBox()
            return { l: r.left - tr.left, t: r.top - tr.top, w: r.width, h: r.height, bx: b.x, by: b.y, bw: b.width, bh: b.height }
          }),
        }
      })
      expect.eq(m.thumb, [40, 20], 'Box ползунка')
      expect.eq(m.arrows.length, 2, 'две стрелки')
      const close = (a, b, msg) => expect(Math.abs(a - b) <= 0.15, `${msg}: получено ${a}, ожидалось ${b}`)
      for (const [i, a] of m.arrows.entries()) {
        expect.eq([a.l, a.t, a.w, a.h], [4 + 16 * i, 2, 16, 16], `стрелка ${i}: коробка 16px внутри Box`)
        close(a.by, 3, `стрелка ${i}: верх глифа`)
        close(a.by + a.bh, 12, `стрелка ${i}: низ глифа`)
        close(a.bw, 5.5, `стрелка ${i}: ширина глифа`)
      }
      close(m.arrows[0].bx, 5.0, 'левая стрелка: x')
      close(m.arrows[1].bx, 5.0, 'правая стрелка: x')
    },
  },
]
