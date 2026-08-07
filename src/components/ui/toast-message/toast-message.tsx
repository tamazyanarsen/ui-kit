import * as React from "react"
import { X } from "@/icons"

import { Button } from "@/components/ui/button"

import { TOAST_BG, TOAST_BORDER, TOAST_ICON, TOAST_ICON_COLOR } from "./variants"
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
      // Size=Mobile is a 328px card with 16px padding and a 16px close
      // cross; Size=Desktop is 480px with 24px padding and a 24px cross.
      className="w-full min-w-[320px] animate-in rounded-[16px] border p-4 shadow-universal fade-in-0 slide-in-from-right-4 md:p-6"
      style={{
        backgroundColor: TOAST_BG[type],
        borderColor: TOAST_BORDER[type],
      }}
    >
      <div className="flex items-start gap-4">
        <Icon
          aria-hidden="true"
          className="size-6 shrink-0"
          style={{ color: TOAST_ICON_COLOR[type] }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
          <span className="text-p1-medium text-[var(--toast-title-fg)]">
            {toast.title}
          </span>

          {toast.description && (
            <p className="text-p2-medium text-[var(--toast-description-fg)]">
              {toast.description}
            </p>
          )}

          {(data?.primaryButtonLabel || data?.secondaryButtonLabel) && (
            <div className="flex items-center gap-2 pt-2">
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

        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="shrink-0 text-[var(--toast-title-fg)] outline-none"
        >
          <X aria-hidden="true" className="size-4 md:size-6" />
        </button>
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
      className="fixed inset-x-4 top-4 z-50 flex flex-col gap-6 md:inset-x-auto md:top-8 md:right-10 md:w-[480px]"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => close(toast.id)} />
      ))}
    </div>
  )
}

// ToastCard is the presentational half of the component (the Toaster owns
// mounting/timing). It's exported for the Storybook state matrix, which has
// to render every type/button combination at once — going through
// `toast.add()` would stack them on a timer instead. Not re-exported from
// index.ts: consumers should still go through `useToast()`.
export { ToastProvider, Toaster, ToastCard }
