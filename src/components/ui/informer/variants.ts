import { CircleAlert, CircleCheck, Clock, Info } from "lucide-react"

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
