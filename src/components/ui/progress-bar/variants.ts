export type ProgressBarVariant = "step" | "timeline"
export type ProgressBarStatus =
  | "default"
  | "success"
  | "attention"
  | "error"
  | "information"
export type ProgressBarTimelineColor = "green" | "yellow" | "red"

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
// track color, (0,50) green, [50,100) amber, 100 red — `color` overrides
// the automatic pick when passed explicitly.
export const TIMELINE_FG: Record<ProgressBarTimelineColor, string> = {
  green: "var(--progress-green)",
  yellow: "var(--progress-amber)",
  red: "var(--progress-red)",
}

export function timelineColorForValue(value: number): ProgressBarTimelineColor {
  if (value >= 100) return "red"
  if (value >= 50) return "yellow"
  return "green"
}
