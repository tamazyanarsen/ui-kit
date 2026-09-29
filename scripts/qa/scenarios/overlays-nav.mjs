// Слой 4: ButtonMenu, Tabs, Switcher, Sidebar — оверфлоу «Ещё» при ресайзе окна на ходу, клавиатура, сворачивание.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
// Ряды с «Ещё» пересчитываются по ResizeObserver: ждём, пока раскладка перестанет меняться
const stable = async (page, read) => {
  let prev = JSON.stringify(await read())
  for (let i = 0; i < 25; i++) {
    await page.waitForTimeout(80)
    const cur = JSON.stringify(await read())
    if (cur === prev) return JSON.parse(cur)
    prev = cur
  }
  return JSON.parse(prev)
}
const resize = (page, w) => page.setViewportSize({ width: w, height: 900 })
const setArgs = (page, args) => page.evaluate((a) => {
  const id = new URLSearchParams(location.search).get('id')
  window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: a })
}, args)

// ---- ButtonMenu
const BM = 'компоненты-button-menu--playground'
const bmState = (page) => page.evaluate(() => {
  const row = document.querySelector('[data-slot=button-menu-row]')
  const more = row.querySelector('[aria-label=Ещё]')
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
  const btns = [...row.children].filter((c) => c.matches('button') && c !== more && vis(c))
  const rr = row.getBoundingClientRect()
  return {
    buttons: btns.map((b) => b.textContent.trim()),
    more: !!more && vis(more),
    inside: btns.every((b) => b.getBoundingClientRect().right <= rr.right + 1) && (!more || more.getBoundingClientRect().right <= rr.right + 1),
    scroll: document.documentElement.scrollWidth,
  }
})
const moreItems = (page) => page.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map((m) => m.textContent.trim()))
const ALL_ACTIONS = 5 // Сохранить, Отмена, Предпросмотр, Дублировать, Удалить

// ---- Tabs / Switcher
const tabsState = (page) => page.evaluate(() => {
  const tabs = [...document.querySelectorAll('[role=tablist] [role=tab]')]
  return {
    visible: tabs.map((t) => t.textContent),
    selected: tabs.filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.textContent),
    stops: tabs.filter((t) => t.tabIndex === 0).map((t) => t.textContent),
    more: !!document.querySelector('[data-slot=tabs-row] [aria-haspopup=menu]'),
  }
})
const activeText = (page) => page.evaluate(() => document.activeElement?.textContent?.trim())
const swState = (page) => page.evaluate(() => {
  const items = [...document.querySelectorAll('[data-slot=switcher-row] [data-slot=switcher-item]')].filter((e) => e.getBoundingClientRect().width > 0)
  const more = document.querySelector('[data-slot=switcher-overflow-trigger]')
  return {
    visible: items.map((t) => t.textContent),
    pressed: items.filter((t) => t.getAttribute('aria-pressed') === 'true').map((t) => t.textContent),
    more: !!more && more.getBoundingClientRect().width > 0,
  }
})

// ---- Sidebar
const SBAR = 'компоненты-sidebar--playground'
const sbState = (page) => page.evaluate(() => {
  const sb = document.querySelector('[data-slot=sidebar]')
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
  const grp = document.querySelector('[data-slot=sidebar-group-trigger]')
  return {
    width: Math.round(sb.getBoundingClientRect().width),
    labels: [...document.querySelectorAll('[data-slot=sidebar-item] > span')].filter(vis).map((s) => s.textContent),
    groupExpanded: grp?.getAttribute('aria-expanded'),
    nested: [...document.querySelectorAll('[data-slot=sidebar-group] [data-slot=sidebar-item]')].filter(vis).map((i) => i.textContent),
  }
})
const tipsOpen = (page) => page.evaluate(() => [...document.querySelectorAll('[data-side][data-open]')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent).filter(Boolean))

export default [
  {
    name: 'button-menu: ресайз окна на ходу — кнопок в ряду меньше, «Ещё» получает остальные, вместе всегда 5 действий, ряд в пределах окна',
    story: BM,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=button-menu-row]')
      const wide = await stable(page, () => bmState(page))
      expect(wide.buttons.length >= 2, 'на 1280 несколько кнопок: ' + wide.buttons)
      expect.eq(wide.buttons[0], 'Сохранить', 'первая кнопка')
      // уже 360 не идём: минимум одна кнопка в ряду — принятое решение, там «Ещё» упирается в край
      const widths = [900, 600, 420, 360]
      let prev = wide.buttons.length
      for (const w of widths) {
        step('ширина ' + w)
        await resize(page, w)
        const s = await stable(page, () => bmState(page))
        expect(s.buttons.length >= 1, w + ': хотя бы одна кнопка')
        expect(s.buttons.length <= prev, `${w}: кнопок не больше, чем на большей ширине (${s.buttons.length} > ${prev})`)
        expect(s.more, w + ': есть «Ещё»')
        expect(s.inside, w + ': ряд в пределах контейнера')
        expect.eq(s.scroll, w, w + ': нет горизонтальной прокрутки')
        await page.getByRole('button', { name: 'Ещё' }).click()
        await wait(page, () => document.querySelectorAll('[role=menuitem]').length > 0, null, 'список «Ещё»')
        expect.eq(s.buttons.length + (await moreItems(page)).length, ALL_ACTIONS, w + ': видимые + в «Ещё»')
        await page.keyboard.press('Escape')
        await wait(page, () => document.querySelectorAll('[role=menuitem]').length === 0, null, 'закрытие «Ещё»')
        prev = s.buttons.length
      }
      step('вернуть 1280')
      await resize(page, 1280)
      const back = await stable(page, () => bmState(page))
      expect.eq(back.buttons, wide.buttons, 'раскладка как была')
    },
  },
  {
    name: 'button-menu: «Ещё» — Esc закрывает и возвращает фокус, ArrowDown идёт по пунктам, Enter закрывает список',
    story: BM,
    viewport: [420, 900],
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=button-menu-row]')
      await stable(page, () => bmState(page))
      const more = page.getByRole('button', { name: 'Ещё' })
      step('открыть мышью, Esc')
      await more.click()
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length > 0, null, 'список')
      await page.keyboard.press('Escape')
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length === 0, null, 'закрытие')
      await wait(page, () => document.activeElement?.getAttribute('aria-label') === 'Ещё', null, 'фокус на «Ещё»')
      step('клавиатура')
      await page.keyboard.press('Enter')
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length > 0, null, 'список по Enter')
      await page.keyboard.press('ArrowDown')
      await wait(page, () => document.activeElement?.getAttribute('role') === 'menuitem', null, 'фокус на пункте списка')
      await page.keyboard.press('Enter')
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length === 0, null, 'закрытие по Enter')
    },
  },
  {
    name: 'tabs: стрелки переключают вкладки в обход недоступной, по кругу; Home/End — крайние; в Tab-порядке одна вкладка',
    story: 'компоненты-tabs--playground',
    run: async ({ page, expect, step }) => {
      await page.getByRole('tab', { name: 'Все' }).focus()
      expect.eq((await tabsState(page)).stops, ['Все'], 'одна остановка Tab — выбранная')
      const press = async (key, want, msg) => {
        await page.keyboard.press(key)
        await wait(page, (w) => document.activeElement?.textContent === w, want, msg)
        const s = await tabsState(page)
        expect.eq(s.selected, [want], msg + ': выбрана')
        expect.eq(s.stops, [want], msg + ': Tab-остановка переехала')
      }
      step('вправо')
      await press('ArrowRight', 'Открытые', 'вправо')
      await press('ArrowRight', 'Ошибки', 'вправо через недоступную «Закрытые»')
      step('End / Home')
      await press('End', 'Входящие', 'End')
      await press('Home', 'Все', 'Home')
      step('влево по кругу')
      await press('ArrowLeft', 'Входящие', 'влево с первой — на последнюю')
      await press('ArrowRight', 'Все', 'вправо с последней — на первую')
    },
  },
  {
    name: 'tabs: клик выбирает вкладку, недоступная вкладка не выбирается',
    story: 'компоненты-tabs--playground',
    run: async ({ page, expect }) => {
      await page.getByRole('tab', { name: 'Ошибки' }).click()
      expect.eq((await tabsState(page)).selected, ['Ошибки'], 'выбрана «Ошибки»')
      await page.getByRole('tab', { name: 'Закрытые' }).click({ force: true })
      expect.eq((await tabsState(page)).selected, ['Ошибки'], 'недоступная не выбралась')
      expect.eq(await page.getByRole('tab', { name: 'Закрытые' }).isDisabled(), true, 'disabled')
    },
  },
  {
    name: 'tabs: ресайз — «Ещё» появляется при сужении, скрытые вкладки выбираются из списка, при расширении все вкладки на месте',
    story: 'компоненты-tabs--playground',
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[role=tablist] [role=tab]')
      const wide = await stable(page, () => tabsState(page))
      expect.eq(wide.visible.length, 5, 'на 1280 все пять')
      expect.eq(wide.more, false, 'на 1280 «Ещё» нет')
      step('сузить до 400')
      await resize(page, 400)
      const narrow = await stable(page, () => tabsState(page))
      expect(narrow.visible.length < 5 && narrow.visible.length >= 1, 'вкладок стало меньше: ' + narrow.visible)
      expect.eq(narrow.more, true, 'появился «Ещё»')
      step('выбрать скрытую «Ошибки»')
      await page.locator('[data-slot=tabs-row] [aria-haspopup=menu]').click()
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length > 0, null, 'список «Ещё»')
      const hidden = await moreItems(page)
      expect.eq(hidden.length + narrow.visible.length, 5, 'видимые + в «Ещё» = 5')
      await page.getByRole('menuitem', { name: 'Ошибки' }).click()
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length === 0, null, 'закрытие списка')
      step('расширить обратно')
      await resize(page, 1280)
      const back = await stable(page, () => tabsState(page))
      expect.eq(back.visible.length, 5, 'все пять на месте')
      expect.eq(back.selected, ['Ошибки'], 'выбор из «Ещё» сохранился')
    },
  },
  {
    name: 'switcher: клик переключает выбранный пункт, Tab ходит по пунктам, Enter и пробел выбирают',
    story: 'компоненты-switcher--playground',
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=switcher-item]')
      const item = (n) => page.locator('[data-slot=switcher-row]').getByRole('button', { name: n, exact: true })
      step('клик')
      await item('Завершённые').click()
      expect.eq((await swState(page)).pressed, ['Завершённые'], 'клик')
      step('Tab и Enter')
      await item('Все').focus()
      await page.keyboard.press('Tab')
      expect.eq(await activeText(page), 'Активные', 'Tab — следующий пункт')
      await page.keyboard.press('Enter')
      expect.eq((await swState(page)).pressed, ['Активные'], 'Enter')
      step('Shift+Tab и пробел')
      await page.keyboard.press('Shift+Tab')
      expect.eq(await activeText(page), 'Все', 'Shift+Tab — предыдущий')
      await page.keyboard.press('Space')
      expect.eq((await swState(page)).pressed, ['Все'], 'пробел')
    },
  },
  {
    name: 'switcher: ресайз — пунктов меньше и «Ещё», скрытый пункт выбирается из списка, Esc возвращает фокус, при расширении раскладка прежняя',
    story: 'компоненты-switcher--playground',
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=switcher-item]')
      const wide = await stable(page, () => swState(page))
      step('сузить до 300')
      await resize(page, 300)
      const narrow = await stable(page, () => swState(page))
      expect(narrow.visible.length < wide.visible.length, `на 300 пунктов меньше (${narrow.visible.length} < ${wide.visible.length})`)
      expect(narrow.visible.length >= 1, 'хотя бы один пункт')
      expect.eq(narrow.more, true, '«Ещё» на месте')
      step('Esc')
      const more = page.locator('[data-slot=switcher-overflow-trigger]')
      await more.click()
      await wait(page, () => document.querySelectorAll('[role=menuitem],[role=menuitemradio]').length > 0, null, 'список «Ещё»')
      await page.keyboard.press('Escape')
      await wait(page, () => document.querySelectorAll('[role=menuitem],[role=menuitemradio]').length === 0, null, 'закрытие')
      await wait(page, () => document.activeElement?.getAttribute('data-slot') === 'switcher-overflow-trigger', null, 'фокус на «Ещё»')
      step('выбрать «Архив»')
      await more.click()
      await page.getByRole('menuitem', { name: 'Архив' }).or(page.getByRole('menuitemradio', { name: 'Архив' })).click()
      await wait(page, () => document.querySelectorAll('[role=menuitem],[role=menuitemradio]').length === 0, null, 'закрытие после выбора')
      step('расширить')
      await resize(page, 1280)
      const back = await stable(page, () => swState(page))
      expect.eq(back.visible.length, wide.visible.length, 'то же число пунктов, что было')
      expect(back.pressed.length <= 1, 'выбран не более одного пункта')
    },
  },
  {
    name: 'sidebar: группа раскрывается и сворачивается щелчком, Enter и пробелом; вложенные пункты видны только в раскрытой',
    story: SBAR,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=sidebar-group-trigger]')
      const g = page.locator('[data-slot=sidebar-group-trigger]')
      expect.eq((await sbState(page)).groupExpanded, 'false', 'сначала свёрнута')
      expect.eq((await sbState(page)).nested, [], 'вложенных нет')
      step('щелчок')
      await g.click()
      await wait(page, () => document.querySelector('[data-slot=sidebar-group-trigger]').getAttribute('aria-expanded') === 'true', null, 'раскрытие')
      expect.eq((await sbState(page)).nested, ['СБП', 'QR-коды СБП'], 'вложенные видны')
      step('Enter')
      await g.focus()
      await page.keyboard.press('Enter')
      await wait(page, () => document.querySelector('[data-slot=sidebar-group-trigger]').getAttribute('aria-expanded') === 'false', null, 'сворачивание по Enter')
      expect.eq((await sbState(page)).nested, [], 'вложенных нет')
      step('пробел')
      await page.keyboard.press('Space')
      await wait(page, () => document.querySelector('[data-slot=sidebar-group-trigger]').getAttribute('aria-expanded') === 'true', null, 'раскрытие по пробелу')
    },
  },
  {
    name: 'sidebar: Tab идёт по пунктам и вложенным ссылкам раскрытой группы по порядку',
    story: SBAR,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=sidebar-group-trigger]')
      await page.locator('[data-slot=sidebar-group-trigger]').click()
      await wait(page, () => document.querySelector('[data-slot=sidebar-group-trigger]').getAttribute('aria-expanded') === 'true', null, 'раскрытие')
      await page.getByRole('link', { name: 'Главная' }).focus()
      const seq = []
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        seq.push(await activeText(page))
      }
      expect.eq(seq.slice(0, 4), ['Платежи', 'СБП', 'QR-коды СБП', 'Карты'], 'порядок обхода')
    },
  },
  {
    name: 'sidebar: свёрнутая панель — только значки, подпись пункта в тултипе по наведению и по фокусу',
    story: SBAR,
    run: async ({ page, expect, step, story }) => {
      await page.goto(`${new URL(page.url()).origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&args=defaultOpen:!false`)
      await page.waitForSelector('[data-slot=sidebar]')
      const s = await stable(page, () => sbState(page))
      expect.eq(s.labels, [], 'подписей нет')
      expect(s.width < 100, 'узкая панель: ' + s.width)
      step('наведение')
      await page.getByRole('link').nth(1).hover()
      await wait(page, () => [...document.querySelectorAll('[data-side][data-open]')].some((e) => e.textContent === 'Карты'), null, 'тултип «Карты» по наведению')
      await page.mouse.move(900, 700)
      await wait(page, () => ![...document.querySelectorAll('[data-side][data-open]')].length, null, 'закрытие тултипа')
      step('фокус')
      await page.getByRole('link').nth(1).focus()
      await wait(page, () => [...document.querySelectorAll('[data-side][data-open]')].some((e) => e.textContent === 'Карты'), null, 'тултип «Карты» по фокусу')
    },
  },
  {
    name: 'sidebar: переключение «Open» на лету сворачивает и разворачивает панель, подписи появляются и пропадают',
    story: SBAR,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=sidebar]')
      const open = await stable(page, () => sbState(page))
      expect.eq(open.labels, ['Главная', 'Карты', 'Настройки'], 'подписи есть')
      step('свернуть')
      await setArgs(page, { defaultOpen: false })
      await wait(page, () => document.querySelector('[data-slot=sidebar]').getBoundingClientRect().width < 100, null, 'сворачивание')
      const closed = await stable(page, () => sbState(page))
      expect.eq(closed.labels, [], 'подписей нет')
      step('развернуть')
      await setArgs(page, { defaultOpen: true })
      await wait(page, () => document.querySelector('[data-slot=sidebar]').getBoundingClientRect().width > 200, null, 'разворачивание')
      const again = await stable(page, () => sbState(page))
      expect.eq(again.width, open.width, 'та же ширина')
      expect.eq(again.labels, open.labels, 'те же подписи')
    },
  },
]
