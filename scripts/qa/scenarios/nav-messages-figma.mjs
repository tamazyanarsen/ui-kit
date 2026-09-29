// Сверка с макетом Figma для группы «навигация и сообщения»: размеры карточки NPS (рамка внутри размера),
// длинные тексты Event (обрезка и перенос по мастеру), плитки верхней строки шапки на y=0 и профиль клиента,
// ширина мобильного тоста. Проверяются значения из живого браузера, а не имена классов.
const OFF = '*,*::before,*::after{animation:none!important;transition:none!important}'
const setArgs = async (page, updatedArgs) => {
  await page.evaluate((a) => {
    const id = new URLSearchParams(location.search).get('id')
    window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: a })
  }, updatedArgs)
  await page.waitForTimeout(400)
  await page.addStyleTag({ content: OFF })
}
const box = (page, sel) => page.evaluate((s) => {
  const r = document.querySelector(s).getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
}, sel)

const NPS = 'компоненты-nps--playground'
const EVENT = 'компоненты-event--playground'
const HEADER = 'компоненты-меню-header--playground'
const TOAST = 'компоненты-toast-message--playground'
const LONG = 'Очень_длинное_слово_без_пробелов_'.repeat(6)
const LONG_TEXT = 'Банковское сопровождение: не следует, однако, забывать, что постоянный количественный рост и сфера нашей активности '.repeat(3)

export default [
  {
    name: 'nps: карточка 360×668 / 232 / 356 с рамкой внутри размера, контент 312, тень 0/8/24',
    story: NPS,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=nps]')
      step('пустое состояние')
      const empty = await box(page, '[data-slot=nps]')
      expect.eq([empty.w, empty.h], [360, 232], 'Empty 360×232')
      step('оценка выбрана: раскрытая форма')
      await page.locator('[role=radio]').first().click()
      await page.waitForTimeout(400)
      const open = await box(page, '[data-slot=nps]')
      expect.eq([open.w, open.h], [360, 668], 'Default 360×668')
      const inner = await page.evaluate(() => {
        const c = document.querySelector('[data-slot=nps]')
        return { top: c.firstElementChild.getBoundingClientRect().width, shadow: getComputedStyle(c).boxShadow, border: getComputedStyle(c).borderTopWidth }
      })
      expect.eq(inner.top, 312, 'ширина контента 312 (в Figma 1px рамки внутри размера)')
      expect.eq(inner.border, '1px', 'рамка 1px осталась')
      expect(/rgba\(0, 0, 0, 0\.0\d*\) 0px 8px 24px 0px$/.test(inner.shadow), 'тень 0 8 24 #0000000F: ' + inner.shadow)
      step('Спасибо за оценку')
      await setArgs(page, { submitted: true })
      const done = await box(page, '[data-slot=nps]')
      expect.eq([done.w, done.h], [360, 356], 'Done 360×356')
    },
  },
  {
    name: 'event: автор и подпись «Комментарий» обрезаются многоточием, комментарий переносится (1280)',
    story: EVENT,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=event]')
      await setArgs(page, { author: LONG, comment: LONG_TEXT, showComment: true })
      const m = await page.evaluate(() => {
        const ev = document.querySelector('[data-slot=event]')
        const ps = [...ev.querySelectorAll('p')]
        const info = (p) => ({ h: p.getBoundingClientRect().height, over: p.scrollWidth > p.clientWidth + 1, ell: getComputedStyle(p).textOverflow, ws: getComputedStyle(p).whiteSpace })
        const author = ps.find((p) => p.textContent.startsWith('Очень'))
        const label = ps.find((p) => p.textContent === 'Комментарий')
        const text = ps.find((p) => p.textContent.startsWith('Банковское'))
        return { author: info(author), label: info(label), text: info(text), page: document.documentElement.scrollWidth - innerWidth }
      })
      expect.eq(m.author.h, 24, 'автор в одну строку')
      expect.eq(m.author.ws, 'nowrap', 'автор nowrap')
      expect.eq(m.author.ell, 'ellipsis', 'автор с многоточием')
      expect.eq(m.author.over, true, 'длинный автор действительно обрезан')
      expect.eq(m.label.h, 24, 'подпись комментария в одну строку')
      expect(m.text.h > 48, 'текст комментария переносится: высота ' + m.text.h)
      expect.eq(m.text.over, false, 'комментарий без горизонтального переполнения')
      expect(m.page <= 0, 'страница не шире окна: ' + m.page)
    },
  },
  {
    name: 'event: длинный автор и комментарий на 375 не раздвигают страницу',
    story: EVENT,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=event]')
      await setArgs(page, { author: LONG, comment: LONG_TEXT, title: LONG, showComment: true })
      const m = await page.evaluate(() => {
        const ev = document.querySelector('[data-slot=event]').getBoundingClientRect()
        return { right: ev.right, page: document.documentElement.scrollWidth - innerWidth }
      })
      expect(m.right <= 375, 'событие в пределах окна: ' + m.right)
      expect(m.page <= 0, 'страница не шире окна: ' + m.page)
    },
  },
  {
    name: 'шапка клиента: плитки верхней строки на y=0, линия внутри 64px, профиль 304 с названием 220 и шевроном у края (1920)',
    story: HEADER,
    viewport: [1920, 900],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=header]')
      const m = await page.evaluate(() => {
        const h = document.querySelector('[data-slot=header]')
        const trig = h.querySelector('[data-slot=profile-menu-trigger]')
        const tiles = [...h.querySelectorAll('[data-slot=header-client-actions] button')].filter((b) => b.getBoundingClientRect().height >= 64)
        const chev = trig.querySelector('svg:last-child').getBoundingClientRect()
        const row = h.firstElementChild
        const line = getComputedStyle(row, '::after')
        return {
          ys: tiles.map((t) => t.getBoundingClientRect().y),
          header: h.getBoundingClientRect().height,
          row: row.getBoundingClientRect().height,
          trig: trig.getBoundingClientRect().width,
          name: trig.querySelector('.truncate').getBoundingClientRect().width,
          chevGap: trig.getBoundingClientRect().right - chev.right,
          line: [line.height, line.backgroundColor],
        }
      })
      expect(m.ys.length >= 3, 'найдены плитки: ' + m.ys.length)
      expect.eq(m.ys.every((y) => y === 0), true, 'плитки на y=0: ' + m.ys)
      expect.eq([m.header, m.row], [128, 64], 'шапка 128 = две строки по 64')
      expect.eq([m.trig, m.name, m.chevGap], [304, 220, 0], 'профиль 304, название 220, шеврон у края')
      expect.eq(m.line[0], '1px', 'линия 1px')
    },
  },
  {
    name: 'шапка: длинное название организации обрезается, профиль остаётся 304 (1280)',
    story: HEADER,
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=header]')
      const m = await page.evaluate((long) => {
        const trig = document.querySelector('[data-slot=profile-menu-trigger]')
        trig.querySelector('.truncate').textContent = long
        const n = trig.querySelector('.truncate')
        return { trig: trig.getBoundingClientRect().width, name: n.getBoundingClientRect().width, cut: n.scrollWidth > n.clientWidth, ell: getComputedStyle(n).textOverflow }
      }, LONG)
      expect.eq([m.trig, m.name], [304, 220], '304 / 220')
      expect.eq([m.cut, m.ell], [true, 'ellipsis'], 'обрезано многоточием')
    },
  },
  {
    name: 'шапка сотрудника: плитки верхней строки на y=0 (1280)',
    story: HEADER,
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=header]')
      await setArgs(page, { type: 'employee' })
      const ys = await page.evaluate(() => [...document.querySelector('[data-slot=header] > div').querySelectorAll('button')]
        .filter((b) => b.getBoundingClientRect().height >= 64).map((b) => b.getBoundingClientRect().y))
      expect(ys.length >= 3, 'плитки найдены: ' + ys.length)
      expect.eq(ys.every((y) => y === 0), true, 'плитки на y=0: ' + ys)
    },
  },
  {
    name: 'toast: на экране 360 мобильная карточка ровно 328 (экран минус поля 16), на 375 — 343',
    story: TOAST,
    viewport: [360, 800],
    run: async ({ page, expect, step }) => {
      // мобильная форма кита — вариант `viewport: mobile`, а не медиазапрос
      await setArgs(page, { viewport: 'mobile' })
      await page.getByRole('button', { name: 'Показать тост' }).click()
      await page.waitForSelector('[data-slot=toast]')
      expect.eq((await box(page, '[data-slot=toast]')).w, 328, '360 − 2×16 = 328, как в мастере Size=Mobile')
      step('375')
      await page.setViewportSize({ width: 375, height: 800 })
      await page.waitForTimeout(300)
      expect.eq((await box(page, '[data-slot=toast]')).w, 343, '375 − 2×16')
    },
  },
]
