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

  React.useEffect(() => {
    if (remaining <= 0) return
    const timeout = window.setTimeout(() => setRemaining((s) => s - 1), 1000)
    return () => window.clearTimeout(timeout)
  }, [remaining])

  function handleResend() {
    onResend?.()
    setRemaining(seconds)
  }

  if (remaining <= 0) {
    return (
      <Button
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
      role="status"
      className={cn(
        "flex h-12 w-full items-center justify-center rounded-[16px] bg-[var(--btn-secondary-white-bg)] px-[25px] text-p2-medium text-[var(--btn-secondary-white-fg)] desktop:h-14 desktop:px-[33px] desktop:text-p1-medium",
        className
      )}
    >
      Отправить повторно через {remaining} сек.
    </div>
  )
}

export { ResendCode }
