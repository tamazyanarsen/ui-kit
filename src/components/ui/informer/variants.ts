// The anatomy sheet's icon is a thin-stroke 24×24 glyph, thinner than this
// kit's own bold filled 16×16 icon set, but only the kit's own Figma-sourced
// icons may be used project-wide (no lucide-react) — so this reuses
// CircleAlert/CircleCheck/Clock/Info same as everywhere else, accepting the
// slightly bolder weight over pulling in a non-Figma icon set.
import { CircleAlert, CircleCheck, Clock, Info } from "@/icons"

export type InformerIcon =
  | "attention-red"
  | "attention-yellow"
  | "check"
  | "information"
  | "clock"

export type InformerSolid = "white" | "grey"

export const ICON_COMPONENT: Record<InformerIcon, typeof CircleAlert> = {
  "attention-red": CircleAlert,
  "attention-yellow": CircleAlert,
  check: CircleCheck,
  information: Info,
  clock: Clock,
}

export const ICON_COLOR: Record<InformerIcon, string> = {
  "attention-red": "var(--informer-icon-red)",
  "attention-yellow": "var(--informer-icon-yellow)",
  check: "var(--informer-icon-green)",
  information: "var(--informer-icon-grey)",
  clock: "var(--informer-icon-yellow)",
}

export const SOLID_BG: Record<InformerSolid, string> = {
  white: "var(--informer-bg-white)",
  grey: "var(--informer-bg-grey)",
}
