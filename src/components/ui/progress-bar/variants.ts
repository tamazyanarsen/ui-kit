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

// Цвет текста подзаголовка («Value») по разделу макета «Статусы» — те же
// пять вариантов для обоих вариантов компонента, независимо от цвета
// заливки самой полосы.
export const STATUS_FG: Record<ProgressBarStatus, string> = {
  default: "var(--progress-title-fg)",
  success: "var(--progress-green)",
  attention: "var(--progress-amber)",
  error: "var(--progress-red)",
  information: "var(--progress-meta-fg)",
}

// Цвет заливки timeline по разделу «Диапазон применения цвета»: на 0%
// остаётся чистый цвет дорожки, в интервале (0,50) зелёный, на [50,100)
// янтарный, на 100 красный. Переданный явно `statusTimeline` перекрывает
// автоматический выбор. Process (#2FCEEF, снят пипеткой со Status=Process)
// — нейтральный синий, который берут «если нет необходимости в
// использовании статусного цвета».
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
