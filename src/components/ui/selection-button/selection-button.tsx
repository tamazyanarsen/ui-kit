import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronDown, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { menuClickOpenProps } from "@/lib/menu-click-open"
import { POPUP_CHEVRON_TRANSITION, POPUP_COLLISION } from "@/lib/popup-position"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import { MenuSheet, MenuSheetItem } from "@/components/ui/menu-sheet"
import { NAV_POPUP_WIDTH } from "@/components/ui/button-menu/popup-width"

// SelectionButton — «Кнопка выбора»: триггер в паре со всплывающим
// списком в стиле Select или Dropdown, которым прячут не поместившуюся в
// видимый интерфейс функциональность. По макету триггер и список
// настраиваются независимо («настройки кнопки указаны в разделе Button, а
// настройки списка — в этом разделе»): триггер по умолчанию — это просто
// `Button` нужного размера (L — это icon-lg 56px, S — icon-sm 32px, оба
// `secondary-white`), но передать можно любой элемент триггера (например,
// Button с подписью и замыкающим шевроном, как в примере «Использование в
// макете»). `direction` — это угол раскрытия всплывающего окна
// относительно триггера; макет называет его по направлению, в котором
// раскрывается список (например, «Top Right» — раскрывается вверх и
// вправо, то есть триггер стоит в левом нижнем углу списка).
//
// Правки UI-Kit от 25.10: `direction` — только ПРЕДПОЧТИТЕЛЬНАЯ сторона и
// выравнивание. По умолчанию список раскрывается вниз (`down-right`), а у
// края окна, где снизу места не хватает, а сверху хватает, позиционер
// отражает его на другую сторону (`POPUP_COLLISION`, src/lib/popup-position.ts).
//
// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“»: в мобильном виде (уже 1280, `useIsDesktop()`) список — штора
// `MenuSheet` (Modal кита) со строками во всю ширину; заголовок — подпись
// триггера (`sheetTitle`), нажатие строки выполняет действие и закрывает
// штору, с `value` у выбранной — галка. Триггер тот же. На десктопе —
// прежний поповер, который раскрывается по клику, а не на `mousedown`
// (`menuClickOpenProps`, «Menu раскрывается на нажатии, а не на клике»).
export type SelectionButtonSize = "lg" | "sm"
export type SelectionButtonDirection =
  | "top-left"
  | "top-right"
  | "down-left"
  | "down-right"

interface SelectionButtonItem {
  /**
   * Устойчивый ключ элемента. Без него ключ — позиция в списке, и при
   * вставке или перестановке элемент получает чужой узел вместе с его
   * состоянием (подсветка пункта) (ревью 10.10, КК-5). Передавайте, если список
   * меняется на месте.
   */
  id?: string | number
  text: React.ReactNode
  description?: React.ReactNode
  onSelect?: () => void
  disabled?: boolean
}

interface SelectionButtonProps {
  items: SelectionButtonItem[]
  size?: SelectionButtonSize
  direction?: SelectionButtonDirection
  showDropdown?: boolean
  trigger?: React.ReactElement
  triggerLabel?: string
  modal?: boolean
  className?: string
  /**
   * Выбранный пункт — его `id` (у пункта без `id` — позиция в списке).
   *
   * Правки UI-Kit от 25.10: задан — меню становится выбором одного из
   * (`role="menuitemradio"`, `aria-checked`), у выбранного пункта справа
   * голубая галка, как у `SelectItem`, и у всех пунктов справа место 48
   * под неё; `null` — отметка включена, но ничего не выбрано. Не задан —
   * меню действий без галок, как раньше. Нужна ли отметка, решает продукт:
   * у переключателя режима выбранный пункт есть всегда, у меню действий его
   * нет. Само значение меню не меняет — его обновляет `onSelect` пункта.
   */
  value?: string | number | null
  /**
   * Заголовок мобильной шторы (Правки UI-Kit от 25.10). Не задан — подпись
   * триггера: текст своего `trigger` или его `aria-label`, иначе
   * `triggerLabel`.
   */
  sheetTitle?: React.ReactNode
}

/** Направление раскрытия → сторона и выравнивание позиционера. Экспортируется
 *  ради «ещё» в Button Menu: в Figma это тот же вложенный Selection Button. */
const SELECTION_BUTTON_PLACEMENT: Record<
  SelectionButtonDirection,
  { side: "top" | "bottom"; align: "start" | "end" }
> = {
  "top-right": { side: "top", align: "start" },
  "top-left": { side: "top", align: "end" },
  "down-right": { side: "bottom", align: "start" },
  "down-left": { side: "bottom", align: "end" },
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

/** Подпись триггера для заголовка шторы: текст кнопки или её `aria-label`. */
function triggerCaption(trigger: React.ReactElement | undefined): React.ReactNode {
  if (!trigger) return undefined
  const props = trigger.props as { children?: unknown; "aria-label"?: string }
  if (typeof props.children === "string" || typeof props.children === "number") {
    return props.children
  }
  return props["aria-label"]
}

/**
 * Шеврон для текстового триггера: смотрит вниз в покое и поворачивается
 * вверх, пока список раскрыт.
 *
 * Дизайн-чек «Storybook 3», замечание 14: в состоянии Active шеврон смотрит
 * вверх, в Default — вниз. Подставляется в `Button` как обычный `icon`,
 * поэтому принимает те же пропсы, что и глиф кита.
 *
 * Правки UI-Kit от 25.10: шеврон ОДИН и поворачивается на 180° (200 мс,
 * ease-out), а не подменяется вторым значком — смена значка читалась
 * вспышкой. Так же сделан шеврон переключателя организации в шапке.
 *
 * ⚠️ Поворот — КЛАССОМ, а не состоянием. Триггер отдаётся снаружи готовым
 * элементом, и открытость списка до него не доходит; зато Base UI ставит
 * `data-popup-open` прямо на кнопку, а у самой кнопки в корне объявлен
 * `group/button`. Так один и тот же элемент оказывается и группой, и
 * носителем признака — правило `group-data-popup-open/button:` попадает по
 * потомку-глифу.
 */
function SelectionButtonChevron({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: 16 | 24 }) {
  return (
    <ChevronDown
      {...props}
      data-slot="selection-button-chevron"
      className={cn(
        POPUP_CHEVRON_TRANSITION,
        "group-data-popup-open/button:rotate-180",
        className
      )}
    />
  )
}

function SelectionButton({
  items,
  size = "lg",
  direction = "down-right",
  showDropdown = true,
  trigger,
  triggerLabel = "Ещё",
  modal = false,
  className,
  value,
  sheetTitle,
}: SelectionButtonProps) {
  const isDesktop = useIsDesktop()
  const resolvedTrigger = trigger ?? (
    <Button
      variant="secondary-white"
      size={size === "lg" ? "lg" : "sm"}
      icon={Ellipsis}
      iconPosition="only"
      aria-label={triggerLabel}
    />
  )

  if (!showDropdown) {
    return resolvedTrigger
  }

  // Мобильный вид — штора. Обёртка гасит всплытие и у шторы: React ведёт
  // события из портала по дереву компонентов, и нажатие строки шторы иначе
  // дошло бы до строки таблицы или карточки, в которой стоит кнопка.
  if (!isDesktop) {
    return (
      <span onMouseDown={stopPropagation} onClick={stopPropagation}>
        <MenuSheet
          title={sheetTitle ?? triggerCaption(trigger) ?? triggerLabel}
          trigger={resolvedTrigger}
        >
          {items.filter(Boolean).map((item, index) => {
            const itemValue = item.id ?? index
            return (
              <MenuSheetItem
                key={itemValue}
                text={item.text}
                description={item.description}
                disabled={item.disabled}
                checked={value === undefined ? undefined : itemValue === value}
                onSelect={item.onSelect}
                data-slot="selection-button-item"
              />
            )
          })}
        </MenuSheet>
      </span>
    )
  }

  const { side, align } = SELECTION_BUTTON_PLACEMENT[direction]

  return (
    <MenuPrimitive.Root modal={modal}>
      {/* Обёртка гасит `mousedown`/`click`, чтобы нажатие триггера не
          проваливалось в строку или карточку. Другое открытое меню при этом
          всё равно закрывается: Base UI ловит «нажатие снаружи» слушателем на
          самой цели нажатия, а не всплытием до документа. */}
      <span onMouseDown={stopPropagation} onClick={stopPropagation}>
        <MenuPrimitive.Trigger {...menuClickOpenProps} render={resolvedTrigger} />
      </span>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={8}
          collisionAvoidance={POPUP_COLLISION}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="selection-button-content"
            // Не шире 400px и окна без полей — как меню навигации (аудит 17):
            // длинная подпись действия раздвигала страницу вбок.
            render={<Dropdown className={cn("themed-scrollbar overflow-x-hidden overflow-y-auto", NAV_POPUP_WIDTH, className)} />}
          >
            {value === undefined ? (
              items.filter(Boolean).map((item, index) => (
                <MenuPrimitive.Item
                  key={item.id ?? index}
                  disabled={item.disabled}
                  onClick={item.onSelect}
                  data-slot="selection-button-item"
                  render={<DropdownItem text={item.text} description={item.description} />}
                />
              ))
            ) : (
              // Выбор одного из: пункты — `menuitemradio` с `aria-checked`.
              // Группа управляемая, а меняет её значение потребитель в
              // `onSelect`; `closeOnClick` — чтобы выбор закрывал меню, как
              // нажатие обычного пункта (у Base UI радиопункт по умолчанию
              // меню не закрывает).
              <MenuPrimitive.RadioGroup value={value}>
                {items.filter(Boolean).map((item, index) => {
                  const itemValue = item.id ?? index
                  return (
                    <MenuPrimitive.RadioItem
                      key={itemValue}
                      value={itemValue}
                      closeOnClick
                      disabled={item.disabled}
                      onClick={item.onSelect}
                      data-slot="selection-button-item"
                      render={
                        <DropdownItem
                          text={item.text}
                          description={item.description}
                          checked={itemValue === value}
                        />
                      }
                    />
                  )
                })}
              </MenuPrimitive.RadioGroup>
            )}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { SelectionButton, SelectionButtonChevron, SELECTION_BUTTON_PLACEMENT }
export type { SelectionButtonProps, SelectionButtonItem }
