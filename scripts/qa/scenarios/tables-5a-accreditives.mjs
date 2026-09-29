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
  // ——— реестр заявок на аккредитив ———
  {
    name: 'Аккредитивы: исходное состояние — 200 результатов, 25 строк, 8 страниц',
    story: LOC,
    run: async ({ page, expect }) => {
      expect.eq(await summary(page), ['Выбрано фильтров: 0', 'Результатов: 200'], 'сводка')
      expect.eq((await cellsOf(page, 2)).length, 25, 'строк на странице')
      expect.eq((await pageNums(page)).find((x) => x.endsWith('*')), '1*', 'страница 1')
      expect.eq(await page.locator('[data-slot=pagination-page]').last().innerText(), '8', 'последняя страница 8')
    },
  },
  {
    name: 'Аккредитивы: поиск отбирает строки по бенефициару, число результатов и страниц сходится',
    story: LOC,
    run: async ({ page, expect, step }) => {
      step('поиск «металлург»')
      await search(page).fill('металлург')
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 0', 'Результатов: 50'], 'найдено 50 из 200')
      const bene = await cellsOf(page, 7)
      expect.eq(bene.length, 25, 'на странице 25 строк')
      expect(bene.every((b) => b.toLowerCase().includes('металлург')), 'у всех строк бенефициар «Металлургический завод»: ' + bene.slice(0, 2))
      expect.eq(await page.locator('[data-slot=pagination-page]').last().innerText(), '2', 'две страницы')
      step('поиск по номеру')
      await search(page).fill('1234568')
      await eventually(expect, async () => (await summary(page))[1], 'Результатов: 1', 'номер 1234568 — одна строка')
      expect.eq(await cellsOf(page, 2), ['1234568'], 'найдена нужная строка')
    },
  },
  {
    name: 'Аккредитивы: пустой результат — сообщение и «Сбросить фильтры» очищает и поиск, и чипы',
    story: LOC,
    run: async ({ page, expect, step }) => {
      await applyChip(page, 'Статус', 'подпис')
      await search(page).fill('яяяяя')
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 1', 'Результатов: 0'], 'ничего не найдено')
      expect.eq((await cellsOf(page, 2)).length, 0, 'строк нет')
      expect((await page.locator('#storybook-root').innerText()).includes('По вашему запросу ничего не найдено'), 'сообщение пустого результата')
      step('сброс кнопкой в пустом результате')
      const resets = page.getByRole('button', { name: 'Сбросить фильтры' })
      await resets.last().click()
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 0', 'Результатов: 200'], 'всё сброшено')
      expect.eq(await search(page).inputValue(), '', 'поле поиска очищено')
      expect.eq((await cellsOf(page, 2)).length, 25, 'строки вернулись')
      expect.eq((await page.locator('[data-slot=filter][data-checked]').count()), 0, 'ни один чип не выбран')
    },
  },
  {
    name: 'Аккредитивы: чип «Статус» отбирает строки, счётчик фильтров растёт, кнопка в шапке всё сбрасывает',
    story: LOC,
    run: async ({ page, expect, step }) => {
      step('чип «Статус» = подпис')
      await applyChip(page, 'Статус', 'подпис')
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 1', 'Результатов: 68'], 'по «подпис» — «Готов к подписанию» и «Подписание»')
      const statuses = await cellsOf(page, 1)
      expect(statuses.every((s) => /подпис/i.test(s)), 'все статусы подходят: ' + [...new Set(statuses)])
      step('второй чип «Вид аккредитива» = импортный')
      await applyChip(page, 'Вид аккредитива', 'импортный')
      await until(async () => (await summary(page))[0] === 'Выбрано фильтров: 2', 'два фильтра')
      const kinds = await cellsOf(page, 4)
      expect(kinds.every((k) => /импортный/i.test(k)), 'виды подходят: ' + [...new Set(kinds)])
      step('«Сбросить фильтры» из шапки')
      await page.locator('[data-slot=table-top-toolbar]').getByRole('button', { name: 'Сбросить фильтры' }).click()
      await eventually(expect, () => summary(page), ['Выбрано фильтров: 0', 'Результатов: 200'], 'сброшено')
      expect.eq(await page.locator('[data-slot=table-top-toolbar]').getByRole('button', { name: 'Сбросить фильтры' }).count(), 0, 'кнопка исчезла вместе с фильтрами')
    },
  },
  {
    name: 'Аккредитивы: чип «Сумма» сравнивает полную сумму точно, а короткий набор — по началу',
    story: LOC,
    run: async ({ page, expect, step }) => {
      step('«20 000 000»')
      await applyChip(page, 'Сумма', '20 000 000')
      await eventually(expect, async () => (await summary(page))[1], 'Результатов: 40', 'ровно 40 строк с 20 000 000')
      expect(new Set(await cellsOf(page, 5)).size === 1, 'у всех одна сумма')
      expect.eq([...new Set(await cellsOf(page, 5))], ['20 000 000,00 ₽'], 'сумма 20 000 000,00 ₽')
      step('«2 000 000» — такой суммы нет, 20 000 000 не подходит')
      await chip(page, '20 000 000').click()
      const pop = page.locator('[data-slot=filter-content]').last()
      await pop.locator('input').fill('2 000 000')
      await pop.getByRole('button', { name: 'Применить' }).click()
      await eventually(expect, async () => (await summary(page))[1], 'Результатов: 0', 'сумма точная — ни одной строки')
      step('короткий набор «300» — по началу')
      await chip(page, '2 000 000').click()
      const pop2 = page.locator('[data-slot=filter-content]').last()
      await pop2.locator('input').fill('300')
      await pop2.getByRole('button', { name: 'Применить' }).click()
      await eventually(expect, async () => (await summary(page))[1], 'Результатов: 40', '«300» находит 300 000 000')
    },
  },
  {
    name: 'Аккредитивы: следующая страница — другие строки, активная страница 2, размер 25 сохраняется',
    story: LOC,
    run: async ({ page, expect, step }) => {
      const first = await cellsOf(page, 3)
      const ids = await cellsOf(page, 2)
      step('вперёд')
      await page.locator('[aria-label="Следующая страница"]').click()
      await eventually(expect, async () => (await pageNums(page)).find((x) => x.endsWith('*')), '2*', 'активна страница 2')
      const second = await cellsOf(page, 3)
      expect.eq(second.length, 25, 'на второй странице 25 строк')
      expect(JSON.stringify([...(await cellsOf(page, 2))]) !== JSON.stringify(ids) || JSON.stringify(second) !== JSON.stringify(first), 'строки страницы 2 отличаются от страницы 1')
      step('назад')
      await page.locator('[aria-label="Предыдущая страница"]').click()
      await eventually(expect, () => cellsOf(page, 3), first, 'страница 1 вернулась в прежнем виде')
    },
  },
  {
    name: 'Аккредитивы: размер страницы 50 — 50 строк и 4 страницы, страница сбрасывается на первую',
    story: LOC,
    run: async ({ page, expect, step }) => {
      await page.locator('[aria-label="Следующая страница"]').click()
      await page.locator('[aria-label="Следующая страница"]').click()
      await eventually(expect, async () => (await pageNums(page)).find((x) => x.endsWith('*')), '3*', 'дошли до страницы 3')
      step('50 на странице')
      await page.locator('[data-slot=pagination-size]', { hasText: '50' }).click()
      await eventually(expect, async () => (await cellsOf(page, 2)).length, 50, '50 строк')
      expect.eq((await pageNums(page)).find((x) => x.endsWith('*')), '1*', 'вернулись на первую страницу')
      expect.eq(await page.locator('[data-slot=pagination-page]').last().innerText(), '4', 'четыре страницы')
    },
  },
  {
    name: 'Аккредитивы: сортировка по сумме действует на весь отбор, а не на страницу',
    story: LOC,
    run: async ({ page, expect, step }) => {
      step('сумма по возрастанию')
      await table(page).locator('thead th', { hasText: 'Сумма' }).locator('button[data-slot=table-sort]').click()
      await eventually(expect, () => table(page).locator('thead th[aria-sort=ascending]').innerText().then(norm), 'Сумма', 'активен столбец суммы')
      const all = []
      for (let p = 1; p <= 8; p++) {
        if (p > 1) {
          await page.locator('[aria-label="Следующая страница"]').click()
          await eventually(expect, async () => (await pageNums(page)).find((x) => x.endsWith('*')), p + '*', 'страница ' + p)
        }
        all.push(...(await cellsOf(page, 5)).map(number))
      }
      expect.eq(all.length, 200, 'прочитано 200 строк')
      const sorted = [...all].sort((a, b) => a - b)
      expect.eq(all, sorted, 'суммы идут по возрастанию через все страницы')
      step('смена направления возвращает на страницу 1')
      await table(page).locator('thead th', { hasText: 'Сумма' }).locator('button[data-slot=table-sort]').click()
      await eventually(expect, async () => (await pageNums(page)).find((x) => x.endsWith('*')), '1*', 'страница 1 после смены сортировки')
      expect.eq(number((await cellsOf(page, 5))[0]), 300000000, 'сверху самая большая сумма')
    },
  },
  {
    name: 'Аккредитивы: выбор строк — панель считает число и сумму выбранных',
    story: LOC,
    run: async ({ page, expect, step }) => {
      expect.eq(await panel(page), null, 'панели нет')
      step('две строки')
      await rowBox(page, 0).click()
      await rowBox(page, 3).click()
      const amounts = await cellsOf(page, 5)
      const want = number(amounts[0]) + number(amounts[3])
      const info = await panel(page)
      expect(info.startsWith('Выбрано 2 На сумму'), 'панель: ' + info)
      expect.eq(number(info.replace('Выбрано 2 На сумму', '')), want, 'сумма выбранных из панели совпадает с суммой ячеек')
      step('снять одну')
      await rowBox(page, 0).click()
      expect((await panel(page)).startsWith('Выбрано 1 '), 'панель после снятия: ' + (await panel(page)))
    },
  },
  {
    name: 'Аккредитивы: выбор переживает смену страницы, шапка выбирает только видимые строки',
    story: LOC,
    run: async ({ page, expect, step }) => {
      await rowBox(page, 0).click()
      await rowBox(page, 1).click()
      step('страница 2')
      await page.locator('[aria-label="Следующая страница"]').click()
      await eventually(expect, async () => (await pageNums(page)).find((x) => x.endsWith('*')), '2*', 'страница 2')
      expect((await panel(page)).startsWith('Выбрано 2 '), 'выбор со страницы 1 остался: ' + (await panel(page)))
      expect.eq(await table(page).locator('thead [role=checkbox]').getAttribute('aria-checked'), 'false', 'чекбокс шапки не отмечен: здесь ничего не выбрано')
      step('шапка на странице 2')
      await table(page).locator('thead [role=checkbox]').click()
      expect((await panel(page)).startsWith('Выбрано 27 '), 'к двум добавились 25 строк страницы: ' + (await panel(page)))
    },
  },
  {
    name: 'Аккредитивы: «Выбрать на всех страницах (200)» берёт весь отбор и исчезает, крестик снимает выбор',
    story: LOC,
    run: async ({ page, expect, step }) => {
      await rowBox(page, 0).click()
      const btn = page.locator('[data-slot=button-menu-black-select-all]')
      expect.eq(await btn.innerText(), 'Выбрать на всех страницах (200)', 'подпись кнопки')
      step('выбрать всё')
      await btn.click()
      await eventually(expect, async () => (await panel(page)).startsWith('Выбрано 200 На сумму'), true, 'выбрано 200')
      expect.eq(number((await panel(page)).replace('Выбрано 200 На сумму', '')), 15084000000, 'сумма всех 200 строк')
      expect.eq(await btn.count(), 0, 'кнопка «на всех страницах» исчезла')
      step('крестик')
      await page.locator('[data-slot=button-menu-black] [data-slot=close-cross]').click()
      await eventually(expect, () => panel(page), null, 'панель закрыта')
      expect.eq(await table(page).locator('tbody [role=checkbox][aria-checked=true]').count(), 0, 'галок в таблице нет')
    },
  },
  {
    name: 'Аккредитивы: «Выбрать на всех страницах» считает по отбору, а не по всем 200 строкам',
    story: LOC,
    run: async ({ page, expect }) => {
      await applyChip(page, 'Вид аккредитива', 'импортный')
      await eventually(expect, async () => (await summary(page))[1], 'Результатов: 80', 'импортных 80')
      await rowBox(page, 0).click()
      expect.eq(await page.locator('[data-slot=button-menu-black-select-all]').innerText(), 'Выбрать на всех страницах (80)', 'N по отбору')
      await page.locator('[data-slot=button-menu-black-select-all]').click()
      await eventually(expect, async () => (await panel(page)).startsWith('Выбрано 80 '), true, 'выбрано 80')
    },
  },
  {
    name: 'Аккредитивы: смена отбора поиском или чипом сбрасывает выбор и страницу',
    story: LOC,
    run: async ({ page, expect, step }) => {
      await rowBox(page, 0).click()
      expect((await panel(page)) !== null, 'панель появилась')
      step('поиск')
      await search(page).fill('321')
      await eventually(expect, () => panel(page), null, 'поиск сбросил выбор')
      step('снова выбор и чип')
      await rowBox(page, 0).click()
      expect((await panel(page)) !== null, 'панель появилась снова')
      await applyChip(page, 'Тип заявки', 'открытие')
      await eventually(expect, () => panel(page), null, 'чип сбросил выбор')
      expect.eq((await pageNums(page)).find((x) => x.endsWith('*')), '1*', 'страница 1')
    },
  },
  {
    name: 'Аккредитивы: смена вкладки сбрасывает выбор, вкладка «Заявки» остаётся выбранной после возврата',
    story: LOC,
    run: async ({ page, expect }) => {
      await rowBox(page, 2).click()
      await page.locator('[role=tab]', { hasText: 'Все аккредитивы' }).click()
      await eventually(expect, () => panel(page), null, 'выбор сброшен')
      expect.eq(await page.locator('[role=tab][aria-selected=true]').innerText(), 'Все аккредитивы', 'вкладка переключилась')
      await page.locator('[role=tab]', { hasText: 'Заявки' }).click()
      await eventually(expect, () => page.locator('[role=tab][aria-selected=true]').innerText(), 'Заявки', 'вернулись на «Заявки»')
    },
  },
  {
    name: 'Аккредитивы: верхнее сообщение закрывается крестиком, тост о создании заявки показан при открытии',
    story: LOC,
    run: async ({ page, expect }) => {
      await until(async () => (await page.locator('[data-slot=toast]').allInnerTexts()).some((t) => t.includes('Заявка на аккредитив создана')), 'тост о создании заявки')
      const msg = page.locator('[data-slot=top-fixed-message]')
      expect.eq(await msg.count(), 1, 'сообщение о полномочиях есть')
      await msg.locator('[data-slot=close-cross]').click()
      await eventually(expect, () => page.locator('[data-slot=top-fixed-message]').count(), 0, 'сообщение закрыто')
    },
  },
  {
    name: 'Аккредитивы на телефоне: страница не шире окна, пагинатор и чёрная панель в окне',
    story: LOC,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await page.waitForFunction(() => document.querySelector('[data-slot=pagination]'))
      const pag = await page.locator('[data-slot=pagination]').boundingBox()
      expect(pag.x + pag.width <= 375 + 1, 'пагинатор в окне: ' + (pag.x + pag.width))
      await rowBox(page, 0).click()
      // Шапка клиента на 375 шире экрана (известный остаток, см. docs/audit-loop.md), поэтому меряется сам блок.
      const block = await page.locator('[data-slot=table-block]').boundingBox()
      expect(block.x + block.width <= 375 + 1, 'табличный блок в окне: ' + (block.x + block.width))
      const panelBox = await page.locator('[data-slot=button-menu-black]').boundingBox()
      expect(panelBox && panelBox.x >= 0 && panelBox.x + panelBox.width <= 375 + 1, 'чёрная панель в окне: ' + JSON.stringify(panelBox))
    },
  },
])
