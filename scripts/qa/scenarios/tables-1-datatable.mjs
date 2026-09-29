// DataTable («По конфигу полей»): сортировка, выбор строк, вложенность, клик по строке, закрепы, ресайз, итог.
// Таблица 0 в истории — вложенная, с выбором и кликом; таблица 1 — плоская, с итогом и сортировкой.
import { firstCells, panelInfo, ready, rowChecks, tableAt, trackRowClicks, until, eventually } from './tables-0-helpers.mjs'

const STORY = 'компоненты-table--fields'
const sortBtn = (t, name) => t.locator('thead th', { hasText: name }).locator('button[data-slot=table-sort]')
const sortState = (t) => t.locator('thead th[aria-sort]').evaluateAll((hs) => hs.map((h) => h.innerText.trim() + ':' + h.getAttribute('aria-sort')))
const codes = (t) => firstCells(t)
const panelButton = (page, text) => page.locator('[data-slot=button-menu-black-block]').getByRole('button', { name: text })

export default ready([
  {
    name: 'DataTable: сортировка по сумме меняет порядок, итог остаётся внизу',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 1)
      step('исходный порядок')
      expect.eq(await codes(t), ['Д-1042', 'Д-1058', 'Д-1077', 'Итого'], 'порядок по умолчанию (по договору)')
      step('сумма по возрастанию')
      await sortBtn(t, 'Сумма').click()
      expect.eq(await codes(t), ['Д-1042', 'Д-1058', 'Д-1077', 'Итого'], 'суммы -10 млн, -6 млн, -0,5 млн идут по возрастанию')
      expect.eq(await sortState(t), ['Договор:none', 'Дата:none', 'Сумма:ascending'], 'aria-sort после первого нажатия')
      step('сумма по убыванию')
      await sortBtn(t, 'Сумма').click()
      expect.eq(await codes(t), ['Д-1077', 'Д-1058', 'Д-1042', 'Итого'], 'порядок по убыванию, итог внизу')
      expect.eq(await sortState(t), ['Договор:none', 'Дата:none', 'Сумма:descending'], 'aria-sort после второго нажатия')
    },
  },
  {
    name: 'DataTable: сортировка по дате и смена столбца сбрасывает прежний',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 1)
      step('дата по возрастанию')
      await sortBtn(t, 'Дата').click()
      expect.eq(await codes(t), ['Д-1058', 'Д-1042', 'Д-1077', 'Итого'], '29.01, 12.03, 04.06')
      expect.eq(await sortState(t), ['Договор:none', 'Дата:ascending', 'Сумма:none'], 'активен только столбец даты')
      step('дата по убыванию')
      await sortBtn(t, 'Дата').click()
      expect.eq(await codes(t), ['Д-1077', 'Д-1042', 'Д-1058', 'Итого'], 'даты по убыванию')
      step('возврат к договору')
      await sortBtn(t, 'Договор').click()
      expect.eq(await sortState(t), ['Договор:ascending', 'Дата:none', 'Сумма:none'], 'активен договор')
    },
  },
  {
    name: 'DataTable: сортировка с клавиатуры (Enter и пробел на заголовке)',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 1)
      await sortBtn(t, 'Сумма').focus()
      step('Enter')
      await page.keyboard.press('Enter')
      expect.eq(await sortState(t), ['Договор:none', 'Дата:none', 'Сумма:ascending'], 'Enter включает сортировку')
      step('пробел')
      await page.keyboard.press('Space')
      expect.eq(await codes(t), ['Д-1077', 'Д-1058', 'Д-1042', 'Итого'], 'пробел переключает направление')
      expect.eq(await sortState(t), ['Договор:none', 'Дата:none', 'Сумма:descending'], 'aria-sort после пробела')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.getAttribute('data-slot')), 'table-sort', 'фокус остался на кнопке сортировки')
    },
  },
  {
    name: 'DataTable: вложенная таблица не предлагает сортировку по договору',
    story: STORY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      expect.eq(await t.locator('thead button[data-slot=table-sort]').count(), 0, 'кнопок сортировки в дереве нет')
      expect.eq(await t.locator('thead th[aria-sort]').count(), 0, 'aria-sort в дереве нет')
    },
  },
  {
    name: 'DataTable: выбор строки чекбоксом и панель «Выбрано»',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      expect.eq(await panelInfo(page), null, 'панели нет без выбора')
      step('отметить вторую строку')
      await t.locator('tbody tr').nth(1).locator('[role=checkbox]').first().click()
      expect.eq(await rowChecks(t), ['false', 'true', 'false', 'false', 'false'], 'выбрана только вторая')
      expect.eq(await panelInfo(page), 'Выбрано 1 из 5', 'панель')
      step('отметить четвёртую')
      await t.locator('tbody tr').nth(3).locator('[role=checkbox]').first().click()
      expect.eq(await panelInfo(page), 'Выбрано 2 из 5', 'панель после второго')
      expect.eq(await t.locator('thead [role=checkbox]').getAttribute('aria-checked'), 'mixed', 'чекбокс шапки в промежуточном состоянии')
      step('снять первую отмеченную')
      await t.locator('tbody tr').nth(1).locator('[role=checkbox]').first().click()
      expect.eq(await rowChecks(t), ['false', 'false', 'false', 'true', 'false'], 'осталась четвёртая')
    },
  },
  {
    name: 'DataTable: «выбрать всё» в шапке выбирает и снимает все строки',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      const head = t.locator('thead [role=checkbox]')
      step('выбрать всё')
      await head.click()
      expect.eq(await rowChecks(t), ['true', 'true', 'true', 'true', 'true'], 'все отмечены')
      expect.eq(await head.getAttribute('aria-checked'), 'true', 'шапка отмечена')
      expect.eq(await panelInfo(page), 'Выбрано 5 из 5', 'панель')
      step('снять всё')
      await head.click()
      expect.eq(await rowChecks(t), ['false', 'false', 'false', 'false', 'false'], 'все сняты')
      expect.eq(await panelInfo(page), null, 'панель ушла')
    },
  },
  {
    name: 'DataTable: шапка выбирает только видимые строки, «на всех страницах» берёт весь отбор',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      step('свернуть первую строку')
      await t.locator('tbody tr').first().locator('[data-slot=table-collapse-toggle]').click()
      expect.eq(await codes(t), ['Д-1042', 'Д-1058', 'Д-1077'], 'видны три строки')
      step('выбрать видимые')
      await t.locator('thead [role=checkbox]').click()
      expect.eq(await panelInfo(page), 'Выбрано 3 из 5', 'свёрнутые дочерние в выбор не попали')
      step('выбрать на всех страницах')
      await panelButton(page, /Выбрать на всех страницах \(5\)/).click()
      expect.eq(await panelInfo(page), 'Выбрано 5 из 5', 'выбран весь отбор')
      step('развернуть')
      await t.locator('tbody tr').first().locator('[data-slot=table-collapse-toggle]').click()
      expect.eq(await rowChecks(t), ['true', 'true', 'true', 'true', 'true'], 'дочерние строки отмечены')
    },
  },
  {
    name: 'DataTable: крестик чёрной панели сбрасывает выбор',
    story: STORY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      await t.locator('tbody tr').nth(0).locator('[role=checkbox]').first().click()
      await t.locator('tbody tr').nth(2).locator('[role=checkbox]').first().click()
      expect.eq(await panelInfo(page), 'Выбрано 2 из 5', 'два выбраны')
      await page.locator('[data-slot=close-cross][aria-label="Закрыть"]').click()
      expect.eq(await panelInfo(page), null, 'панель закрыта')
      expect.eq(await rowChecks(t), ['false', 'false', 'false', 'false', 'false'], 'выбор снят')
      expect.eq(await t.locator('thead [role=checkbox]').getAttribute('aria-checked'), 'false', 'шапка снята')
    },
  },
  {
    name: 'DataTable: свёртка строки и «свернуть/развернуть всё» в шапке',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      expect.eq(await codes(t), ['Д-1042', 'Д-1042/1', 'Д-1042/1-А', 'Д-1058', 'Д-1077'], 'по умолчанию развёрнуто')
      step('свернуть первую')
      const toggle = t.locator('tbody tr').first().locator('[data-slot=table-collapse-toggle]')
      await toggle.click()
      expect.eq(await codes(t), ['Д-1042', 'Д-1058', 'Д-1077'], 'потомки скрыты')
      expect.eq(await toggle.getAttribute('aria-expanded'), 'false', 'aria-expanded=false')
      step('развернуть первую')
      await toggle.click()
      expect.eq(await codes(t), ['Д-1042', 'Д-1042/1', 'Д-1042/1-А', 'Д-1058', 'Д-1077'], 'вернулись потомки')
      step('свернуть всё из шапки')
      const head = t.locator('thead [data-slot=table-collapse-toggle]')
      await head.click()
      expect.eq(await codes(t), ['Д-1042', 'Д-1058', 'Д-1077'], 'остались корни')
      expect.eq(await head.getAttribute('aria-expanded'), 'false', 'шапка свёрнута')
      step('развернуть всё из шапки')
      await head.click()
      expect.eq((await codes(t)).length, 5, 'все пять строк видны')
    },
  },
  {
    name: 'DataTable: шеврон вложенности работает с клавиатуры (Enter и пробел)',
    story: STORY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      const toggle = t.locator('tbody tr').nth(1).locator('[data-slot=table-collapse-toggle]')
      await toggle.focus()
      await page.keyboard.press('Enter')
      expect.eq(await codes(t), ['Д-1042', 'Д-1042/1', 'Д-1058', 'Д-1077'], 'Enter свернул вторую строку')
      await page.keyboard.press('Space')
      expect.eq((await codes(t)).length, 5, 'пробел развернул обратно')
    },
  },
  {
    name: 'DataTable: клик, Enter и пробел на строке открывают её; чекбокс, ссылка и меню — нет',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const clicks = await trackRowClicks(page)
      const t = tableAt(page, 0)
      const row = t.locator('tbody tr').nth(3)
      step('щелчок по тексту ячейки')
      await row.locator('td', { hasText: '29.01.2026' }).click()
      expect.eq(await clicks(), ['2'], 'одно открытие строки с ключом 2')
      step('Enter на строке')
      await row.focus()
      await page.keyboard.press('Enter')
      expect.eq(await clicks(), ['2', '2'], 'Enter открыл')
      step('пробел на строке')
      await page.keyboard.press('Space')
      expect.eq(await clicks(), ['2', '2', '2'], 'пробел открыл')
      step('чекбокс выбора')
      await row.locator('[role=checkbox]').first().click()
      expect.eq((await clicks()).length, 3, 'чекбокс не открывает строку')
      expect.eq((await rowChecks(t))[3], 'true', 'но отмечает её')
      step('ссылка в ячейке')
      await row.locator('a').click()
      expect.eq((await clicks()).length, 3, 'ссылка не открывает строку')
      step('меню действий')
      await row.locator('button[aria-label="Действия со строкой"]').click()
      expect.eq((await clicks()).length, 3, 'кнопка меню не открывает строку')
      await until(async () => page.getByRole('menuitem', { name: 'Удалить' }).isVisible(), 'меню действий открылось')
    },
  },
  {
    name: 'DataTable: протяжка мышью по тексту не открывает строку, обычный щелчок открывает',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const clicks = await trackRowClicks(page)
      const t = tableAt(page, 0)
      const cell = t.locator('tbody tr').nth(3).locator('td', { hasText: '29.01.2026' })
      const bb = await cell.boundingBox()
      const y = bb.y + bb.height / 2
      step('протяжка по дате')
      await page.mouse.move(bb.x + 8, y)
      await page.mouse.down()
      await page.mouse.move(bb.x + 90, y, { steps: 5 })
      await page.mouse.up()
      expect.eq(await page.evaluate(() => String(getSelection())), '29.01.2026', 'текст выделен')
      expect.eq(await clicks(), [], 'протяжка не открыла строку')
      step('щелчок, снимающий выделение')
      await page.mouse.click(bb.x + 100, y)
      expect.eq(await clicks(), [], 'первый щелчок только снял выделение')
      step('повторный щелчок')
      await page.mouse.click(bb.x + 100, y)
      expect.eq(await clicks(), ['2'], 'обычный щелчок открыл строку')
    },
  },
  {
    name: 'DataTable: закреплённые столбцы стоят на месте при горизонтальной прокрутке',
    story: STORY,
    viewport: [900, 900],
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      const box = page.locator('[data-slot=table-container]').first()
      const first = t.locator('tbody tr').first()
      const left = (i) => first.locator('td').nth(i).evaluate((e) => Math.round(e.getBoundingClientRect().left))
      const pos = async () => ({
        chk: await left(0),
        code: await left(1),
        subject: await left(2),
        actionRight: await first.locator('td[data-pin=right]').evaluate((e) => Math.round(e.getBoundingClientRect().right)),
      })
      const before = await pos()
      expect((await box.evaluate((e) => e.scrollWidth - e.clientWidth)) > 300, 'таблица шире окна')
      step('прокрутка вправо')
      await box.evaluate((e) => { e.scrollLeft = 400 })
      const mid = await pos()
      expect.eq(await box.evaluate((e) => e.scrollLeft), 400, 'scrollLeft')
      expect.eq(mid.chk, before.chk, 'чекбокс на месте')
      expect.eq(mid.code, before.code, 'договор на месте')
      expect.eq(mid.actionRight, before.actionRight, 'действия справа на месте')
      expect.eq(mid.subject, before.subject - 400, 'подвижный столбец уехал ровно на 400')
      step('до упора')
      await box.evaluate((e) => { e.scrollLeft = e.scrollWidth })
      const end = await pos()
      expect.eq(end.code, before.code, 'договор на месте в конце прокрутки')
      expect.eq(end.actionRight, before.actionRight, 'действия на месте в конце')
    },
  },
  {
    name: 'DataTable: разделитель закрепа виден, только пока за ним есть скрытый контент',
    story: STORY,
    viewport: [900, 900],
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      const box = page.locator('[data-slot=table-container]').first()
      const dividers = () =>
        t.locator('tbody tr').first().locator('[data-slot=table-pin-divider]').evaluateAll((ds) =>
          ds.map((d) => d.closest('td').getAttribute('data-pin') + ':' + getComputedStyle(d).opacity))
      step('в начале')
      await eventually(expect, dividers, ['left:0', 'right:1'], 'слева прятать нечего, справа контент ещё есть')
      step('прокрутка на 100')
      await box.evaluate((e) => { e.scrollLeft = 100 })
      await eventually(expect, dividers, ['left:1', 'right:1'], 'слева появился, справа ещё есть')
      step('до упора')
      await box.evaluate((e) => { e.scrollLeft = e.scrollWidth })
      await eventually(expect, dividers, ['left:1', 'right:0'], 'справа скрытого контента больше нет')
      step('обратно в начало')
      await box.evaluate((e) => { e.scrollLeft = 0 })
      await eventually(expect, dividers, ['left:0', 'right:1'], 'вернулось исходное')
    },
  },
  {
    name: 'DataTable: перетаскивание правой границы меняет ширину столбца и тела',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 0)
      const th = t.locator('thead th', { hasText: 'Предмет' })
      expect.eq(Math.round((await th.boundingBox()).width), 280, 'исходная ширина')
      const hb = await th.locator('[data-slot=table-resize-handle]').boundingBox()
      const x = hb.x + hb.width / 2
      const y = hb.y + hb.height / 2
      step('тянем вправо на 80')
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.mouse.move(x + 80, y, { steps: 6 })
      await page.mouse.up()
      expect.eq(Math.round((await th.boundingBox()).width), 360, 'ширина шапки')
      expect.eq(await t.locator('tbody tr').first().locator('td').nth(2).evaluate((e) => Math.round(e.getBoundingClientRect().width)), 360, 'ячейка тела за шапкой')
      step('тянем влево ниже минимума')
      const hb2 = await th.locator('[data-slot=table-resize-handle]').boundingBox()
      await page.mouse.move(hb2.x + 4, hb2.y + 20)
      await page.mouse.down()
      await page.mouse.move(hb2.x - 600, hb2.y + 20, { steps: 6 })
      await page.mouse.up()
      const min = Math.round((await th.boundingBox()).width)
      expect(min > 0 && min < 200, 'ширина упёрлась в минимум, а не ушла в ноль или минус: ' + min)
    },
  },
  {
    name: 'DataTable: итоговая строка — последняя, перекрывает две колонки, не сортируется и без чекбокса',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const t = tableAt(page, 1)
      const total = t.locator('tr[data-slot=table-total-row]')
      expect.eq(await total.count(), 1, 'одна итоговая строка')
      expect.eq(await total.locator('td').first().getAttribute('colspan'), '2', 'первая ячейка на две колонки')
      expect.eq(await total.locator('td').first().innerText(), 'Итого', 'подпись')
      expect(/16\s500\s000,00/.test((await total.innerText()).replace(/[  ]/g, ' ')), 'сумма итога 16 500 000,00: ' + (await total.innerText()).replace(/\s+/g, ' '))
      expect.eq(await total.locator('[role=checkbox]').count(), 0, 'чекбоксов в итоге нет')
      step('сортировка по убыванию суммы')
      await sortBtn(t, 'Сумма').click()
      await sortBtn(t, 'Сумма').click()
      const rows = await t.locator('tbody tr').evaluateAll((rs) => rs.map((r) => r.getAttribute('data-slot')))
      expect.eq(rows[rows.length - 1], 'table-total-row', 'итог по-прежнему внизу')
      expect.eq(rows.length, 4, 'три строки данных и итог')
    },
  },
  {
    name: 'DataTable: ячейка суммы и итог стоят колонка в колонку под шапкой',
    story: STORY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 1)
      const right = (loc) => loc.evaluate((e) => Math.round(e.getBoundingClientRect().right))
      const headRight = await right(t.locator('thead th', { hasText: 'Сумма' }))
      expect.eq(await right(t.locator('tbody tr').first().locator('td[data-type=number]').nth(1)), headRight, 'ячейка суммы под шапкой')
      expect.eq(await right(t.locator('tr[data-slot=table-total-row] td[data-type=number]').nth(1)), headRight, 'ячейка итога под шапкой')
    },
  },
  {
    name: 'DataTable: суммы — знак, разряды и единица валюты при значении',
    story: STORY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      const money = await t.locator('tbody tr').evaluateAll((rows) =>
        rows.map((r) => (r.querySelectorAll('td[data-type=number]')[1]?.innerText || '').replace(/[\s ]+/g, ' ').trim()))
      expect.eq(money[0], '-10 000 000,00 ₽ Списание', 'списание')
      expect.eq(money[2], '+31 922 980,05 ₽ Поступление', 'поступление со знаком «+»')
      expect.eq(money[4], '-500 000,00 $ Списание', 'валюта $ у своей строки')
    },
  },
  {
    name: 'DataTable: пустое значение массива и «Несколько (N)» в списке плательщиков',
    story: STORY,
    run: async ({ page, expect }) => {
      const t = tableAt(page, 0)
      const payers = await t.locator('tbody tr').evaluateAll((rows) => rows.map((r) => r.querySelectorAll('td[data-type=text]')[2]?.innerText.replace(/\s+/g, ' ').trim()))
      expect.eq(payers[0], 'ИП Филлимонов Павел Алексеевич', 'один плательщик — как есть')
      expect.eq(payers[1], 'Несколько (2)', 'два плательщика сворачиваются')
      expect.eq(payers[2], '—', 'пустой массив — прочерк')
    },
  },
])
