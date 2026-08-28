import * as React from "react"

import type { ToastType } from "./variants"

interface ToastData {
  primaryButtonLabel?: React.ReactNode
  onPrimaryButtonClick?: () => void
  secondaryButtonLabel?: React.ReactNode
  onSecondaryButtonClick?: () => void
}

interface ToastOptions {
  type?: ToastType
  title: React.ReactNode
  description?: React.ReactNode
  /** Дизайн-чек 3/3 №8: Show Cross — свойство компонент-сета в Figma. */
  showCross?: boolean
  timeout?: number
  data?: ToastData
}

interface ToastItem extends ToastOptions {
  id: string
}

interface ToastContextValue {
  toasts: ToastItem[]
  add: (options: ToastOptions) => string
  close: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within <ToastProvider>")
  }
  return context
}

export { ToastContext, useToast }
export type { ToastData, ToastOptions, ToastItem, ToastContextValue }
