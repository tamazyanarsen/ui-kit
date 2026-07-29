import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { TOAST_BG, TOAST_ICON, TOAST_ICON_COLOR } from "./variants"
import { ToastContext, useToast, type ToastItem, type ToastOptions } from "./use-toast"

// Toast Message — "Всплывающее уведомление". Shows a notification
// noticeably without blocking the user's work; auto-dismisses after 8s
// (the spec's own timing). `data` carries the two optional buttons (Type
// (Button): Two Buttons / Black Button / White Button).
//
// Hand-rolled state (Context + useState + timers) rather than Base UI's
// own Toast primitive: that primitive's store (`useToastManager`) never
// reflected `.add()` calls in this project's exact setup — reproduced with
// a minimal, textbook-correct usage both nested in the app tree and
// mounted standalone at the app root, so it isn't a nesting/context
// mistake on this component's part. Everything else in this kit that
// leans on Base UI (Menu, Popover, Tooltip, Accordion, Dialog, ...) works
// fine; this is scoped to Toast specifically.

// ToastProvider — 8s default timeout per the spec ("Время отображения
// всплывающего сообщения 8 сек"). `limit` caps how many stack at once.
function ToastProvider({
  timeout = 8000,
  limit = 3,
  children,
}: {
  timeout?: number
  limit?: number
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const timers = React.useRef(new Map<string, number>())

  const close = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const add = React.useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Math.random().toString(36).slice(2, 10)}`
      const duration = options.timeout ?? timeout
      setToasts((prev) => [{ ...options, id }, ...prev].slice(0, limit))
      if (duration > 0) {
        const timer = window.setTimeout(() => close(id), duration)
        timers.current.set(id, timer)
      }
      return id
    },
    [timeout, limit, close]
  )

  React.useEffect(() => {
    const timerMap = timers.current
    return () => {
      timerMap.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const value = React.useMemo(
    () => ({ toasts, add, close }),
    [toasts, add, close]
  )

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem
  onClose: () => void
}) {
  const type = toast.type ?? "information"
  const Icon = TOAST_ICON[type]
  const data = toast.data

  return (
    <div
      data-slot="toast"
      role="status"
      className={cn(
        "w-full min-w-[320px] animate-in rounded-2xl p-4 shadow-lg fade-in-0 slide-in-from-right-4"
      )}
      style={{ backgroundColor: TOAST_BG[type] }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Icon
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0"
              style={{ color: TOAST_ICON_COLOR[type] }}
            />
            <span className="font-medium text-[var(--toast-title-fg)]">
              {toast.title}
            </span>
          </div>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 text-[var(--toast-title-fg)] outline-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        {toast.description && (
          <p className="pl-8 text-sm text-[var(--toast-description-fg)]">
            {toast.description}
          </p>
        )}

        {(data?.primaryButtonLabel || data?.secondaryButtonLabel) && (
          <div className="flex items-center gap-2 pl-8">
            {data?.primaryButtonLabel && (
              <Button
                type="button"
                variant="secondary-black"
                size="sm"
                onClick={data.onPrimaryButtonClick}
              >
                {data.primaryButtonLabel}
              </Button>
            )}
            {data?.secondaryButtonLabel && (
              <Button
                type="button"
                variant="secondary-white"
                size="sm"
                onClick={data.onSecondaryButtonClick}
              >
                {data.secondaryButtonLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Toaster — the fixed viewport. Per the spec: desktop top-right, 32px
// from the header, 40px from the right edge, 24px gap between stacked
// toasts; mobile: top, 16px edge padding.
function Toaster() {
  const { toasts, close } = useToast()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed inset-x-4 top-4 z-50 flex flex-col gap-6 md:inset-x-auto md:top-8 md:right-10 md:w-96"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => close(toast.id)} />
      ))}
    </div>
  )
}

export { ToastProvider, Toaster }
