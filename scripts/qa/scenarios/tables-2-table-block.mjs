// Табличный блок: настройка столбцов, Playground таблицы (вложенность, выбор, закрепы, полоса прокрутки,
// липкая шапка, пустой результат), шапка блока «Сводка».
import { eventually, firstCells, panelInfo, ready, tableAt, withArgs } from './tables-0-helpers.mjs'

const FIELDS = 'компоненты-table--fields'
const PLAY = 'компоненты-table--playground'

const heads = (t) => t.locator('thead th').evaluateAll((hs) => hs.map((h) => h.innerText.trim()).filter(Boolean))
const openSettings = async (page) => {
  await page.locator('[data-slot=table-top-summary] button', { hasText: 'Настроить столбцы' }).first().click()
  return page.locator('[data-slot=table-column-settings]')
}
const settingsRows = (panel) => panel.locator('[data-slot=table-column-settings-row]').evaluateAll((r) => r.map((x) => x.innerText.trim()))
const handle = (panel, name) => panel.locator(`[aria-label="Переместить столбец «${name}»"]`)
const activeLabel = (page) => page.evaluate(() => document.activeElement?.getAttribute('aria-label'))

export default ready([
  {
    name: 'настройка столбцов: перестановка клавишами двигает и список, и столбцы таблицы, фокус остаётся на ручке',
    story: FIELDS,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      const panel = await openSettings(page)
      expect.eq((await settingsRows(panel)).slice(0, 4), ['Договор', 'Предмет', 'Статус', 'Плательщики'], 'исходный порядок')
      step('стрелка вниз на «Предмет»')
      await handle(panel, 'Предмет').focus()
      await page.keyboard.press('ArrowDown')
      expect.eq((await settingsRows(panel)).slice(0, 4), ['Договор', 'Статус', 'Предмет', 'Плательщики'], 'порядок в списке')
      expect.eq((await heads(t)).slice(0, 4), ['Договор', 'Статус', 'Предмет', 'Плательщики'], 'порядок в шапке таблицы')
      expect.eq(await activeLabel(page), 'Переместить столбец «Предмет»', 'фокус остался на ручке перемещённого столбца')
      step('ещё раз вниз')
      await page.keyboard.press('ArrowDown')
      expect.eq((await settingsRows(panel)).slice(0, 4), ['Договор', 'Статус', 'Плательщики', 'Предмет'], 'второй шаг вниз')
      step('вверх дважды')
      await page.keyboard.press('ArrowUp')
      await page.keyboard.press('ArrowUp')
      expect.eq((await settingsRows(panel)).slice(0, 4), ['Договор', 'Предмет', 'Статус', 'Плательщики'], 'вернулось')
    },
  },
  {
    name: 'настройка столбцов: закреплённый первый столбец не двигается и не уступает место',
    story: FIELDS,
    run: async ({ page, expect }) => {
      const panel = await openSettings(page)
      expect.eq(await handle(panel, 'Договор').isDisabled(), true, 'ручка первого столбца отключена')
      expect.eq(await panel.locator('[aria-label="Показывать столбец «Договор»"]').getAttribute('aria-disabled'), 'true', 'его флажок заблокирован')
      await handle(panel, 'Предмет').focus()
      await page.keyboard.press('ArrowUp')
      expect.eq((await settingsRows(panel)).slice(0, 2), ['Договор', 'Предмет'], 'выше закрепа второй столбец не встаёт')
      expect.eq(await activeLabel(page), 'Переместить столбец «Предмет»', 'фокус на месте')
    },
  },
  {
    name: 'настройка столбцов: первый и последний столбец не выходят за границы списка стрелками',
    story: FIELDS,
    run: async ({ page, expect }) => {
      const panel = await openSettings(page)
      const before = await settingsRows(panel)
      await handle(panel, 'Вложения').focus()
      await page.keyboard.press('ArrowDown')
      expect.eq(await settingsRows(panel), before, 'вниз с последнего — без изменений')
      await page.keyboard.press('ArrowUp')
      const after = await settingsRows(panel)
      expect.eq(after[after.length - 2], 'Вложения', 'вверх — поменялся с соседом')
    },
  },
  {
    name: 'настройка столбцов: флажок скрывает и возвращает столбец в таблице',
    story: FIELDS,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      const panel = await openSettings(page)
      expect((await heads(t)).includes('Статус'), 'сначала столбец есть')
      step('снять «Статус»')
      await panel.locator('[aria-label="Показывать столбец «Статус»"]').click()
      expect.eq(await heads(t), ['Договор', 'Предмет', 'Плательщики', 'Дата', 'Изменён', 'Ставка', 'Сумма', 'Согласовано'], 'столбец «Статус» исчез')
      expect.eq(await t.locator('tbody tr').first().locator('td[data-type=tag]').count(), 0, 'ячеек статуса в теле нет')
      step('вернуть')
      await panel.locator('[aria-label="Показывать столбец «Статус»"]').click()
      expect((await heads(t)).includes('Статус'), 'столбец вернулся')
    },
  },
  {
    name: 'настройка столбцов: поиск отбирает строки списка и показывает «Ничего не найдено»',
    story: FIELDS,
    run: async ({ page, expect, step }) => {
      const panel = await openSettings(page)
      const search = panel.locator('input[type=search]')
      step('поиск «дат»')
      await search.fill('дат')
      expect.eq(await settingsRows(panel), ['Дата'], 'только «Дата»')
      step('регистр не важен')
      await search.fill('СУММ')
      expect.eq(await settingsRows(panel), ['Сумма'], 'верхний регистр')
      step('нет совпадений')
      await search.fill('яяя')
      expect.eq(await settingsRows(panel), [], 'строк нет')
      expect((await panel.innerText()).includes('Ничего не найдено'), 'сообщение о пустом поиске')
      step('очистка')
      await search.fill('')
      expect.eq((await settingsRows(panel)).length, 10, 'вернулись все десять столбцов')
    },
  },
  {
    name: 'настройка столбцов: Escape закрывает панель и возвращает фокус на кнопку',
    story: FIELDS,
    run: async ({ page, expect }) => {
      const panel = await openSettings(page)
      expect.eq(await panel.count(), 1, 'панель открылась')
      await page.keyboard.press('Escape')
      await eventually(expect, () => page.locator('[data-slot=table-column-settings]').count(), 0, 'панель закрылась')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.textContent?.trim()), 'Настроить столбцы', 'фокус вернулся на кнопку')
    },
  },
  {
    name: 'Table Playground: свёртка вложенных строк и «свернуть всё»',
    story: PLAY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      const cells = () => t.locator('tbody tr').evaluateAll((rs) => rs.map((r) => r.querySelector('td[data-type=text]')?.innerText.trim()))
      expect.eq(await cells(), ['1', '1.1', '1.1.1', '1.1.1.1', '2', '3'], 'по умолчанию развёрнуто 1, 1.1, 1.1.1')
      await t.locator('tbody tr').nth(1).locator('[data-slot=table-collapse-toggle]').click()
      expect.eq(await cells(), ['1', '1.1', '2', '3'], 'свёрнута 1.1')
      await t.locator('thead [data-slot=table-collapse-toggle]').click()
      expect.eq(await cells(), ['1', '2', '3'], 'свёрнуто всё из шапки')
      await t.locator('thead [data-slot=table-collapse-toggle]').click()
      expect.eq((await cells()).length, 6, 'развёрнуто всё')
    },
  },
  {
    name: 'Table Playground: выбор строк, «На сумму» и закрытие панели',
    story: PLAY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      await t.locator('tbody tr').first().locator('[role=checkbox]').first().click()
      expect.eq(await panelInfo(page), 'Выбрано 1 На сумму 400 000,02 ₽', 'панель после первой строки')
      await t.locator('thead [role=checkbox]').click()
      expect.eq(await panelInfo(page), 'Выбрано 6 На сумму 400 000,02 ₽', 'шапка выбрала все шесть')
      await t.locator('thead [role=checkbox]').click()
      expect.eq(await panelInfo(page), null, 'снятие шапки закрывает панель')
    },
  },
  {
    name: 'Table Playground: сортировка «Код» без вложенности чередует направления, aria-sort верный',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await withArgs(page, 'nested:false')
      const t = tableAt(page, 0)
      const sorts = () => t.locator('thead th[aria-sort]').evaluateAll((hs) => hs.map((h) => h.innerText.trim() + ':' + h.getAttribute('aria-sort')))
      expect.eq((await sorts())[0], 'Код:ascending', 'по умолчанию Код по возрастанию')
      const btn = t.locator('thead th', { hasText: 'Код' }).locator('button[data-slot=table-sort]')
      step('первое нажатие')
      await btn.click()
      expect.eq((await sorts())[0], 'Код:descending', 'по убыванию')
      step('второе нажатие')
      await btn.click()
      expect.eq((await sorts())[0], 'Код:ascending', 'круг замкнут на двух направлениях')
    },
  },
  {
    name: 'Table Playground: с вложенностью в шапке «Код» нет сортировки и ресайза',
    story: PLAY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      const th = t.locator('thead th', { hasText: 'Код' })
      expect.eq(await th.locator('button[data-slot=table-sort]').count(), 0, 'кнопки сортировки нет')
      expect.eq(await th.locator('[data-slot=table-resize-handle]').count(), 0, 'ручки ширины нет')
    },
  },
  {
    name: 'Table Playground: пустой результат вместо строк и «Сбросить фильтры» рядом с пагинатором',
    story: PLAY,
    run: async ({ page, expect }) => {
      await withArgs(page, 'empty:true')
      const t = tableAt(page, 0)
      expect.eq(await t.locator('tbody tr').count(), 0, 'строк нет')
      const root = await page.locator('#storybook-root').innerText()
      expect(root.includes('По вашему запросу ничего не найдено'), 'сообщение об пустом результате')
      expect.eq(await page.getByRole('button', { name: 'Сбросить фильтры' }).count(), 1, 'одна кнопка сброса')
      expect(/Результатов:\s*0/.test(root), 'в сводке «Результатов: 0»')
    },
  },
  {
    name: 'Table Playground: перетаскивание бегунка нижней полосы прокручивает таблицу пропорционально',
    story: PLAY,
    viewport: [900, 900],
    run: async ({ page, expect, step }) => {
      const box = page.locator('[data-slot=table-container]').first()
      const thumb = page.locator('[data-slot=table-scrollbar-thumb]')
      const track = page.locator('[data-slot=table-scrollbar-track]')
      const tb = await thumb.boundingBox()
      const trb = await track.boundingBox()
      const max = await box.evaluate((e) => e.scrollWidth - e.clientWidth)
      expect.eq(await box.evaluate((e) => e.scrollLeft), 0, 'начало')
      step('тянем бегунок на 100')
      const y = tb.y + tb.height / 2
      await page.mouse.move(tb.x + tb.width / 2, y)
      await page.mouse.down()
      await page.mouse.move(tb.x + tb.width / 2 + 100, y, { steps: 5 })
      const want = Math.round((100 * max) / (trb.width - tb.width))
      const got = await box.evaluate((e) => Math.round(e.scrollLeft))
      expect(Math.abs(got - want) <= 2, `scrollLeft ${got}, ожидалось около ${want}`)
      await page.mouse.up()
      step('тянем за пределы дорожки')
      await page.mouse.move(tb.x + tb.width / 2 + 100, y)
      await page.mouse.down()
      await page.mouse.move(trb.x + trb.width + 200, y, { steps: 5 })
      await page.mouse.up()
      expect.eq(await box.evaluate((e) => Math.round(e.scrollLeft)), Math.round(max), 'упёрлись в конец прокрутки')
    },
  },
  {
    name: 'Table Playground: отпускание бегунка за пределами окна завершает перетаскивание',
    story: PLAY,
    viewport: [900, 900],
    run: async ({ page, expect, step }) => {
      const box = page.locator('[data-slot=table-container]').first()
      const bar = page.locator('[data-slot=table-scrollbar]')
      const tb = await page.locator('[data-slot=table-scrollbar-thumb]').boundingBox()
      const y = tb.y + tb.height / 2
      await page.mouse.move(tb.x + tb.width / 2, y)
      await page.mouse.down()
      await page.mouse.move(tb.x + tb.width / 2 + 60, y, { steps: 4 })
      expect((await bar.getAttribute('data-dragging')) !== null, 'во время протяжки стоит data-dragging')
      step('отпускание вне окна')
      await page.mouse.move(2000, -200, { steps: 3 })
      await page.mouse.up()
      expect.eq(await bar.getAttribute('data-dragging'), null, 'после отпускания data-dragging снят')
      const stopped = await box.evaluate((e) => e.scrollLeft)
      step('возврат курсора без нажатия')
      await page.mouse.move(tb.x + 200, y, { steps: 4 })
      expect.eq(await box.evaluate((e) => e.scrollLeft), stopped, 'бегунок за курсором не идёт')
    },
  },
  {
    name: 'Table Playground: полоса прокрутки встаёт над чёрной панелью выбора и возвращается вниз без неё',
    story: PLAY,
    viewport: [900, 520],
    run: async ({ page, expect, step }) => {
      const bottom = (sel) => page.locator(sel).first().evaluate((e) => Math.round(e.getBoundingClientRect().bottom))
      const top = (sel) => page.locator(sel).first().evaluate((e) => Math.round(e.getBoundingClientRect().top))
      expect.eq(await bottom('[data-slot=table-scrollbar]'), 520, 'без выбора полоса у нижней кромки окна')
      step('выбор строки')
      await tableAt(page, 0).locator('tbody tr').first().locator('[role=checkbox]').first().click()
      const panelTop = await top('[data-slot=button-menu-black]')
      expect(panelTop > 400 && panelTop < 520, 'панель внизу окна: ' + panelTop)
      expect(await bottom('[data-slot=table-scrollbar]') <= panelTop, 'полоса не заходит под панель')
      step('снять выбор')
      await page.locator('[data-slot=button-menu-black] [data-slot=close-cross]').click()
      expect.eq(await bottom('[data-slot=table-scrollbar]'), 520, 'полоса вернулась вниз')
    },
  },
  {
    name: 'Table Playground: липкая шапка не уезжает при вертикальной прокрутке тела',
    story: PLAY,
    run: async ({ page, expect }) => {
      await withArgs(page, 'stickyHeader:true')
      const box = page.locator('[data-slot=table-container]').first()
      const geo = () => page.evaluate(() => {
        const c = document.querySelector('[data-slot=table-container]')
        return { box: Math.round(c.getBoundingClientRect().top), th: Math.round(c.querySelector('thead th').getBoundingClientRect().top) }
      })
      const before = await geo()
      expect.eq(before.th, before.box, 'шапка у верха окна таблицы')
      expect((await box.evaluate((e) => e.scrollHeight - e.clientHeight)) > 50, 'тело прокручивается по вертикали')
      await box.evaluate((e) => { e.scrollTop = 120 })
      const after = await geo()
      expect.eq(after.th, after.box, 'после прокрутки шапка всё там же')
      expect.eq(await box.evaluate((e) => e.scrollTop), 120, 'тело действительно прокручено')
    },
  },
  {
    name: 'Table Playground без блока и без выбора: колонки чекбоксов нет, панель не появляется',
    story: PLAY,
    run: async ({ page, expect }) => {
      await withArgs(page, 'selectable:false;block:false')
      const t = tableAt(page, 0)
      expect.eq(await t.locator('[role=checkbox]').count(), 0, 'чекбоксов нет')
      expect.eq(await page.locator('[data-slot=table-block]').count(), 0, 'обёртки-карточки нет')
      expect.eq(await panelInfo(page), null, 'панели нет')
      expect.eq((await firstCells(t)).length, 6, 'строки на месте')
    },
  },
])
