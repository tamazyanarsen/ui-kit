// Checkbox, radio, toggle: мышь и клавиатура (Space, Tab, стрелки в группе), disabled, aria-атрибуты.
import { activeLabel, fold, ready, reopen, setArgs } from './fields-lib.mjs'

const CB_PLAY = 'компоненты-checkbox--playground'
const CB_INT = 'компоненты-checkbox--interactive'
const RADIO = 'компоненты-radio--group'
const RADIO_PLAY = 'компоненты-radio--playground'
const TOGGLE = 'компоненты-toggle--interactive'
const TOGGLE_PLAY = 'компоненты-toggle--playground'

const all = [
  {
    name: 'checkbox: клик по подписи и Space переключают, Enter — нет, счётчик в подписи родителя пересчитывается',
    story: CB_INT,
    run: async ({ page, expect, step }) => {
      const passport = page.getByRole('checkbox', { name: 'Паспорт РФ' })
      const parentCaption = page.getByText(/Выбрано: \d из 4/)
      expect.eq(await parentCaption.innerText(), 'Выбрано: 1 из 4', 'исходно выбран СНИЛС')
      step('клик по тексту подписи')
      await page.getByText('Паспорт РФ', { exact: true }).click()
      expect.eq(await passport.getAttribute('aria-checked'), 'true', 'отмечен')
      expect.eq(await parentCaption.innerText(), 'Выбрано: 2 из 4', 'счётчик')
      step('Space на сфокусированном')
      await passport.focus()
      await page.keyboard.press('Space')
      expect.eq(await passport.getAttribute('aria-checked'), 'false', 'снят Space')
      step('Enter не переключает')
      await page.keyboard.press('Enter')
      expect.eq(await passport.getAttribute('aria-checked'), 'false', 'Enter не меняет')
      expect.eq(await parentCaption.innerText(), 'Выбрано: 1 из 4', 'счётчик')
    },
  },
  {
    name: 'checkbox: родитель в состоянии «частично» по клику отмечает всех, повторный клик снимает всех; ручной выбор всех отмечает родителя',
    story: CB_INT,
    run: async ({ page, expect, step }) => {
      const parent = page.getByRole('checkbox', { name: /Все документы/ })
      const children = ['Паспорт РФ', 'СНИЛС', 'ИНН', 'Выписка ЕГРЮЛ'].map((n) => page.getByRole('checkbox', { name: n }))
      const states = async () => Promise.all(children.map((c) => c.getAttribute('aria-checked')))
      expect.eq(await parent.getAttribute('aria-checked'), 'mixed', 'исходно «частично»')
      step('клик по родителю')
      await parent.click()
      expect.eq(await states(), ['true', 'true', 'true', 'true'], 'все отмечены')
      expect.eq(await parent.getAttribute('aria-checked'), 'true', 'родитель отмечен')
      step('повторный клик')
      await parent.click()
      expect.eq(await states(), ['false', 'false', 'false', 'false'], 'все сняты')
      expect.eq(await parent.getAttribute('aria-checked'), 'false', 'родитель снят')
      step('ручной выбор всех по одному')
      for (const c of children) await c.click()
      expect.eq(await parent.getAttribute('aria-checked'), 'true', 'родитель отмечен сам')
      step('снять один')
      await children[2].click()
      expect.eq(await parent.getAttribute('aria-checked'), 'mixed', 'родитель «частично»')
    },
  },
  {
    name: 'checkbox: Tab проходит по чекбоксам по порядку, Shift+Tab возвращает',
    story: CB_INT,
    run: async ({ page, expect }) => {
      await ready(page)
      const names = []
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        names.push(await page.evaluate(() => document.activeElement?.getAttribute('role') + ':' + document.getElementById(document.activeElement?.getAttribute('aria-labelledby'))?.innerText.split('\n')[0]))
      }
      expect.eq(names, ['checkbox:Все документы', 'checkbox:Паспорт РФ', 'checkbox:СНИЛС', 'checkbox:ИНН', 'checkbox:Выписка ЕГРЮЛ'], 'порядок Tab')
      await page.keyboard.press('Shift+Tab')
      expect.eq(await page.evaluate(() => document.getElementById(document.activeElement?.getAttribute('aria-labelledby'))?.innerText.split('\n')[0]), 'ИНН', 'Shift+Tab')
    },
  },
  {
    name: 'checkbox: значение checked и «частично» из аргументов отражаются в aria-checked',
    story: CB_PLAY,
    run: async ({ page, expect }) => {
      const cb = page.getByRole('checkbox')
      expect.eq(await cb.getAttribute('aria-checked'), 'false', 'исходно снят')
      await setArgs(page, { id: CB_PLAY }, { checked: true })
      expect.eq(await cb.getAttribute('aria-checked'), 'true', 'checked')
      await setArgs(page, { id: CB_PLAY }, { checked: false, indeterminate: true })
      expect.eq(await cb.getAttribute('aria-checked'), 'mixed', 'частично')
    },
  },
  {
    name: 'checkbox: выключенный не переключается ни кликом, ни Space и выпадает из обхода Tab; включённый — переключается',
    story: CB_PLAY,
    run: async ({ page, expect, step }) => {
      const cb = page.getByRole('checkbox')
      step('включённый (контроль)')
      await reopen(page, { id: CB_PLAY }, 'checked:!undefined')
      await cb.click()
      expect.eq(await cb.getAttribute('aria-checked'), 'true', 'включённый переключился')
      step('выключенный')
      await reopen(page, { id: CB_PLAY }, 'checked:!undefined;state:disabled')
      expect.eq(await cb.getAttribute('aria-disabled'), 'true', 'aria-disabled')
      await cb.click({ force: true })
      await cb.focus({ timeout: 500 }).catch(() => {})
      await page.keyboard.press('Space')
      expect.eq(await cb.getAttribute('aria-checked'), 'false', 'не переключился')
      await page.evaluate(() => document.activeElement?.blur())
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.getAttribute('role')), null, 'Tab не встаёт на выключенный')
    },
  },
  {
    name: 'checkbox: ошибка выставляет aria-invalid, а текст ошибки связан с чекбоксом',
    story: CB_PLAY,
    run: async ({ page, expect }) => {
      const cb = page.getByRole('checkbox')
      expect.eq(await cb.getAttribute('aria-invalid'), null, 'без ошибки')
      await setArgs(page, { id: CB_PLAY }, { error: true })
      expect.eq(await cb.getAttribute('aria-invalid'), 'true', 'aria-invalid')
      const id = await cb.getAttribute('aria-describedby')
      expect(id, 'aria-describedby')
      expect.eq(await page.locator(`[id="${id}"]`).innerText(), 'Text about error here', 'текст ошибки')
    },
  },

  {
    name: 'radio: Tab входит в группу на отмеченной радиокнопке, стрелки переносят выбор и фокус, выключенная пропускается, по кругу',
    story: RADIO,
    run: async ({ page, expect, step }) => {
      const selected = () => page.locator('b').innerText()
      await ready(page)
      expect.eq(await selected(), 'card', 'исходный выбор')
      step('Tab входит на отмеченную')
      await page.keyboard.press('Tab')
      expect.eq(await activeLabel(page), 'Списать с карты', 'фокус на отмеченной')
      step('стрелка вниз')
      await page.keyboard.press('ArrowDown')
      expect.eq(await selected(), 'account', 'выбор account')
      expect.eq(await activeLabel(page), 'Списать со счёта', 'фокус переехал')
      await page.keyboard.press('ArrowRight')
      expect.eq(await selected(), 'sbp', 'выбор sbp')
      step('через выключенную «В кредит» по кругу')
      await page.keyboard.press('ArrowDown')
      expect.eq(await selected(), 'card', 'выключенная пропущена, круг замкнулся')
      step('вверх по кругу')
      await page.keyboard.press('ArrowUp')
      expect.eq(await selected(), 'sbp', 'вверх через выключенную')
    },
  },
  {
    name: 'radio: группа — один шаг Tab, следующий Tab уходит из группы, Shift+Tab возвращает на выбранную',
    story: RADIO,
    run: async ({ page, expect }) => {
      await ready(page)
      await page.keyboard.press('Tab')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => !!document.activeElement?.closest('[role=radiogroup]')), false, 'вышли из группы')
      await page.keyboard.press('Shift+Tab')
      expect.eq(await activeLabel(page), 'Списать со счёта', 'вернулись на выбранную')
    },
  },
  {
    name: 'radio: клик по подписи выбирает, клик по выключенной ничего не меняет, aria-checked и aria-disabled согласованы',
    story: RADIO,
    run: async ({ page, expect, step }) => {
      const selected = () => page.locator('b').innerText()
      const radio = (name) => page.getByRole('radio', { name })
      step('клик по тексту подписи')
      await page.getByText('Через СБП', { exact: true }).click()
      expect.eq(await selected(), 'sbp', 'выбран sbp')
      expect.eq(await radio(/Через СБП/).getAttribute('aria-checked'), 'true', 'aria-checked')
      expect.eq(await radio(/Списать с карты/).getAttribute('aria-checked'), 'false', 'прежний снят')
      step('выключенная')
      expect.eq(await radio(/В кредит/).getAttribute('aria-disabled'), 'true', 'aria-disabled')
      await page.getByText('В кредит', { exact: true }).click({ force: true })
      expect.eq(await selected(), 'sbp', 'выбор не изменился')
      step('Space на сфокусированной невыбранной')
      await radio(/Списать со счёта/).focus()
      await page.keyboard.press('Space')
      expect.eq(await selected(), 'account', 'Space выбирает')
    },
  },
  {
    name: 'radio: выбор из аргументов отражается в aria-checked, у Playground выключенная радиокнопка не выбирается',
    story: RADIO_PLAY,
    run: async ({ page, expect }) => {
      const r = page.getByRole('radio').first()
      await setArgs(page, { id: RADIO_PLAY }, { checked: true })
      expect.eq(await r.getAttribute('aria-checked'), 'true', 'checked')
      await setArgs(page, { id: RADIO_PLAY }, { checked: false, state: 'disabled' })
      expect.eq(await r.getAttribute('aria-disabled'), 'true', 'aria-disabled')
      await r.click({ force: true })
      expect.eq(await r.getAttribute('aria-checked'), 'false', 'выключенная не выбирается')
    },
  },

  {
    name: 'toggle: клик по подписи и Space переключают, aria-checked и подпись-комментарий согласованы, нативный чекбокс в том же состоянии',
    story: TOGGLE,
    run: async ({ page, expect, step }) => {
      const sw = page.getByRole('switch', { name: /Уведомления/ }).first()
      const email = page.getByRole('switch', { name: 'Письма на почту' })
      expect.eq(await email.getAttribute('aria-checked'), 'false', 'исходно выключен')
      step('клик по подписи')
      await page.getByText('Письма на почту', { exact: true }).click()
      expect.eq(await email.getAttribute('aria-checked'), 'true', 'включён')
      step('Space')
      await email.focus()
      await page.keyboard.press('Space')
      expect.eq(await email.getAttribute('aria-checked'), 'false', 'выключен Space')
      step('главный переключатель с комментарием')
      const comment = page.locator('[id$="-comment"]').first()
      const before = await sw.getAttribute('aria-checked')
      const beforeText = await comment.innerText()
      await sw.click()
      expect(before !== (await sw.getAttribute('aria-checked')), 'главный переключатель поменял состояние')
      expect(beforeText !== (await comment.innerText()), `комментарий изменился (было «${beforeText}»)`)
      expect.eq(await page.locator('input[type=checkbox]').first().isChecked(), (await sw.getAttribute('aria-checked')) === 'true', 'нативный input в том же состоянии')
    },
  },
  {
    name: 'toggle: Tab проходит по переключателям по порядку, каждый берёт фокус',
    story: TOGGLE,
    run: async ({ page, expect }) => {
      await ready(page)
      const roles = []
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab')
        roles.push(await page.evaluate(() => document.activeElement?.getAttribute('role')))
      }
      expect.eq(roles, ['switch', 'switch', 'switch', 'switch'], 'четыре переключателя')
    },
  },
  {
    name: 'toggle: выключенный не переключается ни кликом, ни Space, вне обхода Tab; включённый переключается',
    story: TOGGLE_PLAY,
    run: async ({ page, expect, step }) => {
      const sw = page.getByRole('switch')
      step('включённый (контроль)')
      await reopen(page, { id: TOGGLE_PLAY }, 'checked:!undefined')
      const start = await sw.getAttribute('aria-checked')
      await sw.click()
      expect(start !== (await sw.getAttribute('aria-checked')), 'включённый переключился')
      step('выключенный')
      await reopen(page, { id: TOGGLE_PLAY }, 'checked:!undefined;state:disabled')
      const before = await sw.getAttribute('aria-checked')
      expect.eq(await sw.getAttribute('aria-disabled'), 'true', 'aria-disabled')
      await sw.click({ force: true })
      await page.keyboard.press('Space')
      expect.eq(await sw.getAttribute('aria-checked'), before, 'не изменился')
      await page.evaluate(() => document.activeElement?.blur())
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.getAttribute('role')), null, 'Tab не встаёт на выключенный')
    },
  },
]

export default fold(all, [
  ['checkbox: клик по подписи, Space, Enter, счётчик родителя и порядок Tab', 'checkbox: клик по подписи', 'checkbox: Tab проходит'],
  ['checkbox: значения из аргументов, ошибка (aria-invalid), выключенный не переключается и вне обхода Tab', 'checkbox: значение checked', 'checkbox: выключенный не', 'checkbox: ошибка выставляет'],
  ['radio: Tab входит на отмеченную, стрелки переносят выбор и фокус, выключенная пропускается, выход из группы по Tab', 'radio: Tab входит', 'radio: группа — один шаг'],
  ['toggle: клик по подписи, Space, комментарий, нативный input и порядок Tab', 'toggle: клик по подписи', 'toggle: Tab проходит'],
])
