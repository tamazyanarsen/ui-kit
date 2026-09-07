import type { TagColor } from "@/components/ui/tag/variants"

// Дизайн-чек от 07.09, замечание 15: «Удалить вариант Information в
// компоненте Event — не используем синий статус в продукте в 99% случаев,
// отдельный вариант под это не нужен».
export type EventStatus = "default" | "success" | "attention" | "error"

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
// tokens above used to hardcode by hand.
export const STATUS_TAG_COLOR: Record<EventStatus, TagColor> = {
  default: "grey",
  success: "green",
  attention: "orange",
  error: "red",
}
