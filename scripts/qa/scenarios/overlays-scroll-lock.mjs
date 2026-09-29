// Слой 4: гонка замков прокрутки. Замок кита (атрибут на <html>) и замок Base UI (инлайн-стиль body, снимается
// через setTimeout(0)) не должны пересекаться: быстрые Esc, Esc не оставляют страницу запертой навсегда.
const HEADER = 'компоненты-меню-header--playground'
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 15000 }).catch(() => { throw new Error('не дождались: ' + what) })
const bodyOverflow = (page) => page.evaluate(() => getComputedStyle(document.body).overflow)
const pause = (page, ms) => page.evaluate((t) => new Promise((r) => setTimeout(r, t)), ms)

export default [
  {
    name: 'блокировка прокрутки: модалка «Настроить избранное» над панелью меню, Esc и Esc без пауз — страница разблокирована',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      for (let i = 0; i < 6; i++) {
        step(`круг ${i + 1}: открыть панель и модалку`)
        await page.getByRole('button', { name: 'Меню', exact: true }).click()
        await wait(page, () => !!document.querySelector('[data-slot=header-menu-overlay]'), null, 'открытие панели')
        await page.getByRole('button', { name: 'Настроить избранное' }).first().click()
        await wait(page, () => !!document.querySelector('[role=dialog]'), null, 'открытие модалки')
        await wait(page, () => !!document.activeElement?.closest('[role=dialog]'), null, 'фокус внутри модалки')
        expect.eq(await bodyOverflow(page), 'hidden', 'страница заблокирована под слоями')
        step(`круг ${i + 1}: Esc, Esc без пауз`)
        await page.keyboard.press('Escape')
        await wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие модалки')
        await page.keyboard.press('Escape')
        await wait(page, () => !document.querySelector('[data-slot=header-menu-overlay]'), null, 'закрытие панели')
        await pause(page, 400)
        expect.eq(await bodyOverflow(page), 'visible', `круг ${i + 1}: страница разблокирована`)
      }
    },
  },
  {
    name: 'блокировка прокрутки: пока панель открыта, страница заперта и после закрытия модалки поверх неё',
    story: HEADER,
    run: async ({ page, expect }) => {
      await page.getByRole('button', { name: 'Меню', exact: true }).click()
      await wait(page, () => !!document.querySelector('[data-slot=header-menu-overlay]'), null, 'открытие панели')
      await page.getByRole('button', { name: 'Настроить избранное' }).first().click()
      await wait(page, () => !!document.querySelector('[role=dialog]'), null, 'открытие модалки')
      await wait(page, () => !!document.activeElement?.closest('[role=dialog]'), null, 'фокус внутри модалки')
      await page.keyboard.press('Escape')
      await wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие модалки')
      await pause(page, 400)
      const st = await page.evaluate(() => ({
        panel: !!document.querySelector('[data-slot=header-menu-overlay]'),
        attr: document.documentElement.hasAttribute('data-page-scroll-lock'),
        inline: document.body.style.overflow,
      }))
      expect.eq(await bodyOverflow(page), 'hidden', 'панель ещё открыта — страница всё ещё заперта; состояние ' + JSON.stringify(st))
    },
  },
]
