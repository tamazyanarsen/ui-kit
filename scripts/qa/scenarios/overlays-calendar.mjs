// Слой 4: Calendar — выбор дня, «Применить»/«Сбросить», навигация по месяцам и годам, диапазон, недоступные дни, клавиатура, лист на 375.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
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
    name: 'calendar: день и «Применить» — выделение переезжает, «Сбросить» снимает его',
    story: CAL,
    run: async ({ page, expect, step }) => {
      await wait(page, () => !!document.querySelector('[data-selected=true]'), null, 'начальное выделение')
      expect.eq(await selected(page), ['2024-1-15'], 'начальное значение')
      step('выбрать 20-е')
      await day(page, 20).click()
      expect.eq(await selected(page), ['2024-1-20'], 'новое выделение')
      await page.getByRole('button', { name: 'Применить' }).click()
      expect.eq(await selected(page), ['2024-1-20'], 'после «Применить»')
      step('Сбросить')
      await page.getByRole('button', { name: 'Сбросить' }).click()
      expect.eq(await selected(page), [], 'выделения нет')
    },
  },
  {
    name: 'calendar: стрелки «Назад/Вперёд» листают месяцы, выбранный день возвращается при возврате',
    story: CAL,
    run: async ({ page, expect, step }) => {
      step('вперёд')
      await page.getByRole('button', { name: 'Вперёд' }).click()
      expect.eq(await title(page), 'Февраль 2024', 'февраль')
      expect.eq(await selected(page), [], 'в феврале выбранного нет')
      step('назад дважды')
      await page.getByRole('button', { name: 'Назад' }).click()
      await page.getByRole('button', { name: 'Назад' }).click()
      expect.eq(await title(page), 'Декабрь 2023', 'декабрь 2023 — год перешёл')
      await page.getByRole('button', { name: 'Вперёд' }).click()
      expect.eq(await selected(page), ['2024-1-15'], 'выбранный день на месте')
    },
  },
  {
    name: 'calendar: клавиатура — стрелки, Home/End, PageDown, Enter выбирает день',
    story: CAL,
    run: async ({ page, expect, step }) => {
      await day(page, 3).click()
      step('стрелки')
      await page.keyboard.press('ArrowRight')
      expect.eq(await activeDate(page), '2024-1-4', 'вправо')
      await page.keyboard.press('ArrowDown')
      expect.eq(await activeDate(page), '2024-1-11', 'вниз — неделя')
      await page.keyboard.press('ArrowLeft')
      expect.eq(await activeDate(page), '2024-1-10', 'влево')
      await page.keyboard.press('ArrowUp')
      expect.eq(await activeDate(page), '2024-1-3', 'вверх')
      step('Home/End')
      await page.keyboard.press('Home')
      expect.eq(await activeDate(page), '2024-1-1', 'Home — понедельник недели')
      await page.keyboard.press('End')
      expect.eq(await activeDate(page), '2024-1-7', 'End — воскресенье недели')
      step('PageDown и Enter')
      await page.keyboard.press('PageDown')
      expect.eq(await activeDate(page), '2024-2-7', 'PageDown — месяц вперёд')
      await page.keyboard.press('Enter')
      expect.eq(await selected(page), ['2024-2-7'], 'Enter выбрал день')
    },
  },
  {
    name: 'calendar: клавиатура — стрелка вправо с конца месяца переходит на следующий месяц',
    story: CAL,
    run: async ({ page, expect }) => {
      await day(page, 31).click()
      await page.keyboard.press('ArrowRight')
      expect.eq(await activeDate(page), '2024-2-1', 'фокус на 1 февраля')
      expect.eq(await title(page), 'Февраль 2024', 'заголовок сменился')
    },
  },
  {
    name: 'calendar: клик по месяцу и году в заголовке открывает сетки, выбор возвращает к дням',
    story: CAL,
    run: async ({ page, expect, step }) => {
      step('месяц')
      await page.getByRole('button', { name: 'Январь', exact: true }).click()
      expect.eq(await page.locator('[aria-pressed]').count(), 12, 'сетка из 12 месяцев')
      await page.getByRole('button', { name: 'Мар', exact: true }).click()
      expect.eq(await title(page), 'Март 2024', 'вернулись к дням марта')
      expect.eq(await page.locator('[data-slot=calendar-day]').first().getAttribute('data-date'), '2024-3-1', 'дни марта')
      step('год')
      await page.getByRole('button', { name: '2024', exact: true }).click()
      await page.getByRole('button', { name: '2022', exact: true }).click()
      expect.eq(await page.locator('[aria-pressed]').count(), 12, 'после года — сетка месяцев 2022')
    },
  },
  {
    name: 'calendar: диапазон — два дня выделяют отрезок, третий щелчок начинает новый',
    story: CAL,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'mode:range')
      // у концов диапазона нет атрибута выбора, различаем их по заливке кнопки
      const bg = (d) => day(page, d).evaluate((e) => getComputedStyle(e).backgroundColor)
      const selBg = await bg(10)
      expect(selBg !== (await bg(12)), 'начало диапазона залито иначе, чем день внутри')
      expect.eq(await bg(20), selBg, 'конец диапазона залит как начало')
      await day(page, 5).click()
      await day(page, 8).click()
      expect.eq(await bg(5), selBg, 'новое начало залито')
      expect.eq(await bg(8), selBg, 'новый конец залит')
      expect(selBg !== (await bg(10)), 'старое начало сброшено')
    },
  },
  {
    name: 'calendar: недоступные дни (выходные) не выбираются, будни выбираются',
    story: CAL,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'disabledDate:weekends')
      await day(page, 6).click({ force: true })
      expect.eq(await selected(page), ['2024-1-15'], 'суббота не выбралась')
      await day(page, 10).click()
      expect.eq(await selected(page), ['2024-1-10'], 'среда выбралась')
    },
  },
  {
    name: 'calendar: мобильный лист 375 — тап по дню, «Применить», «Сбросить» и «Закрыть» работают',
    story: CAL,
    viewport: [375, 800],
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'layout:sheet')
      expect.eq(await page.getByRole('heading', { name: 'Выберите дату' }).count(), 1, 'заголовок листа')
      step('тап по 20 января')
      await day(page, 20).click()
      expect.eq(await selected(page), ['2024-1-20'], 'выделен')
      await page.getByRole('button', { name: 'Применить' }).click()
      expect.eq(await selected(page), ['2024-1-20'], 'остался после «Применить»')
      step('Сбросить')
      await page.getByRole('button', { name: 'Сбросить' }).click()
      expect.eq(await selected(page), [], 'снято')
      expect.eq(await page.getByRole('button', { name: 'Закрыть' }).count(), 1, 'кнопка «Закрыть» есть')
    },
  },
]
