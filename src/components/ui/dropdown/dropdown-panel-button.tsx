import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Стрелка мастера `icon / arrow right` 16: штрих 2, круглые концы, по центру
// коробки (шаг по y = 8). Глиф `ArrowRight` набора иконок кита рисуется в
// верхней половине коробки (y 0.3–6.7), и стрелка в кнопке сидела выше
// подписи, поэтому здесь путь мастера взят как есть.
function PanelArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M11.5357 8L4.4646 8M9.05854 5.52288L11.5357 8L9.05854 10.4771"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
  { className, children, onClick, icon = PanelArrow, ...props },
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
