// Сценарии Input вне масок: состояния (очистка, только чтение, ошибка, обязательность), значение снаружи
// (controlled), пароль, телефон/сумма в настоящих экранах песочницы, мобильная форма.
import { PH, byPlaceholder, caret, paste, sel, setArgs, typeIn, fold } from './fields-lib.mjs'

const PLAY = 'компоненты-input--playground'
const active = (page) => page.evaluate(() => document.activeElement?.getAttribute('data-slot') || document.activeElement?.tagName)

const all = [
  {
    name: 'input: набор и стирание обычного текста, значение и каретка',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      step('набор')
      await typeIn(page, el, 'Привет, мир')
      expect.eq(await el.inputValue(), 'Привет, мир', 'значение')
      step('правка в середине')
      await caret(el, 7)
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), 'Привет мир', 'после Backspace')
      expect.eq(await sel(el), [6, 6], 'каретка на месте правки')
      await page.keyboard.type(':')
      expect.eq(await el.inputValue(), 'Привет: мир', 'после набора')
      expect.eq(await sel(el), [7, 7], 'каретка за набранным')
    },
  },
  {
    name: 'input: крестик очистки стирает значение, оставляет фокус в поле и исчезает',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { figmaType: 'filled', clearable: true })
      expect.eq(await el.inputValue(), 'Value', 'исходное значение')
      step('клик по крестику')
      await page.getByRole('button', { name: 'Очистить поле' }).click()
      expect.eq(await el.inputValue(), '', 'значение стёрто')
      expect.eq(await active(page), 'input', 'фокус вернулся в поле')
      expect.eq(await page.getByRole('button', { name: 'Очистить поле' }).count(), 0, 'крестика у пустого поля нет')
      step('набор после очистки')
      await page.keyboard.type('abc')
      expect.eq(await el.inputValue(), 'abc', 'новый ввод')
    },
  },
  {
    name: 'input: очистка поля с маской телефона сбрасывает и маску — новый номер набирается с нуля',
    story: 'песочница-подача-заявки-на-кредит-шаг-3--default',
    run: async ({ page, expect, step }) => {
      const el = page.getByLabel('Мобильный телефон')
      expect.eq(await el.inputValue(), '+7 927 890-32-11', 'исходное значение')
      step('очистка')
      await el.locator('xpath=..').getByRole('button', { name: 'Очистить поле' }).click()
      expect.eq(await el.inputValue(), '', 'значение стёрто')
      step('набор нового номера')
      await page.keyboard.type('9001112233')
      expect.eq(await el.inputValue(), '+7 900 111-22-33', 'новый номер')
    },
  },
  {
    name: 'input: очистка ИНН из готового значения и повторный набор',
    story: 'песочница-подача-заявки-на-кредит-шаг-3--default',
    run: async ({ page, expect }) => {
      const el = page.getByLabel('ИНН').first()
      expect.eq(await el.inputValue(), '123456789012', 'исходное значение')
      await el.locator('xpath=..').getByRole('button', { name: 'Очистить поле' }).click()
      expect.eq(await el.inputValue(), '', 'стёрто')
      await page.keyboard.type('7707083893')
      expect.eq(await el.inputValue(), '7707083893', 'новое значение')
    },
  },
  {
    name: 'input: заблокированное поле (locked) не редактируется и отдаёт aria-readonly',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { figmaType: 'locked' })
      expect.eq(await el.getAttribute('aria-readonly'), 'true', 'aria-readonly')
      expect.eq(await el.getAttribute('readonly'), '', 'readonly')
      step('попытка набора')
      await el.focus()
      await page.keyboard.type('zzz')
      expect.eq(await el.inputValue(), 'Value', 'значение не изменилось')
      step('крестика очистки нет')
      expect.eq(await page.getByRole('button', { name: 'Очистить поле' }).count(), 0, 'крестик у заблокированного')
    },
  },
  {
    name: 'input: выключенное поле (disabled) не редактируется, крестик недоступен',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { figmaType: 'filled', clearable: true, state: 'disabled' })
      expect.eq(await el.getAttribute('aria-disabled'), 'true', 'aria-disabled')
      step('попытка набора и стирания')
      await el.focus()
      await page.keyboard.type('zzz')
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), 'Value', 'значение не изменилось')
      expect.eq(await page.locator('button[aria-label="Очистить поле"]').isDisabled(), true, 'крестик выключен')
    },
  },
  {
    name: 'input: ошибка выставляет aria-invalid и связывает поле с текстом ошибки, а её снятие убирает оба',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      expect.eq(await el.getAttribute('aria-invalid'), null, 'без ошибки aria-invalid нет')
      step('включить ошибку')
      await setArgs(page, { id: PLAY }, { add: 'error' })
      expect.eq(await el.getAttribute('aria-invalid'), 'true', 'aria-invalid')
      const id = await el.getAttribute('aria-describedby')
      expect(id, 'aria-describedby указывает на подпись')
      expect.eq(await page.locator(`[id="${id}"]`).innerText(), 'Text about error here', 'текст ошибки по aria-describedby')
      step('снять ошибку')
      await setArgs(page, { id: PLAY }, { add: 'none' })
      expect.eq(await el.getAttribute('aria-invalid'), null, 'aria-invalid снят')
      expect.eq(await el.getAttribute('aria-describedby'), null, 'aria-describedby снят')
    },
  },
  {
    name: 'input: комментарий связан с полем через aria-describedby',
    story: PLAY,
    run: async ({ page, expect }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { add: 'comment' })
      const id = await el.getAttribute('aria-describedby')
      expect(id, 'aria-describedby')
      expect.eq(await page.locator(`[id="${id}"]`).innerText(), 'Comment', 'текст комментария')
      expect.eq(await el.getAttribute('aria-invalid'), null, 'это не ошибка')
    },
  },
  {
    name: 'input: required и валидность — пустое поле невалидно, после набора валидно, после стирания снова невалидно',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { required: true })
      const state = () => el.evaluate((e) => ({ required: e.required, valid: e.validity.valid, missing: e.validity.valueMissing }))
      expect.eq(await state(), { required: true, valid: false, missing: true }, 'пустое')
      step('набор')
      await typeIn(page, el, 'x')
      expect.eq((await state()).valid, true, 'после набора')
      step('стирание')
      await page.keyboard.press('Backspace')
      expect.eq(await state(), { required: true, valid: false, missing: true }, 'после стирания')
    },
  },
  {
    name: 'input: required с маской телефона — очищенное поле снова считается пустым',
    story: PLAY,
    run: async ({ page, expect }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { required: true, mask: 'phone' })
      await typeIn(page, el, '9')
      expect.eq(await el.evaluate((e) => e.validity.valueMissing), false, 'с цифрой')
      for (let i = 0; i < 4; i++) await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '', 'значение пусто, а не «+7»')
      expect.eq(await el.evaluate((e) => e.validity.valueMissing), true, 'пустое поле считается незаполненным')
    },
  },
  {
    name: 'input: пароль скрыт по умолчанию, кнопка показывает и снова скрывает значение',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { type: 'password', figmaType: 'filled' })
      expect.eq(await el.getAttribute('type'), 'password', 'скрыт')
      step('показать')
      await page.getByRole('button', { name: 'Показать пароль' }).click()
      expect.eq(await el.getAttribute('type'), 'text', 'показан')
      expect.eq(await el.inputValue(), 'Value', 'значение то же')
      step('скрыть')
      await page.getByRole('button', { name: 'Скрыть пароль' }).click()
      expect.eq(await el.getAttribute('type'), 'password', 'снова скрыт')
    },
  },
  {
    name: 'input controlled: значение снаружи проходит через маску телефона (8… и 7… приводятся к +7)',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { mask: 'phone' })
      step('значение 89123456789')
      await setArgs(page, { id: PLAY }, { value: '89123456789' })
      expect.eq(await el.inputValue(), '+7 912 345-67-89', '8…')
      step('значение 79001112233')
      await setArgs(page, { id: PLAY }, { value: '79001112233' })
      expect.eq(await el.inputValue(), '+7 900 111-22-33', '7…')
      step('сброс в пустую строку')
      await setArgs(page, { id: PLAY }, { value: '' })
      expect.eq(await el.inputValue(), '', 'сброс')
      step('снова значение после сброса')
      await setArgs(page, { id: PLAY }, { value: '9005556677' })
      expect.eq(await el.inputValue(), '+7 900 555-66-77', 'после сброса')
    },
  },
  {
    name: 'input controlled: значение суммы снаружи получает разряды и меняется на другое',
    story: PLAY,
    run: async ({ page, expect }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { mask: 'amount', value: '30000000' })
      expect.eq(await el.inputValue(), '30 000 000', 'разряды')
      await setArgs(page, { id: PLAY }, { value: '5' })
      expect.eq(await el.inputValue(), '5', 'другое значение')
      await setArgs(page, { id: PLAY }, { value: '' })
      expect.eq(await el.inputValue(), '', 'сброс')
    },
  },
  {
    name: 'input controlled: значение даты снаружи в ISO и в русском виде приводится к ДД.ММ.ГГГГ',
    story: PLAY,
    run: async ({ page, expect }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { mask: 'date', value: '2026-01-10' })
      expect.eq(await el.inputValue(), '10.01.2026', 'ISO')
      await setArgs(page, { id: PLAY }, { value: '05.03.2024' })
      expect.eq(await el.inputValue(), '05.03.2024', 'русский вид')
      await setArgs(page, { id: PLAY }, { value: '' })
      expect.eq(await el.inputValue(), '', 'сброс')
    },
  },
  {
    name: 'input controlled: значение снаружи для карты и счёта раскладывается по группам',
    story: PLAY,
    run: async ({ page, expect }) => {
      const el = page.locator('input[data-slot=input]')
      await setArgs(page, { id: PLAY }, { mask: 'card', value: '1234567890123456' })
      expect.eq(await el.inputValue(), '1234 5678 9012 3456', 'карта')
      await setArgs(page, { id: PLAY }, { mask: 'account', value: '40817810099910004312' })
      expect.eq(await el.inputValue(), '40817 810 0 99910004312', 'счёт')
    },
  },
  {
    name: 'input controlled (виджет перевода): сумма с маской сбрасывается после отправки, кнопка снова выключена, набор работает',
    story: 'песочница-виджет-перевод-между-счетами--default',
    run: async ({ page, expect, step }) => {
      const amount = page.getByLabel('Сумма')
      const submit = page.getByRole('button', { name: 'Перевести' })
      expect.eq(await submit.isDisabled(), true, 'пустая сумма — кнопка выключена')
      step('набор суммы')
      await typeIn(page, amount, '1500')
      expect.eq(await amount.inputValue(), '1 500', 'маска')
      expect.eq(await submit.isDisabled(), false, 'кнопка включена')
      step('отправка')
      await submit.click()
      expect.eq(await amount.inputValue(), '', 'сумма сброшена')
      expect.eq(await submit.isDisabled(), true, 'кнопка снова выключена')
      await page.getByText('1 500 ₽ переведено между счетами').waitFor()
      step('новый набор после сброса')
      await typeIn(page, amount, '700')
      expect.eq(await amount.inputValue(), '700', 'значение')
      expect.eq(await submit.isDisabled(), false, 'кнопка включена')
    },
  },
  {
    name: 'input controlled (виджет перевода): правка суммы в середине не теряет хвост и попадает в состояние',
    story: 'песочница-виджет-перевод-между-счетами--default',
    run: async ({ page, expect }) => {
      const amount = page.getByLabel('Сумма')
      await typeIn(page, amount, '1234567')
      await caret(amount, 1)
      await page.keyboard.type('9')
      expect.eq(await amount.inputValue(), '19 234 567', 'значение после вставки')
      await page.getByRole('button', { name: 'Перевести' }).click()
      await page.getByText('19 234 567 ₽ переведено между счетами').waitFor()
    },
  },
  {
    name: 'input controlled (виджет перевода): вставка суммы с копейками и отрицательной суммы',
    story: 'песочница-виджет-перевод-между-счетами--default',
    run: async ({ page, expect, step }) => {
      const amount = page.getByLabel('Сумма')
      const submit = page.getByRole('button', { name: 'Перевести' })
      step('вставка «-500»')
      await amount.focus()
      await paste(page, '-500')
      expect.eq(await amount.inputValue(), '', 'отрицательная сумма не принимается')
      expect.eq(await submit.isDisabled(), true, 'кнопка выключена')
      step('вставка «12 345,67»')
      await paste(page, '12 345,67')
      expect.eq(await amount.inputValue(), '12 345', 'копейки отброшены')
    },
  },
  {
    name: 'input: мобильная ширина 375 — набор в поле с маской и отсутствие горизонтальной прокрутки',
    story: 'компоненты-input--masks',
    viewport: [375, 800],
    run: async ({ page, expect }) => {
      const el = byPlaceholder(page, PH.phone)
      await typeIn(page, el, '9123456789')
      expect.eq(await el.inputValue(), '+7 912 345-67-89', 'значение')
      expect.eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'страница не шире окна')
      const box = await el.boundingBox()
      expect(box.x >= 0 && box.x + box.width <= 375, `поле в пределах окна: x=${box.x} w=${box.width}`)
    },
  },
]

export default fold(all, [
  ['input: очистка крестиком в полях с маской (телефон, ИНН) сбрасывает и маску — новое значение набирается с нуля', 'input: очистка поля с маской телефона', 'input: очистка ИНН'],
  ['input: заблокированное (locked) и выключенное (disabled) поле не редактируются, aria-readonly / aria-disabled, крестик недоступен', 'input: заблокированное поле', 'input: выключенное поле'],
  ['input: ошибка и комментарий связаны с полем через aria-describedby, aria-invalid выставляется и снимается', 'input: ошибка выставляет', 'input: комментарий связан'],
  ['input: required и валидность — пустое, заполненное, стёртое; с маской телефона стёртое поле снова пусто', 'input: required и валидность', 'input: required с маской'],
  ['input controlled: значение снаружи проходит через маску (телефон, сумма, дата, карта, счёт), сбрасывается и меняется', 'input controlled: значение снаружи проходит', 'input controlled: значение суммы', 'input controlled: значение даты', 'input controlled: значение снаружи для карты'],
  ['input controlled (виджет перевода): сброс суммы после отправки, правка в середине, вставка с копейками и минусом', 'сумма с маской сбрасывается', 'правка суммы в середине', 'вставка суммы с копейками'],
])
