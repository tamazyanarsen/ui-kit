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
 *
 * Здесь только геометрия и заливка. Перекраска глифа на наведении — в
 * {@link HEADER_ICON_TILE_ACCENT}, потому что она есть не у всех плиток.
 */
const HEADER_ICON_TILE =
  "group flex h-16 w-14 shrink-0 cursor-pointer items-center justify-center text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)]"

/**
 * Плитка, чей глиф на наведении становится брендовым.
 *
 * ⚠️ Так ведут себя ВСЕ плитки панели, кроме «Выйти». Проверено по самим
 * ассетам состояний, а не на глаз: у `Notification Header (ELK)` обводка
 * колокольчика #252628 → #14B1D1 (ноды 70303:48922 и 70303:48926), у
 * `Letter Header (ELK)` заливка конверта #14B1D1 в Hover (нода
 * 70303:48915), у `Profile Employee (ELK)` в Hover брендовыми становятся и
 * подпись, и знак (нода 70303:48879).
 *
 * А вот у `Out (ELK)` (ноды 70303:48813 / 70303:48815) SVG в обоих
 * состояниях совпадает байт в байт с заливкой #252628 — на наведении
 * появляется только подложка. Поэтому кнопка «Выйти» берёт
 * {@link HEADER_ICON_TILE} без этой добавки.
 */
const HEADER_ICON_TILE_ACCENT = cn(
  HEADER_ICON_TILE,
  "hover:text-[var(--header-hover-fg)]"
)

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

export { HEADER_ICON_TILE, HEADER_ICON_TILE_ACCENT, HeaderMenuPopup }
