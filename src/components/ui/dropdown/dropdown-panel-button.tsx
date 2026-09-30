import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@/icons"

/**
 * Блок с кнопкой под строкой поиска — `Panel Button (Desktop | Mobile, ELK)`,
 * свойство `Show Button` компонент-сета `ELK / dropdown`.
 *
 * Замер мастеров: белая панель на всю ширину списка, поля 16 со всех сторон
 * (280×64 на десктопе, 360×64 на мобиле), внутри одна кнопка `ELK / button`
 * S, Secondary (Dark Blue), «Icon Left» со стрелкой `icon / arrow right` —
 * то есть `Button size="sm" variant="secondary-black"`: 32 в высоту, поля
 * 16/20, подпись P2 Medium 14/20 на десктопе и 12/16 на мобиле (размер
 * кнопки переключает она сама). Ряд с переносом (`flex-wrap`, зазор по
 * вертикали 8). Панель стоит между строкой поиска и списком, в списке не
 * прокручивается и разделителя под собой не имеет: линия под поиском уже
 * есть у самой строки поиска.
 */
interface DropdownPanelButtonProps
  extends Omit<React.ComponentProps<"div">, "onClick"> {
  /** Подпись кнопки. */
  children: React.ReactNode
  onClick?: () => void
  /** Глиф слева от подписи; по мастеру — стрелка `icon / arrow right`. */
  icon?: React.ComponentProps<typeof Button>["icon"]
}

const DropdownPanelButton = React.forwardRef<
  HTMLDivElement,
  DropdownPanelButtonProps
>(function DropdownPanelButton(
  { className, children, onClick, icon = ArrowRight, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="dropdown-panel-button"
      className={cn(
        "flex w-full shrink-0 flex-wrap items-start gap-y-2 bg-popover p-4",
        className
      )}
      {...props}
    >
      <Button
        type="button"
        variant="secondary-black"
        size="sm"
        icon={icon}
        iconPosition="left"
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
})

export { DropdownPanelButton }
export type { DropdownPanelButtonProps }
