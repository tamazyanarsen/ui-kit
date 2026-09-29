// Pagination (переходы, размер страницы, сжатие при ресайзе и после загрузки шрифта) и «Сводка» Table Top
// (стрелки листания ленты без пропусков).
import { eventually, ready, withArgs } from './tables-0-helpers.mjs'

const PAGER = 'компоненты-paginator--playground'
const TOP = 'компоненты-table-top--examples'

const pager = (page) => page.locator('[data-slot=pagination]').first()
/** Ряд номеров как строки: «…» — многоточие, «*» — текущая, «[П]»/«[С]» — стрелки (x — отключена). */
const pages = (page) =>
  pager(page).locator('[data-slot=pagination-pages] > *').evaluateAll((els) =>
    els.map((e) => {
      if (e.getAttribute('data-slot') === 'pagination-ellipsis') return '…'
      const label = e.getAttribute('aria-label')
      if (label) return '[' + label[0] + (e.disabled ? 'x' : '') + ']'
      return e.innerText.trim() + (e.getAttribute('aria-current') === 'page' ? '*' : '')
    })
  )
const size = (page) => pager(page).locator('[data-slot=pagination-size][data-active]').innerText()
const compact = (page) => pager(page).getAttribute('data-compact')
const pageBtn = (page, n) => pager(page).locator('[data-slot=pagination-page]', { hasText: new RegExp(`^${n}$`) })
const next = (page) => pager(page).locator('[aria-label="Следующая страница"]')
const prev = (page) => pager(page).locator('[aria-label="Предыдущая страница"]')
const rightEdge = async (page) => {
  const b = await next(page).boundingBox()
  return Math.round(b.x + b.width)
}
const overflowX = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

export default ready([
  {
    name: 'Paginator: щелчок по номеру переносит текущую страницу, ряд перестраивается',
    story: PAGER,
    run: async ({ page, expect, step }) => {
      expect.eq(await pages(page), ['[П]', '1', '…', '4', '5*', '6', '…', '20', '[С]'], 'исходно 5 из 20')
      step('страница 6')
      await pageBtn(page, 6).click()
      expect.eq(await pages(page), ['[П]', '1', '…', '5', '6*', '7', '…', '20', '[С]'], 'ряд сдвинулся вслед за текущей')
      step('страница 1')
      await pageBtn(page, 1).click()
      expect.eq(await pages(page), ['[Пx]', '1*', '2', '3', '4', '5', '…', '20', '[С]'], 'у первой страницы «назад» отключена')
      step('страница 20')
      await pageBtn(page, 20).click()
      expect.eq(await pages(page), ['[П]', '1', '…', '16', '17', '18', '19', '20*', '[Сx]'], 'у последней «вперёд» отключена')
    },
  },
  {
    name: 'Paginator: стрелки «Предыдущая» и «Следующая» листают по одной странице',
    story: PAGER,
    run: async ({ page, expect, step }) => {
      const current = async () => (await pages(page)).find((x) => x.endsWith('*'))
      step('вперёд три раза')
      for (let i = 0; i < 3; i++) await next(page).click()
      expect.eq(await current(), '8*', 'с 5 до 8')
      step('назад пять раз')
      for (let i = 0; i < 5; i++) await prev(page).click()
      expect.eq(await current(), '3*', 'с 8 до 3')
      step('до первой')
      for (let i = 0; i < 2; i++) await prev(page).click()
      expect.eq(await current(), '1*', 'на первой остановились')
      expect.eq(await prev(page).isDisabled(), true, 'стрелка назад отключена на первой')
    },
  },
  {
    name: 'Paginator: стрелки работают с клавиатуры, фокус остаётся на кнопке',
    story: PAGER,
    run: async ({ page, expect }) => {
      await next(page).focus()
      await page.keyboard.press('Enter')
      await page.keyboard.press('Space')
      expect.eq((await pages(page)).find((x) => x.endsWith('*')), '7*', 'Enter и пробел прибавили по странице')
      await eventually(expect, () => page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Следующая страница', 'фокус на стрелке')
    },
  },
  {
    name: 'Paginator: смена размера страницы отмечает выбранный и не трогает текущую страницу',
    story: PAGER,
    run: async ({ page, expect, step }) => {
      expect.eq(await size(page), '25', 'по умолчанию 25')
      step('50')
      await pager(page).locator('[data-slot=pagination-size]', { hasText: '50' }).click()
      expect.eq(await size(page), '50', 'выбрано 50')
      step('100')
      await pager(page).locator('[data-slot=pagination-size]', { hasText: '100' }).click()
      expect.eq(await size(page), '100', 'выбрано 100')
      expect.eq((await pages(page)).find((x) => x.endsWith('*')), '5*', 'текущая страница прежняя')
      expect.eq(await pager(page).locator('[data-slot=pagination-size][data-active]').count(), 1, 'активен ровно один вариант')
    },
  },
  {
    name: 'Paginator: до семи страниц показываются все номера без многоточия',
    story: PAGER,
    run: async ({ page, expect }) => {
      await withArgs(page, 'totalPages:5;page:1')
      expect.eq(await pages(page), ['[Пx]', '1*', '2', '3', '4', '5', '[С]'], 'пять страниц подряд')
    },
  },
  {
    name: 'Paginator: заданная страница из аргументов попадает в середину ряда',
    story: PAGER,
    run: async ({ page, expect }) => {
      await withArgs(page, 'page:10;totalPages:20')
      expect.eq(await pages(page), ['[П]', '1', '…', '9', '10*', '11', '…', '20', '[С]'], 'страница 10 из 20')
    },
  },
  {
    name: 'Paginator: одна страница — остаётся единственный номер без стрелок',
    story: PAGER,
    run: async ({ page, expect }) => {
      await withArgs(page, 'totalPages:1;page:1')
      expect.eq(await pages(page), ['1*'], 'только текущая страница, без стрелок')
    },
  },
  {
    name: 'Paginator: без блока номеров остаётся только выбор размера страницы',
    story: PAGER,
    run: async ({ page, expect }) => {
      await withArgs(page, 'showPages:false')
      expect.eq(await pager(page).locator('[data-slot=pagination-page]').count(), 0, 'номеров нет')
      expect.eq(await pager(page).locator('[data-slot=pagination-size]').count(), 3, 'три размера справа')
    },
  },
  {
    name: 'Paginator: при сужении окна ряд сжимается, «Следующая» остаётся в окне, при расширении возвращается',
    story: PAGER,
    run: async ({ page, expect, step }) => {
      expect.eq(await compact(page), null, 'на 1280 полный ряд')
      step('375')
      await page.setViewportSize({ width: 375, height: 800 })
      await page.waitForFunction(() => document.querySelector('[data-slot=pagination]')?.getAttribute('data-compact') === 'true')
      expect.eq(await pages(page), ['[П]', '1', '…', '5*', '…', '20', '[С]'], 'сжатый ряд: первая, текущая, последняя')
      expect(await rightEdge(page) <= 375, 'стрелка «вперёд» в окне: ' + (await rightEdge(page)))
      expect.eq(await overflowX(page), 0, 'страница не шире окна')
      step('320')
      await page.setViewportSize({ width: 320, height: 800 })
      await page.waitForFunction(() => document.querySelector('[data-slot=pagination]')?.getAttribute('data-compact') === 'minimal')
      expect(await rightEdge(page) <= 320, 'на 320 стрелка тоже в окне: ' + (await rightEdge(page)))
      step('обратно на 1280')
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.waitForFunction(() => document.querySelector('[data-slot=pagination]')?.getAttribute('data-compact') === null)
      expect.eq(await pages(page), ['[П]', '1', '…', '4', '5*', '6', '…', '20', '[С]'], 'полный ряд вернулся')
    },
  },
  {
    name: 'Paginator: сжатие сохраняется после смены страницы на узком окне',
    story: PAGER,
    viewport: [375, 800],
    run: async ({ page, expect, step }) => {
      await page.waitForFunction(() => document.querySelector('[data-slot=pagination]')?.getAttribute('data-compact') === 'true')
      step('вперёд на страницу 6')
      await next(page).click()
      expect.eq(await compact(page), 'true', 'ряд остался сжатым')
      expect.eq((await pages(page)).find((x) => x.endsWith('*')), '6*', 'страница 6')
      expect(await rightEdge(page) <= 375, 'стрелка в окне')
      step('последняя страница')
      await pageBtn(page, 20).click()
      expect(await rightEdge(page) <= 375, 'на последней странице стрелка в окне')
      expect.eq(await overflowX(page), 0, 'без горизонтальной прокрутки страницы')
    },
  },
  {
    name: 'Paginator: на телефоне сразу после загрузки (шрифт готов) ряд не выходит за окно',
    story: PAGER,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(200)
      expect(await rightEdge(page) <= 375, 'стрелка «вперёд» в окне: ' + (await rightEdge(page)))
      const box = await pager(page).boundingBox()
      expect(box.x + box.width <= 375 + 1, 'пагинатор не шире окна: ' + (box.x + box.width))
      expect.eq(await overflowX(page), 0, 'страница не шире окна')
    },
  },
  {
    name: 'Paginator: несколько сужений и расширений подряд дают тот же ряд',
    story: PAGER,
    run: async ({ page, expect }) => {
      const at = async (w) => {
        await page.setViewportSize({ width: w, height: 800 })
        await page.waitForTimeout(250)
        return { compact: await compact(page), pages: await pages(page) }
      }
      const wide1 = await at(1280)
      const narrow1 = await at(375)
      const wide2 = await at(1280)
      const narrow2 = await at(375)
      expect.eq(wide2, wide1, 'на 1280 ряд тот же')
      expect.eq(narrow2, narrow1, 'на 375 ряд тот же')
    },
  },
  {
    name: 'Table Top «Сводка»: стрелки листают пару за парой, ни одна не пропускается, фокус передаётся',
    story: TOP,
    viewport: [700, 900],
    run: async ({ page, expect, step }) => {
      const D = page.locator('[data-slot=table-top-details]')
      const win = D.locator('[data-scroll-window]')
      const settle = async () => {
        let last = -1
        for (let i = 0; i < 40; i++) {
          const v = await win.evaluate((w) => w.scrollLeft)
          if (v === last) return v
          last = v
          await page.waitForTimeout(120)
        }
        return last
      }
      // Пары, целиком видимые между стрелками (зона стрелки 40px берётся только там, где стрелка есть).
      const visible = () =>
        win.evaluate((w) => {
          const d = w.closest('[data-slot=table-top-details]')
          const b = w.getBoundingClientRect()
          const zl = d.querySelector('[data-direction=left]') ? 40 : 0
          const zr = d.querySelector('[data-direction=right]') ? 40 : 0
          return [...w.querySelectorAll('[data-slot=table-top-details-item]')]
            .map((p, i) => {
              const r = p.getBoundingClientRect()
              return r.left >= b.left + zl - 1 && r.right <= b.right - zr + 1 ? i : -1
            })
            .filter((i) => i >= 0)
        })
      const arrows = () => D.locator('[data-slot=table-top-details-arrow]').evaluateAll((a) => a.map((x) => x.getAttribute('data-direction')))
      const focused = () => page.evaluate(() => document.activeElement?.getAttribute('data-direction'))
      const total = await win.locator('[data-slot=table-top-details-item]').count()
      expect.eq(await arrows(), ['right'], 'в начале только «вперёд»')
      const seen = new Set(await visible())
      step('листаем вперёд с клавиатуры')
      await D.locator('[data-direction=right]').focus()
      for (let i = 0; i < 8 && (await D.locator('[data-direction=right]').count()); i++) {
        await page.keyboard.press('Enter')
        await settle()
        for (const v of await visible()) seen.add(v)
      }
      expect.eq(await arrows(), ['left'], 'в конце только «назад»')
      expect.eq(await focused(), 'left', 'фокус перешёл на стрелку «назад», а не упал в body')
      expect.eq([...seen].sort(), Array.from({ length: total }, (_, i) => i), 'каждая пара хоть раз была видна целиком')
      step('листаем назад')
      const back = new Set(await visible())
      for (let i = 0; i < 8 && (await D.locator('[data-direction=left]').count()); i++) {
        await D.locator('[data-direction=left]').focus()
        await page.keyboard.press('Enter')
        await settle()
        for (const v of await visible()) back.add(v)
      }
      expect.eq(await arrows(), ['right'], 'вернулись к началу')
      expect.eq(await win.evaluate((w) => w.scrollLeft), 0, 'scrollLeft = 0')
      expect.eq([...back].sort(), Array.from({ length: total }, (_, i) => i), 'назад тоже без пропусков')
    },
  },
  {
    name: 'Table Top «Сводка»: щелчок мышью по центру стрелки листает ленту',
    story: TOP,
    viewport: [700, 900],
    run: async ({ page, expect }) => {
      const D = page.locator('[data-slot=table-top-details]')
      const win = D.locator('[data-scroll-window]')
      const b = await D.locator('[data-direction=right]').boundingBox()
      await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
      await page.waitForTimeout(900)
      expect((await win.evaluate((w) => w.scrollLeft)) > 0, 'лента сдвинулась после щелчка по центру стрелки')
    },
  },
  {
    name: 'Table Top «Сводка»: при нажатой кнопке мыши стрелка остаётся под курсором',
    story: TOP,
    viewport: [700, 900],
    run: async ({ page, expect }) => {
      const arrow = page.locator('[data-slot=table-top-details] [data-direction=right]')
      const b = await arrow.boundingBox()
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
      await page.mouse.down()
      const pressed = await arrow.boundingBox()
      await page.mouse.up()
      // Штатный сдвиг Button на нажатии — 1px (translate-y-px); баг был в 17px (конфликт с центровкой translate).
      expect(Math.abs(pressed.y - b.y) <= 1.5, `при нажатии стрелка ушла на ${Math.abs(pressed.y - b.y)}px из-под курсора`)
    },
  },
  {
    name: 'Table Top «Сводка»: на телефоне лента тоже листается по парам',
    story: TOP,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      const D = page.locator('[data-slot=table-top-details]')
      const win = D.locator('[data-scroll-window]')
      expect((await win.evaluate((w) => w.scrollWidth - w.clientWidth)) > 0, 'лента шире окна')
      expect.eq(await D.locator('[data-slot=table-top-details-arrow]').count(), 1, 'есть только «вперёд»')
      await D.locator('[data-direction=right]').focus()
      await page.keyboard.press('Enter')
      await page.waitForTimeout(700)
      expect((await win.evaluate((w) => w.scrollLeft)) > 0, 'лента сдвинулась')
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'страница не растянулась')
    },
  },
])
