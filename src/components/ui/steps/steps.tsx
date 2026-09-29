import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { ChevronLeft, ChevronRight } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { Button } from "@/components/ui/button"
import {
  ARROW_BASE,
  arrowPositionClass,
} from "@/components/ui/tooltip/variants"

import { statusColor, type StepState, type StepStatus } from "./variants"

// Steps — ряд «Steps / Компонент», показывающий ход по шагам. Каждый пункт
// сочетает `state` (Default; Active — голубое кольцо; Disabled —
// приглушённый, с курсором запрета и необязательной подсказкой по
// наведению) с независимым `status` (None, Filled, Error), причём свой цвет
// по макету получает только Error, а остальные два делят один приглушённый
// серый. Содержимое карточки («Description») по собственному ограничению
// макета строго однострочное.
//
// Дизайн-чек 3/3 №15: «при нажатии на кнопки Left и Right Fade блок с
// шагами не прокручивается в нужную сторону». Раньше `onClickLeft`/
// `onClickRight` были ЧИСТО презентационными колбэками: без них стрелки
// вообще ничего не делали, и в Playground (где колбэков нет) выглядели
// мёртвыми. Теперь прокрутку ленты компонент делает сам — это его
// собственная геометрия, а не прикладная логика, — а колбэк вызывается
// дополнительно, если он передан.
//
// Компонент также сам подкручивает карточку в зону видимости, когда её
// `state` становится "active".
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
      {hasNode(statusText) && (
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
            {/* Дизайн-чек 3/3 №29: у подсказки не было стрелки направления —
                пузырь висел «сам по себе». Рисуем ту же стрелку, что у
                Tooltip/Hint, и по тем же правилам (см. variants.ts там). */}
            <TooltipPrimitive.Popup
              data-slot="step-tooltip"
              className="relative min-h-10 max-w-[min(592px,var(--available-width))] rounded-lg bg-[var(--steps-tooltip-bg)] py-3 pr-3 pl-4 text-p3-medium text-[var(--steps-tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
              render={(popupProps, state) => (
                <div {...popupProps}>
                  {disabledHint}
                  <span
                    aria-hidden="true"
                    className={cn(
                      ARROW_BASE,
                      // Пузырь подсказки шага красится своим токеном, а не
                      // общим --tooltip-bg, поэтому цвет стрелки переопределяем.
                      "bg-[var(--steps-tooltip-bg)]",
                      arrowPositionClass(state.side, state.align)
                    )}
                  />
                </div>
              )}
            />
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
  const stripRef = React.useRef<HTMLDivElement>(null)
  const activeIndex = steps.findIndex((step) => step.state === "active")

  // Активный шаг выводится в центр ЛЕНТЫ — и только её. `scrollIntoView`
  // прокручивает всех прокручиваемых предков, включая окно: Steps ниже
  // первого экрана утаскивал страницу к себе прямо при загрузке. Поэтому
  // сдвиг считается по коробкам и ставится самой ленте.
  React.useEffect(() => {
    if (activeIndex < 0) return
    const strip = stripRef.current
    const card = cardRefs.current[activeIndex]
    if (!strip || !card) return
    const stripBox = strip.getBoundingClientRect()
    const cardBox = card.getBoundingClientRect()
    const delta =
      cardBox.left + cardBox.width / 2 - (stripBox.left + stripBox.width / 2)
    if (delta === 0) return
    if (typeof strip.scrollBy === "function") {
      strip.scrollBy({ left: delta, behavior: "smooth" })
    } else {
      strip.scrollLeft += delta
    }
  }, [activeIndex])

  // Шаг прокрутки — на одну «страницу» ленты, но не больше её ширины: так
  // на узком контейнере стрелка сдвигает ровно то, что видно.
  function scrollBy(direction: -1 | 1) {
    const strip = stripRef.current
    if (!strip) return
    const delta = direction * strip.clientWidth
    // `scrollBy` есть не везде (в jsdom его нет вовсе) — там просто сдвигаем
    // `scrollLeft`, поведение то же, только без плавности.
    if (typeof strip.scrollBy === "function") {
      strip.scrollBy({ left: delta, behavior: "smooth" })
    } else {
      strip.scrollLeft += delta
    }
  }

  return (
    <div data-slot="steps" className={cn("relative", className)}>
      {showLeftFade && (
        <FadeArrow
          side="left"
          onClick={() => {
            scrollBy(-1)
            onClickLeft?.()
          }}
        />
      )}
      <div
        ref={stripRef}
        data-slot="steps-strip"
        data-scroll-window=""
        className="flex items-stretch gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
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
      {showRightFade && (
        <FadeArrow
          side="right"
          onClick={() => {
            scrollBy(1)
            onClickRight?.()
          }}
        />
      )}
    </div>
  )
}

export { Steps }
export type { StepsProps, Step }
