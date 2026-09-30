// Слой 4: группы «контент» и «выпадающие» — значения раскладки, сверенные с мастерами Figma (Steps / Arrow,
// Title Block Mobile, Block Widget Mobile Label/Double, Block Element Mobile, ELK / empty-page, ELK / dropdown
// Panel Button, Banner Mobile). Проверяются ЧИСЛА из getBoundingClientRect и getComputedStyle, а не имена классов.
import { setArgs } from './fields-lib.mjs'

const near = (expect, got, want, what, eps = 0.6) =>
  expect(Math.abs(got - want) <= eps, `${what}: получено ${got}, ожидалось ${want}`)

export default [
  ...[1280, 375].map((w) => ({
    name: `Steps: затухание 32, кнопка 32 висит на 16px за краем ряда, страница не шире окна (${w})`,
    story: 'компоненты-steps--playground',
    viewport: [w, 800],
    run: async ({ page, expect }) => {
      await page.waitForSelector('[data-slot=steps] button[aria-label="Далее"]')
      const m = await page.evaluate(() => {
        const r = (e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height } }
        const root = document.querySelector('[data-slot=steps]')
        const left = document.querySelector('[data-slot=steps] button[aria-label="Назад"]')
        const right = document.querySelector('[data-slot=steps] button[aria-label="Далее"]')
        return {
          root: r(root), left: r(left), right: r(right), lf: r(left.parentElement), rf: r(right.parentElement),
          bg: [getComputedStyle(left.parentElement).backgroundImage, getComputedStyle(right.parentElement).backgroundImage],
          sw: document.documentElement.scrollWidth, iw: innerWidth,
        }
      })
      near(expect, m.lf.w, 32, 'ширина затухания слева')
      near(expect, m.rf.w, 32, 'ширина затухания справа')
      near(expect, m.lf.h, 104, 'высота затухания')
      near(expect, m.left.w, 32, 'кнопка слева 32')
      near(expect, m.left.x, m.root.x - 16, 'кнопка слева на −16')
      near(expect, m.right.x + m.right.w, m.root.x + m.root.w + 16, 'кнопка справа на +16')
      expect(m.left.x >= 0 && m.right.x + m.right.w <= m.iw + 0.5, `кнопки внутри окна: ${m.left.x}..${m.right.x + m.right.w} из ${m.iw}`)
      expect.eq(m.sw, m.iw, 'горизонтального переполнения страницы нет')
      // маска мастера: слева непрозрачен до 25%, справа зеркально; цвет Grey 106
      expect(/to right.*rgb\(248, 248, 248\) 25%/.test(m.bg[0]), `градиент слева: ${m.bg[0]}`)
      expect(/to left.*rgb\(248, 248, 248\) 25%/.test(m.bg[1]), `градиент справа: ${m.bg[1]}`)
    },
  })),
  ...['mobile', 'desktop'].map((vp) => ({
    name: `Block Widget: тег в шапке 22 / 14/20 на форме ${vp}`,
    story: 'компоненты-block-widget--playground',
    viewport: [1280, 900],
    run: async ({ page, expect, story }) => {
      for (const titleType of ['large', 'small']) {
        for (const type of ['default', 'label']) {
          await setArgs(page, story, { viewport: vp, type, titleType, showTag: true })
          const t = await page.evaluate(() => {
            const e = document.querySelector('[data-slot=block-widget] [data-slot=tag]'), cs = getComputedStyle(e)
            return { h: e.getBoundingClientRect().height, fs: cs.fontSize, lh: cs.lineHeight }
          })
          expect.eq([t.h, t.fs, t.lh], [22, '14px', '20px'], `тег ${type}/${titleType}/${vp}`)
        }
      }
    },
  })),
  {
    name: 'Tag сам по себе: мобильная форма 18 / 12/16 не менялась',
    story: 'компоненты-tag--playground',
    viewport: [1280, 900],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, { viewport: 'mobile' })
      const t = await page.evaluate(() => {
        const e = document.querySelector('[data-slot=tag]'), cs = getComputedStyle(e)
        return [e.getBoundingClientRect().height, cs.fontSize, cs.lineHeight]
      })
      expect.eq(t, [18, '12px', '16px'], 'Tag Size=Mobile')
    },
  },
  {
    name: 'Block Widget Mobile Label: тег над заголовком, зазоры 8/8/4 (Large) и 8/4/4 (Small), блок заголовка 112/96',
    story: 'компоненты-block-widget--playground',
    viewport: [1280, 1200],
    run: async ({ page, expect, story }) => {
      const probe = () => page.evaluate(() => {
        document.querySelector('[data-slot=block-widget]').parentElement.style.width = '328px'
        const tb = document.querySelector('[data-slot=block-widget-title-block]')
        const rr = (e) => { const b = e.getBoundingClientRect(); return { y: b.y, h: b.height, x: b.x } }
        const tag = rr(tb.querySelector('[data-slot=tag]'))
        const spans = [...tb.querySelectorAll('span.truncate')].map(rr)
        const desc = rr(tb.querySelector('p'))
        return { tb: rr(tb), tag, title: spans[0], sub: spans[1], desc }
      })
      await setArgs(page, story, { viewport: 'mobile', type: 'label', titleType: 'large', showTag: true })
      let m = await probe()
      near(expect, m.tb.h, 112, 'Large: блок заголовка')
      near(expect, m.title.y - (m.tag.y + m.tag.h), 8, 'Large: тег → заголовок')
      near(expect, m.sub.y - (m.title.y + m.title.h), 8, 'Large: заголовок → подзаголовок')
      near(expect, m.desc.y - (m.sub.y + m.sub.h), 4, 'Large: подзаголовок → описание')
      near(expect, m.tag.x, m.tb.x, 'тег у левого края колонки')
      await setArgs(page, story, { titleType: 'small' })
      m = await probe()
      near(expect, m.tb.h, 96, 'Small: блок заголовка')
      near(expect, m.title.y - (m.tag.y + m.tag.h), 8, 'Small: тег → заголовок')
      near(expect, m.sub.y - (m.title.y + m.title.h), 4, 'Small: заголовок → подзаголовок')
      near(expect, m.desc.y - (m.sub.y + m.sub.h), 4, 'Small: подзаголовок → описание')
      // десктоп: тег в одном ряду с заголовком, до него
      await setArgs(page, story, { viewport: 'desktop', titleType: 'large' })
      const d = await page.evaluate(() => {
        const tb = document.querySelector('[data-slot=block-widget-title-block]')
        const tag = tb.querySelector('[data-slot=tag]').getBoundingClientRect(), title = tb.querySelector('span.truncate').getBoundingClientRect()
        return { sameRow: Math.abs((tag.y + tag.height / 2) - (title.y + title.height / 2)) < 2, before: tag.right <= title.left + 0.5 }
      })
      expect.eq([d.sameRow, d.before], [true, true], 'десктоп: тег перед заголовком в одном ряду')
    },
  },
  {
    name: 'Block Widget Mobile Double: колонки друг под другом, горизонтальная линия, кнопка слева перед слотом, зазоры 8/16',
    story: 'компоненты-block-widget--playground',
    viewport: [1280, 1200],
    run: async ({ page, expect, story }) => {
      const probe = () => page.evaluate(() => {
        document.querySelector('[data-slot=block-widget]').parentElement.style.width = '328px'
        const R = (e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height } }
        const cols = [...document.querySelectorAll('[data-slot=block-widget-column]')].map(R)
        const div = document.querySelector('[data-slot=block-widget-columns] > [data-slot=divider]')
        const c1 = document.querySelector('[data-slot=block-widget-column]')
        const btn = R(c1.querySelector('button')), slot = R(c1.querySelector('[data-slot=block-widget-slot]'))
        const bottom = R(document.querySelector('[data-slot=block-widget] > [data-slot=block-widget-slot]'))
        return { cols, div: R(div), orient: div.getAttribute('aria-orientation'), btn, slot, bottom }
      })
      await setArgs(page, story, { viewport: 'mobile', type: 'double', showIcon: false, showTag: false })
      let m = await probe()
      expect.eq(m.orient, 'horizontal', 'мобильная линия горизонтальная')
      near(expect, m.cols[0].w, 296, 'колонка на всю ширину (328 − 2×16)')
      near(expect, m.cols[1].w, 296, 'вторая колонка на всю ширину')
      near(expect, m.div.y - (m.cols[0].y + m.cols[0].h), 8, 'колонка → линия')
      near(expect, m.div.h, 1, 'линия 1px')
      near(expect, m.div.w, 296, 'линия на всю ширину')
      near(expect, m.cols[1].y - (m.div.y + m.div.h), 8, 'линия → колонка')
      near(expect, m.bottom.y - (m.cols[1].y + m.cols[1].h), 8, 'колонка → нижний слот')
      near(expect, m.btn.x, m.cols[0].x, 'кнопка у левого края')
      near(expect, m.slot.y - (m.btn.y + m.btn.h), 16, 'кнопка → слот 16')
      await setArgs(page, story, { viewport: 'desktop' })
      m = await probe()
      expect.eq(m.orient, 'vertical', 'десктоп: линия вертикальная')
      expect(m.cols[1].x > m.cols[0].x + m.cols[0].w, 'десктоп: колонки в ряд')
    },
  },
  {
    name: 'Block Widget Block Element Card: на мобиле прижата к верху ряда, на десктопе по центру 56',
    story: 'компоненты-block-widget--playground',
    viewport: [1280, 900],
    run: async ({ page, expect, story }) => {
      const probe = () => page.evaluate(() => {
        const lead = document.querySelector('[data-slot=block-widget-leading]')
        const l = lead.getBoundingClientRect(), c = lead.firstElementChild.getBoundingClientRect()
        return { lh: l.height, off: c.y - l.y, ch: c.height }
      })
      await setArgs(page, story, { viewport: 'mobile', type: 'default', leadingType: 'Card' })
      let m = await probe()
      near(expect, m.lh, 56, 'Block Element 56')
      near(expect, m.off, 0, 'мобильная карта у верха')
      await setArgs(page, story, { viewport: 'desktop' })
      m = await probe()
      near(expect, m.off, (56 - m.ch) / 2, 'десктопная карта по центру', 1)
    },
  },
  ...['desktop', 'mobile'].map((vp) => ({
    name: `Empty Page: значок на плитке скрыт по умолчанию (как в мастере), включённый — 16×16 на −8/−4, кружок 8 красный (${vp})`,
    story: 'компоненты-empty-page--playground',
    viewport: [1280, 800],
    run: async ({ page, expect, story }) => {
      const probe = () => page.evaluate(() => {
        const tile = document.querySelector('[data-slot=empty-search-results] [data-slot=thumbnail]')
        const t = tile.getBoundingClientRect(), b = tile.querySelector('[data-slot=badge]')
        if (!b) return null
        const r = b.getBoundingClientRect(), d = b.firstElementChild
        return { w: r.width, h: r.height, dx: r.right - t.right, dy: r.top - t.top, dot: d.getBoundingClientRect().width, col: getComputedStyle(d).backgroundColor, tile: t.width }
      })
      await setArgs(page, story, { viewport: vp })
      expect.eq(await probe(), null, 'по умолчанию значка нет')
      await setArgs(page, story, { showBadge: true })
      const m = await probe()
      expect(m, 'значок появился')
      expect.eq([m.w, m.h, m.dx, m.dy, m.dot, m.col], [16, 16, 8, -4, 8, 'rgb(215, 75, 84)'], 'значок по мастеру (#D74B54)')
      near(expect, m.tile, vp === 'desktop' ? 48 : 40, 'плитка L')
    },
  })),
  {
    name: 'Dropdown Panel Button: 64 под поиском, кнопка S Dark Blue 32, на десктопе 14/20, на мобиле 12/16; футер на мобиле 14/20 · 48',
    story: 'компоненты-dropdown--playground',
    viewport: [1280, 900],
    run: async ({ page, expect, story }) => {
      const probe = () => page.evaluate(() => {
        const dd = document.querySelector('[data-slot=dropdown]'), o = dd.getBoundingClientRect(), cs = (e) => getComputedStyle(e)
        const R = (e) => { const b = e.getBoundingClientRect(); return { x: b.x - o.x, y: b.y - o.y, w: b.width, h: b.height } }
        const pb = dd.querySelector('[data-slot=dropdown-panel-button]'), btn = pb.querySelector('button'), search = dd.querySelector('[data-slot=dropdown-search]')
        const fb = dd.querySelector('[data-slot=dropdown-footer-button]'), item = dd.querySelector('[data-slot=dropdown-item]')
        return {
          search: R(search), pb: R(pb), btn: R(btn), item: R(item), fb: R(fb),
          b: [cs(btn).backgroundColor, cs(btn).color, cs(btn).fontSize, cs(btn).lineHeight, cs(btn).borderRadius, cs(btn).paddingLeft, cs(btn).paddingRight],
          f: [cs(fb).fontSize, cs(fb).lineHeight, cs(fb).paddingLeft, cs(fb).paddingTop],
        }
      })
      const base = { showSearch: true, showButton: true, add: 'Two Buttons', showTextHelp: false }
      await setArgs(page, story, { ...base, size: 'desktop' })
      let m = await probe()
      near(expect, m.pb.y, m.search.y + m.search.h, 'блок сразу под поиском')
      near(expect, m.pb.h, 64, 'высота блока 64')
      near(expect, m.btn.x, 16, 'поле слева 16')
      near(expect, m.btn.y - m.pb.y, 16, 'поле сверху 16')
      near(expect, m.btn.h, 32, 'кнопка S 32')
      near(expect, m.item.y, m.pb.y + m.pb.h, 'список начинается под блоком')
      expect.eq(m.b, ['rgb(1, 47, 66)', 'rgb(255, 255, 255)', '14px', '20px', '16px', '16px', '20px'], 'кнопка: Dark Blue, 14/20, поля 16/20')
      expect.eq(m.f, ['16px', '24px', '32px', '16px'], 'футер десктоп: 16/24, поля 32/16')
      near(expect, m.fb.h, 56, 'футер десктоп 56')
      for (const size of ['mobile-full-screen', 'mobile-bottom-sheet']) {
        await setArgs(page, story, { ...base, size })
        m = await probe()
        near(expect, m.pb.h, 64, `${size}: блок 64`)
        near(expect, m.pb.y, m.search.y + m.search.h, `${size}: блок под поиском`)
        expect.eq([m.b[2], m.b[3]], ['12px', '16px'], `${size}: подпись кнопки 12/16`)
        expect.eq(m.f, ['14px', '20px', '24px', '14px'], `${size}: футер 14/20, поля 24/14`)
        near(expect, m.fb.h, 48, `${size}: футер 48`)
      }
      await setArgs(page, story, { ...base, size: 'desktop', showButton: false })
      expect.eq(await page.evaluate(() => document.querySelector('[data-slot=dropdown-panel-button]')), null, 'Show Button выключен — блока нет')
    },
  },
  ...[1280, 375].map((w) => ({
    name: `Banner mobile: кнопка 48 / 14/20 / поля 24, заливка Blue 223 при любой ширине окна (${w})`,
    story: 'компоненты-banner--playground',
    viewport: [w, 900],
    run: async ({ page, expect, story }) => {
      await setArgs(page, story, { size: 'mobile', bullet: true, description: ['Первая строка', 'Вторая строка'] })
      const m = await page.evaluate(() => {
        const root = document.querySelector('[data-slot=banner]'), btn = root.querySelector('button'), cs = getComputedStyle(btn)
        const o = root.getBoundingClientRect()
        const R = (e) => { const b = e.getBoundingClientRect(); return { x: b.x - o.x, y: b.y - o.y, w: b.width, h: b.height } }
        const ps = [...root.querySelectorAll('p')].map((p) => R(p))
        return { root: R(root), btn: R(btn), img: R(root.firstElementChild), ps, css: [cs.fontSize, cs.lineHeight, cs.paddingLeft, cs.backgroundColor, cs.borderRadius] }
      })
      near(expect, m.root.w, 328, 'ширина 328')
      near(expect, m.img.h, 128, 'картинка 128')
      near(expect, m.btn.h, 48, 'кнопка 48')
      near(expect, m.btn.w, 296, 'кнопка на всю ширину за вычетом полей 16')
      expect.eq(m.css, ['14px', '20px', '24px', 'rgb(128, 227, 255)', '16px'], 'кнопка: 14/20, поля 24, Blue 223, радиус 16')
      near(expect, m.ps[0].y, 128 + 24, 'заголовок на 24 ниже картинки')
      near(expect, m.ps[0].x, 16, 'поле 16')
      near(expect, m.ps[1].x, 16 + 4 + 4, 'текст после маркера 4 + зазор 4')
      near(expect, m.ps[2].y - (m.ps[1].y + m.ps[1].h), 8, 'зазор строк описания 8')
      near(expect, m.btn.y - (m.ps[2].y + m.ps[2].h), 16, 'описание → кнопка 16')
      near(expect, m.root.h - (m.btn.y + m.btn.h), 24, 'нижнее поле 24')
    },
  })),
]
