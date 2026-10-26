// Геометрия кольца Donut — чистые функции, без React.
//
// Правки UI-Kit от 25.10, пункт «Кольцевая диаграмма (бублик)»:
//   • SVG с viewBox 100: внешний радиус 50, внутренний 39 (толщина 11 % от
//     диаметра — как у штатного 34 из 300);
//   • зазор между сегментами — с ПАРАЛЛЕЛЬНЫМИ краями, 1,1 % диаметра, а не
//     клин к центру: край сегмента — прямая, сдвинутая от радиуса стыка на
//     половину зазора;
//   • скругление углов — 1,3 % диаметра: фигура сегмента ужата на радиус
//     скругления со всех сторон, а обводка того же цвета толщиной 2 × радиус
//     с `stroke-linejoin: round` возвращает края на место — углы выходят
//     круглыми ровно на радиус;
//   • старт сверху (−90°), по часовой;
//   • узкий сегмент, у которого не умещается внутренний край, сводит этот
//     край в точку (пересечение двух сдвинутых краёв) — без перекрученной
//     фигуры; совсем узкий — точка-капля толщиной в обводку;
//   • один ненулевой сегмент — сплошное кольцо без зазора.

const DONUT = { C: 50, RO: 50, RI: 39, GAP: 1.1, RAD: 1.3 } as const

type Point = [number, number]

const fmt = (n: number) => Number(n.toFixed(3))

/** Точка на окружности: угол — радианы по часовой от верха. */
function polar(r: number, angle: number): Point {
  return [fmt(DONUT.C + r * Math.sin(angle)), fmt(DONUT.C - r * Math.cos(angle))]
}

function arc(r: number, to: Point, span: number, clockwise: boolean) {
  const large = span > Math.PI ? 1 : 0
  return `A ${r} ${r} 0 ${large} ${clockwise ? 1 : 0} ${to[0]} ${to[1]}`
}

/** Сплошное кольцо (один ненулевой сегмент), заливка `evenodd`. */
function ringPath(): string {
  const { C, RO, RI } = DONUT
  const circle = (r: number) =>
    `M ${C} ${C - r} A ${r} ${r} 0 1 1 ${C} ${C + r} A ${r} ${r} 0 1 1 ${C} ${C - r} Z`
  return `${circle(RO)} ${circle(RI)}`
}

/**
 * Контур сегмента от `a0` до `a1` (радианы по часовой от верха), уже ужатый
 * на радиус скругления — рисуется заливкой и обводкой 2 × RAD.
 */
function sectorPath(a0: number, a1: number): string {
  const { RO, RI, GAP, RAD } = DONUT
  const offset = GAP / 2 + RAD
  const ro = RO - RAD
  const ri = RI + RAD
  const half = (a1 - a0) / 2
  const mid = a0 + half
  // Где сходятся два сдвинутых края. Шире полукруга края расходятся —
  // ограничения нет.
  const apex = half >= Math.PI / 2 ? 0 : offset / Math.sin(half)

  if (apex >= ro) {
    // Фигуре не хватает места даже у внешнего края: точка посередине
    // кольца, круглая за счёт обводки (`stroke-linecap: round`).
    const p = polar((ro + ri) / 2, mid)
    return `M ${p[0]} ${p[1]} L ${p[0]} ${p[1]}`
  }

  const dOuter = Math.asin(offset / ro)
  const o0 = polar(ro, a0 + dOuter)
  const o1 = polar(ro, a1 - dOuter)
  const outer = `M ${o0[0]} ${o0[1]} ${arc(ro, o1, a1 - a0 - 2 * dOuter, true)}`

  if (apex >= ri) {
    const p = polar(apex, mid)
    return `${outer} L ${p[0]} ${p[1]} Z`
  }

  const dInner = Math.asin(offset / ri)
  const i1 = polar(ri, a1 - dInner)
  const i0 = polar(ri, a0 + dInner)
  return `${outer} L ${i1[0]} ${i1[1]} ${arc(ri, i0, a1 - a0 - 2 * dInner, false)} Z`
}

interface DonutSegment {
  /** Индекс части в исходных данных. */
  index: number
  path: string
  /** Сплошное кольцо — без обводки-скругления. */
  ring: boolean
}

/**
 * Сегменты по значениям: нулевые и неконечные не рисуются, доли — от суммы
 * рисуемых.
 */
function donutSegments(values: number[]): DonutSegment[] {
  const drawable = values
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => Number.isFinite(value) && value > 0)
  const total = drawable.reduce((sum, { value }) => sum + value, 0)
  if (total <= 0) return []
  if (drawable.length === 1) {
    return [{ index: drawable[0].index, path: ringPath(), ring: true }]
  }
  let start = 0
  return drawable.map(({ value, index }) => {
    const end = start + (value / total) * Math.PI * 2
    const segment = { index, path: sectorPath(start, end), ring: false }
    start = end
    return segment
  })
}

export { DONUT, donutSegments, sectorPath, ringPath }
export type { DonutSegment }
