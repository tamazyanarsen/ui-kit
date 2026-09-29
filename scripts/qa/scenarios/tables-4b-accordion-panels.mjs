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

  // ——— аккордеоны ———
  {
    name: 'AccordionList: Enter и пробел на заголовке раскрывают и сворачивают панель',
    story: ACC_LIST,
    run: async ({ page, expect }) => {
      const trigger = page.locator('[data-slot=accordion-list-trigger]')
      const panels = () => page.locator('[data-slot=accordion-list-panel]').count()
      await eventually(expect, async () => [await trigger.getAttribute('aria-expanded'), await panels()], ['true', 1], 'сначала раскрыт')
      await trigger.focus()
      await page.keyboard.press('Enter')
      await eventually(expect, async () => [await trigger.getAttribute('aria-expanded'), await panels()], ['false', 0], 'Enter свернул')
      await page.keyboard.press('Space')
      await eventually(expect, async () => [await trigger.getAttribute('aria-expanded'), await panels()], ['true', 1], 'пробел раскрыл')
    },
  },
  {
    name: 'AccordionList: чекбокс внутри заголовка переключается мышью и пробелом, не раскрывая аккордеон',
    story: ACC_LIST,
    run: async ({ page, expect, step }) => {
      const trigger = page.locator('[data-slot=accordion-list-trigger]')
      const box = page.locator('[data-slot=accordion-list] [role=checkbox]')
      expect.eq(await box.getAttribute('aria-checked'), 'true', 'отмечен по умолчанию')
      step('щелчок по чекбоксу')
      await box.click()
      await page.waitForTimeout(200)
      expect.eq([await box.getAttribute('aria-checked'), await trigger.getAttribute('aria-expanded')], ['false', 'true'], 'галка снята, раскрытость прежняя')
      step('пробел на чекбоксе')
      await box.focus()
      await page.keyboard.press('Space')
      await page.waitForTimeout(200)
      expect.eq([await box.getAttribute('aria-checked'), await trigger.getAttribute('aria-expanded')], ['true', 'true'], 'галка вернулась, раскрытость прежняя')
    },
  },
  {
    name: 'AccordionList: кнопка «Изменить» и меню «Ещё» в заголовке не сворачивают аккордеон',
    story: ACC_LIST,
    run: async ({ page, expect, step }) => {
      const trigger = page.locator('[data-slot=accordion-list-trigger]')
      step('«Изменить»')
      await page.getByRole('button', { name: 'Изменить', exact: true }).click()
      await page.waitForTimeout(200)
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'true', 'после «Изменить» раскрыт')
      step('«Ещё»')
      await page.locator('[data-slot=accordion-list-trigger] button[aria-label="Ещё"]').click()
      await page.waitForTimeout(200)
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'true', 'после «Ещё» раскрыт')
    },
  },
  {
    name: 'AccordionCard: Enter и пробел раскрывают карточку и сворачивают её',
    story: ACC_CARD,
    run: async ({ page, expect }) => {
      const trigger = page.locator('[data-slot=accordion-card-trigger]')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'false', 'свёрнута по умолчанию')
      await trigger.focus()
      await page.keyboard.press('Enter')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'true', 'Enter раскрыл')
      expect((await page.locator('[data-slot=accordion-card-panel]').innerText()).includes('Раскрытое содержимое карточки.'), 'содержимое показано')
      await page.keyboard.press('Space')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'false', 'пробел свернул')
      expect.eq(await page.locator('[data-slot=accordion-card-panel]').count(), 0, 'панели нет')
    },
  },
  {
    name: 'AccordionCard: заблокированная карточка остаётся раскрытой и не сворачивается',
    story: ACC_CARD,
    run: async ({ page, expect }) => {
      await withArgs(page, 'type:blocked;defaultOpen:true')
      const trigger = page.locator('[data-slot=accordion-card-trigger]')
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'true', 'раскрыта')
      await trigger.click({ force: true })
      await trigger.focus()
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
      await eventually(expect, () => trigger.getAttribute('aria-expanded'), 'true', 'по-прежнему раскрыта')
    },
  },

  // ——— панель уведомлений ———
  {
    name: 'NotificationPanel: при ограничении высоты прокручивается список, кнопки панели остаются на месте',
    story: NOTIF,
    run: async ({ page, expect, step }) => {
      await withArgs(page, 'maxHeight:200')
      const panel = page.locator('[data-slot=notification-panel]')
      const list = panel.locator('[data-slot=scrollbar]')
      const foot = () => panel.getByRole('button', { name: 'В центр уведомлений' }).evaluate((e) => Math.round(e.getBoundingClientRect().bottom))
      expect((await list.evaluate((e) => e.scrollHeight - e.clientHeight)) > 100, 'список длиннее окна')
      const footBefore = await foot()
      step('прокрутка списка до конца')
      await list.evaluate((e) => { e.scrollTop = e.scrollHeight })
      expect.eq(await list.evaluate((e) => Math.round(e.scrollTop + e.clientHeight) >= e.scrollHeight - 1), true, 'дошли до конца')
      expect.eq(await foot(), footBefore, 'кнопки панели не сдвинулись')
      const last = panel.locator('[data-slot=notification-item]').last()
      const lb = await last.boundingBox()
      const wb = await list.boundingBox()
      expect(lb.y + lb.height <= wb.y + wb.height + 1, 'последнее уведомление целиком в окне прокрутки')
    },
  },
  {
    name: 'NotificationPanel: пустая панель показывает только заголовок и кнопки',
    story: NOTIF,
    run: async ({ page, expect }) => {
      await withArgs(page, 'itemsCount:0')
      const panel = page.locator('[data-slot=notification-panel]')
      expect.eq(await panel.locator('[data-slot=notification-item]').count(), 0, 'уведомлений нет')
      expect.eq(await panel.getByRole('button').allInnerTexts(), ['В центр уведомлений', 'Прочитать все (23)'], 'обе кнопки на месте')
    },
  },
  {
    name: 'NotificationPanel: три уведомления, у каждого своя кнопка',
    story: NOTIF,
    run: async ({ page, expect }) => {
      const panel = page.locator('[data-slot=notification-panel]')
      expect.eq(await panel.locator('[data-slot=notification-item]').count(), 3, 'три уведомления')
      expect.eq(await panel.locator('[data-slot=notification-item] button').count(), 3, 'у каждого своя кнопка')
    },
  },

  // ——— копирование в ItemInformationField ———
  // Настоящий буфер обмена общий на все параллельные страницы (и на другие группы сценариев), поэтому
  // navigator.clipboard.writeText подменяется записью в window.__copied: проверяется ровно то, что уходит в буфер.
  {
    name: 'ItemInformationField: число копируется без разрядов и «₽», номер счёта — без пробелов',
    story: INFO,
    run: async ({ page, expect, step }) => {
      const check = (value) => copyOf(page, expect, value)
      step('сумма с ₽')
      expect.eq(await check('1 200 000,00 ₽'), '1200000,00', 'сумма без разрядов и знака')
      step('номер счёта')
      expect.eq(await check('40702 810 7 00590062544'), '40702810700590062544', 'счёт без пробелов')
      step('число со знаком')
      expect.eq(await check('-500,5'), '-500,5', 'отрицательное число как есть')
      step('число без валюты')
      expect.eq(await check('12 345'), '12345', 'целое с разрядами')
    },
  },
  {
    name: 'ItemInformationField: телефон, дата и текст копируются как показаны',
    story: INFO,
    run: async ({ page, expect, step }) => {
      const check = (value) => copyOf(page, expect, value)
      step('телефон')
      expect.eq(await check('+7 900 123 45 67'), '+7 900 123 45 67', 'телефон с пробелами')
      step('дата')
      expect.eq(await check('10.01.2026'), '10.01.2026', 'дата с точками')
      step('текст')
      expect.eq(await check('Иван Иванов'), 'Иван Иванов', 'имя')
    },
  },
  {
    name: 'ItemInformationField: явный copyValue копируется слово в слово, тост «Скопировано в буфер обмена»',
    story: INFO,
    run: async ({ page, expect }) => {
      await stubClipboard(page)
      await page.evaluate((id) => window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId: id, updatedArgs: { value: '1 200 000,00 ₽', copyValue: '1 200 000 руб.', copyable: true } }), INFO)
      await until(async () => (await page.locator('[data-slot=item-information-field-value]').first().innerText()).trim() === '1 200 000,00 ₽', 'значение на экране')
      await page.locator('[aria-label="Копировать"]').first().click()
      await eventually(expect, () => page.evaluate(() => window.__copied), ['1 200 000 руб.'], 'в буфер ушёл copyValue')
      await until(async () => (await page.locator('[data-slot=toast]').allInnerTexts()).some((t) => t.includes('Скопировано в буфер обмена')), 'тост об успехе')
    },
  },
  {
    name: 'ItemInformationField: отказ буфера обмена — тост об ошибке, а не об успехе',
    story: INFO,
    run: async ({ page, expect }) => {
      await page.evaluate(() => {
        navigator.clipboard.writeText = () => Promise.reject(new Error('denied'))
      })
      await page.locator('[aria-label="Копировать"]').first().click()
      await until(async () => (await page.locator('[data-slot=toast]').allInnerTexts()).length > 0, 'появился тост')
      const toasts = (await page.locator('[data-slot=toast]').allInnerTexts()).join(' | ')
      expect(toasts.includes('Не удалось скопировать'), 'тост об ошибке: ' + toasts)
      expect(!toasts.includes('Скопировано в буфер обмена'), 'ложного успеха нет: ' + toasts)
    },
  },
])
