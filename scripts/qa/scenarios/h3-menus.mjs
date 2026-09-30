// Сверка списков с перетаскиванием и меню с макетом Figma. Проверяются значения из живого браузера
// (getBoundingClientRect / getComputedStyle), а не имена классов.
//   • строка списка с перетаскиванием («03. ELK / drag-and-drop»): высота 56, радиус 8, pr 16, текст с x=48
//     (вложенная строка — 64), значок группы 32, ручка 24;
//   • «Настройка избранного»: Menu Point p16 / gap 16 / звезда 24, радиус заливки 8, секции 16 и 24;
//   • «Меню сотрудника на главном экране»: колонки 432 (1920) и 384 (1280) с шагом 24, карточка p32 r16,
//     заголовок → список 24, шаг ссылок 40;
//   • раскрытое меню навигации: баннер 240 + 8 + точки 16 = 264, колонки 384 / 432.
const OFF = '*,*::before,*::after{animation:none!important;transition:none!important}'
const setArgs = async (page, updatedArgs) => {
  await page.evaluate((a) => {
    const id = new URLSearchParams(location.search).get('id')
    window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: a })
  }, updatedArgs)
  await page.waitForTimeout(400)
  await page.addStyleTag({ content: OFF })
}
const box = (e) => {
  const b = e.getBoundingClientRect()
  return { x: Math.round(b.left * 10) / 10, y: Math.round(b.top * 10) / 10, w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10 }
}

// Строки списка с перетаскиванием: метрики относительно самой строки.
const rowsOf = async (page, rootSel, rowSel) => {
  await page.waitForSelector(rootSel + ' ' + rowSel.replace(':scope > ', '> '))
  return page.evaluate(([root, rowS]) => {
    const scope = document.querySelector(root)
    return [...scope.querySelectorAll(rowS)].map((row) => {
      const b = row.getBoundingClientRect()
      const cs = getComputedStyle(row)
      const text = [...row.querySelectorAll('span')].find((s) => s.classList.contains('truncate'))
      const handle = row.querySelector('[data-slot=sortable-handle]')
      const leading = row.firstElementChild
      return {
        label: text?.textContent ?? '',
        h: b.height,
        radius: cs.borderTopLeftRadius,
        textX: Math.round((text.getBoundingClientRect().left - b.left) * 10) / 10,
        handleRight: handle ? Math.round((b.right - handle.getBoundingClientRect().right) * 10) / 10 : null,
        handleW: handle ? handle.getBoundingClientRect().width : null,
        leadingW: leading === text?.parentElement ? null : leading.getBoundingClientRect().width,
      }
    })
  }, [rootSel, rowSel])
}

const SORTABLE = 'компоненты-drag-and-drop--playground'
const FAVOURITES = 'компоненты-меню-настройка-избранного--playground'
const EMPLOYEE = 'компоненты-меню-меню-сотрудника--examples'
const HEADER_MENU = 'компоненты-меню-раскрытое-меню-навигации--playground'

export default [
  {
    name: 'h3 drag-and-drop: строка списка разделов — 56, радиус 8, текст с x=48, вложенная с x=64, значок группы 32, ручка справа 16',
    story: SORTABLE,
    run: async ({ page, expect }) => {
      const rows = await rowsOf(page, '[data-slot=sortable-list]', ':scope > div')
      const by = (label) => rows.find((r) => r.label === label)
      for (const r of rows) {
        expect.eq(r.h, 56, `высота «${r.label}»`)
        expect.eq(r.radius, '8px', `радиус «${r.label}»`)
        expect.eq(r.handleRight, 16, `ручка справа у «${r.label}»`)
        expect.eq(r.handleW, 24, `ручка у «${r.label}»`)
      }
      expect.eq(by('Общие вопросы').textX, 48, 'обычная строка: текст с x=48')
      expect.eq(by('Эффективность и целеполагание').textX, 48, 'группа: текст с x=48')
      expect.eq(by('Эффективность и целеполагание').leadingW, 32, 'группа: коробка значка 32')
      expect.eq(by('Обязательные курсы').textX, 64, 'вложенная строка: текст с x=64')
    },
  },
  {
    name: 'h3 drag-and-drop: ручка со стрелками переставляет строку, значения метрик после перестановки те же',
    story: SORTABLE,
    run: async ({ page, expect }) => {
      const labels = () => page.evaluate(() => [...document.querySelectorAll('[data-slot=sortable-list] > div')].map((r) => r.textContent.trim()))
      await page.waitForSelector('[data-slot=sortable-list] > div')
      const before = await labels()
      await page.locator('[data-slot=sortable-handle]').first().focus()
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(150)
      const after = await labels()
      expect.eq(after[0], before[1], 'первая строка уступила место второй')
      expect.eq(after[1], before[0], 'бывшая первая стала второй')
      const rows = await rowsOf(page, '[data-slot=sortable-list]', ':scope > div')
      expect.eq(rows.every((r) => r.h === 56 && r.radius === '8px'), true, '56 и радиус 8 у всех после перестановки')
    },
  },
  {
    name: 'h3 настройка избранного (1280): Menu Point p16/gap16, звезда 24, текст с x=56, ручка справа 16, радиус 8, секции 16 и 24',
    story: FAVOURITES,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[role=dialog] [data-slot=favourites-settings-row]')
      const m = await page.evaluate(() => {
        const d = document.querySelector('[role=dialog]')
        const rows = [...d.querySelectorAll('[data-slot=favourites-settings-row]')]
        const row = rows[0]
        const b = row.getBoundingClientRect()
        const cs = getComputedStyle(row)
        const star = row.querySelector('[data-slot=favourites-settings-star]').getBoundingClientRect()
        const text = [...row.querySelectorAll('span')].find((s) => s.classList.contains('truncate')).getBoundingClientRect()
        const handle = row.querySelector('[data-slot=sortable-handle]').getBoundingClientRect()
        const secs = [...d.querySelectorAll('section')].map((s) => getComputedStyle(s).rowGap)
        return {
          w: b.width, h: b.height, pad: cs.padding, gap: cs.columnGap, radius: cs.borderTopLeftRadius,
          starW: star.width, starX: star.left - b.left, textX: text.left - b.left, handleR: b.right - handle.right, secs,
          allRows: rows.every((r) => r.getBoundingClientRect().height === 56),
        }
      })
      expect.eq(m.w, 496, 'строка 496 (модалка 592 − 2×48)')
      expect.eq(m.h, 56, 'высота строки')
      expect.eq(m.pad, '16px', 'поля p16')
      expect.eq(m.gap, '16px', 'gap 16')
      expect.eq(m.radius, '8px', 'радиус заливки 8')
      expect.eq([m.starW, m.starX, m.textX, m.handleR], [24, 16, 56, 16], 'звезда 24 с x=16, текст с x=56, ручка справа 16')
      expect.eq(m.secs, ['16px', '24px'], 'интервал заголовок → список: «Добавлено» 16, «Остальные разделы» 24')
      expect.eq(m.allRows, true, 'все строки по 56')
    },
  },
  {
    name: 'h3 настройка избранного: ручка со стрелками меняет две первые строки местами',
    story: FAVOURITES,
    run: async ({ page, expect }) => {
      const first = () => page.evaluate(() => [...document.querySelectorAll('[role=dialog] [data-slot=favourites-settings-row]')].slice(0, 2).map((r) => r.textContent.trim()))
      await page.waitForSelector('[role=dialog] [data-slot=favourites-settings-row]')
      const before = await first()
      await page.locator('[role=dialog] [data-slot=sortable-handle]').first().focus()
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(150)
      const after = await first()
      expect.eq(after, [before[1], before[0]], 'две первые строки поменялись местами')
    },
  },
  {
    name: 'h3 настройка избранного (375, mobile): строки на всю ширину тела, 56, радиус 8, текст с x=56 от края строки',
    story: FAVOURITES,
    viewport: [375, 900],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[role=dialog] [data-slot=favourites-settings-row]')
      await setArgs(page, { viewport: 'mobile' })
      const m = await page.evaluate(() => {
        const row = document.querySelector('[role=dialog] [data-slot=favourites-settings-row]')
        const b = row.getBoundingClientRect()
        const text = [...row.querySelectorAll('span')].find((s) => s.classList.contains('truncate')).getBoundingClientRect()
        return { x: b.left, w: b.width, h: b.height, radius: getComputedStyle(row).borderTopLeftRadius, textX: text.left - b.left, scroll: document.documentElement.scrollWidth }
      })
      expect.eq([m.x, m.w, m.h, m.radius, m.textX], [16, 343, 56, '8px', 56], 'мобильная строка')
      expect.eq(m.scroll <= 375, true, 'нет горизонтальной прокрутки')
    },
  },
  {
    name: 'h3 меню сотрудника (1920): колонки 432 с шагом 456, карточка p32 r16, заголовок → список 24, шаг ссылок 40, заголовок 16/24 #999',
    story: EMPLOYEE,
    viewport: [1920, 1080],
    run: async ({ page, expect }) => {
      // Число колонок считает медиазапрос после первого кадра — ждём его.
      await page.waitForFunction(() => document.querySelectorAll('[data-slot=employee-menu]')[0]?.querySelectorAll('[data-slot=employee-menu-column]').length === 4, null, { timeout: 5000 }).catch(() => {})
      const m = await page.evaluate(() => {
        const box = (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height } }
        const menu = document.querySelector('[data-slot=employee-menu]')
        const cols = [...menu.querySelectorAll('[data-slot=employee-menu-column]')].map(box)
        const g = menu.querySelector('[data-slot=employee-menu-group]')
        const gcs = getComputedStyle(g)
        const title = g.querySelector('p')
        const tcs = getComputedStyle(title)
        const list = title.nextElementSibling
        const kids = [...list.children].map(box)
        return {
          menu: box(menu), cols, group: box(g), pad: gcs.padding, radius: gcs.borderRadius,
          title: { ...box(title), color: tcs.color, fs: tcs.fontSize, lh: tcs.lineHeight },
          listY: box(list).y, step: kids[1].y - kids[0].y, linkH: kids[0].h,
        }
      })
      expect.eq(m.cols.length, 4, 'четыре колонки')
      expect.eq(m.cols.map((c) => c.w), [432, 432, 432, 432], 'ширина колонок')
      expect.eq(m.cols.map((c, i) => (i ? c.x - m.cols[i - 1].x : 0)), [0, 456, 456, 456], 'шаг колонок 432 + 24')
      expect.eq(m.menu.w, 1800, 'полоса 1800')
      expect.eq([m.pad, m.radius], ['32px', '16px'], 'поля карточки 32, радиус 16')
      expect.eq([m.title.color, m.title.fs, m.title.lh], ['rgb(153, 153, 153)', '16px', '24px'], 'заголовок группы 16/24 #999')
      expect.eq([m.title.y - m.group.y, m.listY - m.title.y - m.title.h, m.step, m.linkH], [32, 24, 40, 24], 'поле 32, заголовок → список 24, шаг 40, ссылка 24')
    },
  },
  {
    name: 'h3 меню сотрудника (1280): колонки 384 с шагом 408, карточка внутри 320',
    story: EMPLOYEE,
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      const m = await page.evaluate(() => {
        const menu = document.querySelector('[data-slot=employee-menu]')
        const cols = [...menu.querySelectorAll('[data-slot=employee-menu-column]')].map((c) => c.getBoundingClientRect())
        const title = menu.querySelector('[data-slot=employee-menu-group] p').getBoundingClientRect()
        return { w: menu.getBoundingClientRect().width, cw: cols.map((c) => c.width), step: cols.map((c, i) => (i ? c.left - cols[i - 1].left : 0)), tw: title.width }
      })
      expect.eq(m.w, 1200, 'полоса 1200')
      expect.eq(m.cw, [384, 384, 384], 'три колонки по 384')
      expect.eq(m.step, [0, 408, 408], 'шаг 408')
      expect.eq(m.tw, 320, 'ширина заголовка 384 − 2×32')
    },
  },
  {
    name: 'h3 раскрытое меню навигации: баннер 240 + 8 + точки 16 = 264; колонки 384 на 1280 и 432 на 1920',
    story: HEADER_MENU,
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      await setArgs(page, { columns: 3 })
      await page.waitForFunction((n) => document.querySelectorAll('[data-slot=header-menu-column]').length === n, 3, { timeout: 5000 })
      const at = () => page.evaluate(() => {
        const m = document.querySelector('[data-slot=header-menu]')
        const cols = [...m.querySelectorAll('[data-slot=header-menu-column]')].map((c) => c.getBoundingClientRect())
        const car = m.querySelector('[data-slot=menu-banner-carousel]').getBoundingClientRect()
        const ban = m.querySelector('[data-slot=menu-banner]').getBoundingClientRect()
        const g = m.querySelector('[data-slot=header-menu-group]')
        const gcs = getComputedStyle(g)
        const gaps = [...m.querySelectorAll('[data-slot=header-menu-column]')].map((c) => getComputedStyle(c).rowGap)
        return { cw: cols.map((c) => c.width), step: cols.map((c, i) => (i ? c.left - cols[i - 1].left : 0)), top: cols[0].top, car: [car.width, car.height], ban: [ban.width, ban.height], pad: gcs.padding, radius: gcs.borderRadius, bg: gcs.backgroundColor, gaps }
      })
      const a = await at()
      expect.eq(a.cw, [384, 384, 384], '1280: три колонки по 384')
      expect.eq(a.step, [0, 408, 408], '1280: шаг 408')
      expect.eq(a.car, [384, 264], '1280: карусель 384×264')
      expect.eq(a.ban, [384, 240], '1280: баннер 384×240')
      expect.eq([a.pad, a.radius, a.bg, a.top], ['32px', '24px', 'rgb(248, 248, 248)', 16], 'карточка p32 r24 #f8f8f8, колонки с y=16')
      expect.eq(a.gaps, ['24px', '24px', '24px'], 'интервал карточек 24')
      await page.setViewportSize({ width: 1920, height: 1000 })
      await setArgs(page, { columns: 4 })
      await page.waitForFunction((n) => document.querySelectorAll('[data-slot=header-menu-column]').length === n, 4, { timeout: 5000 })
      const b = await at()
      expect.eq(b.cw, [432, 432, 432, 432], '1920: четыре колонки по 432')
      expect.eq(b.car, [432, 264], '1920: карусель 432×264')
    },
  },
]
