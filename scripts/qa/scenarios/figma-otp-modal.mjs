// Мастера Figma: цифры кода OTP по ячейкам, подпись ошибки и разделители тела Modal (замер живых значений).
// Числа сняты с мастеров: поле кода десктоп — ячейки 40 с зазором 16 (шаг 56), мобильная — ячейки 40 с зазором 8
// (шаг 48); подпись ошибки — Regular 12/16, на 8px ниже линии и раскладку не двигает; Scroll Divider в Modal
// лежит поверх края и места не занимает.
import { setArgs } from './fields-lib.mjs'

const OTP = 'компоненты-otp-code--playground'
const FAV = 'компоненты-меню-настройка-избранного--playground'

async function ready(page) {
  const input = page.locator('input[data-slot=otp-input]')
  await input.waitFor()
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-slot') === 'otp-input')
  return input
}

/** Ячейки слоя цифр: текст, ширина, центры и середина поля. */
const cellsOf = (page) =>
  page.evaluate(() => {
    const input = document.querySelector('input[data-slot=otp-input]')
    const ir = input.getBoundingClientRect()
    const cells = [...document.querySelectorAll('[data-otp-cell]')].map((c) => {
      const r = c.getBoundingClientRect()
      return { t: c.textContent, w: r.width, cx: r.x + r.width / 2 }
    })
    return { cells, mid: ir.x + ir.width / 2, scroll: [input.scrollWidth <= input.clientWidth + 1, input.scrollLeft] }
  })

const pitches = (cells) => cells.slice(1).map((c, i) => Math.round((c.cx - cells[i].cx) * 10) / 10)

const all = [
  {
    name: 'OTP (десктоп): цифры в ячейках 40 с шагом 56, группа по центру поля, поле не прокручивается',
    story: OTP,
    run: async ({ page, expect, step }) => {
      const input = await ready(page)
      for (const code of ['882372', '000000', '111111']) {
        step(`код ${code}`)
        await input.fill(code)
        const m = await cellsOf(page)
        expect.eq(m.cells.map((c) => c.t).join(''), code, 'слой показывает набранные цифры')
        expect.eq(m.cells.map((c) => c.w), Array(6).fill(40), 'ширина ячейки')
        expect.eq(pitches(m.cells), Array(5).fill(56), 'шаг ячеек = 40 + 16')
        const center = (m.cells[0].cx + m.cells[5].cx) / 2
        expect(Math.abs(center - m.mid) <= 1, `группа по центру поля (сдвиг ${center - m.mid})`)
        expect.eq(m.scroll, [true, 0], 'текст поля не прокручен')
      }
      const cs = await input.evaluate((e) => getComputedStyle(e).color)
      expect.eq(cs, 'rgba(0, 0, 0, 0)', 'собственный текст поля прозрачен')
    },
  },
  {
    name: 'OTP (десктоп): щелчок ставит каретку по ячейкам, стирание и правка в середине идут по нарисованным цифрам',
    story: OTP,
    run: async ({ page, expect, step }) => {
      const input = await ready(page)
      await page.keyboard.type('123456')
      step('щелчок по третьей ячейке слева, у её левой половины')
      const m = await cellsOf(page)
      const box = await input.boundingBox()
      await page.mouse.click(m.cells[2].cx - 8, box.y + 20)
      expect.eq(await input.evaluate((e) => e.selectionStart), 2, 'каретка перед третьей цифрой')
      step('Backspace убирает вторую цифру, каретка после первой')
      await page.keyboard.press('Backspace')
      expect.eq(await input.inputValue(), '13456', 'значение')
      expect.eq((await cellsOf(page)).cells.map((c) => c.t).join(''), '13456', 'слой')
      step('вставка цифры в середину')
      await page.keyboard.type('9')
      expect.eq(await input.inputValue(), '193456', 'значение')
      expect.eq((await cellsOf(page)).cells.map((c) => c.t).join(''), '193456', 'слой')
      step('каретка рисуется между ячейками, а не у нативной раскладки')
      const caretDx = await page.evaluate(() => {
        const c = document.querySelector('[data-slot=otp-caret]')
        const cell = c.closest('[data-otp-cell]')
        return Math.round(c.getBoundingClientRect().x - cell.getBoundingClientRect().x)
      })
      expect(caretDx === -8 || caretDx === 40 + 8 - 1 || caretDx === 40 + 8, `каретка на границе ячеек (dx ${caretDx})`)
    },
  },
  {
    name: 'OTP (мобильная форма): ячейки 40 с шагом 48, группа по центру, поле не прокручивается',
    story: OTP,
    viewport: [375, 900],
    run: async ({ page, expect }) => {
      const input = await ready(page)
      await setArgs(page, { id: OTP }, { viewport: 'mobile' })
      await input.fill('822372')
      const m = await cellsOf(page)
      expect.eq(m.cells.map((c) => c.w), Array(6).fill(40), 'ширина ячейки')
      expect.eq(pitches(m.cells), Array(5).fill(48), 'шаг ячеек = 40 + 8')
      const center = (m.cells[0].cx + m.cells[5].cx) / 2
      expect(Math.abs(center - m.mid) <= 1, `группа по центру поля (сдвиг ${center - m.mid})`)
      expect.eq(m.scroll, [true, 0], 'текст поля не прокручен')
      await input.fill('000000')
      expect.eq((await cellsOf(page)).scroll, [true, 0], 'из нулей поле не прокручивается')
    },
  },
  {
    name: 'OTP: подпись ошибки Regular 12/16 на 8px ниже линии, высота карточки и «Отправить повторно» не двигаются',
    story: OTP,
    run: async ({ page, expect }) => {
      await ready(page)
      const measure = () =>
        page.evaluate(() => {
          const card = document.querySelector('[data-slot=otp-confirm-card]')
          const input = document.querySelector('input[data-slot=otp-input]')
          const err = input.parentElement.parentElement.querySelector('p')
          const resend = [...card.querySelectorAll('form *')].reverse().find((b) => /Отправить повторно/.test(b.textContent) && b.getBoundingClientRect().height >= 40)
          const ir = input.getBoundingClientRect()
          const e = err && err.getBoundingClientRect()
          const cs = err && getComputedStyle(err)
          return {
            card: card.getBoundingClientRect().height,
            resendY: resend && resend.getBoundingClientRect().y,
            gap: e && Math.round(e.y - ir.bottom),
            h: e && e.height,
            font: cs && [cs.fontSize, cs.lineHeight, cs.fontWeight, cs.color],
            hit: e && resend ? e.bottom <= resend.getBoundingClientRect().y : null,
          }
        })
      const before = await measure()
      await setArgs(page, { id: OTP }, { error: 'Неверный код, превышено количество попыток' })
      const after = await measure()
      expect.eq(after.card, before.card, 'высота карточки с ошибкой')
      expect.eq(after.resendY, before.resendY, 'положение «Отправить повторно»')
      expect.eq(after.gap, 8, 'подпись на 8px ниже линии (у поля 56, линия в его низу)')
      expect.eq(after.font.slice(0, 3), ['12px', '16px', '400'], 'P3 Regular')
      expect(/^rgb\(215, 75, 84\)$/.test(after.font[3]) || after.font[3] !== 'rgb(0, 0, 0)', `цвет ошибки сохранён (${after.font[3]})`)
      expect.eq(after.hit, true, 'подпись не наезжает на «Отправить повторно»')
    },
  },
  {
    name: 'Modal: рамок у тела нет, разделители — внутренняя тень у края и только там, где есть что прокручивать',
    story: FAV,
    run: async ({ page, expect, step }) => {
      const body = page.locator('[data-slot=modal-body]')
      await body.waitFor()
      const m = await body.evaluate((b) => {
        const cs = getComputedStyle(b)
        return { bt: cs.borderTopWidth, bb: cs.borderBottomWidth, off: b.offsetHeight, cl: b.clientHeight }
      })
      expect.eq([m.bt, m.bb], ['0px', '0px'], 'рамок нет — место не занимают')
      expect.eq(m.off, m.cl, 'высота тела = высота клиентской области')
      // Делаем содержимое заведомо длиннее тела и листаем: сверху / посередине / внизу.
      await body.evaluate((b) => {
        const tall = document.createElement('div')
        tall.style.height = '3000px'
        b.appendChild(tall)
        b.scrollTop = 0
        b.dispatchEvent(new Event('scroll'))
      })
      const shadow = () => body.evaluate((b) => getComputedStyle(b).boxShadow)
      const has = (s, part) => s.includes(part)
      const TOP = '0px 1px 0px 0px inset'
      const BOTTOM = '0px -1px 0px 0px inset'
      step('начало')
      let s = await shadow()
      expect.eq([has(s, TOP), has(s, BOTTOM)], [false, true], 'в начале только нижний разделитель')
      step('середина')
      await body.evaluate((b) => { b.scrollTop = 300; b.dispatchEvent(new Event('scroll')) })
      s = await shadow()
      expect.eq([has(s, TOP), has(s, BOTTOM)], [true, true], 'в середине оба')
      step('конец')
      await body.evaluate((b) => { b.scrollTop = b.scrollHeight; b.dispatchEvent(new Event('scroll')) })
      s = await shadow()
      expect.eq([has(s, TOP), has(s, BOTTOM)], [true, false], 'в конце только верхний')
    },
  },
]

export default all
