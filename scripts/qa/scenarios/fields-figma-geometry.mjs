// Слой 4: геометрия форм по мастерам Figma — замер живых значений (px), а не классов.
// Числа сняты с мастеров: карточка OTP `ELK / otp-code` (Desktop 592×488, Mobile поле 216), Textarea Filled
// (подпись y=8, значение y=24), «Menu Point (ELK)» (строка с подписью 76), строка поиска ELK / input (56),
// `ELK / file-upload` и `ELK / files` (Files L: имя y=2, вторая строка y=30 на 48).
// Рамка в CSS занимает место, а у Figma лежит внутри размера, поэтому у полей с рамкой отсчёт от верха коробки
// даёт +1 к y макета (подпись Textarea — 9, значение — 25).
import { setArgs } from './fields-lib.mjs'

const OTP = 'компоненты-otp-code--playground'
const TA = 'компоненты-text-area--playground'
const AC = 'qa-autocomplete--opened'
const CB = 'компоненты-combobox--playground'
const DZ = 'компоненты-file-upload--playground'
const FI = 'компоненты-files--playground'

export default [
  {
    name: 'геометрия OTP (десктоп): карточка 488, тексты с y=48, поле кода 56, форма 240, цифры 44/56',
    story: OTP,
    run: async ({ page, expect }) => {
      await page.locator('input[data-slot=otp-input]').waitFor()
      const m = await page.evaluate(() => {
        const card = document.querySelector('[data-slot=otp-confirm-card]')
        const input = document.querySelector('input[data-slot=otp-input]')
        const top = card.getBoundingClientRect().y
        const cs = getComputedStyle(input)
        return {
          card: card.getBoundingClientRect().height,
          title: card.querySelector('h1,h2').getBoundingClientRect().y - top,
          input: input.getBoundingClientRect().height,
          form: input.closest('form').getBoundingClientRect().height,
          fs: cs.fontSize,
          lh: cs.lineHeight,
        }
      })
      expect.eq(m.card, 488, 'высота карточки')
      expect.eq(m.title, 48, 'верх заголовка от верха карточки')
      expect.eq(m.input, 56, 'высота поля кода')
      expect.eq(m.form, 240, 'слот поля кода (поле 56 + 48 + повтор 56 + 24 + кнопка 56)')
      expect.eq([m.fs, m.lh], ['44px', '56px'], 'кегль и строка цифр (H1 44/56)')
    },
  },
  {
    name: 'геометрия OTP (мобильная форма): поле 48, слот 216, цифры 28/38',
    story: OTP,
    viewport: [375, 900],
    run: async ({ page, expect }) => {
      await page.locator('input[data-slot=otp-input]').waitFor()
      await setArgs(page, { id: OTP }, { viewport: 'mobile' })
      const m = await page.evaluate(() => {
        const input = document.querySelector('input[data-slot=otp-input]')
        const cs = getComputedStyle(input)
        return { input: input.getBoundingClientRect().height, form: input.closest('form').getBoundingClientRect().height, fs: cs.fontSize, lh: cs.lineHeight }
      })
      expect.eq(m.input, 48, 'высота поля кода')
      expect.eq(m.form, 216, 'слот поля кода')
      expect.eq([m.fs, m.lh], ['28px', '38px'], 'кегль и строка цифр (H1 Mobile 28/38)')
    },
  },
  {
    name: 'геометрия Textarea: в заполненном состоянии подпись на 8 (+1 рамка), значение на 24 (+1) — без зазора',
    story: TA,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: TA }, { figmaType: 'filled', label: 'Label' })
      const m = await page.evaluate(() => {
        const ta = document.querySelector('textarea')
        const box = ta.parentElement
        const top = box.getBoundingClientRect().y
        return { label: box.querySelector('label').getBoundingClientRect().y - top, value: ta.getBoundingClientRect().y - top, h: box.getBoundingClientRect().height }
      })
      expect.eq(m.label, 9, 'верх подписи')
      expect.eq(m.value, 25, 'верх значения = подпись + 16')
      expect.eq(m.h, 112, 'высота коробки не меняется')
    },
  },
  {
    name: 'геометрия Autocomplete: пункт с подписью 76 = 16 + 24 + 4 + 16 + 16, заголовок 16/24 500, подпись 12/16',
    story: AC,
    run: async ({ page, expect }) => {
      await page.locator('[data-slot=autocomplete-item]').first().waitFor()
      const m = await page.evaluate(() => {
        const it = document.querySelector('[data-slot=autocomplete-item]')
        const [t, s] = [...it.children]
        const r = (e) => e.getBoundingClientRect()
        const f = (e) => { const c = getComputedStyle(e); return [c.fontSize, c.lineHeight, c.fontWeight] }
        return { h: r(it).height, title: r(t).y - r(it).y, sub: r(s).y - r(it).y, tf: f(t), sf: f(s) }
      })
      expect.eq(m.h, 76, 'высота строки')
      expect.eq([m.title, m.sub], [16, 44], 'y заголовка и подписи (зазор 4)')
      expect.eq(m.tf, ['16px', '24px', '500'], 'заголовок P1 Medium')
      expect.eq(m.sf, ['12px', '16px', '500'], 'подпись P3 Medium')
    },
  },
  {
    name: 'геометрия Combobox: строка поиска 56 (рамка внутри), список начинается сразу под ней без отступа',
    story: CB,
    run: async ({ page, expect }) => {
      await setArgs(page, { id: CB }, { search: true })
      await page.locator('[role=combobox], [data-slot=combobox-trigger]').first().click()
      await page.locator('[data-slot=combobox-search]').waitFor()
      const m = await page.evaluate(() => {
        const row = document.querySelector('[data-slot=combobox-search]').parentElement
        const list = document.querySelector('[data-slot=combobox-list]')
        const item = list.querySelector('[role=option]')
        return { row: row.getBoundingClientRect().height, gap: item.getBoundingClientRect().y - row.getBoundingClientRect().bottom, pt: getComputedStyle(list).paddingTop }
      })
      expect.eq(m.row, 56, 'высота строки поиска')
      expect.eq(m.gap, 0, 'первая строка вплотную к строке поиска')
      expect.eq(m.pt, '0px', 'верхнего отступа у списка нет')
    },
  },
  {
    name: 'геометрия File Upload: подпись под заголовком Regular 400 12/16; мобильная форма — «Загрузите файлы»',
    story: DZ,
    run: async ({ page, expect }) => {
      await page.locator('[data-slot=file-upload-dropzone]').waitFor()
      const sub = () => page.evaluate(() => {
        const s = [...document.querySelectorAll('[data-slot=file-upload-dropzone] > span')].pop()
        const c = getComputedStyle(s)
        return [c.fontSize, c.lineHeight, c.fontWeight]
      })
      const text = () => page.locator('[data-slot=file-upload-dropzone]').evaluate((e) => e.innerText.split('\n')[0].trim())
      expect.eq(await sub(), ['12px', '16px', '400'], 'подпись Regular 12/16')
      expect.eq(await text(), 'Перетащите или загрузите файлы', 'десктопный заголовок')
      await setArgs(page, { id: DZ }, { viewport: 'mobile' })
      expect.eq(await text(), 'Загрузите файлы', 'мобильный заголовок без перетаскивания')
      expect.eq(await sub(), ['12px', '16px', '400'], 'подпись на мобильной')
    },
  },
  {
    name: 'геометрия Files L: зазор 4 между именем и второй строкой (на 48: имя y=2, строка y=30); мобильная 40: 20 + 4 + 16',
    story: FI,
    run: async ({ page, expect }) => {
      await page.locator('[data-slot=file-item]').first().waitFor()
      const m = () => page.evaluate(() => {
        const it = document.querySelector('[data-slot=file-item]')
        const [n, s] = [...it.children[1].children]
        const r = (e) => e.getBoundingClientRect()
        return { h: r(it).height, name: r(n).y - r(it).y, sub: r(s).y - r(it).y, nfs: getComputedStyle(n).fontSize + '/' + getComputedStyle(n).lineHeight }
      })
      expect.eq(await m(), { h: 48, name: 2, sub: 30, nfs: '16px/24px' }, 'L / Desktop')
      await setArgs(page, { id: FI }, { figmaSize: 'l-mobile' })
      expect.eq(await m(), { h: 40, name: 0, sub: 24, nfs: '14px/20px' }, 'L / Mobile')
    },
  },
]
