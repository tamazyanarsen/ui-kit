import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { Dropdown } from "@/components/ui/dropdown"

/**
 * Плитка панели иконок в шапке — только геометрия, без реакции на курсор.
 *
 * Панель иконок — это смежные плитки во всю высоту строки, а не мелкие
 * кнопки с зазорами: Figma's `Panel` ставит Notification/Letter 56×64,
 * Wallet 88×64 и Profile 304×64 подряд с x = 0, 56, 112, 200 (зазор 0).
 *
 * ⚠️ Заливки на наведении у плиток НЕТ. Проверено рендером состояний в
 * изоляции: Hover у Notification (70303:48926), Letter (70303:48915),
 * Wallet (70303:48867) и обоих профилей (70303:48879, 70303:48897)
 * прозрачен насквозь — альфа 0 в каждом пикселе фона. Прежний #EFEFEF был
 * взят не из макета. Единственное исключение — «Выйти», см.
 * {@link HEADER_ICON_TILE_LOGOUT}.
 */
const HEADER_ICON_TILE =
  "group flex h-16 w-14 shrink-0 cursor-pointer items-center justify-center text-[var(--header-icon-fg)] outline-none transition-colors"

/**
 * Плитка, чей глиф на наведении становится брендовым, — обычный случай.
 *
 * Цвет снят с самих ассетов состояний: обводка колокольчика #252628 →
 * #14B1D1 (ноды 70303:48922 и 70303:48926), заливка конверта и кошелька —
 * #14B1D1 в Hover (70303:48915, 70303:48867), у профиля сотрудника
 * брендовыми становятся и подпись, и знак (70303:48879). Состояние Active
 * от Hover не отличается ничем, поэтому отдельного правила у него нет.
 */
const HEADER_ICON_TILE_ACCENT = cn(
  HEADER_ICON_TILE,
  "hover:text-[var(--header-hover-fg)]"
)

/**
 * Плитка «Выйти» — единственная, которая ведёт себя наоборот.
 *
 * У `Out (ELK)` (ноды 70303:48813 / 70303:48815) SVG в Default и Hover
 * совпадает байт в байт с заливкой #252628: знак не перекрашивается, зато
 * появляется подложка grey-106 #F8F8F8. Состояния Active у этой плитки в
 * макете нет вовсе.
 */
const HEADER_ICON_TILE_LOGOUT = cn(
  HEADER_ICON_TILE,
  "hover:bg-[var(--header-logout-hover-bg)]"
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

export {
  HEADER_ICON_TILE,
  HEADER_ICON_TILE_ACCENT,
  HEADER_ICON_TILE_LOGOUT,
  HeaderMenuPopup,
}
