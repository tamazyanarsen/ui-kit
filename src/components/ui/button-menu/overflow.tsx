import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DROPDOWN_POPUP_CLASS, DROPDOWN_ACTION_ITEM_CLASS } from "@/components/ui/select/dropdown-chrome"

// The "..." overflow trigger + its dropdown menu. Per the spec this is the
// same Dropdown component as Select ("Больше информации о выпадающем списке
// вы можете найти в разделе Select, Dropdown") — built on Menu instead of
// Select since items fire actions rather than set a value, but sharing
// Select's exact popup/item chrome via DROPDOWN_POPUP_CLASS below.
interface ButtonMenuOverflowProps
  extends Omit<MenuPrimitive.Root.Props, "children"> {
  children?: React.ReactNode
}

function ButtonMenuOverflow({
  children,
  modal = false,
  ...props
}: ButtonMenuOverflowProps) {
  return (
    <MenuPrimitive.Root modal={modal} {...props}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant="secondary-grey"
            size="lg"
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
            className={cn(DROPDOWN_POPUP_CLASS, "min-w-56 p-2")}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

interface ButtonMenuOverflowItemProps
  extends Omit<MenuPrimitive.Item.Props, "children"> {
  text: React.ReactNode
  description?: React.ReactNode
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
      className={cn(DROPDOWN_ACTION_ITEM_CLASS, className)}
      {...props}
    >
      {/* Round-2 audit fix: Figma's literal design-context dump for this
          item (node 41357:46406, "Menu Point") gives the title as
          text-[16px]/leading-[24px] (P1 Medium desktop) — the kit's own
          typography scale confirms 14px is P1's *mobile* shrink, not the
          desktop size this always-desktop popup renders at. The
          description is P3 Medium (12px/16px, weight 500) — size/line-height
          already matched Tailwind's text-xs default, but font-medium was
          missing. */}
      <span className="text-p1 font-medium text-[#252628]">{text}</span>
      {description && (
        <span className="text-p3 font-medium text-[#999999]">{description}</span>
      )}
    </MenuPrimitive.Item>
  )
}

export { ButtonMenuOverflow, ButtonMenuOverflowItem }
