// Слой 4: живые истории Informer, TopFixedMessage, NPS и Sidebar. Компоненты только зовут onClose/onClick,
// а состояние держит история (Dismissible, NpsLive, DemoSidebar), поэтому сценарии проверяют и её проводку:
// видимость, aria-current, activeElement, строки состояния под компонентом.
// Таймер NPS идёт по фальшивым часам Playwright (page.clock), как в overlays-feedback.mjs.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
const OFF = '*,*::before,*::after{animation:none!important;transition:none!important}'
const load = async (page, story, args = '') => {
  await page.goto(`${new URL(page.url()).origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&args=${args}`)
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: OFF })
}
const withClock = async (page, ready) => {
  await page.clock.install()
  await page.reload()
  await page.waitForSelector(ready)
  await page.addStyleTag({ content: OFF })
  // фальшивые часы по умолчанию идут сами: без остановки срок таймера «плывёт» вместе с реальным временем прогона
  await page.clock.pauseAt(new Date(Date.now() + 5000))
}
// Часы принадлежат контексту браузера, а его делят сценарии одного воркера: остановленные часы замораживали бы
// таймеры (задержки тултипов) следующего сценария, поэтому после прогона их снова пускают.
const clocked = (run) => async (ctx) => {
  try { await run(ctx) } finally { await ctx.page.clock.resume().catch(() => {}) }
}
const count = (page, sel) => page.locator(sel).count()
const active = (page) => page.evaluate(() => {
  const e = document.activeElement
  return e && e !== document.body ? (e.getAttribute('aria-label') || e.textContent.trim()) : null
})
const inside = (page, sel) => page.evaluate((s) => !!document.activeElement?.closest(s), sel)
const status = (page, sel = '[data-slot=story-status]') => page.locator(sel).first().textContent()
const restore = (page) => page.getByRole('button', { name: 'Показать снова' })

// ---- Informer / TopFixedMessage: общая проверка закрытия
const closeMouse = (slot, cross) => async ({ page, expect, step }) => {
  await page.waitForSelector(`[data-slot=${slot}]`)
  expect.eq(await status(page), 'Закрыто раз: 0', 'сначала не закрывали')
  step('клик по крестику')
  await page.getByRole('button', { name: cross }).click()
  expect.eq(await count(page, `[data-slot=${slot}]`), 0, 'компонент убран')
  expect.eq(await status(page), 'Закрыто раз: 1', 'закрытие сосчитано')
  expect.eq(await restore(page).count(), 1, 'есть «Показать снова»')
  expect.eq(await active(page), 'Показать снова', 'фокус ушёл на «Показать снова», а не на body')
  step('показать снова мышью')
  await restore(page).click()
  expect.eq(await count(page, `[data-slot=${slot}]`), 1, 'компонент вернулся')
  expect.eq(await restore(page).count(), 0, 'кнопки возврата нет')
  expect.eq(await inside(page, `[data-slot=${slot}]`), true, 'фокус внутри вернувшегося компонента')
  step('закрыть второй раз')
  await page.getByRole('button', { name: cross }).click()
  expect.eq(await status(page), 'Закрыто раз: 2', 'второе закрытие сосчитано')
}

const INF = 'компоненты-informer--playground'
const TFM = 'компоненты-top-fixed-message--playground'
const NPS = 'компоненты-nps--playground'
const SBAR = 'компоненты-sidebar--playground'

// ---- NPS
const npsRate = (page, n) => page.getByRole('radio', { name: new RegExp(`^${n} из 5`) }).click()
const npsSubmit = (page) => page.getByRole('button', { name: 'Отправить' }).click()
const npsCard = (page) => count(page, '[data-slot=nps]')
const sentLine = (page) => status(page, '[data-slot=story-status-sent]')
const closedLine = (page) => status(page, '[data-slot=story-status-closed]')

// ---- Sidebar
const links = (page) => page.evaluate(() => [...document.querySelectorAll('[data-slot=sidebar-item]')]
  .filter((a) => a.getBoundingClientRect().width > 0 && a.getAttribute('aria-current') === 'page')
  .map((a) => a.getAttribute('aria-label') || a.textContent.trim()))
const activeLine = (page) => status(page)
const sbWidth = (page) => page.evaluate(() => Math.round(document.querySelector('[data-slot=sidebar]').getBoundingClientRect().width))
const tip = (page) => page.evaluate(() => [...document.querySelectorAll('[data-side][data-open]')].map((e) => e.textContent).filter(Boolean))

export default [
  {
    name: 'informer: крестик мышью убирает информер, фокус уходит на «Показать снова», возврат мышью возвращает информер и фокус в него; закрытия считаются',
    story: INF,
    run: closeMouse('informer', 'Закрыть'),
  },
  {
    name: 'informer: крестик закрывается с клавиатуры (Tab до крестика, Enter), «Показать снова» — пробелом; кнопки «Подписать» и «Отложить» информер не закрывают',
    story: INF,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=informer]')
      step('обычные кнопки')
      await page.getByRole('button', { name: 'Подписать' }).click()
      await page.getByRole('button', { name: 'Отложить' }).click()
      expect.eq(await count(page, '[data-slot=informer]'), 1, 'информер на месте')
      expect.eq(await status(page), 'Закрыто раз: 0', 'закрытий нет')
      step('Tab, Enter')
      await page.keyboard.press('Tab')
      expect.eq(await active(page), 'Закрыть', 'после «Отложить» — крестик')
      await page.keyboard.press('Enter')
      expect.eq(await count(page, '[data-slot=informer]'), 0, 'убран по Enter')
      expect.eq(await active(page), 'Показать снова', 'фокус на «Показать снова»')
      step('пробел')
      await page.keyboard.press('Space')
      expect.eq(await count(page, '[data-slot=informer]'), 1, 'вернулся по пробелу')
      expect.eq(await inside(page, '[data-slot=informer]'), true, 'фокус внутри информера')
      step('крестик пробелом')
      await page.getByRole('button', { name: 'Закрыть' }).focus()
      await page.keyboard.press('Space')
      expect.eq(await count(page, '[data-slot=informer]'), 0, 'убран по пробелу')
      expect.eq(await status(page), 'Закрыто раз: 2', 'два закрытия')
    },
  },
  {
    name: 'informer: Show Cross = False — крестика нет; контент (заголовок, кнопки) остаётся',
    story: INF,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'showCross:!false')
      await page.waitForSelector('[data-slot=informer]')
      expect.eq(await page.getByRole('button', { name: 'Закрыть' }).count(), 0, 'крестика нет')
      expect.eq(await page.getByRole('button', { name: 'Подписать' }).count(), 1, 'кнопка на месте')
    },
  },
  {
    name: 'top-fixed-message (десктоп): крестик мышью убирает сообщение, фокус на «Показать снова», возврат возвращает сообщение и фокус в него',
    story: TFM,
    run: closeMouse('top-fixed-message', 'Закрыть'),
  },
  {
    name: 'top-fixed-message (десктоп): «Подробнее» не закрывает; Tab до крестика и Enter закрывают, пробел на «Показать снова» возвращает',
    story: TFM,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=top-fixed-message]')
      await page.getByRole('button', { name: 'Подробнее' }).click()
      expect.eq(await count(page, '[data-slot=top-fixed-message]'), 1, '«Подробнее» не закрыло')
      step('Tab, Enter')
      await page.keyboard.press('Tab')
      expect.eq(await active(page), 'Закрыть', 'после «Подробнее» — крестик')
      await page.keyboard.press('Enter')
      expect.eq(await count(page, '[data-slot=top-fixed-message]'), 0, 'убрано по Enter')
      expect.eq(await active(page), 'Показать снова', 'фокус на «Показать снова»')
      step('пробел')
      await page.keyboard.press('Space')
      expect.eq(await count(page, '[data-slot=top-fixed-message]'), 1, 'вернулось по пробелу')
      expect.eq(await status(page), 'Закрыто раз: 1', 'одно закрытие')
    },
  },
  {
    name: 'top-fixed-message (мобильная форма): вместо крестика кнопка «Закрыть», она убирает сообщение; без Show Icon Close закрывающего элемента нет',
    story: TFM,
    viewport: [375, 800],
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'viewport:mobile')
      await page.waitForSelector('[data-slot=top-fixed-message]')
      expect.eq(await count(page, '[data-slot=close-cross]'), 0, 'крестика на мобайле нет')
      await page.getByRole('button', { name: 'Закрыть' }).click()
      expect.eq(await count(page, '[data-slot=top-fixed-message]'), 0, 'убрано кнопкой «Закрыть»')
      expect.eq(await status(page), 'Закрыто раз: 1', 'закрытие сосчитано')
      await restore(page).click()
      expect.eq(await count(page, '[data-slot=top-fixed-message]'), 1, 'вернулось')
      step('Show Icon Close = False')
      await load(page, story, 'viewport:mobile;showIconClose:!false')
      await page.waitForSelector('[data-slot=top-fixed-message]')
      expect.eq(await page.getByRole('button', { name: 'Закрыть' }).count(), 0, 'кнопки «Закрыть» нет')
    },
  },
  {
    name: 'nps: оценка кликом попадает в onValueChange; стартовая оценка из контрола раскрывает форму; отправка без оценки невозможна',
    story: NPS,
    run: async ({ page, expect, step, story }) => {
      await page.waitForSelector('[data-slot=nps]')
      expect.eq(await status(page, '[data-slot=story-status-rating]'), 'Оценка: нет', 'оценки нет')
      step('клик по 4')
      await npsRate(page, 4)
      expect.eq(await status(page, '[data-slot=story-status-rating]'), 'Оценка: 4', 'оценка дошла до колбэка')
      expect.eq(await page.getByRole('radio', { name: /^4 из 5/ }).getAttribute('aria-checked'), 'true', '4 выбрана')
      expect.eq(await page.evaluate(() => !document.querySelector('[data-slot=nps] [inert]')), true, 'форма раскрыта')
      step('оценка из контрола')
      // числовой аргумент из URL Storybook отбрасывает (не строка из options) — шлём по каналу, как панель контролов
      await page.evaluate(() => window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: new URLSearchParams(location.search).get('id'), updatedArgs: { estimateType: 2 } }))
      await wait(page, () => document.querySelector('[role=radio][aria-checked=true]')?.getAttribute('aria-label')?.startsWith('2 из 5'), null, 'выбрана 2')
      expect.eq(await page.getByRole('radio', { name: /^2 из 5/ }).getAttribute('aria-checked'), 'true', 'выбрана 2')
      step('без оценки')
      await load(page, story)
      expect.eq(await page.locator('button:has-text("Отправить")').evaluate((b) => !!b.closest('[inert]')), true, '«Отправить» недоступна (inert)')
      expect.eq(await sentLine(page), 'Не отправлено', 'ничего не отправлено')
    },
  },
  {
    name: 'nps: чип выбирает один ответ и ставит его текст в комментарий, второй чип заменяет первый, правка руками снимает выбор, повторный клик возвращает',
    story: NPS,
    run: async ({ page, expect, step }) => {
      await npsRate(page, 2)
      const chips = page.locator('[data-slot=filter-table]')
      const pressed = () => page.evaluate(() => [...document.querySelectorAll('[data-slot=filter-table][aria-pressed=true]')].map((c) => c.textContent))
      step('чип')
      await chips.nth(1).click()
      expect.eq(await pressed(), ['Непонятно'], 'нажат один чип')
      expect.eq(await page.locator('textarea').inputValue(), 'Непонятно', 'текст в комментарии')
      step('другой чип')
      await chips.nth(2).click()
      expect.eq(await pressed(), ['Неудобно подписывать'], 'выбор сменился')
      expect.eq(await page.locator('textarea').inputValue(), 'Неудобно подписывать', 'комментарий заменён')
      step('правка руками')
      await page.locator('textarea').fill('свой текст')
      expect.eq(await pressed(), [], 'выбор снят')
      step('вернуться к чипу')
      await chips.nth(2).click()
      expect.eq(await pressed(), ['Неудобно подписывать'], 'чип снова выбран')
      expect.eq(await page.locator('textarea').inputValue(), 'Неудобно подписывать', 'текст чипа вернулся в поле')
    },
  },
  {
    name: 'nps: отправка — onSubmit получает оценку и обрезанный комментарий, карточка сменяется «Спасибо за оценку», фокус на её заголовке, строка про автозакрытие есть',
    story: NPS,
    run: async ({ page, expect, step }) => {
      await npsRate(page, 5)
      expect.eq(await page.getByText('Что понравилось больше всего?').count(), 1, 'у пятёрки другой вопрос')
      step('комментарий и отправка')
      await page.locator('textarea').fill('  Всё удобно  ')
      await npsSubmit(page)
      expect.eq(await sentLine(page), 'Отправлено: 5, «Всё удобно»', 'onSubmit: оценка и комментарий без пробелов по краям')
      const text = await page.locator('[data-slot=nps]').textContent()
      expect(text.includes('Спасибо за оценку'), 'показано «Спасибо за оценку»')
      expect(text.includes('Окно закроется автоматически'), 'есть строка про автозакрытие')
      expect.eq(await page.locator('[role=radio]').count(), 0, 'звёзд нет')
      expect.eq(await active(page), 'Спасибо за оценку', 'фокус на заголовке нового состояния, не на body')
      step('крестик после отправки')
      await page.getByRole('button', { name: 'Закрыть' }).click()
      expect.eq(await npsCard(page), 0, 'карточка убрана')
      expect.eq(await closedLine(page), 'Закрыто раз: 1', 'закрытие сосчитано')
    },
  },
  {
    name: 'nps: автозакрытие — через 2 с после «Спасибо за оценку» вызывается onClose (не раньше), карточка убирается, фокус на «Показать снова», возврат даёт чистую форму',
    story: NPS,
    run: clocked(async ({ page, expect, step }) => {
      await withClock(page, '[data-slot=nps]')
      await npsRate(page, 3)
      await page.locator('textarea').fill('текст')
      await npsSubmit(page)
      expect.eq(await npsCard(page), 1, 'карточка «Спасибо» на месте')
      step('1,9 с')
      await page.clock.runFor(1900)
      expect.eq(await npsCard(page), 1, 'через 1,9 с ещё жива')
      expect.eq(await closedLine(page), 'Закрыто раз: 0', 'onClose ещё не звали')
      step('2,1 с')
      await page.clock.runFor(200)
      expect.eq(await npsCard(page), 0, 'через 2,1 с убрана')
      expect.eq(await closedLine(page), 'Закрыто раз: 1', 'onClose позван один раз')
      expect.eq(await active(page), 'Показать снова', 'фокус на «Показать снова»')
      await page.clock.runFor(10000)
      expect.eq(await closedLine(page), 'Закрыто раз: 1', 'таймер не срабатывает повторно')
      step('показать снова')
      await restore(page).click()
      expect.eq(await page.locator('[role=radio][aria-checked=true]').count(), 0, 'оценки нет')
      expect.eq(await page.locator('textarea').inputValue(), '', 'комментарий пуст')
      expect.eq(await sentLine(page), 'Не отправлено', 'отправка сброшена')
    }),
  },
  {
    name: 'nps: autoCloseMs задаёт срок (30 с), 0 отключает автозакрытие и строку «Окно закроется автоматически»; submitted из контрола тоже закрывается по таймеру',
    story: NPS,
    run: clocked(async ({ page, expect, step, story }) => {
      step('30 с')
      await load(page, story, 'autoCloseMs:30000;submitted:!true')
      await withClock(page, '[data-slot=nps]')
      await page.clock.runFor(20000)
      expect.eq(await npsCard(page), 1, 'через 20 с жива')
      await page.clock.runFor(20000)
      expect.eq(await npsCard(page), 0, 'через 40 с закрыта')
      step('0 — без таймера')
      await load(page, story, 'autoCloseMs:0;submitted:!true')
      await withClock(page, '[data-slot=nps]')
      await page.clock.runFor(30000)
      expect.eq(await npsCard(page), 1, 'через 30 с жива')
      expect.eq((await page.locator('[data-slot=nps]').textContent()).includes('Окно закроется автоматически'), false, 'строки нет')
      expect.eq(await closedLine(page), 'Закрыто раз: 0', 'onClose не звали')
    }),
  },
  {
    name: 'nps: крестик на форме закрывает сразу (с мыши и Enter с клавиатуры) без автозакрытия; возврат даёт чистую карточку с фокусом на крестике',
    story: NPS,
    run: async ({ page, expect, step }) => {
      await npsRate(page, 4)
      await page.locator('textarea').fill('черновик')
      step('мышь')
      await page.getByRole('button', { name: 'Закрыть' }).click()
      expect.eq(await npsCard(page), 0, 'убрана')
      expect.eq(await closedLine(page), 'Закрыто раз: 1', 'закрытие сосчитано')
      expect.eq(await active(page), 'Показать снова', 'фокус на «Показать снова»')
      step('возврат клавиатурой')
      await page.keyboard.press('Enter')
      expect.eq(await npsCard(page), 1, 'карточка вернулась')
      expect.eq(await page.locator('textarea').inputValue(), '', 'черновика нет')
      expect.eq(await active(page), 'Закрыть', 'фокус на крестике карточки')
      step('Enter на крестике')
      await page.keyboard.press('Enter')
      expect.eq(await npsCard(page), 0, 'убрана по Enter')
      expect.eq(await closedLine(page), 'Закрыто раз: 2', 'два закрытия')
    },
  },
  {
    name: 'sidebar: клик по пункту переносит active — aria-current только у выбранного, строка состояния совпадает',
    story: SBAR,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=sidebar-item]')
      expect.eq(await links(page), ['Главная'], 'сначала активна «Главная»')
      expect.eq(await activeLine(page), 'Активный пункт: Главная', 'строка состояния')
      step('клик по «Карты»')
      await page.getByRole('link', { name: 'Карты' }).click()
      expect.eq(await links(page), ['Карты'], 'активна только «Карты»')
      expect.eq(await activeLine(page), 'Активный пункт: Карты', 'строка состояния')
      step('клик по активной')
      await page.getByRole('link', { name: 'Карты' }).click()
      expect.eq(await links(page), ['Карты'], 'повторный клик не снимает active')
      step('клик по «Настройки»')
      await page.getByRole('link', { name: 'Настройки' }).click()
      expect.eq(await links(page), ['Настройки'], 'active переехал')
    },
  },
  {
    name: 'sidebar: с клавиатуры — Tab до пункта и Enter переносят active, фокус остаётся на пункте',
    story: SBAR,
    run: async ({ page, expect }) => {
      await page.getByRole('link', { name: 'Главная' }).focus()
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      expect.eq(await active(page), 'Карты', 'Tab через «Платежи» на «Карты»')
      await page.keyboard.press('Enter')
      expect.eq(await links(page), ['Карты'], 'Enter сделал «Карты» активной')
      expect.eq(await active(page), 'Карты', 'фокус остался на пункте')
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Enter')
      expect.eq(await links(page), ['Главная'], 'Enter на «Главная»')
    },
  },
  {
    name: 'sidebar: вложенный пункт группы становится активным, группа подсвечивается, при выборе внешнего пункта подсветка группы уходит; State: Active = False — активного нет',
    story: SBAR,
    run: async ({ page, expect, step, story }) => {
      const groupActive = () => page.locator('[data-slot=sidebar-group-trigger]').getAttribute('data-active')
      await page.locator('[data-slot=sidebar-group-trigger]').click()
      await page.getByRole('link', { name: 'СБП', exact: true }).click()
      expect.eq(await links(page), ['СБП'], 'активен вложенный «СБП»')
      expect.eq(await groupActive(), 'true', 'группа подсвечена')
      expect.eq(await activeLine(page), 'Активный пункт: СБП', 'строка состояния')
      step('внешний пункт')
      await page.getByRole('link', { name: 'Главная' }).click()
      expect.eq(await links(page), ['Главная'], 'active вернулся')
      expect.eq(await groupActive(), null, 'подсветка группы ушла')
      step('без активного')
      await load(page, story, 'activeItem:!false')
      await page.waitForSelector('[data-slot=sidebar-item]')
      expect.eq(await links(page), [], 'aria-current нет ни у кого')
      expect.eq(await activeLine(page), 'Активный пункт: нет', 'строка состояния')
      await page.getByRole('link', { name: 'Настройки' }).click()
      expect.eq(await links(page), ['Настройки'], 'клик назначил active')
    },
  },
  {
    name: 'sidebar (свёрнутая): клик по иконке меняет active без раскрытия панели, подпись — в тултипе по наведению, aria-label у иконки',
    story: SBAR,
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'defaultOpen:!false')
      await page.waitForSelector('[data-slot=sidebar]')
      expect.eq(await links(page), ['Главная'], 'active виден и в свёрнутой')
      step('наведение')
      await page.getByRole('link', { name: 'Настройки' }).hover()
      await wait(page, () => [...document.querySelectorAll('[data-side][data-open]')].some((e) => e.textContent === 'Настройки'), null, 'тултип «Настройки»')
      step('клик')
      await page.getByRole('link', { name: 'Настройки' }).click()
      expect.eq(await links(page), ['Настройки'], 'active переехал')
      expect.eq(await activeLine(page), 'Активный пункт: Настройки', 'строка состояния')
      expect(await sbWidth(page) < 100, 'панель осталась свёрнутой: ' + await sbWidth(page))
      await page.mouse.move(900, 700)
      await wait(page, () => !document.querySelector('[data-side][data-open]'), null, 'тултип закрылся')
      expect.eq(await tip(page), [], 'тултипов нет')
    },
  },
  {
    name: 'sidebar (свёрнутая): клик по группе разворачивает панель и раскрывает группу, вложенные видны, фокус переезжает на новый заголовок группы',
    story: SBAR,
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'defaultOpen:!false')
      await page.waitForSelector('[data-slot=sidebar]')
      step('клик по «Платежи»')
      await page.getByRole('button', { name: 'Платежи' }).click()
      await wait(page, () => document.querySelector('[data-slot=sidebar]').getBoundingClientRect().width > 200, null, 'разворачивание панели')
      const g = page.locator('[data-slot=sidebar-group-trigger]')
      expect.eq(await g.getAttribute('aria-expanded'), 'true', 'группа раскрыта')
      expect.eq(await page.getByRole('link', { name: 'QR-коды СБП' }).count(), 1, 'вложенные видны')
      expect.eq(await active(page), 'Платежи', 'фокус на заголовке группы')
      step('выбрать вложенный')
      await page.getByRole('link', { name: 'QR-коды СБП' }).click()
      expect.eq(await links(page), ['QR-коды СБП'], 'вложенный активен')
      expect.eq(await activeLine(page), 'Активный пункт: QR-коды СБП', 'строка состояния')
    },
  },
]
