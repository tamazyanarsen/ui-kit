// Полный проход сверки с макетом (группа «навигация и сообщения»): значения из живого браузера,
// снятые с мастеров Figma — мобильная шторка Modal/Hint, Informer на сером, Dropdown, Sidebar, Button Menu.
const OFF = '*,*::before,*::after{animation:none!important;transition:none!important}'
const setArgs = async (page, updatedArgs) => {
  await page.evaluate((a) => {
    const id = new URLSearchParams(location.search).get('id')
    window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: a })
  }, updatedArgs)
  await page.waitForTimeout(400)
  await page.addStyleTag({ content: OFF })
}
const box = (page, sel) => page.evaluate((s) => {
  const r = document.querySelector(s).getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
}, sel)
const css = (page, sel, prop) => page.evaluate(([s, p]) => getComputedStyle(document.querySelector(s))[p], [sel, prop])

export default [
  {
    name: 'modal (мобильная шторка): поля 16, заголовок сверху 24, кнопки 48 радиус 16, заголовок 22/30, крестик 16 от края',
    story: 'компоненты-modal--playground',
    viewport: [360, 900],
    run: async ({ page, expect }) => {
      await setArgs(page, { viewport: 'mobile' })
      await page.getByRole('button', { name: 'Открыть модалку' }).click()
      await page.waitForSelector('[data-slot=modal-content]')
      await page.waitForTimeout(300)
      const t = await box(page, '[data-slot=modal-title]')
      const c = await box(page, '[data-slot=modal-content]')
      expect.eq(t.x, 16, 'заголовок на 16 от края')
      expect.eq(t.y - c.y, 24, 'заголовок на 24 от верха шторки')
      expect.eq(await css(page, '[data-slot=modal-title]', 'lineHeight'), '30px', 'H2 Mobile 22/30')
      const footer = await page.evaluate(() => [...document.querySelectorAll('[data-slot=modal-footer] button')].map((b) => {
        const r = b.getBoundingClientRect(); return [r.x, r.width, r.height, getComputedStyle(b).borderRadius]
      }))
      for (const [x, w, h, br] of footer) expect.eq([x, w, h, br], [16, 328, 48, '16px'], 'кнопка подвала 328×48 r16')
      const cross = await box(page, '[data-slot=modal-content] > button')
      expect.eq([360 - (cross.x + cross.w), cross.y - c.y], [16, 24], 'крестик 16 от края, 24 от верха')
    },
  },
  {
    name: 'hint (мобильная шторка): поля текста 16, кнопка 328×48',
    story: 'компоненты-hint--playground',
    viewport: [360, 900],
    run: async ({ page, expect }) => {
      await setArgs(page, { figmaDirection: 'mobile' })
      await page.locator('#storybook-root button').first().click()
      await page.waitForSelector('[data-slot=hint-sheet]')
      await page.waitForTimeout(300)
      expect.eq(await css(page, '[data-slot=modal-description]', 'paddingLeft'), '16px', 'поля текста 16')
      const b = await box(page, '[data-slot=modal-footer] button')
      expect.eq([b.x, b.w, b.h], [16, 328, 48], 'кнопка 328×48')
    },
  },
  {
    name: 'informer: на сером листе вторая кнопка белая, на белом — серая #F4F4F4',
    story: 'компоненты-informer--playground',
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=informer]')
      const bg = () => page.evaluate(() => getComputedStyle([...document.querySelectorAll('[data-slot=informer] button')][1]).backgroundColor)
      await setArgs(page, { solid: 'grey' })
      expect.eq(await bg(), 'rgb(255, 255, 255)', 'Solid=Grey: Secondary (White)')
      await setArgs(page, { solid: 'white' })
      expect.eq(await bg(), 'rgb(244, 244, 244)', 'Solid=White: Secondary (Grey)')
    },
  },
  {
    name: 'dropdown: строка с описанием 76 (зазор 4), мобильная шапка 56 с заголовком 22/30, поиск — поле 48 с рамкой',
    story: 'компоненты-dropdown--playground',
    viewport: [360, 900],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=dropdown-item]')
      expect.eq((await box(page, '[data-slot=dropdown-item]')).h, 76, 'строка 16+24+4+16+16')
      await setArgs(page, { size: 'mobile-bottom-sheet', showSearch: true })
      expect.eq((await box(page, '[data-slot=dropdown-header]')).h, 56, 'шапка 56')
      expect.eq(await css(page, '[data-slot=dropdown-header] span', 'lineHeight'), '30px', 'заголовок 22/30')
      expect.eq((await box(page, '[data-slot=dropdown-search]')).h, 48, 'кадр поля 48')
      const inner = await page.evaluate(() => {
        const o = document.querySelector('[data-slot=dropdown-search]')
        const e = o.firstElementChild; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e)
        return [r.x - o.getBoundingClientRect().x, r.height, cs.borderTopWidth, cs.borderTopLeftRadius]
      })
      expect.eq(inner, [16, 48, '1px', '16px'], 'поле 48 с полями 16, рамка 1, радиус 16')
      expect.eq(await css(page, '[data-slot=dropdown]', 'borderTopLeftRadius'), '24px', 'шторка скруглена на 24')
    },
  },
  {
    name: 'sidebar: пункты 296 при панели 312, значки #999, шеврон группы тёмный',
    story: 'компоненты-sidebar--playground',
    run: async ({ page, expect }) => {
      await setArgs(page, { defaultOpen: true, activeItem: true, expandGroup: true })
      expect.eq((await box(page, '[data-slot=sidebar]')).w, 312, 'панель 312')
      expect.eq((await box(page, '[data-slot=sidebar-item]')).w, 296, 'пункт 296')
      expect.eq(await css(page, '[data-slot=sidebar-item] svg', 'color'), 'rgb(153, 153, 153)', 'значок Grey 284')
      expect.eq(await css(page, '[data-slot=sidebar-group-chevron]', 'color'), 'rgb(37, 38, 40)', 'шеврон Grey 1514')
    },
  },
  {
    name: 'button-menu: панель 88 высотой, кнопки на 32 от края (рамка внутри размера)',
    story: 'компоненты-button-menu--playground',
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=button-menu]')
      const m = await box(page, '[data-slot=button-menu]')
      const b = await box(page, '[data-slot=button-menu-row] button')
      expect.eq(m.h, 88, 'панель 88 (16+56+16)')
      expect.eq(b.x - m.x, 32, 'кнопка на 32 от края')
      expect.eq(b.y - m.y, 16, 'кнопка на 16 от верха')
    },
  },
]
