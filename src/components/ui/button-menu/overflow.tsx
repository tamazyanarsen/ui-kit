import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// The "..." overflow trigger + its dropdown menu (visually styled like
// Select's dropdown per the spec, but built on Menu since items fire actions
// rather than set a value).
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
            className="min-w-56 origin-(--transform-origin) rounded-2xl bg-white p-2 shadow-lg ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
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
      className={cn(
        "flex cursor-default flex-col gap-0.5 rounded-xl px-3 py-2.5 outline-none select-none data-highlighted:bg-[#F4F4F4]",
        className
      )}
      {...props}
    >
      <span className="text-sm font-medium text-[#252628]">{text}</span>
      {description && (
        <span className="text-xs text-[#999999]">{description}</span>
      )}
    </MenuPrimitive.Item>
  )
}

export { ButtonMenuOverflow, ButtonMenuOverflowItem }
