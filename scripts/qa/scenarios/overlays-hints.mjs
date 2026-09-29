// Слой 4: Hint и Tooltip — наведение, фокус, клик, Esc, направления, disabled.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
// Базовый UI ставит и снимает блокировку прокрутки через setTimeout(0) и кадр — даём хвостам отработать
const settle = (page) => page.evaluate(() => new Promise((res) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 30))), 30)))
const MODAL = 'компоненты-modal--playground'
const MODALS = 'компоненты-modal--examples'
const dlgOpen = (page) => wait(page, () => { const d = document.querySelector('[role=dialog]'); return !!d && d.getBoundingClientRect().width > 0 }, null, 'открытие диалога')
const dlgGone = (page) => wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие диалога')
const pageUnlocked = (page) => wait(page, () => getComputedStyle(document.body).overflow !== 'hidden' && document.body.style.paddingRight === '' && document.documentElement.style.getPropertyValue('--scroll-lock-gap') === '', null, 'снятие блокировки прокрутки страницы')
const pageLocked = (page) => wait(page, () => getComputedStyle(document.body).overflow === 'hidden', null, 'блокировка прокрутки страницы')
const activeIn = (page) => page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))
const activeName = (page) => page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim().slice(0, 30))
const trigger = (page, name) => page.getByRole('button', { name, exact: true })
const focusBack = (page, name) => wait(page, (n) => document.activeElement?.textContent?.trim() === n, name, 'фокус вернулся на «' + name + '»')
const rect = (page, sel) => page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height } }, sel)
// вывести всплывающий слой: ждём, когда он появится и получит размер
const popRect = async (page, sel) => {
  await wait(page, (s) => { const e = document.querySelector(s); return !!e && e.getBoundingClientRect().width > 0 }, sel, 'появление ' + sel)
  await settle(page)
  return rect(page, sel)
}
const centerOf = (r) => ({ x: (r.l + r.r) / 2, y: (r.t + r.b) / 2 })

export default [
  {
    name: 'hint: щелчок открывает подсказку с фокусом на «Закрыть», второй щелчок по кнопке закрывает',
    story: 'компоненты-hint--playground',
    run: async ({ page, expect, step }) => {
      const t = page.locator('[data-slot=button][aria-haspopup]').first()
      step('открыть')
      await t.click()
      await dlgOpen(page)
      expect.eq(await t.getAttribute('aria-expanded'), 'true', 'aria-expanded')
      await wait(page, () => document.activeElement?.getAttribute('aria-label') === 'Закрыть', null, 'фокус на «Закрыть»')
      step('второй щелчок')
      await t.click()
      await dlgGone(page)
      expect.eq(await t.getAttribute('aria-expanded'), 'false', 'aria-expanded снят')
    },
  },
  {
    name: 'hint: Esc и крестик закрывают подсказку, фокус возвращается на кнопку',
    story: 'компоненты-hint--playground',
    run: async ({ page, expect, step }) => {
      const t = page.locator('[data-slot=button][aria-haspopup]').first()
      step('Esc')
      await t.click()
      await dlgOpen(page)
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await wait(page, () => document.activeElement?.getAttribute('aria-haspopup') === 'dialog', null, 'фокус на кнопке после Esc')
      step('крестик')
      await t.click()
      await dlgOpen(page)
      await page.getByRole('button', { name: 'Закрыть' }).click()
      await dlgGone(page)
      await wait(page, () => document.activeElement?.getAttribute('aria-haspopup') === 'dialog', null, 'фокус на кнопке после крестика')
      expect.eq(await page.evaluate(() => getComputedStyle(document.body).overflow), 'visible', 'страница не заблокирована')
    },
  },
  {
    name: 'hint: щелчок вне подсказки закрывает её; открытие второй подсказки закрывает первую',
    story: 'компоненты-hint--examples',
    run: async ({ page, expect, step }) => {
      const t = (n) => page.getByRole('button', { name: n, exact: true })
      step('вне подсказки')
      await t('top-left').click()
      await dlgOpen(page)
      await page.mouse.click(1270, 890)
      await dlgGone(page)
      step('вторая подсказка')
      await t('top-left').click()
      await dlgOpen(page)
      await t('down-center').click()
      await wait(page, () => document.querySelectorAll('[role=dialog]').length === 1 && document.querySelector('[role=dialog]').textContent.includes('down-center'), null, 'осталась только вторая подсказка')
      expect.eq(await t('top-left').getAttribute('aria-expanded'), 'false', 'первая свёрнута')
      expect.eq(await t('down-center').getAttribute('aria-expanded'), 'true', 'вторая раскрыта')
    },
  },
  {
    name: 'hint: направления — подсказка появляется с нужной стороны от кнопки',
    story: 'компоненты-hint--examples',
    run: async ({ page, expect }) => {
      // имя направления — где стрелка подсказки: «top-*» — стрелка сверху, значит окно ПОД кнопкой; «left» — окно справа
      const cases = { 'top-center': 'bottom', 'down-center': 'top', left: 'right', right: 'left' }
      for (const [name, side] of Object.entries(cases)) {
        const t = page.getByRole('button', { name, exact: true })
        await t.scrollIntoViewIfNeeded()
        await t.click()
        const p = await popRect(page, '[role=dialog]')
        const b = await t.evaluate((e) => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom } })
        if (side === 'top') expect(p.b <= b.t + 1, `${name}: над кнопкой (${p.b} <= ${b.t})`)
        if (side === 'bottom') expect(p.t >= b.b - 1, `${name}: под кнопкой (${p.t} >= ${b.b})`)
        if (side === 'left') expect(p.r <= b.l + 1, `${name}: слева от кнопки (${p.r} <= ${b.l})`)
        if (side === 'right') expect(p.l >= b.r - 1, `${name}: справа от кнопки (${p.l} >= ${b.r})`)
        await page.keyboard.press('Escape')
        await wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие подсказки ' + name)
      }
    },
  },
  {
    name: 'tooltip: наведение открывает подсказку, уход курсора закрывает',
    story: 'компоненты-tooltip--playground',
    run: async ({ page, expect, step }) => {
      const t = page.locator('[data-slot=button]').first()
      step('навести')
      await t.hover()
      await wait(page, () => document.body.textContent.includes('Подсказка с пояснением') && [...document.querySelectorAll('[data-side]')].some((e) => e.getBoundingClientRect().width > 0), null, 'открытие подсказки')
      step('увести')
      await page.mouse.move(5, 5)
      await wait(page, () => ![...document.querySelectorAll('[data-side][data-open]')].length, null, 'закрытие подсказки')
    },
  },
  {
    name: 'tooltip: клавиатурный фокус открывает, Esc закрывает с фокусом на кнопке, уход фокуса закрывает',
    story: 'компоненты-tooltip--playground',
    run: async ({ page, expect, step }) => {
      const isOpen = () => page.evaluate(() => [...document.querySelectorAll('[data-side][data-open]')].some((e) => e.getBoundingClientRect().width > 0))
      step('Tab на кнопку')
      await page.keyboard.press('Tab')
      await wait(page, () => [...document.querySelectorAll('[data-side][data-open]')].some((e) => e.getBoundingClientRect().width > 0), null, 'открытие по фокусу')
      step('Esc')
      await page.keyboard.press('Escape')
      await wait(page, () => ![...document.querySelectorAll('[data-side][data-open]')].length, null, 'закрытие по Esc')
      expect.eq(await page.evaluate(() => document.activeElement?.getAttribute('data-slot')), 'button', 'фокус остался на кнопке')
      step('фокус ушёл')
      // повторно открыть фокусом: снять фокус и вернуть его на кнопку (Tab за край страницы браузер зацикливает по-разному)
      await page.evaluate(() => document.activeElement.blur())
      await page.locator('[data-slot=button]').first().focus()
      await wait(page, () => [...document.querySelectorAll('[data-side][data-open]')].length > 0, null, 'повторное открытие по фокусу')
      await page.evaluate(() => document.activeElement.blur())
      await wait(page, () => ![...document.querySelectorAll('[data-side][data-open]')].length, null, 'закрытие при уходе фокуса')
      expect.eq(await isOpen(), false, 'закрыта')
    },
  },
  {
    name: 'tooltip: направления — подсказка появляется с нужной стороны от кнопки',
    story: 'компоненты-tooltip--examples',
    run: async ({ page, expect }) => {
      // имя направления — где стрелка подсказки: «top-*» — стрелка сверху, значит окно ПОД кнопкой; «left» — окно справа
      const cases = { 'top-center': 'bottom', 'down-center': 'top', left: 'right', right: 'left' }
      for (const [name, side] of Object.entries(cases)) {
        const t = page.getByRole('button', { name, exact: true })
        await t.scrollIntoViewIfNeeded()
        await t.hover()
        const p = await popRect(page, '[data-side][data-open]')
        const b = await t.evaluate((e) => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom } })
        if (side === 'top') expect(p.b <= b.t + 1, `${name}: над кнопкой (${p.b} <= ${b.t})`)
        if (side === 'bottom') expect(p.t >= b.b - 1, `${name}: под кнопкой (${p.t} >= ${b.b})`)
        if (side === 'left') expect(p.r <= b.l + 1, `${name}: слева от кнопки (${p.r} <= ${b.l})`)
        if (side === 'right') expect(p.l >= b.r - 1, `${name}: справа от кнопки (${p.l} >= ${b.r})`)
        await page.mouse.move(5, 5)
        await wait(page, () => ![...document.querySelectorAll('[data-side][data-open]')].length, null, 'закрытие подсказки ' + name)
      }
    },
  },
  {
    name: 'tooltip: отключённая подсказка не открывается ни по наведению, ни по фокусу, кнопка остаётся рабочей',
    story: 'компоненты-tooltip--examples',
    run: async ({ page, expect }) => {
      const t = page.getByRole('button', { name: 'Без подсказки', exact: true })
      await t.scrollIntoViewIfNeeded()
      await t.hover()
      await t.focus()
      await settle(page)
      await page.waitForTimeout(400)
      expect.eq(await page.locator('[data-side][data-open]').count(), 0, 'подсказки нет')
      expect.eq(await t.isEnabled(), true, 'кнопка не отключена')
    },
  },
  {
    name: 'tooltip на 375: подсказка не выходит за края экрана',
    story: 'компоненты-tooltip--examples',
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      for (const name of ['top-left', 'down-right', 'right']) {
        const t = page.getByRole('button', { name, exact: true })
        await t.scrollIntoViewIfNeeded()
        await t.hover()
        const p = await popRect(page, '[data-side][data-open]')
        expect(p.l >= 0 && p.r <= 375, `${name}: по ширине в экране (${p.l}..${p.r})`)
        await page.mouse.move(5, 5)
        await wait(page, () => ![...document.querySelectorAll('[data-side][data-open]')].length, null, 'закрытие')
      }
    },
  },
  {
    name: 'top-fixed-message: полный текст в тултипе только у обрезанного сообщения',
    story: 'компоненты-top-fixed-message--matrix',
    run: async ({ page, expect }) => {
      const tips = () => page.evaluate(() => [...document.querySelectorAll('[data-side][data-open]')].map((e) => e.textContent))
      const short = page.getByText('Notification Text Example').first()
      await short.hover()
      await settle(page)
      await page.waitForTimeout(400)
      expect.eq(await tips(), [], 'у короткого текста подсказки нет')
      await page.mouse.move(5, 5)
      const long = page.getByText(/^Очень длинное/).first()
      await long.scrollIntoViewIfNeeded()
      await long.hover()
      await wait(page, () => [...document.querySelectorAll('[data-side][data-open]')].some((e) => e.textContent.startsWith('Очень длинное')), null, 'подсказка у длинного текста')
    },
  },
]
