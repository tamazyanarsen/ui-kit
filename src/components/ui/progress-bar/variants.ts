export type ProgressBarVariant = "step" | "timeline"
export type ProgressBarStatus =
  | "default"
  | "success"
  | "attention"
  | "error"
  | "information"
// Дизайн-чек №4 №5: свойство называется «Status Timeline», значения —
// Process / Success / Attention / Error (было color: green/yellow/red).
export type ProgressBarStatusTimeline =
  | "process"
  | "success"
  | "attention"
  | "error"
// Дизайн-чек №4 №4: «Status Line» — какие элементы группы показаны.
export type ProgressBarStatusLine =
  | "subtitle-description"
  | "subtitle"
  | "description"

// Subtitle ("Value") text color per the "Статусы" spec section — same 5
// options for both variants, independent of the bar's own fill color.
export const STATUS_FG: Record<ProgressBarStatus, string> = {
  default: "var(--progress-title-fg)",
  success: "var(--progress-green)",
  attention: "var(--progress-amber)",
  error: "var(--progress-red)",
  information: "var(--progress-meta-fg)",
}

// Timeline fill color per "Диапазон применения цвета": 0% stays the bare
// track color, (0,50) green, [50,100) amber, 100 red — `statusTimeline`
// overrides the automatic pick when passed explicitly. Process (#2FCEEF,
// pixel-sampled from Status=Process, 70333:2283) is the neutral blue used
// «если нет необходимости в использовании статусного цвета».
export const TIMELINE_FG: Record<ProgressBarStatusTimeline, string> = {
  process: "var(--progress-step-fill)",
  success: "var(--progress-green)",
  attention: "var(--progress-amber)",
  error: "var(--progress-red)",
}

export function timelineColorForValue(value: number): ProgressBarStatusTimeline {
  if (value >= 100) return "error"
  if (value >= 50) return "attention"
  return "success"
}
