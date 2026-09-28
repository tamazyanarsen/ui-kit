import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ResendCode — таблетка отсчёта («Отправить повторно через N сек.»),
// которая по достижении нуля превращается в настоящую нажимаемую кнопку
// secondary-black. Сама таблетка — обычный неинтерактивный div, а не
// выключенная Button: выключенное состояние Button навязывает приглушённое
// серое оформление, тогда как таблетка отсчёта в макете всё время держит
// полный контраст «белое с тёмным текстом» (это показание статуса, а не
// выключенный контрол).
interface ResendCodeProps {
  seconds?: number
  onResend?: () => void
  className?: string
}

function ResendCode({ seconds = 60, onResend, className }: ResendCodeProps) {
  const [remaining, setRemaining] = React.useState(seconds)
  const statusRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  // Куда перевести фокус после смены узла: таблетка и кнопка сменяют друг
  // друга, и узел с фокусом уходит из DOM.
  const focusNext = React.useRef<"status" | "button" | null>(null)

  // Кнопка «Отправить повторно» после нажатия сменяется таблеткой отсчёта —
  // нажатый узел уходит из DOM, и фокус падал на body: клавиатурный
  // пользователь терял место в окне. Поэтому фокус переезжает на таблетку
  // (она программно фокусируемая, `tabIndex={-1}`, в обход Tab не попадает).
  // Обратный переход тот же: по окончании отсчёта таблетка с фокусом
  // сменяется кнопкой, и фокус переходит на кнопку, а не падает на body.
  React.useLayoutEffect(() => {
    const target = focusNext.current
    if (!target) return
    focusNext.current = null
    ;(target === "status" ? statusRef : buttonRef).current?.focus()
  })

  React.useEffect(() => {
    if (remaining <= 0) return
    const timeout = window.setTimeout(() => {
      if (remaining <= 1 && document.activeElement === statusRef.current) {
        focusNext.current = "button"
      }
      setRemaining((s) => s - 1)
    }, 1000)
    return () => window.clearTimeout(timeout)
  }, [remaining])

  function handleResend() {
    onResend?.()
    focusNext.current = "status"
    setRemaining(seconds)
  }

  if (remaining <= 0) {
    return (
      <Button
        ref={buttonRef}
        type="button"
        variant="secondary-black"
        size="lg"
        className={className}
        onClick={handleResend}
      >
        Отправить повторно
      </Button>
    )
  }

  return (
    <div
      ref={statusRef}
      role="status"
      tabIndex={-1}
      className={cn(
        "flex h-12 outline-none w-full items-center justify-center rounded-[16px] bg-[var(--btn-secondary-white-bg)] px-[25px] text-p2-medium text-[var(--btn-secondary-white-fg)] desktop:h-14 desktop:px-[33px] desktop:text-p1-medium",
        className
      )}
    >
      Отправить повторно через {remaining} сек.
    </div>
  )
}

export { ResendCode }
