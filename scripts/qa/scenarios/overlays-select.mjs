// Слой 4: Select и Combobox — открытие мышью и клавиатурой, выбор, Esc и возврат фокуса, блокировки.
const wait = (page, fn, arg, what) =>
  page.waitForFunction(fn, arg, { timeout: 8000 }).catch(() => { throw new Error('не дождались: ' + what) })
const load = async (page, story, args) => {
  await page.goto(`${new URL(page.url()).origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&args=${args}`)
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
}
// фокус возвращается на триггер уже после закрытия — ждём его, а не читаем сразу
const focusSlot = (page, name) => wait(page, (n) => document.activeElement?.getAttribute('data-slot') === n, name, 'фокус на ' + name)
const slot = (page) => page.evaluate(() => document.activeElement?.getAttribute('data-slot'))
const expanded = (page, sel) => page.evaluate((s) => document.querySelector(s).getAttribute('aria-expanded'), sel)
const opened = (page, sel) => wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true' && document.activeElement !== document.body, sel, 'открытие')
// закрыт: aria-expanded снят и фокус ушёл из попапа (возврат фокуса и снятие блокировки идут следом)
const closed = (page, sel) => wait(page, (s) => document.querySelector(s).getAttribute('aria-expanded') === 'false' && !document.activeElement?.closest('[role=listbox],[role=dialog]'), sel, 'закрытие')
const unlocked = (page) => wait(page, () => document.body.style.overflow !== 'hidden', null, 'снятие блокировки прокрутки')
// Базовый UI дорисовывает список (позиция, подсветка) через кадры: перед клавишами даём этому отработать
const settle = (page) => page.evaluate(() => new Promise((res) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 30))), 30)))
const SEL = '[data-slot=select-trigger]'
const CMB = '[data-slot=combobox-trigger]'
const value = (page) => page.evaluate(() => document.querySelector('[data-slot=select-value]').textContent)
const options = (page) => page.evaluate(() => [...document.querySelectorAll('[role=option]')].map((o) => o.textContent))
const checkedOptions = (page) => page.evaluate(() => [...document.querySelectorAll('[role=option][aria-selected=true]')].map((o) => o.textContent))

export default [
  {
    name: 'select: открытие мышью, выбор пункта, закрытие и фокус на триггере',
    story: 'компоненты-select--playground',
    run: async ({ page, expect, step }) => {
      step('открыть кликом')
      await page.locator(SEL).click()
      await opened(page, SEL)
      expect.eq(await options(page), ['Apple', 'Banana', 'Cherry'], 'пункты списка')
      await wait(page, () => document.body.style.overflow === 'hidden', null, 'блокировка прокрутки страницы при открытом списке')
      step('выбрать Cherry')
      await page.getByRole('option', { name: 'Cherry' }).click()
      await closed(page, SEL)
      expect.eq(await value(page), 'Cherry', 'значение')
      await focusSlot(page, 'select-trigger')
      await unlocked(page)
    },
  },
  {
    name: 'select: клавиатура — стрелка открывает, Home/End/набор буквы, Enter выбирает',
    story: 'компоненты-select--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(SEL).focus()
      step('ArrowDown')
      await page.keyboard.press('ArrowDown')
      await opened(page, SEL)
      await settle(page)
      // подсветка пункта — асинхронный след клавиши: ждём нужную, а не читаем сразу
      const hl = (want, msg) => wait(page, (w) => document.querySelector('[role=option][data-highlighted]')?.textContent === w, want, msg)
      await hl('Apple', 'подсвечен первый')
      await page.keyboard.press('End')
      await hl('Cherry', 'End — последний')
      await page.keyboard.press('Home')
      await hl('Apple', 'Home — первый')
      step('буква b')
      await page.keyboard.type('b')
      await hl('Banana', 'поиск по первой букве')
      await page.keyboard.press('Enter')
      await closed(page, SEL)
      expect.eq(await value(page), 'Banana', 'значение')
      await focusSlot(page, 'select-trigger')
    },
  },
  {
    name: 'select: пробел открывает список, Esc закрывает без смены значения и возвращает фокус',
    story: 'компоненты-select--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(SEL).focus()
      step('пробел')
      await page.keyboard.press('Space')
      await opened(page, SEL)
      await page.keyboard.press('ArrowDown')
      step('Esc')
      await page.keyboard.press('Escape')
      await closed(page, SEL)
      expect.eq(await value(page), 'Apple', 'значение не менялось')
      await focusSlot(page, 'select-trigger')
      await unlocked(page)
    },
  },
  {
    name: 'select: щелчок вне списка закрывает его, значение прежнее',
    story: 'компоненты-select--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(SEL).click()
      await opened(page, SEL)
      step('щелчок в пустое место')
      await page.mouse.click(1200, 850)
      await closed(page, SEL)
      expect.eq(await value(page), 'Apple', 'значение')
      await focusSlot(page, 'select-trigger')
    },
  },
  {
    name: 'select: крестик «Очистить» сбрасывает значение и не открывает список',
    story: 'компоненты-select--playground',
    run: async ({ page, expect, step }) => {
      step('клик по крестику')
      await page.getByRole('button', { name: 'Очистить' }).click()
      expect.eq(await value(page), '', 'значение сброшено')
      expect.eq(await expanded(page, SEL), 'false', 'список не открылся')
      expect.eq(await page.getByRole('button', { name: 'Очистить' }).count(), 0, 'крестик исчез у пустого поля')
    },
  },
  {
    name: 'select на 375: список открывается в пределах экрана и не расширяет страницу',
    story: 'компоненты-select--playground',
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      await page.locator(SEL).click()
      await opened(page, SEL)
      const r = await page.evaluate(() => { const b = document.querySelector('[role=listbox]').getBoundingClientRect(); return [b.left, b.right, b.top, b.bottom] })
      expect(r[0] >= 0 && r[1] <= 375, 'по ширине в экране: ' + r)
      expect(r[3] <= 800, 'по высоте в экране: ' + r)
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'нет горизонтальной прокрутки')
    },
  },
  {
    name: 'select: disabled и read-only не открываются мышью и клавиатурой',
    story: 'компоненты-select--matrix',
    run: async ({ page, expect, step }) => {
      for (const [attr, what] of [['aria-disabled', 'disabled'], ['aria-readonly', 'read-only']]) {
        step(what)
        const t = page.locator(`${SEL}[${attr}=true]`).first()
        await t.scrollIntoViewIfNeeded()
        await t.click({ force: true })
        await t.focus().catch(() => {})
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        await page.keyboard.press('Space')
        expect.eq(await t.getAttribute('aria-expanded'), 'false', what + ': список закрыт')
        expect.eq(await page.locator('[role=listbox]:visible').count(), 0, what + ': листбокса нет')
      }
    },
  },
  {
    name: 'select: выключение на лету блокирует открытие, снятие disabled возвращает его',
    story: 'компоненты-select--playground',
    run: async ({ page, expect, step }) => {
      const set = (state) => page.evaluate((s) => {
        const id = new URLSearchParams(location.search).get('id')
        window.__STORYBOOK_PREVIEW__.channel.emit('updateStoryArgs', { storyId: id, updatedArgs: { state: s } })
      }, state)
      step('выключить на лету')
      await set('disabled')
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-disabled') === 'true', SEL, 'disabled')
      await page.locator(SEL).click({ force: true })
      expect.eq(await expanded(page, SEL), 'false', 'не открылось')
      step('включить обратно')
      await set('default')
      await wait(page, (s) => document.querySelector(s).getAttribute('aria-disabled') !== 'true', SEL, 'enabled')
      await page.locator(SEL).click()
      await opened(page, SEL)
    },
  },
  {
    name: 'select: раскрытая история — список открыт, выбранный Banana отмечен, Esc закрывает',
    story: 'компоненты-select--opened',
    run: async ({ page, expect, step }) => {
      await opened(page, SEL) // история рисуется асинхронно: ждём триггер, а не читаем сразу
      expect.eq(await expanded(page, SEL), 'true', 'открыт с начала')
      expect.eq(await checkedOptions(page), ['Banana'], 'выбранный пункт')
      step('Esc')
      await page.keyboard.press('Escape')
      await closed(page, SEL)
      await unlocked(page)
    },
  },
  {
    name: 'combobox: мышью выбрать два пункта, «Выбрать» применяет и подпись триггера меняется',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, step }) => {
      const text = () => page.locator(CMB).locator('[data-slot=clip-text]').textContent()
      step('открыть')
      await page.locator(CMB).click()
      await opened(page, CMB)
      expect.eq((await options(page)).length, 5, 'пять пунктов')
      step('выбрать СНИЛС и ИНН')
      await page.getByRole('option', { name: 'СНИЛС' }).click()
      await page.getByRole('option', { name: 'ИНН' }).click()
      expect.eq(await page.getByRole('button', { name: 'Выбрать: 2' }).count(), 1, 'счётчик в кнопке')
      expect.eq(await text(), '', 'до применения подпись пуста')
      step('применить')
      await page.getByRole('button', { name: 'Выбрать: 2' }).click()
      await closed(page, CMB)
      expect.eq(await text(), 'Выбрано документов: 2', 'подпись')
      await focusSlot(page, 'combobox-trigger')
    },
  },
  {
    name: 'combobox: Esc отменяет черновик выбора и возвращает фокус на триггер',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(CMB).click()
      await opened(page, CMB)
      await page.getByRole('option', { name: 'ИНН' }).click()
      step('Esc')
      await page.keyboard.press('Escape')
      await closed(page, CMB)
      await focusSlot(page, 'combobox-trigger')
      expect.eq(await page.locator(CMB).locator('[data-slot=clip-text]').textContent(), '', 'подпись не изменилась')
      step('открыть снова — выбора нет')
      await page.locator(CMB).click()
      await opened(page, CMB)
      expect.eq(await checkedOptions(page), [], 'черновик сброшен')
    },
  },
  {
    name: 'combobox: клавиатура — Enter открывает, стрелки и Enter отмечают пункты',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(CMB).focus()
      step('Enter на триггере')
      await page.keyboard.press('Enter')
      await opened(page, CMB)
      await wait(page, () => !!document.activeElement?.closest('[data-slot=combobox-list]') || document.activeElement?.getAttribute('data-slot') === 'combobox-list', null, 'фокус в списке')
      const hl = () => page.evaluate(() => document.querySelector('[role=option][data-highlighted]')?.textContent)
      step('две стрелки с Enter')
      await page.keyboard.press('ArrowDown')
      await wait(page, () => document.querySelector('[role=option][data-highlighted]')?.textContent === 'Паспорт РФ', null, 'подсветка первого пункта')
      await page.keyboard.press('Enter')
      await wait(page, () => document.querySelectorAll('[role=option][aria-selected=true]').length === 1, null, 'отметка первого')
      await page.keyboard.press('ArrowDown')
      await wait(page, () => document.querySelector('[role=option][data-highlighted]')?.textContent === 'СНИЛС', null, 'подсветка второго пункта')
      await page.keyboard.press('Enter')
      await wait(page, () => document.querySelectorAll('[role=option][aria-selected=true]').length === 2, null, 'отметка второго')
      expect.eq(await checkedOptions(page), ['Паспорт РФ', 'СНИЛС'], 'отмеченные')
      step('применить кликом')
      await page.getByRole('button', { name: 'Выбрать: 2' }).click()
      await closed(page, CMB)
      expect.eq(await page.locator(CMB).locator('[data-slot=clip-text]').textContent(), 'Выбрано документов: 2', 'подпись')
    },
  },
  {
    name: 'combobox: «Сбросить» очищает черновик, список остаётся открытым',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(CMB).click()
      await opened(page, CMB)
      await page.getByRole('option', { name: 'СНИЛС' }).click()
      await page.getByRole('option', { name: 'ИНН' }).click()
      step('Сбросить')
      await page.getByRole('button', { name: 'Сбросить' }).click()
      expect.eq(await checkedOptions(page), [], 'отметок нет')
      expect.eq(await expanded(page, CMB), 'true', 'список открыт')
      expect.eq(await page.getByRole('button', { name: 'Выбрать: 0' }).count(), 1, 'счётчик 0')
    },
  },
  {
    name: 'combobox: применённый выбор виден при повторном открытии, крестик очищает',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, step }) => {
      await page.locator(CMB).click()
      await opened(page, CMB)
      await page.getByRole('option', { name: 'ИНН' }).click()
      await page.getByRole('button', { name: 'Выбрать: 1' }).click()
      await closed(page, CMB)
      step('открыть ещё раз')
      await page.locator(CMB).click()
      await opened(page, CMB)
      expect.eq(await checkedOptions(page), ['ИНН'], 'отметка сохранена')
      await page.keyboard.press('Escape')
      await closed(page, CMB)
      step('крестик')
      await page.getByRole('button', { name: 'Очистить' }).click()
      expect.eq(await page.locator(CMB).locator('[data-slot=clip-text]').textContent(), '', 'подпись очищена')
      expect.eq(await expanded(page, CMB), 'false', 'список не открылся')
    },
  },
  {
    name: 'combobox: с лимитом 2 остальные пункты недоступны, снятие отметки их возвращает',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, step, story }) => {
      await load(page, story, 'max:2')
      await page.locator(CMB).click()
      await opened(page, CMB)
      await page.getByRole('option', { name: 'ИНН' }).click()
      await page.getByRole('option', { name: 'СНИЛС' }).click()
      const disabled = () => page.evaluate(() => document.querySelectorAll('[role=option][aria-disabled=true]').length)
      expect.eq(await disabled(), 3, 'остальные три недоступны')
      step('клик по недоступному')
      await page.getByRole('option', { name: 'Паспорт РФ' }).click({ force: true })
      expect.eq(await page.getByRole('button', { name: 'Выбрать: 2/2' }).count(), 1, 'счётчик не вырос')
      step('снять отметку')
      await page.getByRole('option', { name: 'ИНН' }).click()
      expect.eq(await disabled(), 0, 'все снова доступны')
    },
  },
  {
    name: 'combobox: disabled не открывается мышью и клавиатурой',
    story: 'компоненты-combobox--playground',
    run: async ({ page, expect, story }) => {
      await load(page, story, 'disabled:true')
      await page.locator(CMB).click({ force: true })
      await page.keyboard.press('Enter')
      expect.eq(await expanded(page, CMB), 'false', 'закрыт')
      expect.eq(await page.locator('[role=listbox]:visible').count(), 0, 'листбокса нет')
    },
  },
]
