// Сценарии масок Input: набор, вставка целой строки и мусора, стирание, замена выделения.
// История «Маски ввода» — по одному полю на каждую маску, поле берётся по нативному placeholder.
import { PH, byPlaceholder, caret, paste, sel, typeIn, fold, selectAll } from './fields-lib.mjs'

const STORY = 'компоненты-input--masks'
const field = (page, key) => byPlaceholder(page, PH[key])
// Только цифры: хвостовой разделитель после Backspace маска может оставить в строке до следующего нажатия.
const digits = (v) => v.replace(/\D/g, '')
// Одно «стирание цифры»: Backspace над хвостовым разделителем убирает только его, поэтому жмём, пока цифр не станет меньше.
async function eraseDigit(page, el) {
  const before = digits(await el.inputValue()).length
  for (let i = 0; i < 3 && digits(await el.inputValue()).length === before; i++) await page.keyboard.press('Backspace')
}

// Набор строки с клавиатуры в пустое поле маски и сравнение значения.
const typing = (name, key, cases) => ({
  name,
  story: STORY,
  run: async ({ page, expect, step }) => {
    const el = field(page, key)
    for (const [keys, want] of cases) {
      step(`набор «${keys}»`)
      await el.fill('')
      await typeIn(page, el, keys)
      expect.eq(await el.inputValue(), want, `набор «${keys}»`)
    }
  },
})

// Вставка (настоящий Ctrl+V) в пустое поле.
const pasting = (name, key, cases) => ({
  name,
  story: STORY,
  run: async ({ page, expect, step }) => {
    const el = field(page, key)
    for (const [text, want] of cases) {
      step(`вставка «${text}»`)
      await el.fill('')
      await el.focus()
      await paste(page, text)
      expect.eq(await el.inputValue(), want, `вставка «${text}»`)
    }
  },
})

const all = [
  typing('маска телефона: набор по цифре, лишние цифры и буквы отбрасываются', 'phone', [
    ['9123456789', '+7 912 345-67-89'],
    ['91234567891234', '+7 912 345-67-89'],
    ['9ab12cd3', '+7 912 3'],
    ['9', '+7 9'],
  ]),
  pasting('маска телефона: вставка целой строки в разных форматах и мусора', 'phone', [
    ['+7 (912) 345-67-89', '+7 912 345-67-89'],
    ['89123456789', '+7 912 345-67-89'],
    ['79123456789', '+7 912 345-67-89'],
    ['9123456789', '+7 912 345-67-89'],
    ['abc', ''],
    ['тел.: 912 345 67 89', '+7 912 345-67-89'],
  ]),
  {
    name: 'маска телефона: Backspace стирает по цифре через разделители и очищает поле до пустого',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'phone')
      await typeIn(page, el, '9123456789')
      step('три стирания с конца')
      await eraseDigit(page, el)
      expect.eq(digits(await el.inputValue()), '7912345678', 'после 1')
      await eraseDigit(page, el)
      expect.eq(digits(await el.inputValue()), '791234567', 'после 2')
      await eraseDigit(page, el)
      expect.eq(digits(await el.inputValue()), '79123456', 'после 3')
      step('стереть всё')
      for (let i = 0; i < 12; i++) await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '', 'после стирания всех цифр поле пусто, а не «+7»')
    },
  },
  {
    name: 'маска телефона: замена выделенных цифр в середине сохраняет хвост',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'phone')
      await typeIn(page, el, '9123456789')
      step('выделить «345» и набрать 0')
      await caret(el, 7, 10)
      await page.keyboard.type('0')
      expect.eq(await el.inputValue(), '+7 912 067-89', 'значение')
      expect.eq(await sel(el), [8, 8], 'каретка сразу за набранной цифрой')
      step('дальше набор с каретки')
      await page.keyboard.type('5')
      expect.eq(await el.inputValue(), '+7 912 056-78-9', 'значение после второй цифры')
    },
  },
  {
    name: 'маска телефона: Backspace и Delete в середине заполненного номера',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'phone')
      await typeIn(page, el, '9123456789')
      step('Delete перед «3»')
      await caret(el, 7)
      await page.keyboard.press('Delete')
      expect.eq(await el.inputValue(), '+7 912 456-78-9', 'после Delete')
      expect.eq(await sel(el), [7, 7], 'каретка на месте')
      step('Backspace после «2»')
      await caret(el, 6)
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '+7 914 567-89', 'после Backspace')
    },
  },
  {
    name: 'маска телефона: выделить всё и набрать другое, выделить всё и стереть',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'phone')
      await typeIn(page, el, '9123456789')
      step('Ctrl+A и набор')
      await selectAll(page)
      await page.keyboard.type('9001112233')
      expect.eq(await el.inputValue(), '+7 900 111-22-33', 'замена')
      step('Ctrl+A и Backspace')
      await selectAll(page)
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '', 'поле пусто')
    },
  },
  {
    name: 'маска телефона: вставка поверх выделения заменяет его, а не дописывает',
    story: STORY,
    run: async ({ page, expect }) => {
      const el = field(page, 'phone')
      await typeIn(page, el, '9123456789')
      await el.focus()
      await selectAll(page)
      await paste(page, '9001112233')
      expect.eq(await el.inputValue(), '+7 900 111-22-33', 'значение')
    },
  },

  typing('маска даты: набор целой даты и дописывание ведущего нуля', 'date', [
    ['12052024', '12.05.2024'],
    ['1.5.2026', '01.05.2026'],
    ['4', '04'],
    ['1205202499', '12.05.2024'],
  ]),
  typing('маска даты: невозможные день и месяц не принимаются', 'date', [
    ['35', '3'],
    ['00', '0'],
    ['1213', '12.1'],
    ['12.00', '12.0'],
  ]),
  pasting('маска даты: вставка ISO, короткого и цифрового форматов; невозможная дата и мусор отбрасываются', 'date', [
    ['2026-01-10', '10.01.2026'],
    ['2026-01-10T12:00', '10.01.2026'],
    ['1.1.2026', '01.01.2026'],
    ['1/2/2026', '01.02.2026'],
    ['10012026', '10.01.2026'],
    ['45.13.2024', ''],
    ['abc', ''],
  ]),
  {
    name: 'маска даты: Backspace стирает по цифре с конца, замена выделения целиком',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'date')
      await typeIn(page, el, '12052024')
      step('стирание по одной цифре')
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '12.05.202', 'после 1')
      for (let i = 0; i < 3; i++) await eraseDigit(page, el)
      expect.eq(digits(await el.inputValue()), '1205', 'после 4')
      step('выделить всё и набрать новую дату')
      await selectAll(page)
      await page.keyboard.type('01012000')
      expect.eq(await el.inputValue(), '01.01.2000', 'замена')
    },
  },

  typing('маска времени: набор с ведущим нулём и допустимые пределы', 'time', [
    ['930', '09:30'],
    ['2359', '23:59'],
    ['0000', '00:00'],
    ['1:05', '01:05'],
    ['1.05', '01:05'],
    ['25', '2'],
  ]),
  pasting('маска времени: вставка целого времени и невозможные значения', 'time', [
    ['09:30', '09:30'],
    ['1:05', '01:05'],
    ['24:00', ''],
    ['25:61', ''],
    ['abc', ''],
  ]),
  {
    name: 'маска времени: Backspace с конца и замена выделения',
    story: STORY,
    run: async ({ page, expect }) => {
      const el = field(page, 'time')
      await typeIn(page, el, '2359')
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '23:5', 'после 1')
      await eraseDigit(page, el)
      await eraseDigit(page, el)
      expect.eq(digits(await el.inputValue()), '2', 'после 3')
      await selectAll(page)
      await page.keyboard.type('0745')
      expect.eq(await el.inputValue(), '07:45', 'замена')
    },
  },

  typing('маски паспорта и загранпаспорта: группы и предел длины, буквы отбрасываются', 'passport', [
    ['1234567890', '1234 567890'],
    ['123456789012', '1234 567890'],
    ['12ab34', '1234'],
  ]),
  typing('маска загранпаспорта: 2+7 цифр', 'foreign', [
    ['123456789', '12 3456789'],
    ['1234567890', '12 3456789'],
  ]),
  typing('маска карты: группы по четыре, лишние цифры отбрасываются', 'card', [
    ['1234567890123456', '1234 5678 9012 3456'],
    ['12345678901234567', '1234 5678 9012 3456'],
    ['1234x5678', '1234 5678'],
  ]),
  pasting('маска карты: вставка с пробелами, дефисами и мусором', 'card', [
    ['1234 5678 9012 3456', '1234 5678 9012 3456'],
    ['1234-5678-9012-3456', '1234 5678 9012 3456'],
    ['карта 1234567890123456 ок', '1234 5678 9012 3456'],
    ['abcd', ''],
  ]),
  {
    name: 'маска карты: правка в середине заполненного номера (Backspace, Delete, замена выделения)',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'card')
      await typeIn(page, el, '1234567890123456')
      step('Backspace после второй цифры')
      await caret(el, 2)
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '1345 6789 0123 456', 'после Backspace')
      expect.eq(await sel(el), [1, 1], 'каретка')
      step('Delete перед пробелом: цифра справа от него стирается не позже второго нажатия')
      await el.fill('')
      await typeIn(page, el, '1234567890123456')
      await caret(el, 4)
      await page.keyboard.press('Delete')
      if ((await el.inputValue()) === '1234 5678 9012 3456') await page.keyboard.press('Delete')
      expect.eq(await el.inputValue(), '1234 6789 0123 456', 'после Delete')
      expect.eq(await sel(el), [5, 5], 'каретка стоит за разделителем')
      step('заменить вторую группу')
      await el.fill('')
      await typeIn(page, el, '1234567890123456')
      await caret(el, 5, 9)
      await page.keyboard.type('0000')
      expect.eq(await el.inputValue(), '1234 0000 9012 3456', 'замена группы')
    },
  },
  typing('маска расчётного счёта: 20 цифр, группировка 5-3-1-11', 'account', [
    ['40817810099910004312', '40817 810 0 99910004312'],
    ['408178100999100043129999', '40817 810 0 99910004312'],
  ]),
  typing('маски ИНН и КПП: только цифры и предел длины', 'inn', [
    ['123456789012', '123456789012'],
    ['1234567890123', '123456789012'],
    ['12ab34', '1234'],
  ]),
  typing('маска КПП: девять цифр', 'kpp', [
    ['770101001', '770101001'],
    ['7701010019', '770101001'],
  ]),
  typing('маска КБК: 20 цифр, группировка 3-1-2-5-2-4-3', 'kbk', [
    ['18210102010011000110', '182 1 01 02010 01 1000 110'],
    ['182101020100110001109', '182 1 01 02010 01 1000 110'],
  ]),
  {
    name: 'маски ИНН, счёта и КБК: вставка мусора не оставляет в поле ничего, вставка с разделителями раскладывается',
    story: STORY,
    run: async ({ page, expect }) => {
      const cases = [
        ['inn', 'abc', ''],
        ['inn', 'ИНН 7707-083893', '7707083893'],
        ['account', '40817-810-0-99910004312', '40817 810 0 99910004312'],
        ['kbk', '182 1 01 02010 01 1000 110', '182 1 01 02010 01 1000 110'],
      ]
      for (const [key, text, want] of cases) {
        const el = field(page, key)
        await el.fill('')
        await el.focus()
        await paste(page, text)
        expect.eq(await el.inputValue(), want, `${key}: вставка «${text}»`)
      }
    },
  },

  typing('маска суммы: разряды через пробел, дробная часть не набирается, буквы отбрасываются', 'amount', [
    ['1234567', '1 234 567'],
    ['007', '7'],
    ['abc', ''],
    ['12ab34', '1 234'],
    ['1234,56', '1 234'],
  ]),
  pasting('маска суммы: вставка с разрядами и копейками, отрицательная и мусор не принимаются', 'amount', [
    ['1 234 567', '1 234 567'],
    ['1234567', '1 234 567'],
    ['1 234 567,89', '1 234 567'],
    ['-12', ''],
    ['abc', ''],
  ]),
  {
    name: 'маска суммы: Backspace, Delete и вставка цифры в середине пересчитывают разряды',
    story: STORY,
    run: async ({ page, expect, step }) => {
      const el = field(page, 'amount')
      await typeIn(page, el, '1234567')
      step('Backspace в конце')
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '123 456', 'после Backspace')
      step('Backspace в середине')
      await el.fill('')
      await typeIn(page, el, '1234567')
      await caret(el, 3)
      await page.keyboard.press('Backspace')
      expect.eq(await el.inputValue(), '134 567', 'после Backspace в середине')
      step('Delete перед пробелом: цифра справа от него стирается не позже второго нажатия')
      await el.fill('')
      await typeIn(page, el, '1234567')
      await caret(el, 1)
      await page.keyboard.press('Delete')
      if ((await el.inputValue()) === '1 234 567') await page.keyboard.press('Delete')
      expect.eq(await el.inputValue(), '134 567', 'после Delete')
      step('цифра в середину')
      await el.fill('')
      await typeIn(page, el, '1234567')
      await caret(el, 1)
      await page.keyboard.type('9')
      expect.eq(await el.inputValue(), '19 234 567', 'после вставки цифры')
      expect.eq(await sel(el), [2, 2], 'каретка сразу за цифрой')
    },
  },
  {
    name: 'маска суммы: выделить всё и набрать другую сумму, выделить всё и стереть',
    story: STORY,
    run: async ({ page, expect }) => {
      const el = field(page, 'amount')
      await typeIn(page, el, '1234567')
      await selectAll(page)
      await page.keyboard.type('5')
      expect.eq(await el.inputValue(), '5', 'замена')
      await page.keyboard.type('000')
      expect.eq(await el.inputValue(), '5 000', 'продолжение набора')
      await selectAll(page)
      await page.keyboard.press('Delete')
      expect.eq(await el.inputValue(), '', 'стёрто')
    },
  },
]

export default fold(all, [
  ['маска телефона: набор и вставка целой строки, лишние цифры, буквы и мусор', 'маска телефона: набор по цифре', 'маска телефона: вставка целой строки'],
  ['маска телефона: замена и стирание выделения (Ctrl+A, вставка поверх)', 'маска телефона: выделить всё и набрать', 'маска телефона: вставка поверх выделения'],
  ['маска даты: набор (ведущий нуль, недопустимые день и месяц), вставка ISO/коротких форматов и мусора', 'маска даты: набор целой даты', 'маска даты: невозможные день и месяц', 'маска даты: вставка ISO'],
  ['маска времени: набор, вставка, стирание с конца и замена выделения', 'маска времени: набор с ведущим', 'маска времени: вставка целого', 'маска времени: Backspace'],
  ['маски паспорта и загранпаспорта: группы, предел длины, буквы отбрасываются', 'маски паспорта и загранпаспорта', 'маска загранпаспорта'],
  ['маска карты: набор и вставка (пробелы, дефисы, мусор)', 'маска карты: группы по четыре', 'маска карты: вставка с пробелами'],
  ['маски счёта, ИНН, КПП, КБК: группировка, предел длины, вставка с разделителями и мусором', 'маска расчётного счёта', 'маски ИНН и КПП', 'маска КПП', 'маска КБК', 'маски ИНН, счёта и КБК'],
  ['маска суммы: набор и вставка (разряды, без копеек, минус и мусор не принимаются)', 'маска суммы: разряды через пробел', 'маска суммы: вставка с разрядами'],
])
