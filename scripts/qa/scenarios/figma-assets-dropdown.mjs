// Слой 4: три сверки с макетом Figma — маскот ErrorPage (Type=Image), значки платёжных систем и габариты Dropdown.
// Проверяются ЧИСЛА из getBoundingClientRect и getComputedStyle, а не имена классов.
//   ErrorPage Type=Image: кадр 1216×488, слой IMG 1139×562 со сдвигом x +28.78 от центра и y −40.
//   Thumbnail Type=Card: значок 24×24 по центру; SBP Card: значок 24×6, правый край −4, низ −24, цифры на 8 от низа.
//   IB / card account: icon / mastercard 14×6 на (3, 3), рисунок 10.71 шириной. Card PS на лице карты: 80×26 / 52×17.
//   ELK / dropdown: min-w 280, max-w 1008, max-h 504.
import { setArgs } from './fields-lib.mjs'

const near = (expect, got, want, what, eps = 0.6) =>
  expect(Math.abs(got - want) <= eps, `${what}: получено ${got}, ожидалось ${want}`)

/** Прямоугольник элемента относительно `origin` (в пикселях, без округления). */
const relRect = (el, origin) => {
  const b = el.getBoundingClientRect()
  const o = origin.getBoundingClientRect()
  return { x: b.x - o.x, y: b.y - o.y, w: b.width, h: b.height }
}

// Окно выпадающего списка: всплывающее меню/список с data-size=desktop (его ставит сам Dropdown) либо статичный Dropdown.
const popupMetrics = (page) =>
  page.evaluate(() => {
    const d = document.querySelector('[data-size=desktop][data-slot$="-content"], [data-size=desktop][role=menu], [data-size=desktop][role=listbox], [data-slot=dropdown][data-size=desktop]')
    const b = d.getBoundingClientRect()
    const cs = getComputedStyle(d)
    return { w: b.width, h: b.height, x: b.x, r: b.right, minW: cs.minWidth, maxW: cs.maxWidth, maxH: cs.maxHeight }
  })

export default [
  {
    name: 'ErrorPage Type=Image: маскот по кадру мастера 1216×488 на десктопе',
    story: 'компоненты-error-page--playground',
    viewport: [1280, 900],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, { type: 'image' })
      const m = await page.evaluate((fn) => {
        const rel = new Function('return ' + fn)()
        const il = document.querySelector('[data-slot=error-page-illustration]')
        const ms = il.querySelector('.error-page-mascot-image')
        return { il: rel(il, il), ms: rel(ms, il), bg: getComputedStyle(ms).backgroundImage }
      }, relRect.toString())
      near(expect, m.il.w, 1216, 'ширина кадра')
      near(expect, m.il.h, 488, 'высота кадра')
      // IMG: левый край кадра + 608 + 28.78 − 569.5, слой ассета — обрезка (270, 128) при масштабе 2048/1139.
      near(expect, m.ms.x, 217.4, 'сдвиг маскота по x', 1)
      near(expect, m.ms.y, 31.2, 'сдвиг маскота по y', 1)
      near(expect, m.ms.w, 725.2, 'ширина маскота', 1)
      near(expect, m.ms.h, 439.6, 'высота маскота', 1)
      expect(/no-code-mascot/.test(m.bg), `картинка маскота: ${m.bg.slice(0, 80)}`)
    },
  },
  {
    name: 'ErrorPage Type=Image: на мобильном кадре маскот масштабируется вместе с кадром',
    story: 'компоненты-error-page--playground',
    viewport: [360, 800],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, { type: 'image' })
      const m = await page.evaluate((fn) => {
        const rel = new Function('return ' + fn)()
        const il = document.querySelector('[data-slot=error-page-illustration]')
        return { il: rel(il, il), ms: rel(il.querySelector('.error-page-mascot-image'), il) }
      }, relRect.toString())
      near(expect, m.il.w, 328, 'ширина кадра', 0.5)
      // Доли те же, что у десктопа: 217.44/1216, 31.22/488, 725.2/1216, 439.6/488.
      near(expect, m.ms.x / m.il.w, 0.1788, 'доля x', 0.002)
      near(expect, m.ms.y / m.il.h, 0.064, 'доля y', 0.002)
      near(expect, m.ms.w / m.il.w, 0.5964, 'доля ширины', 0.002)
      near(expect, m.ms.h / m.il.h, 0.9008, 'доля высоты', 0.002)
    },
  },
  {
    name: 'Thumbnail: значки платёжных систем по мастерам Card и SBP Card',
    story: 'компоненты-thumbnail--matrix',
    viewport: [1280, 1400],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=payment-icon]')
      const m = await page.evaluate((fn) => {
        const rel = new Function('return ' + fn)()
        return [...document.querySelectorAll('[data-slot=thumbnail]')].flatMap((t) => {
          const ic = t.querySelector('[data-slot=payment-icon]')
          if (!ic) return []
          const num = [...t.querySelectorAll('span')].find((s) => s.children.length === 0 && s.textContent.includes('·'))
          const cs = num && getComputedStyle(num)
          const b = t.getBoundingClientRect()
          return [{ type: t.dataset.type, tile: b.width, icon: rel(ic, t), img: rel(ic.querySelector('img'), t), num: num && rel(num, t), font: cs && [cs.fontSize, cs.fontWeight, cs.lineHeight] }]
        })
      }, relRect.toString())
      const card = m.filter((x) => x.type === 'card')
      const sbp = m.filter((x) => x.type === 'sbp-card')
      const acc = m.filter((x) => x.type === 'sbp-card-account')
      expect(card.length > 0 && sbp.length > 0 && acc.length > 0, `нет значков: ${m.length}`)
      for (const c of card) {
        const pad = (c.tile - 24) / 2 // поля 12 у плитки 48 и 8 у плитки 40
        near(expect, c.icon.w, 24, 'Card: ширина значка'); near(expect, c.icon.h, 24, 'Card: высота значка')
        near(expect, c.icon.x, pad, 'Card: значок по центру, x'); near(expect, c.icon.y, pad, 'Card: значок по центру, y')
      }
      for (const s of sbp) {
        near(expect, s.icon.w, 24, 'SBP: ширина значка'); near(expect, s.icon.h, 6, 'SBP: высота значка')
        near(expect, s.tile - (s.icon.x + s.icon.w), 4, 'SBP: правый отступ значка')
        near(expect, s.tile - (s.icon.y + s.icon.h), 24, 'SBP: значок стоит на 24 выше низа')
        near(expect, s.tile - (s.num.y + s.num.h), 8, 'SBP: цифры на 8 выше низа')
        near(expect, s.tile - (s.num.x + s.num.w), 4, 'SBP: правый отступ цифр')
        expect.eq(s.font, ['10px', '400', '12px'], 'SBP: цифры P4 Regular')
      }
      for (const a of acc) {
        // Плитка счёта короче на 10% (высота 90%): отступы 22.2 и 6.2 считаются от низа этой плитки.
        const h = a.tile * 0.9
        near(expect, h - (a.icon.y + a.icon.h), 22.2, 'SBP Card Account: значок на 22.2 выше низа плитки')
        near(expect, h - (a.num.y + a.num.h), 6.2, 'SBP Card Account: цифры на 6.2 выше низа плитки')
      }
    },
  },
  {
    name: 'Card: миниатюра — icon / mastercard 14×6 на (4, 4) от кромки, рисунок 10.71 шириной',
    story: 'компоненты-card--matrix',
    viewport: [1280, 1200],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=payment-icon]')
      const m = await page.evaluate((fn) => {
        const rel = new Function('return ' + fn)()
        return [...document.querySelectorAll('[data-slot=card-account]')].flatMap((c) => {
          const ic = c.querySelector('[data-slot=payment-icon]')
          return ic ? [{ box: rel(c, c), icon: rel(ic, c), img: rel(ic.querySelector('img'), c), sys: ic.dataset.system }] : []
        })
      }, relRect.toString())
      expect(m.length > 0, 'в миниатюре нет ни одного значка')
      for (const c of m) {
        expect.eq(c.sys, 'mastercard', 'значок 14×6 есть в мастере только у Mastercard')
        near(expect, c.box.w, 48, 'ширина миниатюры'); near(expect, c.box.h, 34, 'высота миниатюры')
        // Кромка миниатюры 1px: (3, 3) внутри неё — это (4, 4) от границы блока.
        near(expect, c.icon.x, 4, 'значок x'); near(expect, c.icon.y, 4, 'значок y')
        near(expect, c.icon.w, 14, 'коробка 14'); near(expect, c.icon.h, 6, 'коробка 6')
        near(expect, c.img.w, 10.71, 'рисунок Mastercard (76.53% коробки)', 0.05)
      }
    },
  },
  {
    name: 'Cards: логотип на лице карты — коробка Card PS и высота рисунка по мастеру',
    story: 'компоненты-cards--matrix',
    viewport: [1280, 1400],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=card-ps]')
      await page.waitForFunction(() => new Set([...document.querySelectorAll('[data-slot=card-ps]')].map((e) => e.dataset.system)).size >= 4)
      const m = await page.evaluate((fn) => {
        const rel = new Function('return ' + fn)()
        return [...document.querySelectorAll('[data-slot=bank-card-face]')].flatMap((f) => {
          const ps = f.querySelector('[data-slot=card-ps]')
          if (!ps) return []
          return [{ face: f.getBoundingClientRect().width, sys: ps.dataset.system, box: rel(ps, f), img: rel(ps.querySelector('img'), f) }]
        })
      }, relRect.toString())
      const by = (s, mobile) => m.find((x) => x.sys === s && (mobile ? x.face < 300 : x.face > 300))
      const mir = by('mir'), mirMobile = by('mir', true), sup = by('mir-supreme'), mc = by('mastercard'), visa = by('visa')
      expect(mir && mirMobile && sup && mc && visa, 'в матрице нет всех систем')
      // Desktop: коробка 80×26 (у Supreme 80×40), рисунок МИР 17 высотой, Mastercard 25, Supreme 26.
      for (const x of [mir, mc, visa]) { near(expect, x.box.w, 80, `${x.sys}: коробка 80`); near(expect, x.box.h, 26, `${x.sys}: коробка 26`) }
      near(expect, sup.box.h, 40, 'Supreme: коробка 40')
      near(expect, mir.img.h, 17, 'МИР 17', 0.1); near(expect, visa.img.h, 17, 'Visa 17', 0.1)
      near(expect, mc.img.h, 25, 'Mastercard 25', 0.1); near(expect, sup.img.h, 26, 'Supreme 26', 0.1)
      near(expect, mir.box.x, 17, 'левый край: поле 16 + рамка 1'); near(expect, mir.box.y, 17, 'верх: поле 16 + рамка 1')
      // Mobile: коробка 52×17.
      near(expect, mirMobile.box.w, 52, 'Mobile: коробка 52'); near(expect, mirMobile.box.h, 17, 'Mobile: коробка 17')
    },
  },
  {
    // Combobox не перекрывает ни ширину, ни высоту базы — по нему видно габариты самого Dropdown.
    name: 'Dropdown: габариты мастера ELK / dropdown — min-w 280, max-w 1008, max-h 504',
    story: 'компоненты-combobox--playground',
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      await page.getByRole('combobox').first().click()
      await page.getByRole('listbox').waitFor()
      const m = await popupMetrics(page)
      expect.eq([m.minW, m.maxW, m.maxH], ['280px', '1008px', '504px'], 'min-w, max-w, max-h')
      expect(m.w >= 280, `ширина ${m.w} не меньше 280`)
    },
  },
  {
    name: 'SelectionButton: окно 280 (мастер ELK / dropdown внутри Selection Button) на 1280 и 375',
    story: 'компоненты-selection-button--playground',
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 900 })
        await page.locator('#storybook-root button[aria-label="Ещё"]').click()
        await page.getByRole('menu').waitFor()
        const m = await popupMetrics(page)
        near(expect, m.w, 280, `ширина окна на ${width}`)
        expect(m.x >= 0 && m.r <= width, `окно внутри экрана на ${width}: ${m.x}…${m.r}`)
        await page.keyboard.press('Escape')
        await page.getByRole('menu').waitFor({ state: 'detached' })
      }
    },
  },
  {
    name: 'TableRowMenu: окно 280, не шире экрана, на 1280 и 375',
    story: 'компоненты-table--matrix',
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 900 })
        const trigger = page.locator('[aria-label="Настроить таблицу"]').first()
        await trigger.scrollIntoViewIfNeeded()
        await trigger.click()
        await page.getByRole('menu').waitFor()
        const m = await popupMetrics(page)
        near(expect, m.w, 280, `ширина окна на ${width}`)
        expect(m.x >= 0 && m.r <= width, `окно внутри экрана на ${width}: ${m.x}…${m.r}`)
        await page.keyboard.press('Escape')
        await page.getByRole('menu').waitFor({ state: 'detached' })
      }
    },
  },
  {
    name: 'Select и Combobox: окно не выше 504 и не уже 280 там, где ширину не задаёт поле',
    story: 'компоненты-combobox--playground',
    viewport: [1280, 900],
    run: async ({ page, expect }) => {
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 900 })
        await page.getByRole('combobox').first().click()
        await page.getByRole('listbox').waitFor()
        const m = await popupMetrics(page)
        expect(m.w >= 280 && m.h <= 504, `Combobox на ${width}: ${m.w}×${m.h}`)
        expect(m.x >= 0 && m.r <= width, `окно внутри экрана на ${width}: ${m.x}…${m.r}`)
        await page.keyboard.press('Escape')
        await page.getByRole('listbox').waitFor({ state: 'detached' })
      }
    },
  },
]
