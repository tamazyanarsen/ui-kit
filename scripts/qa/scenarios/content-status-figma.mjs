// Слой 4: значения раскладки группы «контент и статусы», сверенные с мастерами Figma (ErrorPage Size=Mobile,
// ELK / card, ELK / content accordion, ELK / paginator, ELK / block-widget Size=Mobile). Проверяются ЧИСЛА из
// getBoundingClientRect и getComputedStyle, а не имена классов.
import { setArgs } from './fields-lib.mjs'

const near = (expect, got, want, what, eps = 0.6) =>
  expect(Math.abs(got - want) <= eps, `${what}: получено ${got}, ожидалось ${want}`)
const rect = (page, sel) =>
  page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } }, sel)

const ERROR_ARGS = {
  type: '403',
  title: 'Страница недоступна',
  description: 'У вас нет доступа для просмотра этой страницы. Вы можете вернуться на главную',
  showButton: true,
  buttonLabel: 'На главную',
}

export default [
  {
    name: 'ErrorPage: мобильная форма по мастеру Size=Mobile (360)',
    story: 'error-page--playground',
    viewport: [360, 800],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, ERROR_ARGS)
      const m = await page.evaluate(() => {
        const root = document.querySelector('[data-slot=error-page]')
        const cs = (e) => getComputedStyle(e)
        const r = (e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height } }
        const h = root.querySelector('h1')
        const p = root.querySelector('p')
        const il = root.querySelector('[data-slot=error-page-illustration]')
        return { root: r(root), h: [cs(h).fontSize, cs(h).lineHeight, r(h).y], p: [cs(p).fontSize, cs(p).lineHeight], il: r(il), btn: r(root.querySelector('button')) }
      })
      expect.eq(m.h.slice(0, 2), ['22px', '30px'], 'заголовок 22/30')
      expect.eq(m.p, ['14px', '20px'], 'описание 14/20')
      near(expect, m.root.h, 640, 'высота кадра')
      near(expect, m.h[2], 88, 'верхний отступ')
      near(expect, m.il.x, 16, 'боковое поле')
      near(expect, m.il.w, 328, 'ширина картинки')
      near(expect, m.il.h, 131.6, 'высота картинки', 0.4)
      near(expect, m.btn.h, 48, 'кнопка')
    },
  },
  {
    name: 'ErrorPage: десктоп не изменился, пустые слоты не оставляют зазора',
    story: 'error-page--playground',
    viewport: [1280, 900],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, ERROR_ARGS)
      const d = await page.evaluate(() => {
        const root = document.querySelector('[data-slot=error-page]')
        const cs = (e) => getComputedStyle(e)
        return {
          h: cs(root.querySelector('h1')).fontSize,
          p: cs(root.querySelector('p')).fontSize,
          btn: root.querySelector('button').getBoundingClientRect().height,
          il: root.querySelector('[data-slot=error-page-illustration]').getBoundingClientRect().height,
          pad: cs(root).paddingTop,
        }
      })
      expect.eq([d.h, d.p, d.btn, d.pad], ['32px', '16px', 56, '40px'], 'десктопные шрифты, кнопка, верхнее поле')
      near(expect, d.il, 488, 'картинка 1216x488')
      // без заголовка описание встаёт на место заголовка, без 8px сверху
      await setArgs(page, story, { title: '', showButton: false })
      near(expect, (await rect(page, '[data-slot=error-page] p')).y, 40, 'описание без заголовка')
      // всё пусто: картинка сразу под верхним полем, а не на 48px ниже
      await setArgs(page, story, { description: '' })
      near(expect, (await rect(page, '[data-slot=error-page-illustration]')).y, 40, 'картинка без текста')
    },
  },
  {
    name: 'Card: без подзаголовка 84, тег на y+2, сумма и суффикс не урезаны при длинном заголовке',
    story: 'компоненты-card--playground',
    viewport: [420, 700],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, {
        showUserName: false, showValue: true, showButton: false, showTag: true, showNumberCard: true,
        title: 'Очень длинное название карты для проверки сжатия', titleSuffix: '1135',
      })
      const m = await page.evaluate(() => {
        const c = document.querySelector('[data-slot=card]')
        const cb = c.getBoundingClientRect()
        const spans = [...c.querySelectorAll('span')]
        const val = spans.find((s) => s.textContent.includes('12 500'))
        const suf = spans.find((s) => s.textContent.startsWith('•'))
        const tag = c.querySelector('[data-slot=tag]')
        const w = (e) => e.getBoundingClientRect().width
        return { h: cb.height, tagDy: tag.getBoundingClientRect().y - (cb.y + 24), valCut: val.scrollWidth - w(val), sufCut: suf.scrollWidth - w(suf) }
      })
      near(expect, m.h, 84, 'высота карточки без подзаголовка')
      near(expect, m.tagDy, 2, 'тег ниже верха ряда')
      // scrollWidth округляется до целого, поэтому допуск 1px
      expect(m.valCut <= 1, `сумма урезана на ${m.valCut}px`)
      expect(m.sufCut <= 1, `суффикс урезан на ${m.sufCut}px, хотя заголовок ещё можно сжать`)
    },
  },
  {
    name: 'AccordionList: шеврон на 8 (H3) и 6 (H4) от верха строки заголовка',
    story: 'content-accordion--playground',
    viewport: [1280, 700],
    run: async ({ page, expect, story }) => {
      for (const [as, dy] of [['h3', 8], ['h4', 6]]) {
        await setArgs(page, story, { titleAs: as })
        const got = await page.evaluate(() => {
          const ch = document.querySelector('[data-slot=accordion-list-chevron]').getBoundingClientRect()
          const t = document.querySelector('[data-slot=accordion-list-trigger]').getBoundingClientRect()
          return ch.y - t.y
        })
        near(expect, got, dy, `шеврон ${as}`)
      }
    },
  },
  {
    name: 'Paginator: высота 44 (L) и 88 (M) вместе с рамкой, кнопки на 4 от верха',
    story: 'paginator--playground',
    viewport: [1280, 700],
    run: async ({ page, expect, story }) => {
      for (const [size, h] of [['L', 44], ['M', 88]]) {
        await setArgs(page, story, { size })
        const m = await page.evaluate(() => {
          const e = document.querySelector('[data-slot=pagination]')
          const r = e.getBoundingClientRect()
          return { h: r.height, btnDy: e.querySelector('button').getBoundingClientRect().y - r.y, bt: getComputedStyle(e).borderTopWidth }
        })
        near(expect, m.h, h, `высота Size=${size}`)
        near(expect, m.btnDy, 4, 'кнопка от верха')
        expect.eq(m.bt, '1px', 'рамка сверху сохранена')
      }
    },
  },
  {
    name: 'BlockWidget mobile: «статус + кнопка» после слота (Top, Slot, Bottom)',
    story: 'block-widget--playground',
    viewport: [375, 800],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, { viewport: 'mobile', showConteiner: true, showStatus: true, showButton: true })
      const m = await page.evaluate(() => {
        const r = (s) => { const b = document.querySelector(`[data-slot=${s}]`).getBoundingClientRect(); return { y: b.y, h: b.height } }
        return { title: r('block-widget-title-block'), slot: r('block-widget-slot'), tr: r('block-widget-trailing') }
      })
      near(expect, m.slot.y, m.title.y + m.title.h + 8, 'слот через 8 под шапкой')
      near(expect, m.tr.y, m.slot.y + m.slot.h + 8, 'нижний ряд через 8 под слотом')
      near(expect, m.tr.h, 32, 'высота нижнего ряда')
      // десктоп (в широком окне): приписка и кнопка остаются в верхнем ряду
      await page.setViewportSize({ width: 1280, height: 800 })
      await setArgs(page, story, { viewport: 'desktop' })
      const top = await page.evaluate(() => {
        const t = document.querySelector('[data-slot=block-widget-trailing]').getBoundingClientRect()
        const b = document.querySelector('[data-slot=block-widget-title-block]').getBoundingClientRect()
        return t.y - b.y
      })
      expect(Math.abs(top) < 20, `на десктопе группа в верхнем ряду, смещение ${top}`)
    },
  },
]
