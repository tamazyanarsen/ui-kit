import type { TagColor } from "@/components/ui/tag/variants"

// Дизайн-чек от 07.09, замечание 15: «Удалить вариант Information в
// компоненте Event — не используем синий статус в продукте в 99% случаев,
// отдельный вариант под это не нужен».
export type EventStatus = "default" | "success" | "attention" | "error"

// Подкраска значка в строке подписанта: здесь встречаются только «success»
// и «attention» (см. EventSignatory["status"]), а таблетке тега выше
// собственный набор цветов больше не нужен, раз она рисуется через <Tag>.
export const SIGNATORY_STATUS_COLOR: Record<
  "success" | "attention" | "error",
  string
> = {
  success: "var(--event-status-success-bg)",
  attention: "var(--event-status-attention-bg)",
  // Cancel — отказ в подписи; красный статуса, тот же, что у тега «error».
  error: "var(--event-status-error-bg)",
}

// При type="tag" заголовок рисуется через <Tag> (переиспользуя его
// палитру вместо самодельной таблетки), и это отображение — то, что
// отдельные токены --event-status-*-bg выше раньше задавали руками.
export const STATUS_TAG_COLOR: Record<EventStatus, TagColor> = {
  default: "grey",
  success: "green",
  attention: "orange",
  error: "red",
}
