// Слой 4: Autocomplete — набор в поле, фильтрация, выбор мышью и клавиатурой, Esc, очистка, disabled/error,
// пустой результат, подсветка совпадения, мобильная ширина. История — src/components/ui/autocomplete/autocomplete.stories.tsx.
// Проверяются значения (текст поля, пункты, aria-*, activeElement), а не классы.
import { reopen } from './fields-lib.mjs'

const PLAY = 'qa-autocomplete--playground'
const MATRIX = 'qa-autocomplete--matrix'
const F = '[data-slot=autocomplete-field]'
const ROMASHKA = ['ООО «Ромашка»', 'ООО «Ромашка-Сервис»', 'ЗАО «Альфа-Ромео Групп»', 'ООО «Торговый дом Ромашковая долина»']

const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
// заголовки пунктов (первая строка пункта; вторая — подзаголовок «ИНН … КПП …»)
const titles = (page) => page.evaluate(() => [...document.querySelectorAll('[role=option]')].map((o) => o.firstElementChild.textContent))
const value = (page) => page.locator(F).first().inputValue()
const expanded = (page) => page.locator(F).first().getAttribute('aria-expanded')
// Base UI убирает попап уже после закрытия: ждём и атрибут, и исчезновение пунктов
const closed = (page) => wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'false' && !document.querySelector('[role=option],[data-slot=autocomplete-empty]'), F, 'закрытие списка')
const focused = (page) => wait(page, (s) => document.activeElement === document.querySelector(s), F, 'фокус в поле')
const hasTitles = (page, want, what) =>
  wait(page, (w) => JSON.stringify([...document.querySelectorAll('[role=option]')].map((o) => o.firstElementChild.textContent)) === JSON.stringify(w), want, what)
const highlighted = (page, want, what) =>
  wait(page, (w) => document.querySelector('[role=option][data-highlighted]')?.firstElementChild.textContent === w, want, what)
// клик в поле и набор с клавиатуры, как у человека
async function typeText(page, text) {
  await page.locator(F).first().click()
  await page.keyboard.type(text)
}
const mark = (page) => page.evaluate(() => [...document.querySelectorAll('[role=option] mark')].map((m) => m.textContent))

export default [
  {
    name: 'autocomplete: набор фильтрует список, список раскрыт, фокус остаётся в поле',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      expect.eq(await expanded(page), 'false', 'до ввода список закрыт')
      step('ром')
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'четыре организации со «ром»')
      expect.eq(await expanded(page), 'true', 'aria-expanded')
      expect.eq(await value(page), 'ром', 'текст поля')
      step('ромашка')
      await page.keyboard.type('ашка')
      await hasTitles(page, ['ООО «Ромашка»', 'ООО «Ромашка-Сервис»'], 'сузили до двух')
      step('стереть до «р»')
      for (let i = 0; i < 6; i++) await page.keyboard.press('Backspace')
      await hasTitles(page, ['ООО «Ромашка»', 'ООО «Ромашка-Сервис»', 'АО «Роснефтьторг»', 'ИП Петров Пётр Петрович', 'ПАО «Северсталь-Инвест»', 'ООО «Вектор»', 'ЗАО «Альфа-Ромео Групп»', 'ООО «Торговый дом Ромашковая долина»'], 'по «р» подходят все')
      expect.eq(await page.evaluate((s) => document.activeElement === document.querySelector(s), F), true, 'фокус в поле')
    },
  },
  {
    name: 'autocomplete: поиск идёт и по подзаголовку (ИНН), регистр не важен',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      step('7706')
      await typeText(page, '7706')
      await hasTitles(page, ['ООО «Вектор»'], 'найден по ИНН')
      step('ВЕКТОР заглавными')
      await page.locator(F).fill('ВЕКТОР')
      await hasTitles(page, ['ООО «Вектор»'], 'регистр не важен')
      expect.eq(await page.locator('[role=option]').first().locator('span').nth(1).textContent(), 'ИНН 7706678901 КПП 770601001', 'подзаголовок пункта')
    },
  },
  {
    name: 'autocomplete: выбор мышью — текст поля, закрытие, фокус в поле, выбранный пункт отмечен',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'список')
      step('клик по «Ромашка-Сервис»')
      await page.getByRole('option', { name: /Ромашка-Сервис/ }).click()
      await closed(page)
      expect.eq(await value(page), 'ООО «Ромашка-Сервис»', 'текст поля = название')
      await focused(page)
      step('стрелка вниз открывает снова')
      await page.keyboard.press('ArrowDown')
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true', F, 'повторное открытие')
      expect.eq(await page.locator('[role=option][aria-selected=true]').count(), 1, 'ровно один отмеченный пункт')
      expect.eq(await page.locator('[role=option][aria-selected=true]').first().evaluate((o) => o.firstElementChild.textContent), 'ООО «Ромашка-Сервис»', 'отмечен выбранный')
    },
  },
  {
    name: 'autocomplete: клавиатура — стрелки двигают подсветку, Enter выбирает, Esc закрывает без выбора',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'список')
      expect.eq(await page.locator('[role=option][data-highlighted]').count(), 0, 'без стрелок ничего не подсвечено')
      step('вниз, вниз, вверх, вниз, вниз')
      await page.keyboard.press('ArrowDown')
      await highlighted(page, 'ООО «Ромашка»', 'первый')
      await page.keyboard.press('ArrowDown')
      await highlighted(page, 'ООО «Ромашка-Сервис»', 'второй')
      await page.keyboard.press('ArrowUp')
      await highlighted(page, 'ООО «Ромашка»', 'вверх — снова первый')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      await highlighted(page, 'ЗАО «Альфа-Ромео Групп»', 'третий')
      expect.eq(await expanded(page), 'true', 'список всё ещё раскрыт')
      step('Enter')
      await page.keyboard.press('Enter')
      await closed(page)
      expect.eq(await value(page), 'ЗАО «Альфа-Ромео Групп»', 'значение')
      await focused(page)
    },
  },
  {
    name: 'autocomplete: Esc закрывает список, фокус остаётся в поле, выбранное значение не теряется',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await typeText(page, 'вектор')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await closed(page)
      step('открыть стрелкой и нажать Esc')
      await page.keyboard.press('ArrowDown')
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true', F, 'открытие')
      await page.keyboard.press('Escape')
      await closed(page)
      expect.eq(await value(page), 'ООО «Вектор»', 'значение осталось')
      await focused(page)
      step('Esc при наборе без выбора')
      await page.locator(F).fill('рос')
      await hasTitles(page, ['АО «Роснефтьторг»'], 'список по «рос»')
      await page.keyboard.press('Escape')
      await closed(page)
      await focused(page)
    },
  },
  {
    name: 'autocomplete: Tab уводит фокус к следующему элементу и закрывает список',
    story: PLAY,
    run: async ({ page }) => {
      // страница истории — одно поле, Tab из него ушёл бы в браузер: даём ему соседа
      await page.evaluate(() => { const b = document.createElement('button'); b.id = 'next'; b.textContent = 'next'; document.querySelector('#storybook-root').append(b) })
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'список')
      await page.keyboard.press('Tab')
      await wait(page, () => document.activeElement?.id === 'next', null, 'фокус на соседней кнопке')
      await closed(page)
    },
  },
  {
    name: 'autocomplete: крестик «Очистить поле» стирает значение, фокус в поле, список не открывается',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      expect.eq(await page.getByRole('button', { name: 'Очистить поле' }).count(), 0, 'у пустого поля крестика нет')
      await typeText(page, 'вектор')
      await page.getByRole('option').first().click()
      await closed(page)
      step('крестик')
      await page.getByRole('button', { name: 'Очистить поле' }).click()
      await wait(page, (s) => document.querySelector(s).value === '', F, 'очистка поля')
      expect.eq(await expanded(page), 'false', 'список не открылся')
      await wait(page, () => !document.querySelector('[aria-label="Очистить поле"]'), null, 'крестик исчез у пустого поля')
      await focused(page)
      step('после очистки поле снова ищет')
      await page.locator(F).click()
      await page.keyboard.type('вект')
      await hasTitles(page, ['ООО «Вектор»'], 'после очистки список работает')
    },
  },
  {
    name: 'autocomplete: пустой результат показывает текст Empty, пустой запрос — подсказку',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      step('клик в пустое поле')
      await page.locator(F).click()
      await wait(page, () => document.querySelector('[data-slot=autocomplete-status]')?.textContent.trim() === 'Начните вводить название или ИНН', null, 'подсказка')
      expect.eq(await titles(page), [], 'пунктов нет')
      expect.eq(await page.locator('[data-slot=autocomplete-empty]:not(:empty)').count(), 0, 'Empty не показан')
      step('яяя')
      await page.keyboard.type('яяя')
      await wait(page, () => document.querySelector('[data-slot=autocomplete-empty]')?.textContent.replace(/[⁠\s]+$/g, '') === 'Ничего не найдено', null, 'Ничего не найдено')
      expect.eq(await titles(page), [], 'пунктов нет')
      expect.eq(await expanded(page), 'true', 'список раскрыт с сообщением')
      step('спецсимвол «(» не ломает поиск')
      await page.locator(F).fill('(')
      await wait(page, () => /Ничего не найдено/.test(document.querySelector('[data-slot=autocomplete-empty]')?.textContent || ''), null, 'Empty на «(»')
    },
  },
  {
    name: 'autocomplete: подсветка совпадения — без учёта регистра, в заголовке и подзаголовке',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      step('ром')
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'список')
      expect.eq(await mark(page), ['Ром', 'Ром', 'Ром', 'Ром'], 'регистр слов из названия сохранён')
      expect.eq(await page.evaluate(() => [...document.querySelectorAll('[role=option]')].map((o) => o.textContent)), ROMASHKA.map((t, i) => t + ['ИНН 7701234567 КПП 770101001', 'ИНН 7702345678 КПП 770201001', 'ИНН 7707789012 КПП 770701001', 'ИНН 7708890123 КПП 770801001'][i]), 'текст пунктов цел')
      step('7706 — совпадение в подзаголовке дважды')
      await page.locator(F).fill('7706')
      await hasTitles(page, ['ООО «Вектор»'], 'по ИНН')
      expect.eq(await mark(page), ['7706', '7706'], 'отмечены ИНН и КПП')
      expect.eq(await page.evaluate(() => [...document.querySelectorAll('[role=option] mark')].every((m) => m.closest('span').className.includes('text-p3'))), true, 'метки в строке подзаголовка')
      step('««» — символ, а не регулярка')
      await page.locator(F).fill('«')
      await wait(page, () => document.querySelectorAll('[role=option] mark').length > 0, null, 'метки')
      expect.eq((await mark(page)).every((m) => m === '«'), true, 'метка — только ««»')
    },
  },
  {
    name: 'autocomplete: highlight выключен — меток нет, список тот же',
    story: PLAY,
    run: async ({ page, expect }) => {
      await reopen(page, { id: PLAY }, 'highlight:!false')
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'список')
      expect.eq(await mark(page), [], 'меток нет')
    },
  },
  {
    name: 'autocomplete: filterMode=local — список полный до набора и сужается фильтром Base UI',
    story: PLAY,
    run: async ({ page, expect }) => {
      await reopen(page, { id: PLAY }, 'filterMode:local')
      await page.locator(F).click()
      await wait(page, () => document.querySelectorAll('[role=option]').length === 8, null, '8 пунктов без запроса')
      await page.keyboard.type('вект')
      await hasTitles(page, ['ООО «Вектор»'], 'сузили до одного')
    },
  },
  {
    name: 'autocomplete: ошибка — aria-invalid и текст ошибки связан с полем, без ошибки атрибута нет',
    story: PLAY,
    run: async ({ page, expect }) => {
      expect.eq(await page.locator(F).getAttribute('aria-invalid'), null, 'без ошибки aria-invalid нет')
      await reopen(page, { id: PLAY }, 'error:Err;comment:Note')
      expect.eq(await page.locator(F).getAttribute('aria-invalid'), 'true', 'aria-invalid')
      const text = await page.evaluate((s) => document.getElementById(document.querySelector(s).getAttribute('aria-describedby'))?.textContent, F)
      expect.eq(text, 'Err', 'подпись под полем — ошибка, а не comment')
      await typeText(page, 'вектор')
      await hasTitles(page, ['ООО «Вектор»'], 'поле с ошибкой ищет как обычное')
    },
  },
  {
    name: 'autocomplete: disabled не принимает ввод и не открывается; read only не даёт менять текст',
    story: MATRIX,
    run: async ({ page, expect, step }) => {
      step('disabled')
      const dis = page.locator(`${F}[aria-disabled=true]`).first()
      await dis.scrollIntoViewIfNeeded()
      expect.eq(await dis.isDisabled(), true, 'нативный disabled')
      const before = await dis.inputValue()
      await dis.click({ force: true })
      await page.keyboard.type('вектор')
      await page.keyboard.press('ArrowDown')
      expect.eq(await dis.inputValue(), before, 'текст не менялся')
      expect.eq(await dis.getAttribute('aria-expanded'), 'false', 'список закрыт')
      expect.eq(await page.locator('[role=listbox]').count(), 0, 'листбокса нет')
      step('read only')
      const ro = page.locator(`${F}[readonly]`).first()
      await ro.scrollIntoViewIfNeeded()
      const roBefore = await ro.inputValue()
      await ro.click()
      await page.keyboard.type('вектор')
      await page.keyboard.press('ArrowDown')
      expect.eq(await ro.inputValue(), roBefore, 'read only: текст не менялся')
      expect.eq(await ro.getAttribute('aria-expanded'), 'false', 'read only: список закрыт')
    },
  },
  {
    name: 'autocomplete: loading показывает индикатор и не мешает вводу',
    story: PLAY,
    run: async ({ page, expect }) => {
      expect.eq(await page.locator('svg.animate-spin').count(), 0, 'без loading индикатора нет')
      await reopen(page, { id: PLAY }, 'state:loading')
      expect.eq(await page.locator('svg.animate-spin').count(), 1, 'индикатор')
      await typeText(page, 'вектор')
      await hasTitles(page, ['ООО «Вектор»'], 'ввод работает')
    },
  },
  {
    name: 'autocomplete: на 375 список внутри экрана, страница не шире экрана, выбор работает',
    story: PLAY,
    viewport: [375, 700],
    run: async ({ page, expect }) => {
      await reopen(page, { id: PLAY }, 'viewport:mobile')
      await typeText(page, 'ром')
      await hasTitles(page, ROMASHKA, 'список')
      const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=autocomplete-content]').getBoundingClientRect(); return [b.left, b.right, b.bottom] })
      expect(r[0] >= 0 && r[1] <= 375, 'список по ширине в экране: ' + r)
      expect(r[2] <= 700, 'список по высоте в экране: ' + r)
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'нет горизонтальной прокрутки')
      await page.getByRole('option', { name: /Ромашка-Сервис/ }).click()
      await closed(page)
      expect.eq(await value(page), 'ООО «Ромашка-Сервис»', 'выбор на мобильной ширине')
    },
  },
  {
    name: 'autocomplete на 375: матрица состояний не расширяет страницу',
    story: MATRIX,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'нет горизонтальной прокрутки')
    },
  },
  {
    name: 'autocomplete: «Раскрытый список» — три примера: подсветка, пустой результат, статус',
    story: 'qa-autocomplete--opened',
    run: async ({ page, expect }) => {
      await wait(page, (s) => document.querySelectorAll(s).length === 3, F, 'три поля')
      expect.eq(await page.locator(F).evaluateAll((els) => els.map((e) => e.value)), ['ром', 'яяяя', 'ооо'], 'запросы примеров')
      await wait(page, () => document.querySelectorAll('[role=option]').length > 0, null, 'пункты')
      expect(await page.locator('[role=option] mark').count() > 0, 'подсветка в раскрытом примере')
      await wait(page, () => [...document.querySelectorAll('[data-slot=autocomplete-empty]')].some((e) => /Ничего не найдено/.test(e.textContent)), null, 'Empty')
      await wait(page, () => [...document.querySelectorAll('[data-slot=autocomplete-status]')].some((e) => /^Найдено: \d+$/.test(e.textContent.trim())), null, 'Status')
    },
  },
]
