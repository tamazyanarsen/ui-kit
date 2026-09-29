// Слой 4: шапка, меню шапки, профиль, меню сотрудника, карусель баннеров — панели, фокус, блокировка прокрутки, ресайз.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
// Базовый UI снимает и ставит свою блокировку прокрутки через setTimeout(0) и кадр; даём этим хвостам отработать
// (несколько макрозадач и кадры), прежде чем следующим действием менять слои
const settle = (page) => page.evaluate(() => new Promise((res) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 30))), 30)))
const HEADER = 'компоненты-меню-header--playground'
const overlay = (page) => page.evaluate(() => !!document.querySelector('[data-slot=header-menu-overlay]'))
const overlayWait = (page, want) => wait(page, (w) => !!document.querySelector('[data-slot=header-menu-overlay]') === w, want, want ? 'открытие панели' : 'закрытие панели')
const locked = (page) => page.evaluate(() => document.body.style.overflow === 'hidden')
const unlocked = (page) => wait(page, () => document.body.style.overflow !== 'hidden', null, 'снятие блокировки прокрутки')
const focusLabel = (page) => page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.getAttribute('data-slot') || document.activeElement?.textContent?.trim().slice(0, 30))
const focusOn = (page, text) => wait(page, (t) => { const a = document.activeElement; return !!a && (a.textContent || '').trim().startsWith(t) || a?.getAttribute('aria-label') === t }, text, 'фокус на «' + text + '»')
const menuBtn = (page) => page.getByRole('button', { name: 'Меню', exact: true })
const modalTitle = (page) => page.evaluate(() => document.querySelector('[role=dialog] [data-slot=modal-title]')?.textContent ?? null)
const popupOpen = (page, sel) => wait(page, (s) => { const e = document.querySelector(s); return !!e && e.getBoundingClientRect().width > 0 }, sel, 'открытие ' + sel)
const popupGone = (page, sel) => wait(page, (s) => !document.querySelector(s), sel, 'закрытие ' + sel)
const navState = (page) => page.evaluate(() => {
  const row = document.querySelector('[data-slot=header-nav-row]')
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' }
  const items = [...row.querySelectorAll('[data-slot=header-nav-item]')].filter(vis)
  return {
    items: items.length,
    more: !!row.querySelector('[data-slot=header-nav-overflow-trigger]') && vis(row.querySelector('[data-slot=header-nav-overflow-trigger]')),
    maxRight: Math.max(...items.map((i) => i.getBoundingClientRect().right)),
    rowRight: row.getBoundingClientRect().right,
    scroll: document.documentElement.scrollWidth,
  }
})
const stable = async (page, read) => {
  let prev = JSON.stringify(await read())
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(80)
    const cur = JSON.stringify(await read())
    if (cur === prev) return JSON.parse(cur)
    prev = cur
  }
  return JSON.parse(prev)
}

export default [
  {
    name: 'header: «Меню» открывает панель и блокирует прокрутку, Esc закрывает и возвращает фокус на кнопку',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      const btn = menuBtn(page)
      step('открыть')
      await btn.click()
      await overlayWait(page, true)
      expect.eq(await btn.getAttribute('aria-expanded'), 'true', 'aria-expanded')
      expect.eq(await locked(page), true, 'прокрутка страницы заблокирована')
      step('Esc')
      await page.keyboard.press('Escape')
      await overlayWait(page, false)
      expect.eq(await btn.getAttribute('aria-expanded'), 'false', 'aria-expanded снят')
      await focusOn(page, 'Меню')
      await unlocked(page)
      expect.eq(await page.evaluate(() => document.documentElement.style.getPropertyValue('--scroll-lock-gap')), '', '--scroll-lock-gap снят')
      expect.eq(await page.evaluate(() => document.body.style.paddingRight), '', 'отступ body снят')
    },
  },
  {
    name: 'header: панель меню закрывается щелчком по подложке ниже неё',
    story: HEADER,
    run: async ({ page, expect }) => {
      await menuBtn(page).click()
      await overlayWait(page, true)
      await page.mouse.click(640, 880)
      await overlayWait(page, false)
      await unlocked(page)
      expect.eq(await menuBtn(page).getAttribute('aria-expanded'), 'false', 'aria-expanded снят')
    },
  },
  {
    name: 'header: «Создать» открывает свою панель; переход с «Меню» на «Создать» оставляет одну открытую панель',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      step('Меню')
      await menuBtn(page).click()
      await overlayWait(page, true)
      step('Создать')
      const create = page.getByRole('button', { name: 'Создать' })
      await create.click()
      await wait(page, () => [...document.querySelectorAll('button[aria-expanded=true]')].some((b) => b.textContent.includes('Создать')), null, 'Создать раскрыта')
      expect.eq(await menuBtn(page).getAttribute('aria-expanded'), 'false', '«Меню» свернута')
      await wait(page, () => document.querySelectorAll('[data-slot=header-menu-overlay]').length === 1, null, 'одна панель вместо двух')
      expect.eq(await locked(page), true, 'прокрутка заблокирована')
      await page.keyboard.press('Escape')
      await overlayWait(page, false)
      await unlocked(page)
    },
  },
  {
    name: 'header: ресайз окна при открытой панели меню — панель остаётся в пределах окна, прокрутка не растёт',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      await menuBtn(page).click()
      await overlayWait(page, true)
      for (const [w, h] of [[900, 600], [1280, 500], [1280, 900]]) {
        step(`${w}x${h}`)
        await page.setViewportSize({ width: w, height: h })
        await wait(page, ([ww, hh]) => { const o = document.querySelector('[data-slot=header-menu-overlay]'); return !!o && Math.abs(o.getBoundingClientRect().bottom - hh) <= 200 }, [w, h], 'пересчёт панели')
        const r = await stable(page, () => page.evaluate(() => { const p = document.querySelector('[data-slot=header-menu-overlay] [data-slot=header-menu]').getBoundingClientRect(); return { l: p.left, r: p.right, b: p.bottom, sw: document.documentElement.scrollWidth } }))
        expect(r.l >= 0 && r.r <= w, `${w}x${h}: по ширине в окне: ${r.l}..${r.r}`)
        expect(r.b <= h, `${w}x${h}: по высоте в окне: ${r.b}`)
        expect.eq(r.sw, w, `${w}x${h}: нет горизонтальной прокрутки`)
      }
    },
  },
  {
    name: 'header: щелчок по ссылке меню закрывает панель, блокировка снимается',
    story: HEADER,
    run: async ({ page, expect }) => {
      await menuBtn(page).click()
      await overlayWait(page, true)
      await page.getByRole('button', { name: 'Реестры платежей' }).click()
      await overlayWait(page, false)
      await unlocked(page)
      expect.eq(await menuBtn(page).getAttribute('aria-expanded'), 'false', 'aria-expanded снят')
    },
  },
  {
    name: 'header: звёздочка избранного в меню переключает подпись и aria-pressed, панель остаётся открытой',
    story: HEADER,
    run: async ({ page, expect }) => {
      await menuBtn(page).click()
      await overlayWait(page, true)
      const star = page.locator('[data-slot=header-menu-link] button[aria-pressed=false]').first()
      const handle = await star.elementHandle()
      const read = () => handle.evaluate((e) => [e.getAttribute('aria-pressed'), e.getAttribute('aria-label')])
      expect.eq(await read(), ['false', 'Добавить в избранное'], 'до')
      await handle.click()
      expect.eq(await read(), ['true', 'Убрать из избранного'], 'после')
      expect.eq(await overlay(page), true, 'панель открыта')
      await handle.click()
      expect.eq(await read(), ['false', 'Добавить в избранное'], 'обратно')
    },
  },
  {
    name: 'header: модалка «Настроить избранное» поверх панели — Esc закрывает по одному слою, блокировка держится до конца',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      await menuBtn(page).click()
      await overlayWait(page, true)
      step('открыть модалку')
      await page.getByRole('button', { name: 'Настроить избранное' }).click()
      await wait(page, () => !!document.querySelector('[role=dialog]'), null, 'модалка')
      await settle(page)
      step('Esc — закрылась модалка')
      await page.keyboard.press('Escape')
      await wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие модалки')
      await settle(page)
      expect.eq(await overlay(page), true, 'панель ещё открыта')
      expect.eq(await locked(page), true, 'блокировка держится под панелью')
      step('Esc — закрылась панель')
      await page.keyboard.press('Escape')
      await overlayWait(page, false)
      await unlocked(page)
      expect.eq(await page.evaluate(() => document.documentElement.style.getPropertyValue('--scroll-lock-gap')), '', '--scroll-lock-gap снят')
    },
  },
  {
    name: 'header: уведомления и документы — открытие мышью, Esc закрывает и возвращает фокус на кнопку',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      for (const [name, sel] of [['Уведомления', '[data-slot=notification-menu-content]'], ['Документы', '[data-slot=header-document-menu-content]']]) {
        step(name)
        const t = page.getByRole('button', { name })
        await t.click()
        await popupOpen(page, sel)
        expect.eq(await t.getAttribute('aria-expanded'), 'true', name + ': aria-expanded')
        await page.keyboard.press('Escape')
        await popupGone(page, sel)
        await focusOn(page, name)
        expect.eq(await t.getAttribute('aria-expanded'), 'false', name + ': закрыто')
      }
    },
  },
  {
    name: 'header: одновременно открыт один попап — «Документы» закрывает «Уведомления»',
    story: HEADER,
    run: async ({ page, expect }) => {
      await page.getByRole('button', { name: 'Уведомления' }).click()
      await popupOpen(page, '[data-slot=notification-menu-content]')
      await page.getByRole('button', { name: 'Документы' }).click()
      await popupOpen(page, '[data-slot=header-document-menu-content]')
      await popupGone(page, '[data-slot=notification-menu-content]')
      expect.eq(await page.locator('[role=menu]:visible').count(), 1, 'одно меню')
    },
  },
  {
    name: 'profile-menu: выбор другой организации меняет подпись, закрывает меню и возвращает фокус на кнопку',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      const trig = page.locator('[data-slot=profile-menu-trigger]')
      await trig.click()
      await popupOpen(page, '[data-slot=profile-menu-content]')
      expect.eq(await page.locator('[role=menuitemradio][aria-checked=true]').count(), 1, 'одна отмеченная организация')
      step('выбрать «Северострой»')
      await page.getByRole('menuitemradio', { name: /Северострой/ }).click()
      await popupGone(page, '[data-slot=profile-menu-content]')
      expect((await trig.textContent()).includes('Северострой'), 'подпись сменилась')
      await wait(page, () => document.activeElement?.getAttribute('data-slot') === 'profile-menu-trigger', null, 'фокус на кнопке профиля')
    },
  },
  {
    name: 'profile-menu: клавиатура — стрелка, End на «Выйти», Enter открывает подтверждение, Esc закрывает и возвращает фокус',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      const trig = page.locator('[data-slot=profile-menu-trigger]')
      await trig.focus()
      step('Enter на кнопке профиля')
      await page.keyboard.press('Enter')
      await popupOpen(page, '[data-slot=profile-menu-content]')
      await page.keyboard.press('ArrowDown')
      await wait(page, () => document.activeElement?.getAttribute('role') === 'menuitemradio', null, 'фокус на организации')
      step('End')
      await page.keyboard.press('End')
      await wait(page, () => document.activeElement?.getAttribute('data-slot') === 'profile-menu-logout-item', null, 'фокус на «Выйти»')
      step('Enter')
      await page.keyboard.press('Enter')
      await wait(page, () => !!document.querySelector('[role=dialog] [data-slot=modal-title]'), null, 'подтверждение выхода')
      expect.eq(await modalTitle(page), 'Выйти из личного кабинета?', 'заголовок подтверждения')
      await wait(page, () => document.body.style.overflow === 'hidden', null, 'блокировка прокрутки под подтверждением')
      step('Esc')
      await page.keyboard.press('Escape')
      await wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие подтверждения')
      await wait(page, () => document.activeElement?.getAttribute('data-slot') === 'profile-menu-trigger', null, 'фокус на кнопке профиля')
      await unlocked(page)
    },
  },
  {
    name: 'profile-menu: «Отмена» в подтверждении выхода закрывает окно, остаётся тот же пользователь',
    story: HEADER,
    run: async ({ page, expect }) => {
      const trig = page.locator('[data-slot=profile-menu-trigger]')
      const before = await trig.textContent()
      await trig.click()
      await popupOpen(page, '[data-slot=profile-menu-content]')
      await page.getByRole('menuitem', { name: 'Выйти' }).click()
      await wait(page, () => !!document.querySelector('[role=dialog]'), null, 'подтверждение')
      await page.getByRole('button', { name: 'Отмена' }).click()
      await wait(page, () => !document.querySelector('[role=dialog]'), null, 'закрытие')
      expect.eq(await trig.textContent(), before, 'подпись прежняя')
      await unlocked(page)
    },
  },
  {
    name: 'header: ряд навигации при ресайзе окна на ходу — «Ещё» появляется, ряд не выходит за край, при возврате раскладка прежняя',
    story: HEADER,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[data-slot=header-nav-row] [data-slot=header-nav-item]')
      const wide = await stable(page, () => navState(page))
      expect(wide.items >= 4, 'на 1280 видно несколько пунктов: ' + wide.items)
      expect(wide.maxRight <= wide.rowRight, 'на 1280 пункты в пределах ряда')
      const counts = [wide.items]
      for (const w of [1000, 800, 600, 480]) {
        step('ширина ' + w)
        await page.setViewportSize({ width: w, height: 900 })
        const s = await stable(page, () => navState(page))
        expect(s.items >= 1, w + ': хотя бы один пункт')
        expect(s.items <= counts.at(-1), `${w}: пунктов не больше, чем на большей ширине (${s.items} > ${counts.at(-1)})`)
        expect(s.more, w + ': есть «Ещё»')
        expect(s.maxRight <= w, w + ': пункты в пределах окна')
        expect.eq(s.scroll, w, w + ': нет горизонтальной прокрутки страницы')
        counts.push(s.items)
      }
      step('вернуть 1280')
      await page.setViewportSize({ width: 1280, height: 900 })
      const back = await stable(page, () => navState(page))
      expect.eq(back.items, wide.items, 'то же число пунктов, что было на 1280')
    },
  },
  {
    name: 'header: «Ещё» в ряду навигации открывает список скрытых пунктов, Esc возвращает фокус на «Ещё»',
    story: HEADER,
    viewport: [800, 900],
    run: async ({ page, expect, step }) => {
      const more = page.locator('[data-slot=header-nav-overflow-trigger]')
      await wait(page, () => { const e = document.querySelector('[data-slot=header-nav-overflow-trigger]'); return !!e && e.getBoundingClientRect().width > 0 }, null, '«Ещё»')
      await page.waitForSelector('[data-slot=header-nav-row] [data-slot=header-nav-item]')
      const hiddenCount = 8 - (await stable(page, () => navState(page))).items
      step('открыть')
      await more.click()
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length > 0, null, 'список «Ещё»')
      expect.eq(await page.locator('[role=menuitem]').count(), hiddenCount, 'в списке столько пунктов, сколько скрыто из ряда')
      step('Esc')
      await page.keyboard.press('Escape')
      await wait(page, () => document.querySelectorAll('[role=menuitem]').length === 0, null, 'закрытие списка')
      await wait(page, () => document.activeElement?.getAttribute('data-slot') === 'header-nav-overflow-trigger', null, 'фокус на «Ещё»')
    },
  },
  {
    name: 'employee-menu: звёздочка избранного переключается туда и обратно, фокус остаётся на ней',
    story: 'компоненты-меню-меню-сотрудника--playground',
    run: async ({ page, expect }) => {
      const handle = await page.getByRole('button', { name: 'Добавить в избранное' }).first().elementHandle()
      const read = () => handle.evaluate((e) => [e.getAttribute('aria-pressed'), e.getAttribute('aria-label')])
      expect.eq(await read(), ['false', 'Добавить в избранное'], 'до')
      await handle.click()
      expect.eq(await read(), ['true', 'Убрать из избранного'], 'после')
      expect.eq(await handle.evaluate((e) => e === document.activeElement), true, 'фокус на звёздочке')
      await handle.click()
      expect.eq(await read(), ['false', 'Добавить в избранное'], 'обратно')
    },
  },
  {
    name: 'employee-menu: Tab проходит пункты по порядку и не теряет фокус',
    story: 'компоненты-меню-меню-сотрудника--playground',
    run: async ({ page, expect }) => {
      await page.getByRole('button', { name: 'Письма' }).focus()
      const seen = []
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab')
        seen.push(await page.evaluate(() => document.activeElement === document.body ? 'BODY' : (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim())))
      }
      expect(!seen.includes('BODY'), 'фокус не ушёл на body: ' + seen.join(' | '))
      expect.eq(seen[0], 'Убрать из избранного', 'после «Письма» идёт его звёздочка')
      expect.eq(seen[1], 'Задачник', 'дальше «Задачник»')
    },
  },
  {
    name: 'карусель баннеров в меню: автолистание раз в 6 с по кругу, щелчок по стрелке и точке автолистание не останавливает',
    story: 'компоненты-меню-раскрытое-меню-навигации--playground',
    run: async ({ page, expect, step }) => {
      await page.clock.install()
      await page.reload()
      await page.waitForSelector('[data-slot=menu-banner-track]')
      await page.evaluate(() => document.fonts.ready)
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
      const tx = () => page.evaluate(() => document.querySelector('[data-slot=menu-banner-track]').style.transform)
      expect.eq(await tx(), 'translateX(0%)', 'старт')
      step('автолистание')
      await page.clock.runFor(6100)
      expect.eq(await tx(), 'translateX(-100%)', 'через 6 с второй')
      await page.clock.runFor(6000)
      expect.eq(await tx(), 'translateX(-200%)', 'третий')
      await page.clock.runFor(6000)
      expect.eq(await tx(), 'translateX(0%)', 'по кругу на первый')
      step('щелчок по стрелке «Следующий», курсор уходит')
      await page.getByRole('button', { name: 'Следующий баннер' }).click()
      expect.eq(await tx(), 'translateX(-100%)', 'стрелка листает')
      await page.mouse.move(5, 5)
      await page.clock.runFor(6100)
      expect.eq(await tx(), 'translateX(-200%)', 'после щелчка и ухода курсора автолистание идёт')
      step('щелчок по точке')
      await page.getByRole('button', { name: 'Баннер 1' }).click()
      expect.eq(await tx(), 'translateX(0%)', 'точка переключает')
      await page.mouse.move(5, 5)
      await page.clock.runFor(6100)
      expect.eq(await tx(), 'translateX(-100%)', 'после щелчка по точке автолистание идёт')
    },
  },
  {
    name: 'карусель баннеров: пауза по наведению курсора и по клавиатурному фокусу',
    story: 'компоненты-меню-раскрытое-меню-навигации--playground',
    run: async ({ page, expect, step }) => {
      await page.clock.install()
      await page.reload()
      await page.waitForSelector('[data-slot=menu-banner-track]')
      await page.evaluate(() => document.fonts.ready)
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
      const tx = () => page.evaluate(() => document.querySelector('[data-slot=menu-banner-track]').style.transform)
      step('наведение')
      const box = await page.locator('[data-slot=menu-banner-carousel]').boundingBox()
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.clock.runFor(20000)
      expect.eq(await tx(), 'translateX(0%)', 'под курсором не листает')
      await page.mouse.move(5, 5)
      await page.clock.runFor(6100)
      expect.eq(await tx(), 'translateX(-100%)', 'курсор ушёл — листает')
      step('клавиатурный фокус')
      await page.getByRole('button', { name: 'Предыдущий баннер' }).focus()
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Tab')
      await page.clock.runFor(20000)
      expect.eq(await tx(), 'translateX(-100%)', 'с фокусом на стрелке не листает')
      await page.evaluate(() => document.activeElement.blur())
      await page.clock.runFor(6100)
      expect.eq(await tx(), 'translateX(-200%)', 'фокус ушёл — листает')
    },
  },
]
