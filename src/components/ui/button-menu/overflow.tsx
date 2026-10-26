import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { menuClickOpenProps } from "@/lib/menu-click-open"
import { POPUP_COLLISION } from "@/lib/popup-position"
import { useIsDesktop } from "@/lib/use-is-desktop"

import { Button } from "@/components/ui/button"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import { MenuSheet, MenuSheetItem, useMenuSheet } from "@/components/ui/menu-sheet"
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
//
// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“»: в мобильном виде (уже 1280) «…»/«Ещё» открывает не поповер, а
// штору `MenuSheet` (заголовок — `sheetTitle`, по умолчанию «Ещё», как
// подпись триггера); пункты `ButtonMenuOverflowItem` внутри шторы сами
// становятся её строками — нажатие выполняет действие и закрывает штору.
// Так это работает и в `ButtonMenuRow`, и в `ButtonMenuBlack`: обе панели
// рисуют этот же компонент. На десктопе — прежний поповер, раскрывается по
// клику (`menuClickOpenProps`).
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
  /** Заголовок мобильной шторы — подпись триггера; по умолчанию «Ещё». */
  sheetTitle?: React.ReactNode
}

function ButtonMenuOverflow({
  children,
  modal = false,
  tone = "light",
  direction = "down-right",
  size,
  showDropdown = true,
  sheetTitle = "Ещё",
  ...props
}: ButtonMenuOverflowProps) {
  const isDesktop = useIsDesktop()
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

  if (!isDesktop) {
    // Открытость шторы — та же, что у меню: `open`/`defaultOpen`/
    // `onOpenChange` потребителя доходят и сюда.
    return (
      <MenuSheet
        title={sheetTitle}
        trigger={trigger}
        open={props.open}
        defaultOpen={props.defaultOpen}
        onOpenChange={
          props.onOpenChange
            ? (open) =>
                (props.onOpenChange as (open: boolean, details?: unknown) => void)(open)
            : undefined
        }
      >
        {children}
      </MenuSheet>
    )
  }

  const { side, align } = SELECTION_BUTTON_PLACEMENT[direction]

  return (
    <MenuPrimitive.Root modal={modal} {...props}>
      <MenuPrimitive.Trigger {...menuClickOpenProps} render={trigger} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={8}
          collisionAvoidance={POPUP_COLLISION}
          className="isolate z-50"
        >
          {/* Высота — не больше места до края окна: у закреплённой нижней
              панели длинный список раскрывается вверх, и без ограничения его
              верхние пункты уходили за экран, прокрутить к ним было нельзя. */}
          <MenuPrimitive.Popup
            data-slot="button-menu-overflow-content"
            render={<Dropdown className={cn("themed-scrollbar min-w-56 overflow-x-hidden overflow-y-auto", NAV_POPUP_WIDTH)} />}
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
//
// Внутри мобильной шторы (`MenuSheet`) пункт — строка шторы, а не
// `Menu.Item`: примитиву меню там нет корня. Действие (`onClick`) и
// `disabled` те же; штора закрывается после нажатия.
const ButtonMenuOverflowItem = React.forwardRef<
  HTMLDivElement,
  ButtonMenuOverflowItemProps
>(function ButtonMenuOverflowItem({ className, text, description, ...props }, ref) {
  const sheet = useMenuSheet()
  if (sheet) {
    const { onClick, disabled, id, style } = props
    return (
      <MenuSheetItem
        ref={ref}
        id={id}
        style={typeof style === "function" ? undefined : style}
        text={text}
        description={description}
        disabled={disabled}
        className={className}
        aria-current={props["aria-current"]}
        data-slot="button-menu-overflow-item"
        onSelect={
          onClick
            ? (event) =>
                (onClick as unknown as (event: React.SyntheticEvent) => void)(event)
            : undefined
        }
      />
    )
  }
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
