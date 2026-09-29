// Textarea и OTP (карточка подтверждения кода: набор, вставка, стирание, правка в середине, повторная отправка).
import { caret, paste, reopen, setArgs, sel, typeIn, fold } from './fields-lib.mjs'

const TA = 'компоненты-text-area--playground'
const OTP = 'компоненты-otp-code--playground'
const OTP_EX = 'компоненты-otp-code--examples'

// Карточка открывается порталом уже после загрузки истории и забирает фокус на поле.
async function otpReady(page) {
  const input = page.locator('input[data-slot=otp-input]')
  await input.waitFor()
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-slot') === 'otp-input')
  return input
}
const submit = (page) => page.getByRole('button', { name: 'Подтвердить' })

const all = [
  {
    name: 'textarea: набор нескольких строк с Enter, правка в середине, каретка',
    story: TA,
    run: async ({ page, expect, step }) => {
      const el = page.locator('textarea')
      step('набор')
      await typeIn(page, el, 'один')
      await page.keyboard.press('Enter')
      await page.keyboard.type('два')
      expect.eq(await el.inputValue(), 'один\nдва', 'значение с переводом строки')
      step('Enter в середине строки')
      await caret(el, 2)
      await page.keyboard.press('Enter')
      expect.eq(await el.inputValue(), 'од\nин\nдва', 'строка разорвана в каретке')
      expect.eq(await sel(el), [3, 3], 'каретка в начале новой строки')
      step('Backspace склеивает строки')
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), 'один\nдва', 'строки склеены')
    },
  },
  {
    name: 'textarea: вставка многострочного текста сохраняет переводы строк и не добавляет лишнего',
    story: TA,
    run: async ({ page, expect }) => {
      const el = page.locator('textarea')
      await el.focus()
      await paste(page, 'первая\nвторая\n\nчетвёртая')
      expect.eq(await el.inputValue(), 'первая\nвторая\n\nчетвёртая', 'значение')
    },
  },
  {
    name: 'textarea: длинный текст не растягивает поле — высота та же, содержимое прокручивается',
    story: TA,
    run: async ({ page, expect }) => {
      const el = page.locator('textarea')
      await typeIn(page, el, 'х')
      const before = await el.evaluate((e) => e.getBoundingClientRect().height)
      await el.fill(Array.from({ length: 30 }, (_, i) => `строка ${i}`).join('\n'))
      await el.focus()
      const after = await el.evaluate((e) => ({ h: e.getBoundingClientRect().height, scroll: e.scrollHeight > e.clientHeight }))
      expect.eq(after.h, before, 'высота поля не изменилась')
      expect.eq(after.scroll, true, 'есть прокрутка')
    },
  },
  {
    name: 'textarea: заблокированное поле не редактируется, aria-readonly выставлен',
    story: TA,
    run: async ({ page, expect }) => {
      const el = page.locator('textarea')
      await setArgs(page, { id: TA }, { figmaType: 'locked' })
      const before = await el.inputValue()
      expect(before.length > 10, 'поле заполнено')
      expect.eq(await el.getAttribute('aria-readonly'), 'true', 'aria-readonly')
      await el.focus()
      await page.keyboard.type('zzz')
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), before, 'значение не изменилось')
    },
  },
  {
    name: 'textarea: выключенное поле не редактируется, aria-disabled выставлен',
    story: TA,
    run: async ({ page, expect }) => {
      const el = page.locator('textarea')
      await setArgs(page, { id: TA }, { figmaType: 'filled', state: 'disabled' })
      const before = await el.inputValue()
      expect.eq(await el.getAttribute('aria-disabled'), 'true', 'aria-disabled')
      await el.focus()
      await page.keyboard.type('zzz')
      expect.eq(await el.inputValue(), before, 'значение не изменилось')
    },
  },
  {
    name: 'textarea: ошибка и комментарий связаны с полем через aria-describedby, подсказка «i» раскрывается по клику',
    story: TA,
    run: async ({ page, expect, step }) => {
      const el = page.locator('textarea')
      step('ошибка')
      await setArgs(page, { id: TA }, { add: 'error' })
      expect.eq(await el.getAttribute('aria-invalid'), 'true', 'aria-invalid')
      const id = await el.getAttribute('aria-describedby')
      expect.eq(await page.locator(`[id="${id}"]`).innerText(), 'Text about error here', 'текст ошибки')
      step('комментарий с иконкой')
      await setArgs(page, { id: TA }, { add: 'comment', showCommentIcon: true })
      expect.eq(await el.getAttribute('aria-invalid'), null, 'ошибки нет')
      const cid = await el.getAttribute('aria-describedby')
      expect.eq(await page.locator(`[id="${cid}"]`).innerText(), 'Comment', 'текст комментария')
      const info = page.getByRole('button', { name: 'Дополнительная информация' })
      expect.eq(await info.getAttribute('aria-expanded'), 'false', 'закрыта')
      await info.click()
      await page.getByRole('dialog').getByText('Дополнительная информация по полю').waitFor()
      expect.eq(await info.getAttribute('aria-expanded'), 'true', 'открыта')
      await page.keyboard.press('Escape')
      await page.getByRole('dialog').waitFor({ state: 'detached' })
      expect.eq(await info.getAttribute('aria-expanded'), 'false', 'закрыта по Escape')
    },
  },
  {
    name: 'textarea: длинное слово без пробелов на 375 переносится внутри поля, а не выходит за него',
    story: TA,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      const el = page.locator('textarea')
      await el.fill('Ы'.repeat(300))
      // Ширину страницы не проверяем: демо-обёртка Playground фиксированная (w-96 = 384px) и шире окна сама по себе.
      expect.eq(await el.evaluate((e) => e.scrollWidth <= e.clientWidth + 1), true, 'слово переносится внутри поля')
    },
  },

  {
    name: 'otp: карточка открывается с фокусом на поле кода, «Подтвердить» выключена',
    story: OTP,
    run: async ({ page, expect }) => {
      const input = await otpReady(page)
      expect.eq(await input.inputValue(), '', 'пусто')
      expect.eq(await submit(page).isDisabled(), true, 'кнопка выключена')
      expect.eq(await input.getAttribute('inputmode'), 'numeric', 'цифровая клавиатура')
      expect.eq(await input.getAttribute('autocomplete'), 'one-time-code', 'автоподстановка кода из СМС')
    },
  },
  {
    name: 'otp: набор шести цифр включает «Подтвердить», седьмая цифра и буквы отбрасываются',
    story: OTP,
    run: async ({ page, expect, step }) => {
      const input = await otpReady(page)
      step('буквы и пробелы')
      await page.keyboard.type('a1 b2-c3')
      expect.eq(await input.inputValue(), '123', 'только цифры')
      expect.eq(await submit(page).isDisabled(), true, 'ещё неполный')
      step('добор до шести')
      await page.keyboard.type('456')
      expect.eq(await input.inputValue(), '123456', 'полный код')
      expect.eq(await submit(page).isDisabled(), false, 'кнопка включена')
      step('седьмая цифра')
      await page.keyboard.type('7')
      expect.eq(await input.inputValue(), '123456', 'седьмая отброшена')
    },
  },
  {
    name: 'otp: вставка кода с разделителями, лишним текстом и мусором',
    story: OTP,
    run: async ({ page, expect, step }) => {
      const input = await otpReady(page)
      for (const [text, want] of [
        ['123-456', '123456'],
        ['Код: 1234567', '123456'],
        ['12 34', '1234'],
        ['abc', ''],
      ]) {
        step(`вставка «${text}»`)
        await input.fill('')
        await input.focus()
        await paste(page, text)
        expect.eq(await input.inputValue(), want, `вставка «${text}»`)
      }
      expect.eq(await submit(page).isDisabled(), true, 'после «abc» кнопка выключена')
    },
  },
  {
    name: 'otp: Backspace в полном коде снова выключает «Подтвердить», стирание до пустого',
    story: OTP,
    run: async ({ page, expect }) => {
      const input = await otpReady(page)
      await page.keyboard.type('123456')
      expect.eq(await submit(page).isDisabled(), false, 'полный')
      await page.keyboard.press('Backspace')
      expect.eq(await input.inputValue(), '12345', 'после Backspace')
      expect.eq(await submit(page).isDisabled(), true, 'кнопка выключена')
      for (let i = 0; i < 6; i++) await page.keyboard.press('Backspace')
      expect.eq(await input.inputValue(), '', 'пусто')
    },
  },
  {
    name: 'otp: правка в середине полного кода — Backspace, Delete, замена выделения, вставка поверх выделения',
    story: OTP,
    run: async ({ page, expect, step }) => {
      const input = await otpReady(page)
      await page.keyboard.type('123456')
      step('Backspace после третьей цифры')
      await caret(input, 3)
      await page.keyboard.press('Backspace')
      expect.eq(await input.inputValue(), '12456', 'значение')
      expect.eq(await sel(input), [2, 2], 'каретка')
      step('цифра в середину')
      await page.keyboard.type('9')
      expect.eq(await input.inputValue(), '129456', 'вставлена')
      expect.eq(await sel(input), [3, 3], 'каретка за цифрой')
      step('в полный код цифра без выделения не добавляется')
      await page.keyboard.type('7')
      expect.eq(await input.inputValue(), '129456', 'полный код не сдвигается')
      step('Delete')
      await caret(input, 0)
      await page.keyboard.press('Delete')
      expect.eq(await input.inputValue(), '29456', 'первая стёрта')
      step('замена выделения')
      await caret(input, 1, 3)
      await page.keyboard.type('00')
      expect.eq(await input.inputValue(), '20056', 'замена двух цифр двумя')
      step('вставка поверх выделения')
      await caret(input, 0, 5)
      await paste(page, '987-654')
      expect.eq(await input.inputValue(), '987654', 'вставка поверх выделения')
    },
  },
  {
    name: 'otp: повторный набор одного и того же кода после стирания работает (код не «залипает»)',
    story: OTP,
    run: async ({ page, expect }) => {
      const input = await otpReady(page)
      await page.keyboard.type('123456')
      await page.keyboard.press('Backspace')
      await page.keyboard.type('6')
      expect.eq(await input.inputValue(), '123456', 'тот же код снова')
      expect.eq(await submit(page).isDisabled(), false, 'кнопка включена')
    },
  },
  {
    name: 'otp: код из 4 знаков — пятая цифра отбрасывается, вставка режется до четырёх',
    story: OTP,
    run: async ({ page, expect }) => {
      await reopen(page, { id: OTP }, 'length:4')
      const input = await otpReady(page)
      await page.keyboard.type('12345')
      expect.eq(await input.inputValue(), '1234', 'набор')
      await input.fill('')
      await input.focus()
      await paste(page, '987654')
      expect.eq(await input.inputValue(), '9876', 'вставка')
      expect.eq(await submit(page).isDisabled(), false, 'кнопка включена')
    },
  },
  {
    name: 'otp: код с ошибкой — aria-invalid и текст ошибки по aria-describedby; дополнение кода работает',
    story: OTP_EX,
    run: async ({ page, expect, step }) => {
      await page.getByRole('button', { name: 'Открыть с ошибкой' }).click()
      const input = await otpReady(page)
      expect.eq(await input.inputValue(), '1234', 'исходный код')
      expect.eq(await input.getAttribute('aria-invalid'), 'true', 'aria-invalid')
      const id = await input.getAttribute('aria-describedby')
      expect.eq(await page.locator(`[id="${id}"]`).innerText(), 'Неверный код, попробуйте снова', 'текст ошибки')
      step('дополнить код')
      await caret(input, 4)
      await page.keyboard.type('56')
      expect.eq(await input.inputValue(), '123456', 'значение')
    },
  },
  {
    name: 'otp: Escape закрывает карточку и возвращает фокус на кнопку-триггер, повторное открытие даёт пустое поле',
    story: OTP_EX,
    run: async ({ page, expect, step }) => {
      const trigger = page.getByRole('button', { name: 'Подтвердить контакты' })
      await trigger.click()
      await otpReady(page)
      await page.keyboard.type('1234')
      step('Escape')
      await page.keyboard.press('Escape')
      await page.getByRole('dialog').waitFor({ state: 'detached' })
      await page.waitForFunction(() => document.activeElement?.textContent === 'Подтвердить контакты')
      step('повторное открытие')
      await trigger.click()
      const again = await otpReady(page)
      expect.eq(await again.inputValue(), '', 'код сброшен')
      expect.eq(await submit(page).isDisabled(), true, 'кнопка выключена')
    },
  },
  {
    name: 'otp: повторная отправка — отсчёт заканчивается кнопкой, после нажатия отсчёт идёт заново, а фокус остаётся в карточке',
    story: OTP,
    run: async ({ page, expect, step }) => {
      await reopen(page, { id: OTP }, 'resendSeconds:2')
      await otpReady(page)
      const status = page.getByRole('status')
      expect(/Отправить повторно через \d сек\./.test(await status.innerText()), 'идёт отсчёт')
      step('дождаться конца отсчёта')
      const resend = page.getByRole('button', { name: 'Отправить повторно' })
      await resend.waitFor({ timeout: 6000 })
      expect.eq(await page.getByRole('status').count(), 0, 'таблетки отсчёта нет')
      step('нажать')
      await resend.click()
      await page.getByRole('status').waitFor()
      expect(/через 2 сек\./.test(await page.getByRole('status').innerText()), 'отсчёт пошёл заново с 2')
      expect.eq(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')), true, 'фокус остался в карточке, а не упал на body')
    },
  },
  {
    name: 'otp: мобильная ширина 375 — карточка помещается, код набирается',
    story: OTP,
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      const input = await otpReady(page)
      await page.keyboard.type('123456')
      expect.eq(await input.inputValue(), '123456', 'значение')
      const box = await input.boundingBox()
      expect(box.x >= 0 && box.x + box.width <= 375, `поле в пределах окна: x=${box.x} w=${box.width}`)
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'нет горизонтальной прокрутки')
    },
  },
]

export default fold(all, [
  ['textarea: многострочный набор, Enter и Backspace в середине, вставка многострочного текста', 'textarea: набор нескольких строк', 'textarea: вставка многострочного'],
  ['textarea: заблокированное и выключенное поле не редактируются, aria-readonly / aria-disabled', 'textarea: заблокированное поле', 'textarea: выключенное поле'],
  ['otp: открытие с фокусом на поле, набор шести цифр, буквы и седьмая цифра отбрасываются', 'otp: карточка открывается', 'otp: набор шести цифр'],
  ['otp: Backspace в полном коде, повторный набор того же кода', 'otp: Backspace в полном', 'otp: повторный набор одного и того же'],
])
