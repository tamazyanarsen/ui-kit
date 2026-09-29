// Слой 4: Combobox с полем поиска (ComboboxSearchInput) — фильтр по набору, пустой результат, крестик поиска,
// отметки при смене фильтра, клавиатура, Esc и возврат фокуса, мобильная ширина. Поле поиска включает аргумент
// `search` истории «компоненты-combobox--playground» (по умолчанию выключен, чтобы не менять overlays-select).
import { reopen } from './fields-lib.mjs'

const PLAY = 'компоненты-combobox--playground'
const T = '[data-slot=combobox-trigger]'
const SR = '[data-slot=combobox-search]'
const ALL = ['Паспорт РФ', 'СНИЛС', 'ИНН', 'Договор аренды', 'Выписка ЕГРЮЛ']
const CLEAR = 'button[aria-label="Очистить поиск"]'

const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
const names = (page) => page.evaluate(() => [...document.querySelectorAll('[role=option]')].map((o) => o.textContent))
const checked = (page) => page.evaluate(() => [...document.querySelectorAll('[role=option][aria-selected=true]')].map((o) => o.textContent))
const hasNames = (page, want, what) =>
  wait(page, (w) => JSON.stringify([...document.querySelectorAll('[role=option]')].map((o) => o.textContent)) === JSON.stringify(w), want, what)
const label = (page) => page.locator(T).locator('[data-slot=clip-text]').textContent()
const onSearch = (page, what) => wait(page, (s) => document.activeElement === document.querySelector(s), SR, what || 'фокус в поле поиска')
const onTrigger = (page) => wait(page, (s) => document.activeElement === document.querySelector(s), T, 'фокус на триггере')
// список раскрыт, и Base UI уже отдал фокус полю поиска
async function open(page, how = 'click') {
  if (how === 'click') await page.locator(T).click()
  else { await page.locator(T).focus(); await page.keyboard.press(how) }
  await wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true', T, 'открытие')
  await onSearch(page)
}
const closed = (page) => wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'false' && !document.querySelector('[role=option]'), T, 'закрытие')
const withSearch = (page, args = '') => reopen(page, { id: PLAY }, 'search:!true' + (args ? ';' + args : ''))

export default [
  {
    name: 'combobox search: список открывается с фокусом в поле поиска, пункты полные, placeholder из аргумента',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      step('без аргумента search поля поиска нет')
      await page.locator(T).click()
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true', T, 'открытие')
      expect.eq(await page.locator(SR).count(), 0, 'поиска нет по умолчанию')
      step('с search')
      await withSearch(page, 'searchPlaceholder:Find')
      await open(page)
      expect.eq(await names(page), ALL, 'пункты')
      expect.eq(await page.locator(SR).getAttribute('placeholder'), 'Find', 'placeholder')
      expect.eq(await page.locator(SR).inputValue(), '', 'поиск пуст')
      expect.eq(await page.locator(CLEAR).count(), 0, 'у пустого поиска крестика нет')
    },
  },
  {
    name: 'combobox search: набор фильтрует пункты без учёта регистра, крестик поиска появляется с текстом',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await withSearch(page)
      await open(page)
      step('дог')
      await page.keyboard.type('дог')
      await hasNames(page, ['Договор аренды'], 'по «дог»')
      expect.eq(await page.locator(SR).inputValue(), 'дог', 'текст поиска')
      expect.eq(await page.locator(CLEAR).count(), 1, 'крестик поиска')
      step('заглавными')
      await page.locator(SR).fill('СНИЛС')
      await hasNames(page, ['СНИЛС'], 'регистр не важен')
      step('стереть — список полный')
      await page.locator(SR).fill('')
      await hasNames(page, ALL, 'полный список')
      expect.eq(await page.locator(CLEAR).count(), 0, 'крестик ушёл')
    },
  },
  {
    name: 'combobox search: пустой результат — текст Empty; крестик поиска возвращает список, фокус в поле',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await withSearch(page, 'emptyText:Nothing')
      await open(page)
      step('ии')
      await page.keyboard.type('ии')
      await wait(page, () => /^Nothing/.test(document.querySelector('[data-slot=combobox-empty]')?.textContent || ''), null, 'текст Empty')
      expect.eq(await names(page), [], 'пунктов нет')
      expect.eq(await page.locator('[data-slot=combobox-trigger]').getAttribute('aria-expanded'), 'true', 'список раскрыт')
      step('крестик')
      await page.locator(CLEAR).click()
      await hasNames(page, ALL, 'полный список после очистки')
      expect.eq(await page.locator(SR).inputValue(), '', 'поиск пуст')
      await onSearch(page)
      expect.eq(await page.evaluate(() => document.querySelector('[data-slot=combobox-empty]')?.textContent.replace(/[⁠\s]/g, '') || ''), '', 'Empty пуст')
      expect.eq(await page.locator(CLEAR).count(), 0, 'крестик ушёл')
    },
  },
  {
    name: 'combobox search: клавиатура — стрелка и Enter отмечают найденный пункт, «Выбрать» применяет, фокус на триггере',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await withSearch(page)
      await open(page, 'Enter')
      step('дог, стрелка, Enter')
      await page.keyboard.type('дог')
      await hasNames(page, ['Договор аренды'], 'найден один')
      await page.keyboard.press('ArrowDown')
      await wait(page, () => document.querySelector('[role=option][data-highlighted]')?.textContent === 'Договор аренды', null, 'подсветка')
      await page.keyboard.press('Enter')
      await wait(page, () => document.querySelectorAll('[role=option][aria-selected=true]').length === 1, null, 'пункт отмечен')
      expect.eq(await page.locator('[data-slot=combobox-trigger]').getAttribute('aria-expanded'), 'true', 'список остался открыт')
      await onSearch(page)
      step('Выбрать')
      expect.eq(await page.getByRole('button', { name: 'Выбрать: 1' }).count(), 1, 'кнопка со счётчиком')
      await page.getByRole('button', { name: 'Выбрать: 1' }).click()
      await closed(page)
      expect.eq(await label(page), 'Выбрано документов: 1', 'подпись триггера')
      await onTrigger(page)
    },
  },
  {
    name: 'combobox search: отметки переживают смену фильтра, «Выбрать: 2» применяет оба пункта',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await withSearch(page)
      await open(page)
      step('СНИЛС')
      await page.keyboard.type('снилс')
      await hasNames(page, ['СНИЛС'], 'фильтр 1')
      await page.getByRole('option', { name: 'СНИЛС' }).click()
      step('договор')
      await page.locator(SR).fill('договор')
      await hasNames(page, ['Договор аренды'], 'фильтр 2')
      await page.getByRole('option', { name: 'Договор аренды' }).click()
      step('очистить поиск')
      await page.locator(SR).fill('')
      await hasNames(page, ALL, 'полный список')
      expect.eq(await checked(page), ['СНИЛС', 'Договор аренды'], 'обе отметки на месте')
      await page.getByRole('button', { name: 'Выбрать: 2' }).click()
      await closed(page)
      expect.eq(await label(page), 'Выбрано документов: 2', 'подпись')
    },
  },
  {
    name: 'combobox search: крестик поиска стирает текст, отмеченные пункты остаются',
    story: PLAY,
    run: async ({ page, expect }) => {
      await withSearch(page)
      await open(page)
      await page.getByRole('option', { name: 'ИНН' }).click()
      await page.locator(SR).fill('пас')
      await hasNames(page, ['Паспорт РФ'], 'фильтр')
      await page.locator(CLEAR).click()
      await hasNames(page, ALL, 'список полный')
      expect.eq(await checked(page), ['ИНН'], 'отметка осталась')
      await onSearch(page)
    },
  },
  {
    name: 'combobox search: Esc закрывает список, возвращает фокус на триггер и отбрасывает черновик и текст поиска',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await withSearch(page)
      await open(page)
      await page.getByRole('option', { name: 'ИНН' }).click()
      await page.keyboard.type('пас')
      await hasNames(page, ['Паспорт РФ'], 'фильтр')
      step('Esc')
      await page.keyboard.press('Escape')
      await closed(page)
      await onTrigger(page)
      expect.eq(await label(page), '', 'подпись не менялась')
      step('повторное открытие')
      await open(page)
      expect.eq(await page.locator(SR).inputValue(), '', 'текст поиска сброшен')
      expect.eq(await names(page), ALL, 'полный список')
      expect.eq(await checked(page), [], 'черновик отброшен')
    },
  },
  {
    name: 'combobox search: searchLoading рисует крутилку рядом с крестиком поиска',
    story: PLAY,
    run: async ({ page, expect }) => {
      await withSearch(page)
      await open(page)
      expect.eq(await page.locator('[data-slot=combobox-content] svg.animate-spin').count(), 0, 'без searchLoading крутилки нет')
      await withSearch(page, 'searchLoading:!true')
      await open(page)
      await page.keyboard.type('а')
      await wait(page, () => !!document.querySelector('button[aria-label="Очистить поиск"]'), null, 'крестик')
      expect.eq(await page.locator('[data-slot=combobox-content] svg.animate-spin').count(), 1, 'крутилка')
      expect.eq(await page.locator(CLEAR).count(), 1, 'крестик рядом с крутилкой')
    },
  },
  {
    name: 'combobox search: disabled не открывается ни мышью, ни клавишей — поля поиска в DOM нет',
    story: PLAY,
    run: async ({ page, expect }) => {
      await withSearch(page, 'disabled:!true')
      await page.locator(T).click({ force: true })
      await page.locator(T).focus().catch(() => {})
      await page.keyboard.press('Enter')
      await page.keyboard.press('ArrowDown')
      expect.eq(await page.locator(T).getAttribute('aria-expanded'), 'false', 'aria-expanded')
      expect.eq(await page.locator(SR).count(), 0, 'поля поиска нет')
      expect.eq(await page.locator('[role=option]').count(), 0, 'пунктов нет')
    },
  },
  {
    name: 'combobox search: на 375 список и поиск внутри экрана, страница не шире экрана, фильтр работает',
    story: PLAY,
    viewport: [375, 700],
    run: async ({ page, expect }) => {
      await withSearch(page, 'viewport:mobile')
      await open(page)
      await page.keyboard.type('дог')
      await hasNames(page, ['Договор аренды'], 'фильтр на мобильной ширине')
      const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=combobox-content]').getBoundingClientRect(); return [b.left, b.right, b.bottom] })
      expect(r[0] >= 0 && r[1] <= 375, 'список по ширине в экране: ' + r)
      expect(r[2] <= 700, 'список по высоте в экране: ' + r)
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'нет горизонтальной прокрутки')
    },
  },
  {
    name: 'combobox search: пример «С полем поиска» в Matrix открывается и фильтрует',
    story: 'компоненты-combobox--matrix',
    run: async ({ page, expect }) => {
      const section = page.locator('section', { hasText: 'С полем поиска' }).last()
      await section.locator(T).scrollIntoViewIfNeeded()
      await section.locator(T).click()
      await wait(page, (s) => !!document.querySelector(s), SR, 'поле поиска')
      await page.keyboard.type('егрюл')
      await hasNames(page, ['Выписка ЕГРЮЛ'], 'фильтр в примере')
    },
  },
]
