import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { menuClickOpenProps } from "@/lib/menu-click-open"

import { Ellipsis } from "@/icons"
import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/ui/dropdown"
import { cn } from "@/lib/utils"
import { NAV_POPUP_WIDTH } from "@/components/ui/button-menu/popup-width"
import { POPUP_COLLISION } from "@/lib/popup-position"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { MenuSheet } from "@/components/ui/menu-sheet"

// Триггер действий «...» для типа Button у ячейки заголовка — это Menu,
// собранное так же, как `ButtonMenuOverflow`, размером icon-sm и в варианте
// `secondary-white` (белый фон, наведение Grey 114, нажатие Grey 106;
// попиксельно сверено с собственным образцом «кебаба» в состояниях Default,
// Hover и Active — отдельный «призрачный» вариант кнопки не нужен). У
// действий строки вместо этого используется `SelectionButton`, который
// макет называет прямо: «используя белый компонент Selection Button».
//
// Правки UI-Kit от 25.10: на десктопе меню раскрывается по клику
// (`menuClickOpenProps`), в мобильном виде (уже 1280) вместо поповера —
// штора `MenuSheet` (заголовок `sheetTitle`); пункты `ButtonMenuOverflowItem`
// в ней сами становятся строками шторы. Нажатия в шторе не всплывают к
// строке таблицы.
function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

const DEFAULT_LABEL = "Открыть меню строки"

function TableRowMenu({
  menu,
  label = DEFAULT_LABEL,
  sheetTitle,
}: {
  menu: React.ReactNode
  label?: string
  /**
   * Заголовок мобильной шторы. По умолчанию — своя подпись триггера
   * (`label`, например «Настроить таблицу»), у меню строки — «Действия».
   */
  sheetTitle?: React.ReactNode
}) {
  const isDesktop = useIsDesktop()
  const trigger = (
    <Button
      variant="secondary-white"
      size="sm"
      icon={Ellipsis}
      iconPosition="only"
      aria-label={label}
    />
  )

  if (!isDesktop) {
    return (
      <span className="contents" onMouseDown={stopPropagation} onClick={stopPropagation}>
        <MenuSheet
          title={sheetTitle ?? (label === DEFAULT_LABEL ? "Действия" : label)}
          trigger={trigger}
        >
          {menu}
        </MenuSheet>
      </span>
    )
  }

  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger {...menuClickOpenProps} render={trigger} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionAvoidance={POPUP_COLLISION}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="table-row-menu-content"
            // Не выше места до края окна, как списки «…» (r11), и не шире
            // 400px и окна без полей, как меню навигации (аудит 17).
            render={<Dropdown className={cn("themed-scrollbar overflow-x-hidden overflow-y-auto", NAV_POPUP_WIDTH)} />}
          >
            {menu}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { TableRowMenu }
