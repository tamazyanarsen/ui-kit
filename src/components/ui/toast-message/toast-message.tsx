import * as React from "react"
import { X } from "@/icons"

import { useIsDesktop } from "@/lib/use-is-desktop"
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
  const isDesktop = useIsDesktop()
  const data = toast.data
  const showCross = toast.showCross ?? true

  return (
    <div
      data-slot="toast"
      role="status"
      // Size=Mobile is a 328px card with 16px padding and a 16px close
      // cross; Size=Desktop is 480px with 24px padding and a 24px cross.
      className="w-full min-w-[320px] animate-in rounded-[16px] p-4 shadow-universal fade-in-0 slide-in-from-right-4 desktop:p-6"
      style={{
        backgroundColor: TOAST_BG[type],
        // Дизайн-чек 3/3 №31: «сейчас размер тоста 76px, должен быть 74px».
        // В Figma обводка нарисована ВНУТРЬ рамки, поэтому не увеличивает
        // высоту: 24 (pt) + 2 (pt-0.5 текстовой колонки) + 24 (Title 16/24)
        // + 24 (pb) = 74 (774:134177). CSS-`border` же добавлялся снаружи и
        // давал 76. `outline` с отрицательным offset рисует ту же линию, но
        // вне потока — высота становится ровно 74.
        outline: `1px solid ${TOAST_BORDER[type]}`,
        outlineOffset: "-1px",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Дизайн-чек №3 №5: «иконки тоста некорректные — слишком жирное
            начертание». Плитка 24px и на десктопе, и на мобиле, поэтому
            нужен именно 24px-рисунок из Figma, а не 16px, растянутый до
            24: у второго кольцо и штрихи в полтора раза толще. */}
        <Icon
          size={24}
          aria-hidden="true"
          className="size-6 shrink-0"
          style={{ color: TOAST_ICON_COLOR[type] }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
          {/* Size=Mobile steps the whole text block down one notch, like
              Informer does: Title 14/20 and Description 12/16 against
              16/24 and 14/20 on Size=Desktop (master `ELK / toast
              message` v2.0.0, node 774:134168). */}
          <span className="text-p2-medium text-[var(--toast-title-fg)] desktop:text-p1-medium">
            {toast.title}
          </span>

          {toast.description && (
            <p className="text-p3-medium text-[var(--toast-description-fg)] desktop:text-p2-medium">
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

        {/* Дизайн-чек 3/3 №8: Show Cross — свойство компонент-сета
            `ELK / toast message` (774:134186), поэтому крестик отключаемый. */}
        {showCross && (
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="shrink-0 text-[var(--toast-close-fg)] outline-none"
        >
          {/* Дизайн-чек №3 №9: «Некорректное начертание крестика… ещё
              заметил в toast message». У крестика два самостоятельных
              рисунка, и 24px-коробка должна получать 24px-глиф, иначе
              линии выходят на треть толще макета. Размер коробки здесь
              меняется брейкпоинтом (16 → 24), а рисунок — пропом, поэтому
              выбирать приходится в JS. */}
          <X
            size={isDesktop ? 24 : 16}
            aria-hidden="true"
            className="size-4 desktop:size-6"
          />
        </button>
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
      className="fixed inset-x-4 top-4 z-50 flex flex-col gap-6 desktop:inset-x-auto desktop:top-8 desktop:right-10 desktop:w-[480px]"
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
