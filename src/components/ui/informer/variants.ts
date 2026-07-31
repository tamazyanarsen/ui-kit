// Design-check #28: the anatomy sheet's icon is a thin-stroke 24×24 glyph,
// not this kit's own bold filled 16×16 icon set — lucide-react (already a
// project dependency, see Button's stories) supplies the outline weight
// directly instead of a from-scratch redraw.
import { AlertCircle, CheckCircle2, Clock, Info } from "lucide-react"

export type InformerIcon =
  | "attention-red"
  | "attention-yellow"
  | "check"
  | "information"
  | "clock"

export type InformerSolid = "white" | "grey"

export const ICON_COMPONENT: Record<InformerIcon, typeof AlertCircle> = {
  "attention-red": AlertCircle,
  "attention-yellow": AlertCircle,
  check: CheckCircle2,
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
