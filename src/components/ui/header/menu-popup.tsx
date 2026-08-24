import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { Dropdown } from "@/components/ui/dropdown"

/**
 * Плитка панели иконок в шапке.
 *
 * Панель иконок — это смежные плитки во всю высоту строки, а не мелкие
 * кнопки с зазорами: Figma's `Panel` ставит Notification/Letter 56×64,
 * Wallet 88×64 и Profile 304×64 подряд с x = 0, 56, 112, 200 (зазор 0).
 */
const HEADER_ICON_TILE =
  "group flex h-16 w-14 shrink-0 cursor-pointer items-center justify-center text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"

/**
 * Выпадающая панель любого меню шапки: портал, позиционер и попап-`Dropdown`
 * на фоне шапки. Все меню шапки раскрываются одинаково — вниз, с отступом 8
 * и над остальным содержимым, — поэтому эти три обёртки живут в одном месте,
 * а не переписываются в каждом меню.
 */
function HeaderMenuPopup({
  slot,
  align = "end",
  className,
  children,
}: {
  /** Значение `data-slot` попапа — по нему меню находят тесты. */
  slot: string
  align?: "start" | "end"
  className?: string
  children: React.ReactNode
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side="bottom"
        align={align}
        sideOffset={8}
        className="isolate z-50"
      >
        <MenuPrimitive.Popup
          data-slot={slot}
          render={
            <Dropdown
              className={cn(
                "min-w-56 overflow-hidden bg-[var(--header-bg)]",
                className
              )}
            />
          }
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export { HEADER_ICON_TILE, HeaderMenuPopup }
