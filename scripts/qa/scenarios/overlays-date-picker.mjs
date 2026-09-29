// Слой 4: DatePicker — набор даты, открытие, выбор дня, «Применить»/«Сбросить», диапазон, месяц/год, disabled на лету.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 15000 }).catch(() => { throw new Error('не дождались: ' + what) })
const load = async (page, story, args, viewport) => {
  if (viewport) await page.setViewportSize({ width: viewport[0], height: viewport[1] })
  await page.goto(`${new URL(page.url()).origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&args=${args}`)
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
}
const DP = 'компоненты-date-picker--playground'
const CAL = 'компоненты-calendar--playground'
const INPUT = 'input[data-slot=input]'
const day = (page, d, m = 1, y = 2024) => page.locator(`[data-date="${y}-${m}-${d}"]`)
const isOpen = (page) => page.evaluate((s) => document.querySelector(s).getAttribute('aria-expanded') === 'true', INPUT)
const openWait = (page) => wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true' && !!document.querySelector('[role=dialog]'), INPUT, 'открытие календаря')
const closeWait = (page) => wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'false' && !document.querySelector('[role=dialog]'), INPUT, 'закрытие календаря')
// значение поля дописывается эффектом уже после клика, поэтому ждём, пока оно перестанет меняться
// ждём известное ожидаемое значение поля, а не «пока перестанет меняться»
const valIs = async (page, want, msg) => {
  await wait(page, ([sel, w]) => document.querySelector(sel).value === w, [INPUT, want], msg + ' (ждали «' + want + '»)')
}
const val = async (page) => {
  let prev = await page.locator(INPUT).inputValue()
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(60)
    const cur = await page.locator(INPUT).inputValue()
    if (cur === prev) return cur
    prev = cur
  }
  return prev
}
// фокус в поле ввода (после закрытия Base UI возвращает его отдельным шагом)
const focusInInput = (page) => wait(page, (s) => document.activeElement === document.querySelector(s), INPUT, 'фокус в поле')
const selected = (page) => page.evaluate(() => [...document.querySelectorAll('[data-selected=true]')].map((b) => b.dataset.date))
const activeDate = (page) => page.evaluate(() => document.activeElement?.dataset?.date ?? document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent)
const title = (page) => page.evaluate(() => [...document.querySelectorAll('[data-slot=calendar] > div:first-child [data-slot=button]')].filter((b) => !b.getAttribute('aria-label')).map((b) => b.textContent).join(' '))

export default [
  {
    name: 'date-picker: клик по полю открывает календарь на выбранной дате, фокус остаётся в поле',
    story: DP,
    run: async ({ page, expect, step }) => {
      step('клик')
      await page.locator(INPUT).click()
      await openWait(page)
      expect.eq(await selected(page), ['2024-1-15'], 'выбран день из значения')
      expect.eq(await title(page), 'Январь 2024', 'заголовок')
      expect.eq(await page.evaluate((s) => document.activeElement === document.querySelector(s), INPUT), true, 'фокус в поле')
    },
  },
  {
    name: 'date-picker: значок календаря открывает и закрывает попап',
    story: DP,
    run: async ({ page, expect, step }) => {
      const icon = page.getByRole('button', { name: 'Открыть календарь' })
      step('открыть значком')
      await icon.click()
      await openWait(page)
      step('закрыть значком')
      await icon.click()
      await closeWait(page)
      expect.eq(await val(page), '15.01.2024', 'значение не менялось')
    },
  },
  {
    name: 'date-picker: день + «Применить» меняет значение, закрывает попап и возвращает фокус в поле',
    story: DP,
    run: async ({ page, expect, step }) => {
      await page.locator(INPUT).click()
      await openWait(page)
      step('выбрать 20-е')
      await day(page, 20).click()
      expect.eq(await val(page), '15.01.2024', 'до «Применить» значение прежнее')
      expect.eq(await selected(page), ['2024-1-20'], 'выделен новый день')
      step('Применить')
      await page.getByRole('button', { name: 'Применить' }).click()
      await closeWait(page)
      await valIs(page, '20.01.2024', 'значение')
      await focusInInput(page)
    },
  },
  {
    name: 'date-picker: Esc закрывает без применения выбранного дня и возвращает фокус в поле',
    story: DP,
    run: async ({ page, expect, step }) => {
      await page.locator(INPUT).click()
      await openWait(page)
      await day(page, 20).click()
      step('Esc')
      await page.keyboard.press('Escape')
      await closeWait(page)
      expect.eq(await val(page), '15.01.2024', 'значение прежнее')
      await focusInInput(page)
      step('открыть снова — выделено прежнее значение')
      await page.locator(INPUT).click()
      await openWait(page)
      expect.eq(await selected(page), ['2024-1-15'], 'выбран прежний день')
    },
  },
  {
    name: 'date-picker: «Сбросить» очищает поле, календарь остаётся открытым',
    story: DP,
    run: async ({ page, expect, step }) => {
      await page.locator(INPUT).click()
      await openWait(page)
      step('Сбросить')
      await page.getByRole('button', { name: 'Сбросить' }).click()
      await valIs(page, '', 'поле пусто')
      expect.eq(await selected(page), [], 'выделения нет')
      expect.eq(await isOpen(page), true, 'календарь открыт')
    },
  },
  {
    name: 'date-picker: набор даты с клавиатуры переводит календарь на этот месяц и выделяет день',
    story: DP,
    run: async ({ page, expect, step }) => {
      const inp = page.locator(INPUT)
      await inp.click()
      await openWait(page)
      step('набрать 01.02.2025')
      await inp.fill('')
      await inp.pressSequentially('01022025')
      await valIs(page, '01.02.2025', 'маска')
      await wait(page, () => document.querySelector('[data-selected=true]')?.dataset.date === '2025-2-1', null, 'выделение набранного дня')
      expect.eq(await title(page), 'Февраль 2025', 'заголовок переведён')
      expect.eq(await isOpen(page), true, 'календарь остался открыт')
    },
  },
  {
    name: 'date-picker: несуществующая дата 31.02.2024 не выделяет день, при уходе из поля поле очищается',
    story: DP,
    run: async ({ page, expect, step }) => {
      const inp = page.locator(INPUT)
      await inp.click()
      await openWait(page)
      step('набрать 31.02.2024')
      await inp.fill('')
      await inp.pressSequentially('31022024')
      expect.eq(await selected(page), [], 'день в календаре не выделен')
      step('щелчок мимо')
      await page.mouse.click(5, 5)
      await closeWait(page)
      await valIs(page, '', 'в поле нет несуществующей даты')
    },
  },
  {
    name: 'date-picker: стрелка вниз уводит фокус на день, Esc возвращает его в поле и закрывает',
    story: DP,
    run: async ({ page, expect, step }) => {
      await page.locator(INPUT).focus()
      step('ArrowDown в закрытом поле')
      await page.keyboard.press('ArrowDown')
      await openWait(page)
      await page.keyboard.press('ArrowDown').catch(() => {})
      const onDay = await page.evaluate(() => document.activeElement?.dataset?.slot === 'calendar-day' || document.activeElement?.getAttribute('data-slot') === 'calendar-day')
      expect.eq(onDay, true, 'фокус на дне календаря')
      step('Esc')
      await page.keyboard.press('Escape')
      await closeWait(page)
      await focusInInput(page)
    },
  },
  {
    name: 'date-picker: Tab из календаря идёт по кнопкам «Сбросить» и «Применить»',
    story: DP,
    run: async ({ page, expect, step }) => {
      await page.locator(INPUT).click()
      await openWait(page)
      await page.keyboard.press('ArrowDown')
      step('Tab до подвала')
      const seen = []
      for (let i = 0; i < 2; i++) {
        await page.keyboard.press('Tab')
        seen.push(await page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label')))
      }
      expect(seen.includes('Сбросить') && seen.includes('Применить'), 'в обходе есть обе кнопки подвала: ' + seen.join(','))
      expect.eq(await isOpen(page), true, 'календарь ещё открыт')
    },
  },
  {
    name: 'date-picker: диапазон — два щелчка, обратный порядок выравнивается, «Применить» записывает в поле',
    story: DP,
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'mode:range')
      await valIs(page, '10.01.2024 — 20.01.2024', 'начальный диапазон')
      await page.locator(INPUT).click()
      await openWait(page)
      step('20 затем 12')
      await day(page, 20).click()
      await day(page, 12).click()
      step('Применить')
      await page.getByRole('button', { name: 'Применить' }).click()
      await closeWait(page)
      await valIs(page, '12.01.2024 — 20.01.2024', 'диапазон выровнен по возрастанию')
    },
  },
  {
    name: 'date-picker: месяц — выбор «Мар» и «Применить» пишут «Март 2026»',
    story: DP,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'mode:month')
      await page.locator(INPUT).click()
      await openWait(page)
      await page.getByRole('button', { name: 'Мар', exact: true }).click()
      await page.getByRole('button', { name: 'Применить' }).click()
      await closeWait(page)
      await valIs(page, 'Март 2026', 'значение')
    },
  },
  {
    name: 'date-picker: год — выбор 2022 и «Применить» пишут «2022»',
    story: DP,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'mode:year')
      await page.locator(INPUT).click()
      await openWait(page)
      await page.getByRole('button', { name: '2022', exact: true }).click()
      await page.getByRole('button', { name: 'Применить' }).click()
      await closeWait(page)
      await valIs(page, '2022', 'значение')
    },
  },
  {
    name: 'date-picker: без подвала выбор дня сразу меняет значение',
    story: DP,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'footer:!false')
      await page.locator(INPUT).click()
      await openWait(page)
      expect.eq(await page.getByRole('button', { name: 'Применить' }).count(), 0, 'подвала нет')
      await day(page, 20).click()
      await valIs(page, '20.01.2024', 'значение сразу')
    },
  },
  {
    name: 'date-picker: disabled не открывается мышью и клавиатурой; снятие disabled на лету возвращает открытие',
    story: DP,
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'state:disabled')
      const inp = page.locator(INPUT)
      await inp.click({ force: true })
      await page.keyboard.press('ArrowDown')
      await page.getByRole('button', { name: 'Открыть календарь' }).click({ force: true }).catch(() => {})
      expect.eq(await isOpen(page), false, 'не открылся')
      expect.eq(await page.locator('[role=dialog]').count(), 0, 'диалога нет')
      step('включить на лету')
      await page.evaluate(() => {
        const id = new URLSearchParams(location.search).get('id')
        window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: { state: 'default' } })
      })
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-disabled') !== 'true', INPUT, 'снятие disabled')
      await inp.click()
      await openWait(page)
    },
  },
  {
    name: 'date-picker: выключение на лету при открытом календаре закрывает его и не открывает сам после включения',
    story: DP,
    run: async ({ page, expect, step }) => {
      const set = (state) => page.evaluate((s) => {
        const id = new URLSearchParams(location.search).get('id')
        window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: { state: s } })
      }, state)
      await page.locator(INPUT).click()
      await openWait(page)
      step('disabled')
      await set('disabled')
      await closeWait(page)
      step('обратно')
      await set('default')
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-disabled') !== 'true', INPUT, 'снятие disabled')
      expect.eq(await isOpen(page), false, 'сам не открылся')
    },
  },
  {
    name: 'date-picker на 375: календарь открывается целиком в пределах экрана',
    story: DP,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await page.locator(INPUT).click()
      await openWait(page)
      const r = await page.evaluate(() => { const b = document.querySelector('[role=dialog]').getBoundingClientRect(); return [b.left, b.right, b.top, b.bottom] })
      expect(r[0] >= 0 && r[1] <= 375, 'по ширине в экране: ' + r)
      expect(r[3] <= 800, 'по высоте в экране: ' + r)
      await day(page, 20).click()
      await page.getByRole('button', { name: 'Применить' }).click()
      await closeWait(page)
      await valIs(page, '20.01.2024', 'значение')
    },
  },
]
