// Слой 4: тосты (таймеры), «Наверх», NPS, информер, баннер, верхнее сообщение, Dropdown — появление, автозакрытие, пауза.
// Таймеры тостов идут по фальшивым часам Playwright (page.clock): ставим их до перезагрузки истории, чтобы все
// таймеры страницы были фальшивыми, и двигаем время вручную — без реального ожидания и без гонок.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
const withClock = async (page, readySelector) => {
  await page.clock.install()
  await page.reload()
  await page.waitForSelector(readySelector)
  await page.evaluate(() => document.fonts.ready)
  // перезагрузка сбрасывает отключение анимаций, которое ставит запускатель
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
}
const load = async (page, story, args) => {
  await page.goto(`${new URL(page.url()).origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&args=${args}`)
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
}

// ---- Toast
const TOAST = 'компоненты-toast-message--playground'
const toasts = (page) => page.evaluate(() => [...document.querySelectorAll('[data-slot=toast]')].map((t) => ({ closing: t.dataset.closing === 'true', text: t.textContent })))
const alive = async (page) => (await toasts(page)).filter((t) => !t.closing).length
const show = (page) => page.getByRole('button', { name: 'Показать тост' }).click()
const centerOfToast = async (page) => {
  const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=toast]').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2] })
  return r
}

// ---- NPS
const NPS = 'компоненты-nps--playground'
const npsState = (page) => page.evaluate(() => {
  const radios = [...document.querySelectorAll('[role=radio]')]
  return {
    checked: radios.filter((r) => r.getAttribute('aria-checked') === 'true').map((r) => r.getAttribute('aria-label')),
    stops: radios.filter((r) => r.tabIndex === 0).length,
    follow: !document.querySelector('[data-slot=nps] [inert]'),
    chips: [...document.querySelectorAll('[data-slot=filter-table]')].filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.textContent),
    comment: document.querySelector('textarea')?.value,
  }
})

export default [
  {
    name: 'toast: появляется в углу, живёт 4 с и убирается сам',
    story: TOAST,
    run: async ({ page, expect, step }) => {
      await withClock(page, '[data-slot=button]')
      expect.eq((await toasts(page)).length, 0, 'сначала тостов нет')
      step('показать')
      await show(page)
      const t = await toasts(page)
      expect.eq(t.length, 1, 'появился один тост')
      const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=toast]').getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom] })
      expect(r[0] >= 0 && r[2] <= 1280 && r[1] >= 0, 'тост в пределах окна: ' + r)
      step('3,5 с')
      await page.clock.runFor(3500)
      expect.eq(await alive(page), 1, 'через 3,5 с ещё жив')
      step('4,2 с')
      await page.clock.runFor(700)
      expect.eq(await alive(page), 0, 'через 4,2 с уходит (закрывается)')
      await page.clock.runFor(2000)
      expect.eq((await toasts(page)).length, 0, 'и снят из DOM')
    },
  },
  {
    name: 'toast: пока курсор над областью уведомлений, тост не гаснет; после ухода курсора живёт ещё положенное время',
    story: TOAST,
    run: async ({ page, expect, step }) => {
      await withClock(page, '[data-slot=button]')
      await show(page)
      const [x, y] = await centerOfToast(page)
      step('навести и ждать 20 с')
      await page.mouse.move(x, y)
      await page.clock.runFor(20000)
      expect.eq(await alive(page), 1, 'после 20 с под курсором жив')
      step('увести курсор')
      await page.mouse.move(5, 5)
      await page.clock.runFor(3000)
      expect.eq(await alive(page), 1, 'через 3 с после ухода ещё жив')
      await page.clock.runFor(1500)
      expect.eq(await alive(page), 0, 'через 4,5 с после ухода закрыт')
    },
  },
  {
    name: 'toast: несколько тостов складываются вниз по порядку, у каждого свой срок, крестик закрывает сразу',
    story: TOAST,
    run: async ({ page, expect, step }) => {
      await withClock(page, '[data-slot=button]')
      const b = page.getByRole('button', { name: 'Показать тост' })
      await b.click()
      await page.clock.runFor(1000)
      await b.click()
      await page.clock.runFor(1000)
      await b.click()
      const tops = await page.evaluate(() => [...document.querySelectorAll('[data-slot=toast]')].map((t) => t.getBoundingClientRect().top))
      expect.eq(tops.length, 3, 'три тоста')
      expect(tops[0] < tops[1] && tops[1] < tops[2], 'новые ниже старых: ' + tops)
      step('первый уходит на 4-й секунде, остальные позже')
      await page.clock.runFor(2100)
      expect.eq(await alive(page), 2, 'после 4,1 с живых два')
      await page.clock.runFor(1000)
      expect.eq(await alive(page), 1, 'после 5,1 с живой один')
      step('крестик')
      await page.locator('[data-slot=toast] [data-slot=close-cross]').last().click()
      await page.clock.runFor(1500)
      expect.eq((await toasts(page)).length, 0, 'все убраны')
    },
  },
  {
    name: 'toast: тост, добавленный при курсоре над областью, тоже ждёт и не умирает под рукой',
    story: TOAST,
    run: async ({ page, expect, step }) => {
      await withClock(page, '[data-slot=button]')
      const b = page.getByRole('button', { name: 'Показать тост' })
      await b.click()
      const [x, y] = await centerOfToast(page)
      await page.mouse.move(x, y)
      await page.clock.runFor(1000)
      step('добавить второй, пока пауза')
      await page.evaluate(() => document.querySelector('[data-slot=button]').click())
      await page.clock.runFor(30000)
      expect.eq(await alive(page), 2, 'оба живы под курсором')
      await page.mouse.move(5, 5)
      await page.clock.runFor(5000)
      expect.eq(await alive(page), 0, 'после ухода курсора закрылись оба')
    },
  },
  {
    name: 'toast на 375 (мобильная форма): тост целиком в пределах экрана',
    story: TOAST,
    viewport: [375, 800],
    run: async ({ page, expect, story }) => {
      // форму задаёт контрол viewport истории: по умолчанию он форсирует десктопную (480px)
      await load(page, story, 'viewport:mobile')
      await show(page)
      await wait(page, () => document.querySelectorAll('[data-slot=toast]').length === 1, null, 'тост')
      const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=toast]').getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom] })
      expect(r[0] >= 0 && r[2] <= 375, 'по ширине в экране: ' + r)
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'нет горизонтальной прокрутки')
    },
  },
  {
    name: 'up-button: скрыта, пока страница не прокручена за порог; появляется после прокрутки; клик возвращает наверх и кнопка исчезает',
    story: 'компоненты-up-button--playground',
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'threshold:200')
      // в истории кнопка статичная (лежит в углу коробки наверху страницы); в продукте она fixed —
      // возвращаем ей это, иначе прокрутка страницы уносит кнопку с экрана и клик её «догоняет» прокруткой
      await page.addStyleTag({ content: '[data-slot=up-button]{position:fixed!important;right:24px!important;bottom:24px!important}' })
      await page.evaluate(() => { const d = document.createElement('div'); d.style.height = '4000px'; document.body.appendChild(d) })
      const btn = page.locator('[data-slot=up-button]')
      await page.evaluate(() => window.scrollTo(0, 0))
      expect.eq(await btn.count(), 0, 'на самом верху кнопки нет')
      step('прокрутить за порог')
      await page.evaluate(() => window.scrollTo(0, 500))
      await wait(page, () => !!document.querySelector('[data-slot=up-button]'), null, 'появление кнопки')
      expect.eq(await btn.getAttribute('aria-label'), 'Наверх', 'подпись')
      step('прокрутить в пределах порога')
      await page.evaluate(() => window.scrollTo(0, 100))
      await wait(page, () => !document.querySelector('[data-slot=up-button]'), null, 'исчезновение ниже порога')
      step('клик')
      await page.evaluate(() => window.scrollTo(0, 1200))
      await wait(page, () => window.scrollY === 1200 && !!document.querySelector('[data-slot=up-button]'), null, 'прокрутка и появление кнопки')
      await btn.click({ timeout: 8000 })
      await wait(page, () => window.scrollY === 0, null, 'возврат наверх')
      await wait(page, () => !document.querySelector('[data-slot=up-button]'), null, 'исчезновение после возврата')
    },
  },
  {
    name: 'up-button: hidden прячет кнопку даже на прокрученной странице',
    story: 'компоненты-up-button--playground',
    run: async ({ page, expect, story }) => {
      await load(page, story, 'threshold:200;hidden:!true')
      await page.evaluate(() => { const d = document.createElement('div'); d.style.height = '4000px'; document.body.appendChild(d); window.scrollTo(0, 800) })
      await page.waitForTimeout(300)
      expect.eq(await page.locator('[data-slot=up-button]').count(), 0, 'кнопки нет')
    },
  },
  {
    name: 'nps: оценка стрелками/Home/End меняет выбор и раскрывает продолжение; в Tab-порядке одна звезда',
    story: NPS,
    run: async ({ page, expect, step }) => {
      await page.waitForSelector('[role=radio]')
      const start = await npsState(page)
      expect.eq(start.checked, [], 'оценки нет')
      expect.eq(start.follow, false, 'продолжение скрыто')
      expect.eq(start.stops, 1, 'одна остановка Tab')
      step('стрелка вправо')
      await page.getByRole('radio', { name: /3 из 5/ }).focus()
      await page.keyboard.press('ArrowRight')
      let s = await npsState(page)
      expect.eq(s.checked, ['4 из 5, Хорошо'], 'выбрана 4')
      expect.eq(s.follow, true, 'продолжение раскрылось')
      step('Home / End')
      await page.keyboard.press('Home')
      expect.eq((await npsState(page)).checked, ['1 из 5, Очень плохо'], 'Home')
      await page.keyboard.press('End')
      expect.eq((await npsState(page)).checked, ['5 из 5, Отлично'], 'End')
      step('влево дважды')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowLeft')
      expect.eq((await npsState(page)).checked, ['3 из 5, Нормально'], 'влево')
    },
  },
  {
    name: 'nps: клик по звезде выбирает оценку; причина из чипов ставит один чип и текст в комментарий, ввод руками снимает чип',
    story: NPS,
    run: async ({ page, expect, step }) => {
      await page.getByRole('radio', { name: /5 из 5/ }).click()
      expect.eq((await npsState(page)).checked, ['5 из 5, Отлично'], 'оценка')
      step('чип')
      const chips = page.locator('[data-slot=filter-table]')
      await chips.nth(1).click()
      let s = await npsState(page)
      expect.eq(s.chips, ['Непонятно'], 'нажат один чип')
      expect.eq(s.comment, 'Непонятно', 'текст чипа в комментарии')
      step('другой чип')
      await chips.nth(0).click()
      s = await npsState(page)
      expect.eq(s.chips, ['Долго заполнять'], 'чип заменился, а не добавился')
      step('ввод руками')
      await page.locator('textarea').fill('свой текст')
      s = await npsState(page)
      expect.eq(s.chips, [], 'чип снят')
      expect.eq(s.comment, 'свой текст', 'текст остался')
    },
  },
  {
    name: 'nps: submitted показывает «Спасибо за оценку» вместо формы',
    story: NPS,
    run: async ({ page, expect, story }) => {
      await load(page, story, 'submitted:!true')
      await page.waitForSelector('[data-slot=nps]')
      const text = await page.locator('[data-slot=nps]').textContent()
      expect(text.includes('Спасибо за оценку'), 'есть «Спасибо за оценку»')
      expect(text.includes('Окно закроется автоматически'), 'есть строка про автозакрытие')
      expect.eq(await page.locator('[role=radio]').count(), 0, 'звёзд нет')
    },
  },
  {
    name: 'nps: плавающее окно — в правом нижнем углу экрана, целиком в пределах окна (1280 и 375)',
    story: NPS,
    run: async ({ page, expect, step, story }) => {
      for (const [w, h] of [[1280, 900], [375, 700]]) {
        step(`${w}x${h}`)
        await page.setViewportSize({ width: w, height: h })
        await load(page, story, 'floating:!true')
        await page.waitForSelector('[data-slot=nps]')
        const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=nps]').getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, fixed: getComputedStyle(document.querySelector('[data-slot=nps]')).position } })
        expect.eq(r.fixed, 'fixed', `${w}: позиция fixed`)
        expect(r.l >= 0 && r.r <= w && r.t >= 0 && r.b <= h, `${w}: целиком в окне: ${JSON.stringify(r)}`)
        expect(w - r.r < 60 && h - r.b < 60, `${w}: прижато к правому нижнему углу: ${w - r.r}, ${h - r.b}`)
      }
    },
  },
  {
    name: 'informer и верхнее сообщение: кнопки доступны с клавиатуры по порядку, крестик подписан',
    story: 'компоненты-informer--playground',
    run: async ({ page, expect, step, story }) => {
      step('informer')
      await page.waitForSelector('[data-slot=informer]')
      await page.getByRole('button', { name: 'Подписать' }).focus()
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Отложить', 'после «Подписать» — «Отложить»')
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Закрыть', 'потом «Закрыть»')
      step('top-fixed-message')
      await load(page, { id: 'компоненты-top-fixed-message--playground' }, '')
      await page.waitForSelector('[data-slot=top-fixed-message]')
      await page.getByRole('button', { name: 'Подробнее' }).focus()
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Закрыть', 'после «Подробнее» — «Закрыть»')
    },
  },
  {
    name: 'banner (проверка на дым): кнопка фокусируется и нажимается без ошибок консоли, баннер в пределах окна',
    story: 'компоненты-banner--playground',
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=banner]')
      const btn = page.getByRole('button', { name: 'Подробнее' })
      await btn.focus()
      expect.eq(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Подробнее', 'фокус на кнопке')
      await btn.click()
      const r = await page.evaluate(() => { const b = document.querySelector('[data-slot=banner]').getBoundingClientRect(); return [b.left, b.right] })
      expect(r[0] >= 0 && r[1] <= 1280, 'баннер в пределах окна')
    },
  },
  {
    name: 'dropdown: поиск — ввод показывает крестик, крестик очищает поле и возвращает в него фокус',
    story: 'компоненты-dropdown--examples',
    run: async ({ page, expect, step }) => {
      const input = page.locator('input[type=search]').first()
      expect.eq(await input.count(), 1, 'поле поиска есть')
      step('ввод')
      await input.fill('плат')
      expect.eq(await input.inputValue(), 'плат', 'значение')
      const clear = page.getByRole('button', { name: 'Очистить поиск' }).first()
      expect.eq(await clear.count(), 1, 'крестик появился')
      step('очистить')
      await clear.click()
      expect.eq(await input.inputValue(), '', 'поле пусто')
      expect.eq(await page.evaluate(() => document.activeElement?.tagName + ':' + document.activeElement?.type), 'INPUT:search', 'фокус в поле поиска')
      expect.eq(await page.getByRole('button', { name: 'Очистить поиск' }).count(), 0, 'крестик исчез')
    },
  },
  {
    name: 'dropdown: кнопки подвала «Сбросить» и «Выбрать» доступны с клавиатуры и в порядке слева направо',
    story: 'компоненты-dropdown--playground',
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=dropdown-footer-button]')
      const buttons = page.locator('[data-slot=dropdown-footer-button]')
      await buttons.first().focus()
      expect.eq(await activeLabel(page), 'Сбросить', 'первая')
      await page.keyboard.press('Tab')
      expect.eq(await activeLabel(page), 'Выбрать', 'вторая')
    },
  },
]

function activeLabel(page) {
  return page.evaluate(() => document.activeElement?.textContent?.trim())
}
