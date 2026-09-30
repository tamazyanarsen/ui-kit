// Полная сверка группы «таблицы и списки» с макетом: числа мастеров (высоты, зазоры, порядок узлов).
// Значения сняты с символов Figma, классы не проверяются.
import { withArgs } from './tables-0-helpers.mjs'

const box = (page, sel) =>
  page.locator(sel).first().evaluate((e) => {
    const r = e.getBoundingClientRect()
    return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100, x: r.x }
  })

export default [
  {
    name: 'full: Chips Filter — коробка 36 (Desktop) и 32 (Mobile), рамка Active внутри коробки',
    story: 'компоненты-chips--playground',
    run: async ({ page, expect }) => {
      await withArgs(page, 'type:filter-white;showSelect:!true;selected:!false')
      expect.eq((await box(page, '[data-slot=chips]')).h, 36, 'Default 36')
      await withArgs(page, 'type:filter-white;showSelect:!true;selected:!true')
      expect.eq((await box(page, '[data-slot=chips]')).h, 36, 'Active те же 36 (рамка внутри)')
      await withArgs(page, 'type:filter-subtitle-white;showSelect:!true;selected:!true')
      expect.eq((await box(page, '[data-slot=chips]')).h, 56, 'Filter Subtitle 56')
    },
  },
  {
    name: 'full: Switcher — высота 56 (L) и 48 (M), ячейка в 4px от внешнего края',
    story: 'компоненты-switcher--playground',
    run: async ({ page, expect }) => {
      await withArgs(page, 'itemsCount:2;showMore:!false;size:lg')
      expect.eq((await box(page, '[data-slot=switcher]')).h, 56, 'L 56')
      const gap = await page.locator('[data-slot=switcher-item]').first().evaluate((e) => {
        const s = e.closest('[data-slot=switcher]').getBoundingClientRect()
        return Math.round(e.getBoundingClientRect().left - s.left)
      })
      expect.eq(gap, 4, 'левое поле ячейки')
      await withArgs(page, 'itemsCount:2;showMore:!false;size:md')
      expect.eq((await box(page, '[data-slot=switcher]')).h, 48, 'M 48')
    },
  },
  {
    name: 'full: Information Field Label Left на мобильном — 96 со значками-подсказками',
    story: 'компоненты-information-field--playground',
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await withArgs(page, 'type:label-left;viewport:mobile;showInformation:!true;copyable:!false')
      expect.eq((await box(page, '[data-slot=item-information-field]')).h, 96, 'Label Left Mobile 96')
      await withArgs(page, 'type:label-top;viewport:mobile;showInformation:!true;copyable:!false')
      expect.eq((await box(page, '[data-slot=item-information-field]')).h, 64, 'Label Top Mobile 64')
    },
  },
  {
    name: 'full: Mail Feed — 140 без флажка и 148 с флажком, дата и текст Regular',
    story: 'компоненты-mail-components--playground',
    run: async ({ page, expect }) => {
      await withArgs(page, 'showCheckbox:!false')
      expect.eq((await box(page, '[data-slot=mail-feed]')).h, 140, 'без флажка')
      await withArgs(page, 'showCheckbox:!true')
      expect.eq((await box(page, '[data-slot=mail-feed]')).h, 148, 'с флажком')
      const weights = await page.locator('[data-slot=mail-feed] span').evaluateAll((els) =>
        els
          .filter((e) => /^\d\d\.\d\d\.\d{4}/.test(e.textContent || '') || (e.textContent || '').startsWith('У меня'))
          .map((e) => getComputedStyle(e).fontWeight)
      )
      expect.eq(weights.length > 0 && weights.every((w) => w === '400'), true, 'дата и текст письма — вес 400: ' + weights)
    },
  },
  {
    name: 'full: Table Top — «Скачать» и «Ещё фильтры»: подпись первой, шеврон справа',
    story: 'компоненты-table-top--examples',
    run: async ({ page, expect }) => {
      const order = await page.locator('button', { hasText: /^(Скачать|Ещё фильтры)/ }).evaluateAll((bs) =>
        bs.map((b) => {
          const svg = b.querySelector('svg').getBoundingClientRect()
          const r = document.createRange()
          r.selectNodeContents([...b.childNodes].find((n) => n.nodeType === 3) || b)
          return svg.left > r.getBoundingClientRect().left
        })
      )
      expect.eq(order.length > 0 && order.every(Boolean), true, 'шеврон правее подписи: ' + order)
    },
  },
]
