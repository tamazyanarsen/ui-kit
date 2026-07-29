export type EventStatus =
  | "default"
  | "success"
  | "attention"
  | "error"
  | "information"

export const STATUS_BG: Record<EventStatus, string> = {
  default: "var(--event-status-default-bg)",
  success: "var(--event-status-success-bg)",
  attention: "var(--event-status-attention-bg)",
  error: "var(--event-status-error-bg)",
  information: "var(--event-status-information-bg)",
}
