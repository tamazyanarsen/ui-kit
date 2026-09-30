// Мелкие пункты, вынесенные из прошлых проходов: значения из живого браузера (getBoundingClientRect /
// getBBox / getComputedStyle), а не имена классов.
//   • Star: звезда избранного в карточке меню — начертание 16 (окно 0 0 16 16, кнопка 20×22: pl4 py3), у
//     добавленного раздела закрашена (один контур), у обычного — контурная (два контура, вырез); цвет grey-166
//     #C8C8CB (литерал мастера). Звёзды NPS остаются в окне 32;
//   • стрелка кнопки «Panel Button» у Dropdown — общий ArrowRight 16: по центру коробки и по центру кнопки;
//   • кнопка «Назад» у Title Card — `icon / arrow back small` 16: рисунок 5,89×9,78 из мастера;
//   • плитки «Создать»: СБП — цветной логотип (`icon / SBP color`), QR — `icon / qr`, оба окно 24.
const HEADER_MENU = 'компоненты-меню-раскрытое-меню-навигации--playground'
const CREATE_MENU = 'компоненты-меню-раскрытое-меню-создания--playground'
const DROPDOWN = 'компоненты-dropdown--playground'
const TITLE = 'компоненты-title--playground'
const NPS = 'компоненты-nps--playground'

const r1 = (n) => Math.round(n * 100) / 100
// Число подпутей контура: у закрашенной звезды один, у контурной — два (внешний + вырез).
const subpaths = (d) => (d.match(/[zZ]/g) || []).length

export default [
  {
    name: 'h5 Star: звезда в карточке меню — окно 16, кнопка 20×22, контурная → закрашенная по нажатию, цвет grey-166',
    story: HEADER_MENU,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=header-menu-link] button[aria-pressed]')
      const read = () =>
        page.evaluate(() => {
          const b = document.querySelector('[data-slot=header-menu-link] button[aria-pressed]')
          const svg = b.querySelector('svg')
          const path = svg.querySelector('path')
          const br = b.getBoundingClientRect()
          const sr = svg.getBoundingClientRect()
          return {
            viewBox: svg.getAttribute('viewBox'),
            btnW: br.width,
            btnH: br.height,
            svgW: sr.width,
            svgH: sr.height,
            padL: sr.left - br.left,
            padT: sr.top - br.top,
            d: path.getAttribute('d'),
            fill: getComputedStyle(path).fill,
            pressed: b.getAttribute('aria-pressed'),
          }
        })
      const a = await read()
      expect.eq(a.viewBox, '0 0 16 16', 'звезда карточки: начертание 16, а не окно 32')
      expect.eq([a.svgW, a.svgH], [16, 16], 'коробка значка 16')
      expect.eq([a.btnW, a.btnH], [20, 22], 'Star Container: pl4 + 16, py3 + 16')
      expect.eq([a.padL, a.padT], [4, 3], 'отступы значка pl4 py3')
      expect.eq(a.fill, 'rgb(200, 200, 203)', 'цвет звезды — grey-166 #C8C8CB')
      const wasPressed = a.pressed
      await page.locator('[data-slot=header-menu-link] button[aria-pressed]').first().click()
      await page.waitForTimeout(150)
      const b = await read()
      expect(b.pressed !== wasPressed, 'нажатие переключает избранное')
      const filledD = wasPressed === 'false' ? b.d : a.d
      const strokeD = wasPressed === 'false' ? a.d : b.d
      expect.eq(subpaths(filledD), 1, 'закрашенная звезда — один контур')
      expect.eq(subpaths(strokeD), 2, 'контурная звезда — внешний контур и вырез')
    },
  },
  {
    name: 'h5 Star: звёзды NPS остаются в окне 32 (коробка 32, рисунок ≈29,3)',
    story: NPS,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=nps] svg, svg')
      const m = await page.evaluate(() => {
        const svg = [...document.querySelectorAll('svg')].find((s) => s.getAttribute('viewBox') === '0 0 32 32')
        if (!svg) return null
        const sr = svg.getBoundingClientRect()
        const bb = svg.querySelector('path').getBBox()
        return { w: sr.width, h: sr.height, bbW: bb.width }
      })
      expect(m !== null, 'в NPS есть звезда с окном 32')
      expect.eq([m.w, m.h], [32, 32], 'коробка звезды NPS 32')
      expect(Math.abs(m.bbW - 29.32) < 0.1, `рисунок 29,32 в окне 32, получено ${r1(m.bbW)}`)
    },
  },
  {
    name: 'h5 Dropdown Panel Button: стрелка — общий ArrowRight 16, по центру коробки и по центру кнопки, цвет подписи',
    story: DROPDOWN,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=dropdown-panel-button] button svg')
      const m = await page.evaluate(() => {
        const btn = document.querySelector('[data-slot=dropdown-panel-button] button')
        const svg = btn.querySelector('svg')
        const path = svg.querySelector('path')
        const bb = path.getBBox()
        const br = btn.getBoundingClientRect()
        const sr = svg.getBoundingClientRect()
        return {
          viewBox: svg.getAttribute('viewBox'),
          svg: [sr.width, sr.height],
          btnH: br.height,
          centerDelta: sr.top + sr.height / 2 - (br.top + br.height / 2),
          glyphCx: bb.x + bb.width / 2,
          glyphCy: bb.y + bb.height / 2,
          fill: getComputedStyle(path).fill,
          color: getComputedStyle(btn).color,
        }
      })
      expect.eq(m.viewBox, '0 0 16 16', 'окно 16')
      expect.eq(m.svg, [16, 16], 'коробка значка 16')
      expect.eq(m.btnH, 32, 'кнопка S — 32')
      expect(Math.abs(m.centerDelta) <= 0.5, `значок по центру кнопки, сдвиг ${r1(m.centerDelta)}`)
      expect(Math.abs(m.glyphCx - 8) < 0.1, `глиф по центру коробки по x, получено ${r1(m.glyphCx)}`)
      expect(Math.abs(m.glyphCy - 8) < 0.1, `глиф по центру коробки по y (раньше сидел в верхней половине), получено ${r1(m.glyphCy)}`)
      expect.eq(m.fill, m.color, 'цвет стрелки — цвет подписи кнопки')
    },
  },
  {
    name: 'h5 Title Card: «Назад» — arrow back small 16 (рисунок 5,89×9,78 из мастера), по центру коробки',
    story: TITLE,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=title-card] button svg')
      const m = await page.evaluate(() => {
        const btn = document.querySelector('[data-slot=title-card] button')
        const svg = btn.querySelector('svg')
        const bb = svg.querySelector('path').getBBox()
        const sr = svg.getBoundingClientRect()
        return { label: btn.textContent.trim(), viewBox: svg.getAttribute('viewBox'), box: [sr.width, sr.height], bbW: bb.width, bbH: bb.height, cy: bb.y + bb.height / 2 }
      })
      expect.eq(m.label, 'Назад', 'первая кнопка — «Назад»')
      expect.eq(m.viewBox, '0 0 16 16', 'окно 16')
      expect.eq(m.box, [16, 16], 'коробка 16')
      expect(Math.abs(m.bbW - 5.89) < 0.2, `ширина шеврона 5,89, получено ${r1(m.bbW)}`)
      expect(Math.abs(m.bbH - 9.78) < 0.2, `высота шеврона 9,78, получено ${r1(m.bbH)}`)
      expect(Math.abs(m.cy - 7.9) < 0.2, `шеврон по центру коробки, получено ${r1(m.cy)}`)
    },
  },
  {
    name: 'h5 Раскрытое меню создания: СБП — цветной логотип (SBP color), QR — icon / qr, окно 24, не «документ со стрелкой»',
    story: CREATE_MENU,
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=header-create-menu-item]')
      const m = await page.evaluate(() => {
        const tiles = [...document.querySelectorAll('[data-slot=header-create-menu-item]')]
        const pick = (label) => {
          const t = tiles.find((x) => x.textContent.includes(label))
          if (!t) return null
          const svg = t.querySelector('svg')
          const sr = svg.getBoundingClientRect()
          return {
            viewBox: svg.getAttribute('viewBox'),
            box: [sr.width, sr.height],
            fills: [...new Set([...svg.querySelectorAll('path')].map((p) => p.getAttribute('fill')))],
          }
        }
        return { company: pick('Платёж по СБП юрлицу'), person: pick('Платёж по СБП физлицу'), qr: pick('QR-код') }
      })
      for (const k of ['company', 'person']) {
        expect(m[k] !== null, `плитка «${k}» есть`)
        expect.eq(m[k].viewBox, '0 0 24 24', `${k}: окно 24`)
        expect.eq(m[k].box, [24, 24], `${k}: коробка 24`)
        expect(m[k].fills.includes('#5b57a2') && m[k].fills.includes('#d90751'), `${k}: цвета логотипа СБП из мастера, получено ${m[k].fills}`)
      }
      expect(m.qr !== null, 'плитка QR есть')
      expect.eq(m.qr.viewBox, '0 0 24 24', 'QR: окно 24')
      expect(!m.qr.fills.includes('#5b57a2'), 'QR — не логотип СБП')
    },
  },
]
