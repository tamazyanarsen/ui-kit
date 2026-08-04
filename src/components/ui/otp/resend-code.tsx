import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ResendCode — countdown pill ("Отправить повторно через N сек.") that
// swaps to a real, clickable secondary-black Button once the countdown
// reaches 0. The pill is a plain non-interactive div, not a disabled
// Button — Button's disabled state forces the muted gray treatment, but
// the spec's countdown pill keeps full white/dark-text contrast the whole
// time (it's a status readout, not a disabled control).
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
        "flex h-12 w-full items-center justify-center rounded-[16px] bg-[var(--btn-secondary-white-bg)] px-[25px] text-p2-medium text-[var(--btn-secondary-white-fg)] md:h-14 md:px-[33px] md:text-p1-medium",
        className
      )}
    >
      Отправить повторно через {remaining} сек.
    </div>
  )
}

export { ResendCode }
