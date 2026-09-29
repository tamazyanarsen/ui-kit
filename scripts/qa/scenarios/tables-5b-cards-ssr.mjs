// Экраны группы «Песочница» с таблицами: реестр заявок на аккредитив, реестр бизнес-карт, перераспределение ССР.
// Проверяются значения: сколько результатов, какие строки, что выбрано и на какую сумму.
import { eventually, ready, until } from './tables-0-helpers.mjs'

const LOC = 'песочница-реестр-заявок-на-аккредитив--default'
const CARDS = 'песочница-реестр-бизнес-карт--default'
const COST = 'песочница-перераспределение-сср--default'

const norm = (s) => s.replace(/[\s  ]+/g, ' ').trim()
const table = (page) => page.locator('#storybook-root table').first()
/** Колонки реестра аккредитивов: 0 чекбокс, 1 статус, 2 номер, 3 дата, 4 вид, 5 сумма, 6 срок, 7 бенефициар, 8 банк. */
const cellsOf = (page, col) => table(page).locator('tbody tr').evaluateAll((rs, c) => rs.map((r) => r.querySelectorAll('td')[c]?.innerText.replace(/[\s  ]+/g, ' ').trim()), col)
const summary = (page) => page.locator('[data-slot=table-top-summary-item]').evaluateAll((e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()))
const panel = (page) =>
  page.evaluate(() => {
    const el = document.querySelector('[data-slot=button-menu-black-info]')
    return el ? el.innerText.replace(/[\s  ]+/g, ' ').trim() : null
  })
const pageNums = (page) => page.locator('[data-slot=pagination-page]').evaluateAll((p) => p.map((x) => x.innerText + (x.getAttribute('aria-current') ? '*' : '')))
const search = (page) => page.locator('input[placeholder^="Поиск"]')
const chip = (page, name) => page.locator('[data-slot=filter]', { hasText: name })
const rowBox = (page, i) => table(page).locator('tbody tr').nth(i).locator('[role=checkbox]').first()
const number = (s) => Number(s.replace(/[^\d,-]/g, '').replace(',', '.'))

async function applyChip(page, name, value) {
  await chip(page, name).click()
  const pop = page.locator('[data-slot=filter-content]').last()
  await pop.locator('input').fill(value)
  await pop.getByRole('button', { name: 'Применить' }).click()
  await until(async () => (await page.locator('[data-slot=filter-content]').count()) === 0, 'попап чипа «' + name + '» закрылся')
}

export default ready([

  // ——— реестр бизнес-карт ———
  {
    name: 'Бизнес-карты: исходное состояние — 180 действующих карт, 25 на странице',
    story: CARDS,
    run: async ({ page, expect }) => {
      expect.eq(await summary(page), ['Выбрано фильтров: 0', 'Результатов: 180'], 'сводка')
      expect.eq(await page.locator('[data-slot=card]').count(), 25, 'карточек на странице')
    },
  },
  {
    name: 'Бизнес-карты: вкладка «Закрытые» показывает 20 карт на одной странице и возвращает 180 обратно',
    story: CARDS,
    run: async ({ page, expect }) => {
      await page.locator('[role=tab]', { hasText: 'Закрытые' }).click()
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 0', 'Результатов: 20'], 'закрытых 20')
      expect.eq(await page.locator('[data-slot=card]').count(), 20, '20 карточек')
      await page.locator('[role=tab]', { hasText: 'Действующие' }).click()
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 0', 'Результатов: 180'], 'вернулись 180')
    },
  },
  {
    name: 'Бизнес-карты: чип «Статус» отбирает карточки по статусу, счётчик и результаты сходятся с карточками',
    story: CARDS,
    run: async ({ page, expect, step }) => {
      step('чип «Статус» = активна')
      await applyChip(page, 'Статус', 'активна')
      await until(async () => (await summary(page))[0] === 'Выбрано фильтров: 1', 'один фильтр')
      const total = Number((await summary(page))[1].replace(/\D/g, ''))
      const tags = await page.locator('[data-slot=card] [data-slot=tag]').allInnerTexts()
      expect(tags.length > 0 && tags.every((t) => t.trim() === 'Активна'), 'все статусы «Активна»: ' + [...new Set(tags)])
      expect.eq(tags.length, Math.min(25, total), 'карточек на странице столько, сколько положено при ' + total + ' результатах')
      step('чип «Держатель»')
      await applyChip(page, 'Держатель', 'петров')
      await until(async () => (await summary(page))[0] === 'Выбрано фильтров: 2', 'два фильтра')
      const holders = await page.locator('[data-slot=card]').evaluateAll((cs) => cs.map((c) => c.innerText))
      expect(holders.every((h) => /ПЕТРОВ/.test(h) && /Активна/.test(h)), 'все карточки — Петров и «Активна»')
    },
  },
  {
    name: 'Бизнес-карты: пустой результат и «Сбросить фильтры» возвращают полный список',
    story: CARDS,
    run: async ({ page, expect }) => {
      await applyChip(page, 'Держатель', 'ыыы')
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 1', 'Результатов: 0'], 'пусто')
      expect.eq(await page.locator('[data-slot=card]').count(), 0, 'карточек нет')
      expect((await page.locator('#storybook-root').innerText()).includes('По вашему запросу ничего не найдено'), 'сообщение')
      await page.getByRole('button', { name: 'Сбросить фильтры' }).last().click()
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 0', 'Результатов: 180'], 'возврат к 180')
      expect.eq(await page.locator('[data-slot=card]').count(), 25, 'карточки вернулись')
    },
  },
  {
    name: 'Бизнес-карты: страница 2 показывает другие карточки, размер 50 даёт 50 карточек',
    story: CARDS,
    run: async ({ page, expect }) => {
      const first = await page.locator('[data-slot=card]').first().innerText()
      await page.locator('[aria-label="Следующая страница"]').click()
      await eventually(expect, async () => (await pageNums(page)).find((x) => x.endsWith('*')), '2*', 'страница 2')
      expect(first !== (await page.locator('[data-slot=card]').first().innerText()), 'первая карточка другая')
      await page.locator('[data-slot=pagination-size]', { hasText: '50' }).click()
      await eventually(expect, () => page.locator('[data-slot=card]').count(), 50, '50 карточек')
      expect.eq((await pageNums(page)).find((x) => x.endsWith('*')), '1*', 'вернулись на страницу 1')
    },
  },
  {
    name: 'Бизнес-карты: «Активировать карту» доступна только требующей активации и показывает тост',
    story: CARDS,
    run: async ({ page, expect }) => {
      const cards = page.locator('[data-slot=card]')
      const menuItems = async (i) => {
        await cards.nth(i).locator('button[aria-label="Ещё"]').click()
        await until(async () => (await page.getByRole('menuitem').count()) > 0, 'меню карты ' + i + ' открылось')
        const items = await page.getByRole('menuitem').evaluateAll((m) => m.map((x) => x.innerText.trim() + (x.hasAttribute('data-disabled') || x.getAttribute('aria-disabled') === 'true' ? ' (недоступно)' : '')))
        await page.keyboard.press('Escape')
        await until(async () => (await page.getByRole('menuitem').count()) === 0, 'меню закрылось')
        return items
      }
      const status = async (i) => (await cards.nth(i).locator('[data-slot=tag]').innerText()).trim()
      expect.eq(await status(0), 'Требует активации', 'первая карта требует активации')
      expect.eq((await menuItems(0))[0], 'Активировать карту', 'у неё пункт доступен')
      expect.eq(await status(2), 'Активна', 'третья карта активна')
      expect.eq((await menuItems(2))[0], 'Активировать карту (недоступно)', 'у активной пункт отключён')
      await cards.nth(0).locator('button[aria-label="Ещё"]').click()
      await page.getByRole('menuitem', { name: 'Активировать карту' }).click()
      await until(async () => (await page.locator('[data-slot=toast]').allInnerTexts()).some((t) => /Карта · \d{4} активирована/.test(t)), 'тост об активации')
    },
  },

  // ——— перераспределение ССР ———
  {
    name: 'ССР: правка суммы листа пересчитывает главу, итоги в шапке и сметную стоимость',
    story: COST,
    run: async ({ page, expect, step }) => {
      const T = table(page)
      const heads = () => T.locator('thead th').evaluateAll((hs) => hs.map((h) => h.innerText.replace(/[\s  ]+/g, ' ').trim()))
      const row = (i) => T.locator('tbody tr').nth(i).evaluate((r) => [...r.querySelectorAll('td')].map((t) => (t.querySelector('input') ? 'in:' + t.querySelector('input').value : t.innerText.replace(/[\s  ]+/g, ' ').trim())))
      expect.eq((await heads()).slice(1, 4), ['Сметная стоимость 760 000 000,00 ₽', 'Заёмные средства 640 000 000,00 ₽', 'Собственные средства 120 000 000,00 ₽'], 'исходные итоги')
      step('заёмные листа 1.1: 90 → 80 млн')
      const input = T.locator('tbody tr').nth(1).locator('input').first()
      await input.fill('80 000 000')
      expect.eq(await input.inputValue(), '80 000 000', 'маска оставила разряды')
      await eventually(expect, async () => (await heads()).slice(1, 4), ['Сметная стоимость 750 000 000,00 ₽', 'Заёмные средства 630 000 000,00 ₽', 'Собственные средства 120 000 000,00 ₽'], 'итоги в шапке')
      expect.eq((await row(0)).slice(1, 4), ['300 000 000,00 ₽', '260 000 000,00 ₽', '40 000 000,00 ₽'], 'глава 1')
      expect.eq((await row(1)).slice(1, 4), ['90 000 000,00 ₽', 'in:80 000 000', 'in:10 000 000'], 'лист 1.1: сметная = заёмные + собственные')
      step('стереть значение — это ноль')
      await input.fill('')
      await eventually(expect, async () => (await row(1)).slice(1, 4), ['10 000 000,00 ₽', 'in:', 'in:10 000 000'], 'пустое поле считается нулём')
      expect.eq((await heads())[2], 'Заёмные средства 550 000 000,00 ₽', 'итог заёмных без листа')
    },
  },
  {
    name: 'ССР: радиогруппа убирает лишний столбец средств, итог сметной стоимости остаётся полным',
    story: COST,
    run: async ({ page, expect, step }) => {
      const heads = () => table(page).locator('thead th').evaluateAll((hs) => hs.map((h) => h.innerText.replace(/[\s  ]+/g, ' ').trim()).filter(Boolean))
      step('Заёмные')
      await page.getByRole('radio', { name: 'Заёмные' }).click()
      await eventually(expect, heads, ['Статья', 'Сметная стоимость 760 000 000,00 ₽', 'Заёмные средства 640 000 000,00 ₽'], 'остались заёмные')
      step('Собственные')
      await page.getByRole('radio', { name: 'Собственные' }).click()
      await eventually(expect, heads, ['Статья', 'Сметная стоимость 760 000 000,00 ₽', 'Собственные средства 120 000 000,00 ₽'], 'остались собственные')
      step('Все средства')
      await page.getByRole('radio', { name: 'Все средства' }).click()
      await eventually(expect, async () => (await heads()).length, 4, 'все столбцы вернулись')
    },
  },
  {
    name: 'ССР: правка суммы переживает переключение столбцов средств',
    story: COST,
    run: async ({ page, expect }) => {
      const T = table(page)
      await T.locator('tbody tr').nth(1).locator('input').first().fill('70 000 000')
      await page.getByRole('radio', { name: 'Собственные' }).click()
      await page.getByRole('radio', { name: 'Все средства' }).click()
      await eventually(expect, () => T.locator('tbody tr').nth(1).locator('input').first().inputValue(), '70 000 000', 'значение на месте')
      expect.eq(norm(await T.locator('thead th').nth(2).innerText()), 'Заёмные средства 620 000 000,00 ₽', 'итог посчитан с правкой')
    },
  },
  {
    name: 'ССР: поиск по сумме с разрядами точный, ветка остаётся вместе с найденным листом',
    story: COST,
    run: async ({ page, expect, step }) => {
      const codes = () => table(page).locator('tbody tr').evaluateAll((rs) => rs.map((r) => r.querySelector('td')?.innerText.trim().split(/\s/)[0]))
      const s = page.getByLabel('Код, статья или сумма')
      step('код статьи')
      await s.fill('2.2.1.3')
      await eventually(expect, codes, ['2.', '2.2.', '2.2.1.', '2.2.1.3.'], 'найденный лист показан вместе с главой и родителями')
      step('«270 000 000» — сумма главы 1, полная сумма ищется точно')
      await s.fill('270 000 000')
      await eventually(expect, codes, ['1.', '1.1.', '1.2.', '1.3.', '1.4.'], 'только глава 1')
      step('«70 000 000» не находит 270 000 000')
      await s.fill('70 000 000')
      const found = await (async () => { await page.waitForTimeout(200); return codes() })()
      expect(!found.includes('1.'), 'глава 1 (270 000 000) не подходит под 70 000 000: ' + found)
      expect(found.includes('2.2.1.3.'), 'лист с 70 000 000 найден: ' + found)
    },
  },
  {
    name: 'ССР: поиск без результатов — сообщение, «Сбросить фильтры» очищает поле и возвращает все статьи',
    story: COST,
    run: async ({ page, expect }) => {
      const s = page.getByLabel('Код, статья или сумма')
      const count = () => table(page).locator('tbody tr').count()
      await s.fill('яяя')
      await eventually(expect, count, 0, 'строк нет')
      expect((await page.locator('#storybook-root').innerText()).includes('ничего не найдено'), 'сообщение')
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click()
      await eventually(expect, count, 19, 'все 19 статей')
      expect.eq(await s.inputValue(), '', 'поле очищено')
    },
  },
  {
    name: 'ССР: свёртка главы прячет статьи, сумма главы не меняется',
    story: COST,
    run: async ({ page, expect }) => {
      const T = table(page)
      const count = () => T.locator('tbody tr').count()
      const chapter = () => T.locator('tbody tr').first().evaluate((r) => r.querySelectorAll('td')[1]?.innerText.replace(/[\s  ]+/g, ' ').trim())
      expect.eq(await count(), 19, 'сначала все статьи')
      const total = await chapter()
      await T.locator('tbody tr').first().locator('[data-slot=table-collapse-toggle]').click()
      await eventually(expect, count, 15, 'глава 1 свернулась, остались 15 строк')
      expect.eq(await chapter(), total, 'сумма главы прежняя')
    },
  },
])
