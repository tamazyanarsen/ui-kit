import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { ChevronLeft, ChevronRight } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { compactList } from "@/components/ui/header-menu/compact-list"
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
//
// Дизайн-чек от 08.10, замечание 20: стрелка слева была видна всегда, даже в
// начале ленты. Теперь `showLeftFade`/`showRightFade` только РАЗРЕШАЮТ
// стрелку, а видна она, когда в её сторону есть что прокручивать: в начале
// ленты левой нет, в конце — правой, в середине переполненной ленты видны
// обе со своей маской. Положение пересчитывается на прокрутке ленты и на
// изменении её размеров (ResizeObserver), а не только при монтировании.
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
  /**
   * «Show Left Fade» — разрешает левую стрелку. Видна она только когда ленте
   * есть куда прокручиваться влево (в начале ленты скрыта).
   */
  showLeftFade?: boolean
  /** «Show Right Fade» — то же для правой стрелки (в конце ленты скрыта). */
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
        // Рамка активной карточки внутри размера 240×104 (мастер 5582:8756: Default и Active одной высоты), поэтому
        // её 2px вычтены из отступов, а не прибавлены к ним.
        "w-60 shrink-0 rounded-[16px] border-2 border-transparent bg-[var(--steps-bg)] px-[calc(--spacing(6)-2px)] py-[calc(--spacing(4)-2px)]",
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
        {/* Задержка 100 мс, как у Tooltip кита (дизайн-чек 08.10, замечание 10). */}
        <TooltipPrimitive.Trigger delay={100} render={card} />
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

  // Мастер Steps / Arrow: блок затухания 32 (серый фон страницы, маска — градиент:
  // слева непрозрачен до 25%, справа от 75%), а кнопка 32 висит на 16px ЗА
  // краем ряда (left/right: -16; экспорт 1040 при ряде 1008). Поэтому кнопке
  // нужны поля снаружи: потребитель оставляет 16px с каждой стороны, иначе
  // кнопку обрежет край контейнера.
  //
  // Цвет маски — `--steps-fade-bg`, который ссылается на `--page-bg`: маска
  // должна сливаться с серым фоном страницы, а он у тем разный (Grey 106 в
  // старой, Grey 109 в новой). Замечание 20 дизайн-чека от 08.10.
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 z-10 flex w-8 items-center",
        side === "left"
          ? "left-0 justify-start bg-[linear-gradient(to_right,var(--steps-fade-bg)_25%,transparent)]"
          : "right-0 justify-end bg-[linear-gradient(to_left,var(--steps-fade-bg)_25%,transparent)]"
      )}
    >
      <Button
        type="button"
        variant="secondary-black"
        size="sm"
        className={cn(
          "pointer-events-auto rounded-full",
          side === "left" ? "-ml-4" : "-mr-4"
        )}
        icon={Icon}
        iconPosition="only"
        aria-label={side === "left" ? "Назад" : "Далее"}
        onClick={onClick}
      />
    </div>
  )
}

/** Есть ли у ленты куда прокручиваться влево и вправо. Допуск в 1px гасит
 * дробные scrollLeft при масштабе страницы, иначе в конце ленты правая
 * стрелка мигала бы из-за полупикселя. */
function useScrollEdges(stripRef: React.RefObject<HTMLDivElement | null>, count: number) {
  const [edges, setEdges] = React.useState({ left: false, right: false })

  React.useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const measure = () => {
      const left = strip.scrollLeft > 1
      const right = strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1
      setEdges((prev) =>
        prev.left === left && prev.right === right ? prev : { left, right }
      )
    }
    measure()
    strip.addEventListener("scroll", measure, { passive: true })
    // Ширина ленты меняется с контейнером, ширина содержимого — с числом и
    // размером карточек; следим за обоими.
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null
    observer?.observe(strip)
    Array.from(strip.children).forEach((child) => observer?.observe(child))
    return () => {
      strip.removeEventListener("scroll", measure)
      observer?.disconnect()
    }
  }, [stripRef, count])

  return edges
}

function Steps({
  steps: rawSteps,
  showLeftFade = true,
  showRightFade = true,
  onClickLeft,
  onClickRight,
  className,
}: StepsProps) {
  // `[cond && step]` даёт в списке false/null: без отбора карточка падала на
  // разборе шага, а `findIndex` — на чтении `state`.
  const steps = compactList(rawSteps) ?? []
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const stripRef = React.useRef<HTMLDivElement>(null)
  const activeIndex = steps.findIndex((step) => step.state === "active")
  const edges = useScrollEdges(stripRef, steps.length)

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
      {showLeftFade && edges.left && (
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
      {showRightFade && edges.right && (
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
