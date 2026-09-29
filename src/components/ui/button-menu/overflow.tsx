import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import {
  SELECTION_BUTTON_PLACEMENT,
  type SelectionButtonDirection,
  type SelectionButtonSize,
} from "@/components/ui/selection-button/selection-button"
import { NAV_POPUP_WIDTH } from "./popup-width"

// Триггер перекрытия «...» и его выпадающее меню. По макету это тот же
// компонент Dropdown, что и у Select («Больше информации о выпадающем
// списке вы можете найти в разделе Select, Dropdown»), построенный на Menu
// вместо Select, потому что пункты вызывают действия, а не задают значение,
// — но рисующий настоящие общие компоненты Dropdown и DropdownItem (через
// пропс `render` в Base UI), а не просто занимающий их className.
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
   * одноразмерная». Проверено по мастеру: вложенный
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
          {/* Высота — не больше места до края окна: у закреплённой нижней
              панели длинный список раскрывается вверх, и без ограничения его
              верхние пункты уходили за экран, прокрутить к ним было нельзя. */}
          <MenuPrimitive.Popup
            data-slot="button-menu-overflow-content"
            render={<Dropdown className={cn("themed-scrollbar min-w-56 max-h-(--available-height) overflow-x-hidden overflow-y-auto", NAV_POPUP_WIDTH)} />}
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

// forwardRef: тип пропсов унаследован от `Menu.Item` и обещает `ref`, а на
// React 18 обычная функция его молча теряет.
const ButtonMenuOverflowItem = React.forwardRef<
  HTMLDivElement,
  ButtonMenuOverflowItemProps
>(function ButtonMenuOverflowItem({ className, text, description, ...props }, ref) {
  return (
    <MenuPrimitive.Item
      ref={ref}
      data-slot="button-menu-overflow-item"
      render={<DropdownItem text={text} description={description} className={className} />}
      {...props}
    />
  )
})

export { ButtonMenuOverflow, ButtonMenuOverflowItem }
export type { ButtonMenuOverflowProps }
