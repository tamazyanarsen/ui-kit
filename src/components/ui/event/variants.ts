import type { TagColor } from "@/components/ui/tag/variants"

export type EventStatus =
  | "default"
  | "success"
  | "attention"
  | "error"
  | "information"

// Signatory row icon tint — only "success"/"attention" ever occur here (see
// EventSignatory["status"]); the tag pill above no longer needs its own
// color set now that it renders <Tag> instead.
export const SIGNATORY_STATUS_COLOR: Record<
  "success" | "attention" | "error",
  string
> = {
  success: "var(--event-status-success-bg)",
  attention: "var(--event-status-attention-bg)",
  // Cancel — отказ в подписи; красный статуса, тот же, что у тега «error».
  error: "var(--event-status-error-bg)",
}

// type="tag" renders the title as a <Tag> (reusing its palette instead of a
// hand-rolled pill) — this mapping is what the standalone --event-status-*-bg
// tokens above used to hardcode by hand, including a bug where "information"
// silently fell back to grey instead of Tag's blue.
export const STATUS_TAG_COLOR: Record<EventStatus, TagColor> = {
  default: "grey",
  success: "green",
  attention: "orange",
  error: "red",
  information: "blue",
}
