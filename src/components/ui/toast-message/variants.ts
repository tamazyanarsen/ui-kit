import { CircleAlert, CircleCheck, CircleX, Info } from "@/icons"

export type ToastType = "checked" | "attention" | "error" | "information"

export const TOAST_ICON: Record<ToastType, typeof CircleCheck> = {
  checked: CircleCheck,
  attention: CircleAlert,
  error: CircleX,
  information: Info,
}

export const TOAST_BG: Record<ToastType, string> = {
  checked: "var(--toast-checked-bg)",
  attention: "var(--toast-attention-bg)",
  error: "var(--toast-error-bg)",
  information: "var(--toast-information-bg)",
}

export const TOAST_ICON_COLOR: Record<ToastType, string> = {
  checked: "var(--toast-checked-icon)",
  attention: "var(--toast-attention-icon)",
  error: "var(--toast-error-icon)",
  information: "var(--toast-information-icon)",
}
