export type StepState = "default" | "active" | "disabled"
export type StepStatus = "none" | "filled" | "error"

// "Не заполнено" and "Заполнено" render in the same muted grey in the spec
// — only "Ошибки" (error) gets its own red. Kept as a 3-value enum anyway
// since the spec documents all three as distinct semantic states.
export function statusColor(status: StepStatus): string {
  return status === "error"
    ? "var(--steps-status-error-fg)"
    : "var(--steps-status-fg)"
}
