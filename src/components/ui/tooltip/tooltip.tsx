import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

import {
  ARROW_BASE,
  DIRECTION_PLACEMENT,
  arrowPositionClass,
  type TooltipDirection,
} from "./variants"
import { CloseCross } from "@/components/ui/close-cross"

// Tooltip — hover-triggered, smaller sibling of Hint (see hint.tsx). Per the
// spec: opens after a 400ms hover delay (so moving the cursor across the page
// doesn't flicker tooltips open), closes instantly the moment the cursor
// leaves. Max width 256px, height adaptive.
interface TooltipProps {
  content: React.ReactNode
  /** Дизайн-чек 3/3 №5: у `ELK / tooltip & hint` есть свойство Show Title —
   * заголовок над текстом (11756:8037), поэтому он есть и здесь, а не только
   * у Hint. */
  title?: React.ReactNode
  /** Дизайн-чек 3/3 №5: свойство Show Cross того же компонент-сета
   * (11756:8039). У Tooltip по умолчанию выключен — он закрывается уводом
   * курсора, крестик нужен не всегда. */
  showCross?: boolean
  direction?: TooltipDirection
  children: React.ReactElement
  className?: string
  /** Keeps the tooltip permanently closed while leaving the wrapper mounted.
   * For anchors whose tooltip comes and goes with their content (Input only
   * explains itself while locked, or while its value overflows): swapping
   * between a wrapped and an unwrapped child instead would remount the
   * anchor's whole subtree, which for a field means losing focus and caret
   * position mid-typing. */
  disabled?: boolean
}

function Tooltip({
  content,
  title,
  showCross = false,
  direction = "top-center",
  children,
  className,
  disabled = false,
}: TooltipProps) {
  const { side, align } = DIRECTION_PLACEMENT[direction]
  // Open state is always controlled, never conditionally so: handing Root an
  // `open` prop only while disabled would flip it between uncontrolled and
  // controlled and Base UI warns about exactly that.
  const [open, setOpen] = React.useState(false)

  return (
    <TooltipPrimitive.Provider delay={400} closeDelay={0}>
      <TooltipPrimitive.Root open={disabled ? false : open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger render={children} />
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            side={side}
            align={align}
            sideOffset={8}
            className="z-50"
          >
            {/* Дизайн-чек 3/3 №4: стрелка рисуется вручную и прижимается к
                грани самого пузыря (см. arrowPositionClass в variants.ts), а
                не к центру якоря, как это делает `<Tooltip.Arrow>`. Раскладку
                берём из состояния попапа — оно отдаёт РАЗРЕШЁННЫЕ side/align,
                то есть уже с учётом возможного collision-флипа. */}
            <TooltipPrimitive.Popup
              data-slot="tooltip-content"
              render={(popupProps, state) => (
                <div {...popupProps}>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 pr-1">
                    {title && <p className="font-medium">{title}</p>}
                    <div>{content}</div>
                  </div>
                  {showCross && (
                    <CloseCross
                      onClick={() => setOpen(false)}
                      className="text-[var(--tooltip-fg)]"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      ARROW_BASE,
                      arrowPositionClass(state.side, state.align)
                    )}
                  />
                </div>
              )}
              className={cn(
                // Раскладка та же, что у Hint: текстовая колонка и крестик —
                // соседи в одной строке (gap-2), а не «иконка над текстом».
                "relative flex max-w-64 items-start gap-2 rounded-[8px] bg-[var(--tooltip-bg)] py-3 pr-3 pl-4 text-p3-regular text-[var(--tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                className
              )}
            />
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { Tooltip }
export type { TooltipProps }
