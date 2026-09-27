export type StepState = "default" | "active" | "disabled"
export type StepStatus = "none" | "filled" | "error"

// «Не заполнено» и «Заполнено» в макете рисуются одним и тем же
// приглушённым серым — свой красный есть только у «Ошибки». Перечисление
// всё равно оставлено из трёх значений, потому что макет описывает все три
// как разные смысловые состояния.
export function statusColor(status: StepStatus): string {
  return status === "error"
    ? "var(--steps-status-error-fg)"
    : "var(--steps-status-fg)"
}
