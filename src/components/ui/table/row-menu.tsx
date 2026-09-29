import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Ellipsis } from "@/icons"
import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/ui/dropdown"
import { cn } from "@/lib/utils"
import { NAV_POPUP_WIDTH } from "@/components/ui/button-menu/popup-width"

// Триггер действий «...» для типа Button у ячейки заголовка — это Menu,
// собранное так же, как `ButtonMenuOverflow`, размером icon-sm и в варианте
// `secondary-white` (белый фон, наведение Grey 114, нажатие Grey 106;
// попиксельно сверено с собственным образцом «кебаба» в состояниях Default,
// Hover и Active — отдельный «призрачный» вариант кнопки не нужен). У
// действий строки вместо этого используется `SelectionButton`, который
// макет называет прямо: «используя белый компонент Selection Button».
function TableRowMenu({
  menu,
  label = "Открыть меню строки",
}: {
  menu: React.ReactNode
  label?: string
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant="secondary-white"
            size="sm"
            icon={Ellipsis}
            iconPosition="only"
            aria-label={label}
          />
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="table-row-menu-content"
            // Не выше места до края окна, как списки «…» (r11), и не шире
            // 400px и окна без полей, как меню навигации (аудит 17).
            render={<Dropdown className={cn("min-w-48 themed-scrollbar max-h-(--available-height) overflow-x-hidden overflow-y-auto", NAV_POPUP_WIDTH)} />}
          >
            {menu}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { TableRowMenu }
