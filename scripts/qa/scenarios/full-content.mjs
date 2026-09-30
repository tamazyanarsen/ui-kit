// Полный проход сверки с Figma, группа «контент и заголовки» (Thumbnail, CardAccount, BlockWidget).
// Проверяются ЧИСЛА из getBoundingClientRect, снятые с мастеров: `ELK / thumbnail` Type=Image, `IB / card account`,
// `Title Block` (Size=Mobile, Small Text).
import { setArgs } from './fields-lib.mjs'

const near = (expect, got, want, what, eps = 0.3) =>
  expect(Math.abs(got - want) <= eps, `${what}: получено ${got}, ожидалось ${want}`)

/** Положение значка внутри плитки (от левого верхнего угла плитки) и размер плитки. */
const badgeIn = (page) =>
  page.evaluate(() => {
    const t = document.querySelector('[data-slot=thumbnail]').getBoundingClientRect()
    const b = document.querySelector('[data-slot=thumbnail] [data-slot=badge]').getBoundingClientRect()
    return { size: t.width, x: b.x - t.x, y: b.y - t.y, w: b.width }
  })

export default [
  {
    name: 'Thumbnail Type=Image: значок по мастеру (L: правый край 4, верх 28; 40px: правый край 0, верх 12)',
    story: 'thumbnail--playground',
    viewport: [1280, 700],
    run: async ({ page, expect, story }) => {
      // L / Desktop: плитка 48, значок 16 → x = 48-4-16 = 28, y = 28
      await setArgs(page, story, { figmaSize: 'l-desktop', type: 'picture', showDot: true })
      let m = await badgeIn(page)
      near(expect, m.size, 48, 'плитка L / Desktop')
      near(expect, m.x, 28, 'L / Desktop: x значка')
      near(expect, m.y, 28, 'L / Desktop: y значка')
      // M / Desktop и L / Mobile — плитка 40: x = 40-0-16 = 24, y = 12
      for (const figmaSize of ['m-desktop', 'l-mobile']) {
        await setArgs(page, story, { figmaSize })
        m = await badgeIn(page)
        near(expect, m.size, 40, `плитка ${figmaSize}`)
        near(expect, m.x, 24, `${figmaSize}: x значка`)
        near(expect, m.y, 12, `${figmaSize}: y значка`)
      }
      // остальные типы: значок на углу (-8, -4) в обоих размерах
      for (const figmaSize of ['l-desktop', 'm-desktop']) {
        await setArgs(page, story, { figmaSize, type: 'card' })
        m = await badgeIn(page)
        near(expect, m.x, m.size - 8, `${figmaSize} card: x значка`)
        near(expect, m.y, -4, `${figmaSize} card: y значка`)
      }
    },
  },
  {
    name: 'CardAccount: цифры номера вплотную к низу рамки (строка 12 на 20–32 из 32), правый край 3',
    story: 'card--playground',
    viewport: [1280, 700],
    run: async ({ page, expect }) => {
      const m = await page.evaluate(() => {
        const c = document.querySelector('[data-slot=card-account]')
        const cr = c.getBoundingClientRect()
        const t = [...c.querySelectorAll('span')].find((s) => /\d/.test(s.textContent)).getBoundingClientRect()
        return { h: cr.height, w: cr.width, top: t.y - cr.y, bottom: cr.bottom - t.bottom, right: cr.right - t.right, th: t.height }
      })
      near(expect, m.w, 48, 'ширина плитки')
      near(expect, m.h, 34, 'высота плитки')
      near(expect, m.th, 12, 'строка цифр 10/12')
      // рамка 1px: строка занимает 21–33 из 34 по внешней рамке
      near(expect, m.top, 21, 'верх строки цифр')
      near(expect, m.bottom, 1, 'низ строки цифр до рамки')
      near(expect, m.right, 4, 'правый край цифр (3 + рамка 1)')
    },
  },
  {
    name: 'BlockWidget mobile: верхний отступ блока заголовка 2 у обеих ступеней (Large и Small), на десктопе Small 4',
    story: 'block-widget--playground',
    viewport: [375, 800],
    run: async ({ page, expect, story }) => {
      const pt = () =>
        page.evaluate(() => getComputedStyle(document.querySelector('[data-slot=block-widget-title-block]')).paddingTop)
      for (const titleType of ['large', 'small']) {
        await setArgs(page, story, { viewport: 'mobile', titleType })
        expect.eq(await pt(), '2px', `мобильный ${titleType}: pt`)
      }
      await setArgs(page, story, { viewport: 'desktop', titleType: 'small' })
      await page.setViewportSize({ width: 1280, height: 800 })
      await setArgs(page, story, { viewport: 'desktop', titleType: 'small' })
      expect.eq(await pt(), '4px', 'десктопный Small: pt')
      await setArgs(page, story, { viewport: 'desktop', titleType: 'large' })
      expect.eq(await pt(), '0px', 'десктопный Large: pt')
    },
  },
]
