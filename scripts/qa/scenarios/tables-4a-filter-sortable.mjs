// Управляющие элементы вокруг таблиц: filter-table (чипы, попап значения), sortable (перестановка клавишами и
// сброс взвода), selection-button, чёрная панель выбора, аккордеоны, панель уведомлений, копирование значения.
import { eventually, ready, until, withArgs } from './tables-0-helpers.mjs'

const FILTER = 'компоненты-filter-table--opened'
const DND = 'компоненты-drag-and-drop--playground'
const SEL = 'компоненты-selection-button--playground'
const SEL_EX = 'компоненты-selection-button--examples'
const ACC_LIST = 'компоненты-content-accordion--playground'
const ACC_CARD = 'компоненты-accordion--playground'
const NOTIF = 'компоненты-notification--playground'
const INFO = 'компоненты-information-field--playground'

const chips = (page) =>
  page.locator('[data-slot=filter]').evaluateAll((fs) =>
    fs.map((e) => e.innerText.replace(/\s+/g, ' ').trim() + '|' + (e.getAttribute('data-checked') ? 'выбран' : '') + '|' + e.getAttribute('aria-expanded'))
  )
const dialogs = (page) => page.locator('[data-slot=filter-content]').count()

const order = (page) =>
  page.locator('[data-slot=sortable-list]').first().locator('[data-slot=sortable-handle]').evaluateAll((hs) =>
    hs.map((h) => h.getAttribute('aria-label').replace(/^Переместить «|»$/g, ''))
  )
const dndHandle = (page, name) => page.locator(`[data-slot=sortable-list] [aria-label="Переместить «${name}»"]`).first()
const dndRow = (page, name) => dndHandle(page, name).locator('xpath=ancestor::div[@draggable][1]')

/** Подменяет запись в буфер обмена: всё, что уходит в writeText, копится в window.__copied. */
async function stubClipboard(page) {
  await page.evaluate(() => {
    window.__copied = []
    navigator.clipboard.writeText = (text) => {
      window.__copied.push(text)
      return Promise.resolve()
    }
  })
}

/** Ставит значение поля через канал Storybook, жмёт «Копировать» и возвращает то, что ушло в буфер. */
async function copyOf(page, expect, value) {
  await stubClipboard(page)
  await page.evaluate(
    ([id, v]) => window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId: id, updatedArgs: { value: v, copyable: true, copyValue: undefined } }),
    [INFO, value]
  )
  await until(async () => (await page.locator('[data-slot=item-information-field-value]').first().innerText()).trim() === value, 'значение «' + value + '» на экране')
  await page.locator('[aria-label="Копировать"]').first().click()
  await until(async () => (await page.evaluate(() => window.__copied.length)) > 0, 'запись в буфер для «' + value + '»')
  const copied = await page.evaluate(() => window.__copied)
  expect.eq(copied.length, 1, 'одна запись в буфер')
  return copied[0]
}

export default ready([
  // ——— filter-table ———
  {
    name: 'FilterTable: значение из попапа по «Применить» становится подписью выбранного чипа',
    story: FILTER,
    run: async ({ page, expect, step }) => {
      expect.eq((await chips(page))[0], 'Статус||true', 'раскрытый чип без значения')
      const pop = page.locator('[data-slot=filter-content]').first()
      step('ввод и «Применить»')
      await pop.locator('input').fill('Абв')
      await pop.getByRole('button', { name: 'Применить' }).click()
      await eventually(expect, async () => (await chips(page))[0], 'Абв|выбран|true', 'подпись заменена значением, чип выбран')
    },
  },
  {
    name: 'FilterTable: «Сбросить» в попапе очищает значение чипа и поле ввода',
    story: FILTER,
    run: async ({ page, expect, step }) => {
      const pop = page.locator('[data-slot=filter-content]').first()
      await pop.locator('input').fill('Абв')
      await pop.getByRole('button', { name: 'Применить' }).click()
      await eventually(expect, async () => (await chips(page))[0], 'Абв|выбран|true', 'применили')
      step('сброс')
      await pop.getByRole('button', { name: 'Сбросить' }).click()
      await eventually(expect, async () => (await chips(page))[0], 'Статус||true', 'подпись вернулась')
      expect.eq(await pop.locator('input').inputValue(), '', 'поле пустое')
    },
  },
  {
    name: 'FilterTable: крестик на выбранном чипе снимает значение и не раскрывает попап',
    story: FILTER,
    run: async ({ page, expect }) => {
      expect.eq((await chips(page))[3], 'Оплачен|выбран|false', 'четвёртый чип выбран')
      const before = await dialogs(page)
      await page.locator('[aria-label="Сбросить фильтр"]').click()
      await eventually(expect, async () => (await chips(page))[3], 'Тип||false', 'подпись вернулась к названию, чип не выбран')
      expect.eq(await page.locator('[aria-label="Сбросить фильтр"]').count(), 0, 'крестика больше нет')
      expect.eq(await dialogs(page), before, 'попап крестиком не открылся')
    },
  },
  {
    name: 'FilterTable: чип открывается с клавиатуры, Escape закрывает и возвращает фокус',
    story: FILTER,
    run: async ({ page, expect, step }) => {
      const chip = page.locator('[data-slot=filter]').nth(1)
      await chip.focus()
      step('Enter')
      await page.keyboard.press('Enter')
      await eventually(expect, () => chip.getAttribute('aria-expanded'), 'true', 'чип «Сумма» раскрыт')
      step('Escape')
      await page.keyboard.press('Escape')
      await until(async () => (await chip.getAttribute('aria-expanded')) === 'false', 'чип закрылся')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.textContent?.trim()), 'Сумма', 'фокус вернулся на чип')
      step('пробел')
      await page.keyboard.press('Space')
      await eventually(expect, () => chip.getAttribute('aria-expanded'), 'true', 'пробел тоже открывает')
    },
  },
  {
    name: 'FilterTable: чип со счётчиком показывает число, а применённое значение текстового чипа сбрасывается крестиком',
    story: FILTER,
    run: async ({ page, expect, step }) => {
      expect.eq((await chips(page))[2], 'Период 3||false', 'счётчик 3 рядом с подписью')
      const chip = page.locator('[data-slot=filter]').nth(1)
      await chip.click()
      const pop = page.locator('[data-slot=filter-content]').last()
      await pop.locator('input').fill('123')
      await pop.getByRole('button', { name: 'Применить' }).click()
      await until(async () => (await chips(page))[1] === '123|выбран|false', 'значение применено')
      step('сброс крестиком')
      await chip.locator('[aria-label="Сбросить фильтр"]').click()
      await eventually(expect, async () => (await chips(page))[1], 'Сумма||false', 'вернулась подпись')
    },
  },

  // ——— sortable ———
  {
    name: 'Sortable: стрелка вниз на ручке переставляет строку, фокус остаётся на ручке',
    story: DND,
    run: async ({ page, expect }) => {
      expect.eq((await order(page)).slice(0, 3), ['Общие вопросы', 'Эффективность и целеполагание', 'Управление аккаунтом'], 'исходный порядок')
      await dndHandle(page, 'Общие вопросы').focus()
      await page.keyboard.press('ArrowDown')
      expect.eq((await order(page)).slice(0, 3), ['Эффективность и целеполагание', 'Общие вопросы', 'Управление аккаунтом'], 'строка ушла вниз')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Переместить «Общие вопросы»', 'фокус на ручке той же строки')
      await page.keyboard.press('ArrowDown')
      expect.eq((await order(page)).slice(0, 3), ['Эффективность и целеполагание', 'Управление аккаунтом', 'Общие вопросы'], 'ещё на шаг')
    },
  },
  {
    name: 'Sortable: стрелка вверх возвращает строку, у краёв списка стрелки ничего не делают',
    story: DND,
    run: async ({ page, expect, step }) => {
      const initial = await order(page)
      await dndHandle(page, 'Общие вопросы').focus()
      step('вверх с первой строки')
      await page.keyboard.press('ArrowUp')
      expect.eq(await order(page), initial, 'первая строка выше не идёт')
      step('вниз-вверх')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowUp')
      expect.eq(await order(page), initial, 'порядок вернулся')
      step('вниз с последней строки')
      const last = initial[initial.length - 1]
      await dndHandle(page, last).focus()
      await page.keyboard.press('ArrowDown')
      expect.eq(await order(page), initial, 'последняя строка ниже не идёт')
    },
  },
  {
    name: 'Sortable: перестановка идёт по строкам, число строк не меняется',
    story: DND,
    run: async ({ page, expect }) => {
      const before = await order(page)
      await dndHandle(page, 'Платежи и подписки').focus()
      for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowUp')
      const after = await order(page)
      expect.eq(after.length, before.length, 'строк столько же')
      expect.eq([...after].sort(), [...before].sort(), 'состав тот же')
      expect.eq(after.indexOf('Платежи и подписки'), before.indexOf('Платежи и подписки') - 3, 'ушла ровно на три вверх')
    },
  },
  {
    name: 'Sortable: строка взводится (draggable) только пока нажата ручка и сбрасывается при отпускании',
    story: DND,
    run: async ({ page, expect, step }) => {
      const row = dndRow(page, 'Общие вопросы')
      const b = await dndHandle(page, 'Общие вопросы').boundingBox()
      expect.eq(await row.getAttribute('draggable'), 'false', 'без нажатия строка не draggable')
      step('нажатие на ручку')
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
      await page.mouse.down()
      expect.eq(await row.getAttribute('draggable'), 'true', 'нажатая ручка взводит строку')
      step('отпускание на ручке')
      await page.mouse.up()
      expect.eq(await row.getAttribute('draggable'), 'false', 'взвод снят')
    },
  },
  {
    name: 'Sortable: после протяжки и отпускания вне списка взвод и признак переноса сняты',
    story: DND,
    run: async ({ page, expect }) => {
      const row = dndRow(page, 'Общие вопросы')
      const b = await dndHandle(page, 'Общие вопросы').boundingBox()
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
      await page.mouse.down()
      await page.mouse.move(b.x + 400, b.y + 3, { steps: 4 })
      await page.mouse.up()
      await until(async () => (await row.getAttribute('draggable')) === 'false' && (await row.getAttribute('data-dragging')) === null, 'взвод и перенос сняты')
      expect.eq((await order(page)).slice(0, 2), ['Общие вопросы', 'Эффективность и целеполагание'], 'порядок не изменился')
    },
  },

  // ——— selection-button ———
  {
    name: 'SelectionButton: меню открывается, стрелки ходят по пунктам, Escape закрывает и возвращает фокус',
    story: SEL,
    run: async ({ page, expect, step }) => {
      const trigger = page.locator('#storybook-root button[aria-label="Ещё"]')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'false', 'сначала закрыто')
      step('открыть')
      await trigger.click()
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'true', 'открыто')
      expect.eq(await page.getByRole('menuitem').allInnerTexts().then((a) => a.map((s) => s.split('\n')[0])), ['Редактировать', 'Дублировать', 'Удалить'], 'три пункта')
      step('вниз')
      await page.keyboard.press('ArrowDown')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.innerText.split('\n')[0]), 'Редактировать', 'первая стрелка ведёт на первый пункт')
      await page.keyboard.press('ArrowDown')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.innerText.split('\n')[0]), 'Дублировать', 'вторая — на второй пункт')
      step('Escape')
      await page.keyboard.press('Escape')
      await until(async () => (await trigger.getAttribute('aria-expanded')) === 'false', 'меню закрылось')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Ещё', 'фокус на триггере')
    },
  },
  {
    name: 'SelectionButton: выбор пункта мышью закрывает меню',
    story: SEL,
    run: async ({ page, expect }) => {
      const trigger = page.locator('#storybook-root button[aria-label="Ещё"]')
      await trigger.click()
      await page.getByRole('menuitem', { name: /Удалить/ }).click()
      await until(async () => (await page.getByRole('menu').count()) === 0, 'меню закрылось')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'false', 'триггер закрыт')
    },
  },
  {
    name: 'SelectionButton: Enter на пункте закрывает меню',
    story: SEL,
    run: async ({ page, expect }) => {
      const trigger = page.locator('#storybook-root button[aria-label="Ещё"]')
      await trigger.focus()
      await page.keyboard.press('Enter')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await until(async () => (await page.getByRole('menu').count()) === 0, 'меню закрылось')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'false', 'триггер закрыт')
    },
  },
  {
    name: 'SelectionButton: меню всех четырёх направлений помещается в окно',
    story: SEL_EX,
    run: async ({ page, expect }) => {
      const triggers = page.locator('#storybook-root button[aria-label="Ещё"]')
      const n = await triggers.count()
      expect(n >= 4, 'в примерах не меньше четырёх триггеров, найдено ' + n)
      for (let i = 0; i < n; i++) {
        const t = triggers.nth(i)
        await t.scrollIntoViewIfNeeded()
        await t.click()
        await until(async () => (await page.getByRole('menu').count()) === 1, 'меню открылось у триггера ' + i)
        const box = await page.getByRole('menu').boundingBox()
        const vp = page.viewportSize()
        expect(box.x >= 0 && box.y >= 0 && box.x + box.width <= vp.width && box.y + box.height <= vp.height, `меню триггера ${i} вне окна: ${JSON.stringify(box)}`)
        await page.keyboard.press('Escape')
        await until(async () => (await page.getByRole('menu').count()) === 0, 'меню закрылось у триггера ' + i)
      }
    },
  },
  {
    name: 'SelectionButton: на телефоне меню тоже целиком в окне',
    story: SEL,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await page.locator('#storybook-root button[aria-label="Ещё"]').click()
      await until(async () => (await page.getByRole('menu').count()) === 1, 'меню открылось')
      const box = await page.getByRole('menu').boundingBox()
      expect(box.x >= 0 && box.x + box.width <= 375, 'меню в пределах 375: ' + JSON.stringify(box))
    },
  },

  // ——— чёрная панель выбора ———
  {
    name: 'Чёрная панель: «Выбрать на всех страницах (N)» прячется, когда выбрано всё, и возвращается при снятии галки',
    story: 'компоненты-table--fields',
    viewport: [1280, 600],
    run: async ({ page, expect, step }) => {
      const T = page.locator('#storybook-root table').first()
      const vars = () =>
        page.evaluate(() => {
          const cs = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim()
          const box = (s) => {
            const e = document.querySelector(s)
            return e ? [Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().bottom)] : null
          }
          return { view: cs('--viewport-inset-bottom'), float: cs('--floating-inset-bottom'), block: box('[data-slot=button-menu-black-block]'), panel: box('[data-slot=button-menu-black]'), bar: box('[data-slot=table-scrollbar]') }
        })
      expect.eq((await vars()).view, '0px', 'без панели отступ снизу нулевой')
      step('выбрать строку')
      await T.locator('tbody tr').nth(1).locator('[role=checkbox]').first().click()
      let v = await vars()
      expect.eq([v.view, v.float], ['72px', '136px'], 'панель 72 и блок с кнопкой 136')
      expect.eq(v.block, [464, 600], 'блок «выбрать всё» над панелью у нижнего края окна 600')
      expect.eq(v.panel, [528, 600], 'сама панель 72px внизу')
      expect.eq(v.bar[1], v.panel[0], 'нижняя полоса прокрутки встала вплотную над панелью')
      step('выбрать на всех страницах')
      await page.locator('[data-slot=button-menu-black-select-all]').click()
      v = await vars()
      expect.eq([v.view, v.float, v.block], ['72px', '0px', null], 'кнопка ушла, панель осталась 72px')
      step('снять одну галку')
      await T.locator('tbody tr').nth(1).locator('[role=checkbox]').first().click()
      v = await vars()
      expect.eq([v.view, v.float], ['72px', '136px'], 'кнопка вернулась вместе с блоком 136')
      step('закрыть панель')
      await page.locator('[data-slot=button-menu-black] [data-slot=close-cross]').click()
      v = await vars()
      expect.eq([v.view, v.float, v.panel], ['0px', '0px', null], 'все отступы сняты')
    },
  },
  {
    name: 'Чёрная панель: ряд кнопок и поля информации не выходят за окно на телефоне',
    story: 'компоненты-button-menu-black--playground',
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      const panel = page.locator('[data-slot=button-menu-black]')
      const box = await panel.boundingBox()
      expect(box.x >= 0 && box.x + box.width <= 375 + 1, 'панель в окне: ' + JSON.stringify(box))
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'страница без горизонтальной прокрутки')
      const over = await panel.locator('button').evaluateAll((bs) => bs.filter((b) => b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().right > 376).map((b) => b.innerText || b.getAttribute('aria-label')))
      expect.eq(over, [], 'кнопки за правым краем')
    },
  },
  {
    name: 'Чёрная панель: крестик закрывает панель по клику и с клавиатуры',
    story: 'компоненты-table--playground',
    run: async ({ page, expect, step }) => {
      const T = page.locator('#storybook-root table').first()
      const cross = () => page.locator('[data-slot=button-menu-black] [data-slot=close-cross]')
      await T.locator('tbody tr').first().locator('[role=checkbox]').first().click()
      step('щелчок')
      await cross().click()
      expect.eq(await page.locator('[data-slot=button-menu-black]').count(), 0, 'панель закрыта щелчком')
      expect.eq(await T.locator('tbody tr').first().locator('[role=checkbox]').first().getAttribute('aria-checked'), 'false', 'выбор снят')
      step('с клавиатуры')
      await T.locator('tbody tr').first().locator('[role=checkbox]').first().click()
      await cross().focus()
      await page.keyboard.press('Enter')
      expect.eq(await page.locator('[data-slot=button-menu-black]').count(), 0, 'панель закрыта Enter')
    },
  },
])
