import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { ChevronLeft, ChevronRight } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { statusColor, type StepState, type StepStatus } from "./variants"

// Steps — the "Steps / Компонент" wizard-progress row. Each item combines a
// `state` (Default / Active — cyan ring — / Disabled — dimmed, locked
// cursor, optional hover hint) with an independent `status` (None / Filled
// / Error — only Error gets its own color, the other two share the same
// muted grey per the spec). Card content ("Description") is single-line
// only per the spec's own constraint note.
//
// `showLeftFade`/`showRightFade` + `onClickLeft`/`onClickRight` are purely
// presentational callbacks — deciding which steps to show on navigation is
// app-level logic this component doesn't own. What the component DOES own:
// once the caller flips a step's `state` to "active" (in response to those
// callbacks or anything else), it scrolls that card into view itself —
// otherwise the fade/arrows would be decorative dead ends whenever the row
// is wider than its container.
interface Step {
  title: React.ReactNode
  description: React.ReactNode
  statusText?: React.ReactNode
  status?: StepStatus
  state?: StepState
  disabledHint?: React.ReactNode
  onClick?: () => void
}

interface StepsProps {
  steps: Step[]
  showLeftFade?: boolean
  showRightFade?: boolean
  onClickLeft?: () => void
  onClickRight?: () => void
  className?: string
}

function StepCard({
  step,
  cardRef,
}: {
  step: Step
  cardRef: (el: HTMLDivElement | null) => void
}) {
  const { title, description, statusText, status = "none", state = "default", disabledHint, onClick } = step
  const disabled = state === "disabled"
  const active = state === "active"
  const clickable = Boolean(onClick) && !disabled

  const card = (
    <div
      ref={cardRef}
      data-slot="step"
      data-state={state}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={cn(
        "w-60 shrink-0 rounded-[16px] border-2 border-transparent bg-[var(--steps-bg)] px-6 py-4",
        clickable && "cursor-pointer",
        disabled && "cursor-not-allowed",
        active && "border-[var(--steps-active-ring)]"
      )}
    >
      <p
        className={cn(
          "truncate text-p2-medium",
          disabled
            ? "text-[var(--steps-disabled-fg)]"
            : "text-[var(--steps-title-fg)]"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "mt-1 truncate text-p2-medium",
          disabled
            ? "text-[var(--steps-disabled-fg)]"
            : "text-[var(--steps-title-fg)]"
        )}
      >
        {description}
      </p>
      {statusText && (
        <p
          className="mt-2 truncate text-p2-medium"
          style={{
            color: disabled
              ? "var(--steps-disabled-fg)"
              : statusColor(status),
          }}
        >
          {statusText}
        </p>
      )}
    </div>
  )

  if (disabled && disabledHint) {
    return (
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger render={card} />
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner side="bottom" sideOffset={8}>
            <TooltipPrimitive.Popup
              data-slot="step-tooltip"
              className="min-h-10 max-w-[592px] rounded-lg bg-[var(--steps-tooltip-bg)] py-3 pr-3 pl-4 text-p3-regular text-[var(--steps-tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              {disabledHint}
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    )
  }

  return card
}

function FadeArrow({
  side,
  onClick,
}: {
  side: "left" | "right"
  onClick?: () => void
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 z-10 flex w-16 items-center",
        side === "left"
          ? "left-0 justify-start bg-gradient-to-r from-[var(--steps-fade-bg)] to-transparent"
          : "right-0 justify-end bg-gradient-to-l from-[var(--steps-fade-bg)] to-transparent"
      )}
    >
      <Button
        type="button"
        variant="secondary-black"
        size="sm"
        className="pointer-events-auto rounded-full"
        icon={Icon}
        iconPosition="only"
        aria-label={side === "left" ? "Назад" : "Далее"}
        onClick={onClick}
      />
    </div>
  )
}

function Steps({
  steps,
  showLeftFade = false,
  showRightFade = false,
  onClickLeft,
  onClickRight,
  className,
}: StepsProps) {
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const activeIndex = steps.findIndex((step) => step.state === "active")

  React.useEffect(() => {
    if (activeIndex < 0) return
    cardRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [activeIndex])

  return (
    <div data-slot="steps" className={cn("relative", className)}>
      {showLeftFade && <FadeArrow side="left" onClick={onClickLeft} />}
      <div className="flex items-stretch gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            cardRef={(el) => {
              cardRefs.current[index] = el
            }}
          />
        ))}
      </div>
      {showRightFade && <FadeArrow side="right" onClick={onClickRight} />}
    </div>
  )
}

export { Steps }
export type { StepsProps, Step }
