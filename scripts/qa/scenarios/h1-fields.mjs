// Слой 4: сверка группы «поля» с мастерами Figma (проход h1) — замер живых значений, а не классов.
// Числа и цвета сняты с мастеров: `ELK / otp-code` → Input Code (Focused: каретка 1×40 на десктопе и 1×32 на
// мобильной, верхним краем по кадру Code; Error: подпись на 64 от верха кадра, раскладка кнопок не сдвигается),
// `ELK / input` (Comment & Icon, Error Input & Icon: значок «i» 16px в конце строки подписи, зазор 8 у Comment и 4
// у Error, значок серый #999), `ELK / dropdown` (подвал 56px, «Сбросить» при нуле выбранных: #EFEFEF / #C8C8CB),
// `ELK / files` (Disabled: имя, строка сведений и значок #999 без прозрачности; S: сведения P4 Regular 10/12, вес 400).
import { setArgs } from './fields-lib.mjs'

const OTP = 'компоненты-otp-code--playground'
const IN = 'компоненты-input--playground'
const CB = 'компоненты-combobox--playground'
const FI = 'компоненты-files--playground'
const TA = 'компоненты-text-area--playground'

const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`

// Состояние фокуса поля кода: поле в карточке получает фокус само при открытии.
const otpMetrics = (page) =>
  page.evaluate(() => {
    const card = document.querySelector('[data-slot=otp-confirm-card]')
    const input = card.querySelector('[data-slot=otp-input]')
    const caret = card.querySelector('[data-slot=otp-caret]')
    const form = card.querySelector('form')
    const ib = input.getBoundingClientRect()
    const cb = caret?.getBoundingClientRect()
    const submit = card.querySelector('button[type=submit]').getBoundingClientRect()
    const err = card.querySelector('[id$=-caption]')
    return {
      caret: cb && { w: cb.width, h: cb.height, top: +(cb.y - ib.y).toFixed(1), color: getComputedStyle(caret).backgroundColor },
      form: form.getBoundingClientRect().height,
      submitTop: +(submit.y - ib.y).toFixed(1),
      err: err && { top: +(err.getBoundingClientRect().y - ib.y).toFixed(1), h: err.getBoundingClientRect().height },
    }
  })

export default [
  {
    name: 'h1 OTP (десктоп): каретка пустого поля 1×40, верхним краем по кадру Code, цвет #252628',
    story: OTP,
    run: async ({ page, expect }) => {
      await page.locator('input[data-slot=otp-input]').waitFor()
      await page.evaluate(() => document.querySelector('input[data-slot=otp-input]').focus())
      const m = await otpMetrics(page)
      expect(m.caret, 'каретка нарисована')
      expect.eq([m.caret.w, m.caret.h, m.caret.top], [1, 40, 0], 'ширина, высота, верх каретки от верха кадра Code')
      expect.eq(m.caret.color, rgb(37, 38, 40), 'цвет каретки')
      // Focused мастера — только каретка и линия: «Введите код из СМС» есть лишь у Default.
      const ph = await page.evaluate(() => getComputedStyle(document.querySelector('input[data-slot=otp-input]'), '::placeholder').color)
      expect.eq(ph, 'rgba(0, 0, 0, 0)', 'placeholder в фокусе прозрачный')
      await page.evaluate(() => document.querySelector('input[data-slot=otp-input]').blur())
      const blurred = await page.evaluate(() => getComputedStyle(document.querySelector('input[data-slot=otp-input]'), '::placeholder').color)
      expect.eq(blurred, rgb(153, 153, 153), 'без фокуса placeholder #999 (Default мастера)')
    },
  },
  {
    name: 'h1 OTP (мобильная): каретка пустого поля 1×32, ошибка не сдвигает кнопки (подпись на 64, отправка на 96+)',
    story: OTP,
    viewport: [375, 900],
    run: async ({ page, expect }) => {
      await page.locator('input[data-slot=otp-input]').waitFor()
      await setArgs(page, { id: OTP }, { viewport: 'mobile' })
      await page.evaluate(() => document.querySelector('input[data-slot=otp-input]').focus())
      const clean = await otpMetrics(page)
      expect.eq([clean.caret.w, clean.caret.h, clean.caret.top], [1, 32, 0], 'каретка 1×32 у верха кадра Code')
      await setArgs(page, { id: OTP }, { error: 'Неверный код, превышено количество попыток', defaultValue: '882372' })
      const bad = await otpMetrics(page)
      expect.eq(bad.err.top, 64, 'подпись ошибки стоит на 64 от верха кадра Code (16 ниже линии)')
      expect.eq(bad.submitTop, clean.submitTop, 'кнопка «Подтвердить» не сдвинулась от появления ошибки')
      expect.eq(bad.form, clean.form, 'высота формы не изменилась')
    },
  },
  {
    name: 'h1 Input: Comment & Icon — значок «i» 16×16 в конце строки подписи, зазор 8, серый #999; Error Input & Icon — зазор 4, значок серый',
    story: IN,
    run: async ({ page, expect }) => {
      await page.locator('input[data-slot=input]').waitFor()
      const read = () =>
        page.evaluate(() => {
          const caption = document.querySelector('p[id$=-caption]')
          const row = caption.parentElement
          const icon = row.querySelector('svg')
          const r = row.getBoundingClientRect()
          const i = icon.getBoundingClientRect()
          const p = caption.getBoundingClientRect()
          return {
            icon: [i.width, i.height],
            right: +(r.right - 16 - i.right).toFixed(1),
            gap: +(i.left - p.right).toFixed(1),
            iconColor: getComputedStyle(icon).color,
            textColor: getComputedStyle(caption).color,
            rowPad: getComputedStyle(row).paddingLeft,
          }
        })
      await setArgs(page, { id: IN }, { add: 'comment', showCommentIcon: true })
      const c = await read()
      expect.eq(c.icon, [16, 16], 'значок 16×16')
      expect.eq(c.right, 0, 'значок прижат к правому краю ряда (ряд с отступом 16)')
      expect.eq(c.gap, 8, 'зазор между текстом и значком у Comment')
      expect.eq(c.iconColor, rgb(153, 153, 153), 'цвет значка')
      expect.eq(c.rowPad, '16px', 'отступ ряда')
      await setArgs(page, { id: IN }, { add: 'error' })
      const e = await read()
      expect.eq(e.gap, 4, 'зазор у Error')
      expect.eq(e.iconColor, rgb(153, 153, 153), 'значок при ошибке остаётся серым, красит только текст')
      expect(e.textColor !== rgb(153, 153, 153), 'текст ошибки не серый')
      await setArgs(page, { id: IN }, { add: 'comment', showCommentIcon: false })
      expect.eq(await page.locator('p[id$=-caption]').locator('xpath=..').locator('svg').count(), 0, 'без флага значка нет')
    },
  },
  {
    name: 'h1 Input: state=focus в Playground показывает рамку и поднятую подпись (эмуляция фокуса в витрине)',
    story: IN,
    run: async ({ page, expect }) => {
      await page.locator('input[data-slot=input]').waitFor()
      const read = () =>
        page.evaluate(() => {
          const input = document.querySelector('input[data-slot=input]')
          const box = input.parentElement
          return { border: getComputedStyle(box).borderTopColor, labelTop: getComputedStyle(box.querySelector('label')).top, focused: document.activeElement === input }
        })
      const base = await read()
      await setArgs(page, { id: IN }, { state: 'focus' })
      const f = await read()
      expect.eq(f.focused, false, 'настоящего фокуса нет — состояние эмулируется')
      expect(f.border !== base.border, `рамка сменилась (${base.border} → ${f.border})`)
      expect.eq(f.border, rgb(153, 153, 153), 'рамка фокуса #999')
      expect(parseFloat(f.labelTop) < parseFloat(base.labelTop), `подпись поднялась (${base.labelTop} → ${f.labelTop})`)
    },
  },
  {
    name: 'h1 Textarea: state=focus в Playground — рамка фокуса и поднятая подпись (эмуляция, а не настоящий фокус)',
    story: TA,
    run: async ({ page, expect }) => {
      await page.locator('textarea[data-slot=textarea]').waitFor()
      const read = () =>
        page.evaluate(() => {
          const area = document.querySelector('textarea[data-slot=textarea]')
          const box = area.parentElement
          const label = box.querySelector('label')
          return { border: getComputedStyle(box).borderTopColor, labelTop: getComputedStyle(label).top, labelFs: getComputedStyle(label).fontSize, focused: document.activeElement === area }
        })
      const base = await read()
      await setArgs(page, { id: TA }, { state: 'focus' })
      const f = await read()
      expect.eq(f.focused, false, 'настоящего фокуса нет — состояние эмулируется')
      expect(f.border !== base.border, `рамка сменилась (${base.border} → ${f.border})`)
      expect.eq([f.labelTop, f.labelFs], ['8px', '12px'], 'подпись поднята (top 8, 12px), как при настоящем фокусе')
    },
  },
  {
    name: 'h1 Combobox (мобильная): высота подвала равна высоте кнопок, без пустой полосы под ними',
    story: CB,
    viewport: [375, 900],
    run: async ({ page, expect }) => {
      await setArgs(page, { id: CB }, { viewport: 'mobile' })
      await page.getByRole('combobox').first().click()
      await page.locator('[data-slot=combobox-footer]').waitFor()
      const m = await page.evaluate(() => {
        const footer = document.querySelector('[data-slot=combobox-footer]')
        const buttons = [...footer.querySelectorAll('button')].map((b) => b.getBoundingClientRect().height)
        return { footer: footer.getBoundingClientRect().height, buttons }
      })
      expect.eq(m.footer, m.buttons[0], `подвал ${m.footer} = кнопка ${m.buttons[0]}`)
      expect.eq(m.buttons[0], m.buttons[1], 'обе кнопки одной высоты')
    },
  },
  {
    name: 'h1 Combobox: подвал 56px; «Сбросить» при нуле выбранных — #EFEFEF / #C8C8CB, после выбора доступна, «Выбрать» всегда обычная',
    story: CB,
    run: async ({ page, expect }) => {
      await page.getByRole('combobox').first().click()
      await page.locator('[data-slot=combobox-footer]').waitFor()
      const read = () =>
        page.evaluate(() => {
          const footer = document.querySelector('[data-slot=combobox-footer]')
          const [reset, apply] = [...footer.querySelectorAll('button')]
          const s = (b) => ({ bg: getComputedStyle(b).backgroundColor, fg: getComputedStyle(b).color, disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' })
          return { h: footer.getBoundingClientRect().height, reset: s(reset), apply: s(apply), applyH: apply.getBoundingClientRect().height }
        })
      const zero = await read()
      expect.eq(zero.h, 56, 'высота подвала (линия сверху лежит внутри размера)')
      expect.eq(zero.applyH, 56, 'высота кнопки')
      expect.eq([zero.reset.bg, zero.reset.fg, zero.reset.disabled], [rgb(239, 239, 239), rgb(200, 200, 203), true], '«Сбросить» при нуле выбранных')
      expect.eq(zero.apply.disabled, false, '«Выбрать» не заблокирована')
      expect(zero.apply.bg !== rgb(239, 239, 239), 'заливка «Выбрать» не серая')
      await page.getByRole('option').first().click()
      const one = await read()
      expect.eq(one.reset.disabled, false, '«Сбросить» после выбора доступна')
      expect(one.reset.fg !== rgb(200, 200, 203), 'подпись «Сбросить» больше не серая')
      await page.locator('[data-slot=combobox-footer] button').first().click()
      expect.eq((await read()).reset.disabled, true, 'после сброса снова недоступна')
    },
  },
  {
    name: 'h1 Files: Disabled — без прозрачности, имя/сведения/значок #999, значки действий #252628; S — сведения 10/12 весом 400',
    story: FI,
    run: async ({ page, expect }) => {
      await page.locator('[data-slot=file-item]').waitFor()
      const read = () =>
        page.evaluate(() => {
          const row = document.querySelector('[data-slot=file-item]')
          const texts = [...row.querySelectorAll('[class*=truncate], [class*=line-clamp]')]
          const glyph = row.querySelector('svg')
          const btn = row.querySelector('button')
          return {
            opacity: getComputedStyle(row).opacity,
            name: getComputedStyle(texts[0]).color,
            meta: texts[1] && [getComputedStyle(texts[1]).color, getComputedStyle(texts[1]).fontSize, getComputedStyle(texts[1]).lineHeight, getComputedStyle(texts[1]).fontWeight],
            glyph: getComputedStyle(glyph).color,
            action: getComputedStyle(btn).color,
          }
        })
      await setArgs(page, { id: FI }, { state: 'disabled' })
      const d = await read()
      expect.eq(d.opacity, '1', 'прозрачность строки')
      expect.eq([d.name, d.meta[0], d.glyph], [rgb(153, 153, 153), rgb(153, 153, 153), rgb(153, 153, 153)], 'имя, сведения, значок документа')
      expect.eq(d.action, rgb(37, 38, 40), 'значки действий')
      await setArgs(page, { id: FI }, { state: 'default', figmaSize: 's-desktop' })
      const s = await read()
      expect.eq(s.meta.slice(1), ['10px', '12px', '400'], 'сведения S: P4 Regular')
    },
  },
]
