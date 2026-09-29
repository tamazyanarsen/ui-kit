// Range-input и count-button: мышь и клавиатура, границы и шаг, disabled, aria-атрибуты.
import { fold, ready, setArgs } from './fields-lib.mjs'

const RANGE = 'компоненты-range-input--playground'
const COUNT = 'компоненты-count-button--playground'

const slider = (page) => page.locator('input[type=range]')
const num = async (el, attr) => Number(await el.getAttribute(attr))
const activeLabel = (page) => page.evaluate(() => document.activeElement?.getAttribute('aria-labelledby') && document.getElementById(document.activeElement.getAttribute('aria-labelledby'))?.innerText.split('\n')[0])

const all = [
  {
    name: 'range-input: стрелки, PageUp/PageDown, Home/End меняют значение, вывод совпадает с aria-valuenow, пределы не пробиваются',
    story: RANGE,
    run: async ({ page, expect, step }) => {
      const el = slider(page)
      await el.focus()
      const out = page.locator('[data-slot=range-input-value]')
      expect.eq(await num(el, 'aria-valuenow'), 50, 'исходное значение')
      step('стрелки')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowUp')
      expect.eq(await num(el, 'aria-valuenow'), 52, 'после двух шагов вверх')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      expect.eq(await num(el, 'aria-valuenow'), 49, 'после трёх шагов вниз')
      expect.eq(await out.innerText(), '49', 'вывод значения совпадает')
      step('Home / End и пределы')
      await page.keyboard.press('Home')
      expect.eq(await num(el, 'aria-valuenow'), 0, 'Home')
      await page.keyboard.press('ArrowLeft')
      expect.eq(await num(el, 'aria-valuenow'), 0, 'ниже минимума не уходит')
      await page.keyboard.press('End')
      expect.eq(await num(el, 'aria-valuenow'), 100, 'End')
      await page.keyboard.press('ArrowRight')
      expect.eq(await num(el, 'aria-valuenow'), 100, 'выше максимума не уходит')
      step('PageDown / Shift+стрелка — крупный шаг')
      await page.keyboard.press('PageDown')
      expect.eq(await num(el, 'aria-valuenow'), 90, 'PageDown')
      await page.keyboard.press('Shift+ArrowLeft')
      expect.eq(await num(el, 'aria-valuenow'), 80, 'Shift+ArrowLeft')
    },
  },
  {
    name: 'range-input: щелчок по дорожке ставит значение в точку щелчка, ползунок можно перетащить, заливка следует за значением',
    story: RANGE,
    run: async ({ page, expect, step }) => {
      const track = page.locator('[data-slot=range-input-track]')
      const el = slider(page)
      const box = await track.boundingBox()
      step('щелчок на 25%')
      await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2)
      const v = await num(el, 'aria-valuenow')
      expect(Math.abs(v - 25) <= 3, `значение после щелчка на 25%: ${v}`)
      const fill = await page.locator('[data-slot=range-input-indicator]').evaluate((e) => e.style.width)
      expect.eq(parseFloat(fill), v, 'заливка соответствует значению')
      step('перетаскивание к 80%')
      const thumb = await page.locator('[data-slot=range-input-thumb]').boundingBox()
      await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 5 })
      await page.mouse.up()
      const w = await num(el, 'aria-valuenow')
      expect(Math.abs(w - 80) <= 3, `значение после перетаскивания: ${w}`)
    },
  },
  {
    name: 'range-input: шаг 5 и границы 10–60 из аргументов — значения кратны шагу и не выходят за границы',
    story: RANGE,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: RANGE }, { min: 10, max: 60, step: 5, rangeLine: 'beginning' })
      const el = slider(page)
      await el.focus()
      await page.keyboard.press('Home')
      expect.eq(await num(el, 'aria-valuenow'), 10, 'минимум')
      await page.keyboard.press('ArrowRight')
      expect.eq(await num(el, 'aria-valuenow'), 15, 'шаг 5')
      await page.keyboard.press('End')
      expect.eq(await num(el, 'aria-valuenow'), 60, 'максимум')
      expect.eq(await el.getAttribute('min'), '10', 'min')
      expect.eq(await el.getAttribute('max'), '60', 'max')
    },
  },
  {
    name: 'range-input: у ползунка есть имя из подписи, а комментарий и ошибка связаны через aria-describedby / aria-invalid',
    story: RANGE,
    run: async ({ page, expect, step }) => {
      const el = slider(page)
      expect.eq(await activeLabelOf(el), 'Label', 'подпись доступного имени')
      const cid = await el.getAttribute('aria-describedby')
      expect.eq(await page.locator(`[id="${cid}"]`).innerText(), 'Comment', 'комментарий')
      expect.eq(await el.getAttribute('aria-invalid'), null, 'без ошибки')
      step('ошибка')
      await setArgs(page, { id: RANGE }, { state: 'error' })
      expect.eq(await el.getAttribute('aria-invalid'), 'true', 'aria-invalid')
      step('снятие ошибки')
      await setArgs(page, { id: RANGE }, { state: 'default' })
      expect.eq(await el.getAttribute('aria-invalid'), null, 'aria-invalid снят')
    },
  },
  {
    name: 'range-input: выключенный ползунок не меняется ни с клавиатуры, ни мышью',
    story: RANGE,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: RANGE }, { state: 'disabled' })
      const el = slider(page)
      expect.eq(await el.isDisabled(), true, 'disabled')
      const box = await page.locator('[data-slot=range-input-track]').boundingBox()
      await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2)
      await page.keyboard.press('ArrowRight')
      expect.eq(await num(el, 'aria-valuenow'), 50, 'значение не изменилось')
    },
  },
  {
    name: 'range-input: формат «Рубли» показывает значение в валюте, значение слайдера остаётся числом',
    story: RANGE,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: RANGE }, { formatPreset: 'Рубли' })
      const el = slider(page)
      await el.focus()
      await page.keyboard.press('End')
      const text = await page.locator('[data-slot=range-input-value]').innerText()
      expect(/100/.test(text) && /₽/.test(text), `вывод «${text}»`)
      expect.eq(await num(el, 'aria-valuenow'), 100, 'aria-valuenow число')
    },
  },

  {
    name: 'count-button: счётчик показывает число, 100 и больше превращает в «99+», выключение счётчика убирает плашку',
    story: COUNT,
    run: async ({ page, expect }) => {
      const badge = page.locator('[data-slot=badge]')
      expect.eq(await badge.innerText(), '3', 'исходное значение')
      for (const [count, want] of [[1, '1'], [99, '99'], [100, '99+'], [999, '99+']]) {
        await setArgs(page, { id: COUNT }, { count })
        expect.eq(await badge.innerText(), want, `count=${count}`)
      }
      await setArgs(page, { id: COUNT }, { showCount: false })
      expect.eq(await badge.count(), 0, 'плашки нет')
    },
  },
  {
    name: 'count-button: выключенная кнопка не нажимается и не берёт фокус с клавиатуры, включённая — берёт по Tab',
    story: COUNT,
    run: async ({ page, expect }) => {
      const btn = page.locator('[data-slot=count-button] button')
      await ready(page)
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.textContent), 'Уведомления', 'Tab фокусирует кнопку')
      await setArgs(page, { id: COUNT }, { state: 'disabled' })
      expect.eq(await btn.isDisabled(), true, 'disabled')
      await page.evaluate(() => document.activeElement?.blur())
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.textContent === 'Уведомления'), false, 'выключенная кнопка вне обхода')
    },
  },
]

// Доступное имя ползунка: по aria-labelledby (первая строка текста подписи).
async function activeLabelOf(el) {
  return el.evaluate((e) => document.getElementById(e.getAttribute('aria-labelledby'))?.innerText.trim())
}

export default fold(all, [
  ['range-input: шаг и границы из аргументов, формат «Рубли»', 'range-input: шаг 5', 'range-input: формат «Рубли»'],
  ['range-input: доступное имя, комментарий и ошибка (aria), выключенный ползунок не меняется', 'range-input: у ползунка есть имя', 'range-input: выключенный ползунок'],
])
