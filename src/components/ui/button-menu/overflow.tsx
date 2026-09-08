import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { Button } from "@/components/ui/button"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import {
  SELECTION_BUTTON_PLACEMENT,
  type SelectionButtonDirection,
  type SelectionButtonSize,
} from "@/components/ui/selection-button/selection-button"

// The "..." overflow trigger + its dropdown menu. Per the spec this is the
// same Dropdown component as Select ("Больше информации о выпадающем списке
// вы можете найти в разделе Select, Dropdown") — built on Menu instead of
// Select since items fire actions rather than set a value, but rendering
// the actual shared Dropdown/DropdownItem components (via Base UI's `render`
// prop) instead of just borrowing their className.
interface ButtonMenuOverflowProps
  extends Omit<MenuPrimitive.Root.Props, "children"> {
  children?: React.ReactNode
  /** Панель, на которой стоит триггер. `dark` — чёрная ButtonMenuBlack: там
   *  все действия белые и 32px, включая «ещё» (дизайн-чек №12). Обычно
   *  проставляется самой панелью, руками передавать не нужно. */
  tone?: "light" | "dark"
  /**
   * Сторона раскрытия списка — свойство `Direction` вложенного
   * `ELK Selection Button` (см. {@link SelectionButtonDirection}).
   *
   * Дизайн-чек Storybook (Аня Багрова) №10: в панели свойств `ELK / button
   * menu` кнопка «ещё» — это инстанс Selection Button со своими Size,
   * Direction и Show Dropdown, а здесь их не было вовсе.
   */
  direction?: SelectionButtonDirection
  /**
   * Размер триггера. Проставляется РЯДОМ (`ButtonMenuRow`) под размер его
   * кнопок, руками передавать не нужно.
   *
   * ⚠️ Свойством компонента это НЕ является. Дизайн-чек от 08.09, замечание
   * 10: «Size S для Button Menu — выдуман. Его не должно быть, панель
   * одноразмерная». Проверено по мастеру (нода 41357:45664): вложенный
   * `ELK / selection button` в панели нарисован 56×56 и другого размера не
   * имеет. Значение `sm` осталось только для ряда команд внутри карточки и
   * для чёрной панели, где 32px — размер её собственных кнопок.
   */
  size?: SelectionButtonSize
  /** Свойство `Show Dropdown`: выключенное значение оставляет один триггер
   *  без выпадающего списка. */
  showDropdown?: boolean
}

function ButtonMenuOverflow({
  children,
  modal = false,
  tone = "light",
  direction = "down-right",
  size,
  showDropdown = true,
  ...props
}: ButtonMenuOverflowProps) {
  const resolvedSize = size ?? (tone === "dark" ? "sm" : "lg")
  const trigger = (
    <Button
      variant={tone === "dark" ? "secondary-white" : "secondary-grey"}
      size={resolvedSize}
      icon={Ellipsis}
      iconPosition="only"
      aria-label="Ещё"
    />
  )

  if (!showDropdown) return trigger

  const { side, align } = SELECTION_BUTTON_PLACEMENT[direction]

  return (
    <MenuPrimitive.Root modal={modal} {...props}>
      <MenuPrimitive.Trigger render={trigger} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="button-menu-overflow-content"
            render={<Dropdown className="min-w-56 overflow-hidden" />}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

interface ButtonMenuOverflowItemProps
  extends Omit<MenuPrimitive.Item.Props, "children" | "className"> {
  text: React.ReactNode
  description?: React.ReactNode
  className?: string
}

function ButtonMenuOverflowItem({
  className,
  text,
  description,
  ...props
}: ButtonMenuOverflowItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="button-menu-overflow-item"
      render={<DropdownItem text={text} description={description} className={className} />}
      {...props}
    />
  )
}

export { ButtonMenuOverflow, ButtonMenuOverflowItem }
export type { ButtonMenuOverflowProps }
