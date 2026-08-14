import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { Button } from "@/components/ui/button"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"

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
}

function ButtonMenuOverflow({
  children,
  modal = false,
  tone = "light",
  ...props
}: ButtonMenuOverflowProps) {
  return (
    <MenuPrimitive.Root modal={modal} {...props}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant={tone === "dark" ? "secondary-white" : "secondary-grey"}
            size={tone === "dark" ? "sm" : "lg"}
            icon={Ellipsis}
            iconPosition="only"
            aria-label="Ещё"
          />
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="start"
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
