// Слой 4: модалка — открытие, фокус-ловушка, возврат фокуса, блокировка прокрутки, два окна подряд.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
// Базовый UI ставит и снимает блокировку прокрутки через setTimeout(0) и кадр — даём хвостам отработать
const settle = (page) => page.evaluate(() => new Promise((res) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 30))), 30)))
const MODAL = 'компоненты-modal--playground'
const MODALS = 'компоненты-modal--examples'
const dlgOpen = (page) => wait(page, () => { const d = document.querySelector('[role=dialog]'); return !!d && d.getBoundingClientRect().width > 0 }, null, 'открытие диалога')
const dlgGone = (page) => wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие диалога')
const pageUnlocked = (page) => wait(page, () => document.body.style.overflow !== 'hidden' && document.body.style.paddingRight === '' && document.documentElement.style.getPropertyValue('--scroll-lock-gap') === '', null, 'снятие блокировки прокрутки страницы')
const pageLocked = (page) => wait(page, () => document.body.style.overflow === 'hidden', null, 'блокировка прокрутки страницы')
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
    name: 'modal: открытие кнопкой — фокус внутри окна, прокрутка страницы заблокирована; крестик закрывает, фокус на кнопке, блокировка снята',
    story: MODAL,
    run: async ({ page, expect, step }) => {
      const t = trigger(page, 'Открыть модалку')
      step('открыть')
      await t.click()
      await dlgOpen(page)
      await pageLocked(page)
      await wait(page, () => !!document.activeElement?.closest('[role=dialog]'), null, 'фокус внутри окна')
      expect.eq(await page.locator('[data-slot=button][aria-haspopup]').first().getAttribute('aria-expanded'), 'true', 'aria-expanded кнопки')
      step('крестик')
      await page.getByRole('button', { name: 'Закрыть', exact: true }).click()
      await dlgGone(page)
      await focusBack(page, 'Открыть модалку')
      await pageUnlocked(page)
      expect.eq(await page.locator('[data-slot=button][aria-haspopup]').first().getAttribute('aria-expanded'), 'false', 'aria-expanded снят')
    },
  },
  {
    name: 'modal: Esc закрывает окно, фокус возвращается на кнопку, блокировка снимается',
    story: MODAL,
    run: async ({ page, expect }) => {
      await trigger(page, 'Открыть модалку').click()
      await dlgOpen(page)
      await settle(page)
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await focusBack(page, 'Открыть модалку')
      await pageUnlocked(page)
    },
  },
  {
    name: 'modal: щелчок по подложке закрывает окно',
    story: MODAL,
    run: async ({ page }) => {
      await trigger(page, 'Открыть модалку').click()
      await dlgOpen(page)
      await settle(page)
      await page.mouse.click(4, 4)
      await dlgGone(page)
      await focusBack(page, 'Открыть модалку')
      await pageUnlocked(page)
    },
  },
  {
    name: 'modal: щелчок внутри окна его не закрывает',
    story: MODAL,
    run: async ({ page, expect }) => {
      await trigger(page, 'Открыть модалку').click()
      await dlgOpen(page)
      await settle(page)
      await page.locator('[data-slot=modal-title]').click()
      await settle(page)
      expect.eq(await page.locator('[role=dialog]').count(), 1, 'окно осталось')
    },
  },
  {
    name: 'modal: фокус-ловушка — Tab и Shift+Tab ходят по кругу внутри окна и не уходят на страницу',
    story: MODAL,
    run: async ({ page, expect, step }) => {
      await trigger(page, 'Открыть модалку').click()
      await dlgOpen(page)
      await wait(page, () => !!document.activeElement?.closest('[role=dialog]'), null, 'фокус внутри окна')
      const seq = []
      step('Tab вперёд 8 раз')
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab')
        await wait(page, () => !!document.activeElement?.closest('[role=dialog]'), null, `фокус внутри окна после Tab ${i + 1}`)
        seq.push(await activeName(page))
      }
      expect(new Set(seq).size >= 2, 'фокус ходит по нескольким элементам: ' + seq.join(' | '))
      expect(seq.slice(0, 3).join() === seq.slice(3, 6).join(), 'круг повторяется: ' + seq.join(' | '))
      step('Shift+Tab назад 8 раз')
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Shift+Tab')
        await wait(page, () => !!document.activeElement?.closest('[role=dialog]'), null, `фокус внутри окна после Shift+Tab ${i + 1}`)
      }
      expect.eq(await activeIn(page), true, 'фокус внутри окна')
    },
  },
  {
    name: 'modal: «Отмена» закрывает окно и возвращает фокус на кнопку',
    story: MODAL,
    run: async ({ page }) => {
      await trigger(page, 'Открыть модалку').click()
      await dlgOpen(page)
      await page.getByRole('dialog').getByRole('button', { name: 'Отмена' }).click()
      await dlgGone(page)
      await focusBack(page, 'Открыть модалку')
      await pageUnlocked(page)
    },
  },
  {
    name: 'modal: два окна подряд — после каждого страница разблокирована, второе открывается и закрывается так же',
    story: MODALS,
    run: async ({ page, expect, step }) => {
      for (const name of ['Large Modal', 'Small Modal', 'Large Modal']) {
        step(name)
        await trigger(page, name).click()
        await dlgOpen(page)
        await pageLocked(page)
        expect.eq(await page.locator('[role=dialog]').count(), 1, name + ': одно окно')
        await settle(page)
        await page.keyboard.press('Escape')
        await dlgGone(page)
        await focusBack(page, name)
        await pageUnlocked(page)
      }
    },
  },
  {
    name: 'modal: открыть, закрыть и сразу открыть снова — окно одно, блокировка ставится и снимается',
    story: MODAL,
    run: async ({ page, expect }) => {
      const t = trigger(page, 'Открыть модалку')
      await t.click()
      await dlgOpen(page)
      await settle(page)
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await t.click()
      await dlgOpen(page)
      expect.eq(await page.locator('[role=dialog]').count(), 1, 'одно окно')
      await pageLocked(page)
      await settle(page)
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await pageUnlocked(page)
    },
  },
  {
    name: 'modal: «Без крестика» — крестика нет, Esc всё равно закрывает',
    story: MODALS,
    run: async ({ page, expect }) => {
      await trigger(page, 'Без крестика').click()
      await dlgOpen(page)
      expect.eq(await page.getByRole('dialog').getByRole('button', { name: 'Закрыть', exact: true }).count(), 0, 'кнопки «Закрыть» нет')
      await settle(page)
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await pageUnlocked(page)
    },
  },
  {
    name: 'modal: длинное содержимое — прокручивается тело окна, страница под ним нет; шапка и подвал остаются на месте',
    story: MODALS,
    run: async ({ page, expect, step }) => {
      await trigger(page, 'Открыть длинную модалку').click()
      await dlgOpen(page)
      await pageLocked(page)
      const box = () => page.evaluate(() => {
        const d = document.querySelector('[role=dialog]')
        const scr = [...d.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 20 && ['auto', 'scroll'].includes(getComputedStyle(e).overflowY))
        const h = d.querySelector('[data-slot=modal-header]')
        const f = d.querySelector('[data-slot=modal-footer]')
        return { canScroll: !!scr, top: scr?.scrollTop ?? -1, head: h?.getBoundingClientRect().top, foot: f?.getBoundingClientRect().top, fits: d.getBoundingClientRect().bottom <= innerHeight && d.getBoundingClientRect().top >= 0 }
      })
      const before = await box()
      expect.eq(before.canScroll, true, 'в окне есть прокручиваемое тело')
      expect.eq(before.fits, true, 'окно помещается в экран')
      step('прокрутить тело')
      await page.evaluate(() => {
        const d = document.querySelector('[role=dialog]')
        const scr = [...d.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 20 && ['auto', 'scroll'].includes(getComputedStyle(e).overflowY))
        scr.scrollTop = 200
      })
      const after = await box()
      expect(after.top > 0, 'тело прокрутилось: ' + after.top)
      expect.eq(after.head, before.head, 'шапка на месте')
      expect.eq(after.foot, before.foot, 'подвал на месте')
      expect.eq(await page.evaluate(() => window.scrollY), 0, 'страница под окном не прокрутилась')
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await pageUnlocked(page)
    },
  },
  {
    name: 'modal на 375: окно открывается в пределах экрана, Esc закрывает',
    story: MODAL,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await trigger(page, 'Открыть модалку').click()
      await dlgOpen(page)
      await settle(page)
      const r = await rect(page, '[role=dialog]')
      expect(r.l >= 0 && r.r <= 375, 'по ширине в экране: ' + [r.l, r.r])
      expect(r.t >= 0 && r.b <= 800, 'по высоте в экране: ' + [r.t, r.b])
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'нет горизонтальной прокрутки')
      await page.keyboard.press('Escape')
      await dlgGone(page)
      await pageUnlocked(page)
    },
  },
]
