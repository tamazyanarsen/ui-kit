// Shared 8-direction placement system for both Tooltip and Hint (they're
// one Figma spec, "Tooltip & Hint", and share the same speech-bubble
// language). The spec names directions by which way the bubble *expands*
// from its anchor corner — e.g. "Top Center" points its arrow up (anchor
// above, bubble below), which is Floating UI's side="bottom"; "Down
// Center" is the reverse (side="top"). "Left"/"Right" only ever center
// vertically — there's no Left-Top/Left-Bottom in the spec's property list.
export type TooltipDirection =
  | "left"
  | "right"
  | "top-center"
  | "top-left"
  | "top-right"
  | "down-center"
  | "down-left"
  | "down-right"

export const DIRECTION_PLACEMENT: Record<
  TooltipDirection,
  { side: "top" | "bottom" | "left" | "right"; align: "start" | "center" | "end" }
> = {
  left: { side: "right", align: "center" },
  right: { side: "left", align: "center" },
  "top-center": { side: "bottom", align: "center" },
  "top-left": { side: "bottom", align: "start" },
  "top-right": { side: "bottom", align: "end" },
  "down-center": { side: "top", align: "center" },
  "down-left": { side: "top", align: "start" },
  "down-right": { side: "top", align: "end" },
}

/* Дизайн-чек 3/3 №4: «при выборе direction — top left, top right, down left,
   down right — стрелка тултипа отображается в неверном месте».

   Причина: Base UI позиционирует свой `<Arrow>` по ЯКОРЮ — он всегда целится
   в центр триггера. Пока пузырь уже якоря (история «Направления», где текст
   подсказки — короткое «top-left»), центр якоря выпадает за пузырь и стрелка
   упирается в его край, поэтому там баг не виден. В Playground текст длиннее
   кнопки, центр якоря попадает в середину пузыря — и стрелка встаёт по
   центру при любом direction.

   В макете смещение задано ОТ ПУЗЫРЯ, а не от якоря: у `Direction=Top Left`
   (11756:8032) строка со стрелкой — `flex px-[16px]` без justify, у
   `Top Right` (11756:8043) — та же строка с `justify-end`. То есть стрелка
   прижата к своему краю пузыря с отступом 16px, а по центру стоит только у
   `*-Center`. Поэтому стрелку рисуем сами, а раскладку берём из состояния
   позиционера (`side`/`align`) — так она остаётся верной и после
   collision-флипа, когда Base UI меняет сторону сам. */
type ArrowSide = "top" | "bottom" | "left" | "right"
type ArrowAlign = "start" | "center" | "end"

/** Прижатие стрелки к нужной грани пузыря. */
const ARROW_SIDE: Record<ArrowSide, string> = {
  // Пузырь ПОД якорем — стрелка на верхней грани, и наоборот.
  bottom: "top-0 -translate-y-1/2",
  top: "bottom-0 translate-y-1/2",
  // Боковые направления всегда центрируются по вертикали (Left/Top и
  // Left/Bottom в спеке нет).
  right: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
  left: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
}

/** Горизонтальное смещение — только для верхних/нижних направлений. */
const ARROW_ALIGN: Record<ArrowAlign, string> = {
  start: "left-4",
  center: "left-1/2 -translate-x-1/2",
  end: "right-4",
}

export function arrowPositionClass(side: string, align: string) {
  const sideClass = ARROW_SIDE[side as ArrowSide] ?? ARROW_SIDE.bottom
  if (side === "left" || side === "right") {
    return sideClass
  }
  return `${sideClass} ${ARROW_ALIGN[align as ArrowAlign] ?? ARROW_ALIGN.center}`
}

/** Сам треугольник: повёрнутый на 45° квадрат в цвете пузыря. */
export const ARROW_BASE = "absolute size-3 rotate-45 bg-[var(--tooltip-bg)]"
