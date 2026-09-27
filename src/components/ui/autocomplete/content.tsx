import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"
import { Dropdown } from "@/components/ui/dropdown"

import { useAutocompleteAnchor } from "./root"

// Portal, Positioner и Popup, заякоренные прямо к полю (отдельного
// триггера-кнопки в дереве нет): ширина равна ширине поля, устройство то
// же, что у content.tsx в ./combobox, но без дополнительного поля поиска
// внутри всплывающего окна — здесь полем поиска служит само поле. `anchor`
// задан явно на внешнюю коробку из field.tsx (см. комментарий про
// AnchorContext в root.tsx): без этого Base UI по умолчанию берёт голый
// <input>, который уже коробки. Рисуется настоящий общий компонент
// Dropdown (тот же, что у Select и Combobox), а не просто совпадающий
// className. `p-2` здесь нет — так же, как в собственных content.tsx у
// Select и Combobox: у оболочки Dropdown нулевые отступы, пункты идут
// вплотную к её краям (см. item.tsx).

function AutocompleteContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const anchorRef = useAutocompleteAnchor()
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        anchor={anchorRef}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 w-(--anchor-width)"
      >
        <ComboboxPrimitive.Popup
          data-slot="autocomplete-content"
          render={
            <Dropdown
              className={cn(
                "isolate flex max-h-[min(400px,var(--available-height))] w-full flex-col overflow-hidden",
                className
              )}
            />
          }
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function AutocompleteList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="autocomplete-list"
      className={cn("themed-scrollbar flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
}

function AutocompleteCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

function AutocompleteStatus({ className, ...props }: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="autocomplete-status"
      // Второй проход: та же правка отступов подсказки «Text Help», что и
      // у Status и Empty самого Combobox (pt-[12px]/pb-[16px]/px-[16px] по
      // инстансу выпадающего списка с подсказкой поиска, а не равномерные
      // px-3/py-2.5). Отдельного кадра Autocomplete не существует, но это
      // буквально тот же переиспользованный шаблон
      // ComboboxPrimitive.Status и Empty, а не перенос по аналогии. Текст
      // состояния «Empty» у самого списка — Object Sans Medium (P2 Medium),
      // а не Regular, несмотря на приглушённый цвет --select-caption-fg.
      className={cn("px-4 pt-3 pb-4 text-p2-medium text-[var(--select-caption-fg)] empty:hidden", className)}
      {...props}
    />
  )
}

function AutocompleteEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="autocomplete-empty"
      // Второй проход: та же правка отступов подсказки «Text Help», что и
      // у Status и Empty самого Combobox (pt-[12px]/pb-[16px]/px-[16px] по
      // инстансу выпадающего списка с подсказкой поиска, а не равномерные
      // px-3/py-2.5). Отдельного кадра Autocomplete не существует, но это
      // буквально тот же переиспользованный шаблон
      // ComboboxPrimitive.Status и Empty, а не перенос по аналогии. Текст
      // состояния «Empty» у самого списка — Object Sans Medium (P2 Medium),
      // а не Regular, несмотря на приглушённый цвет --select-caption-fg.
      className={cn("px-4 pt-3 pb-4 text-p2-medium text-[var(--select-caption-fg)] empty:hidden", className)}
      {...props}
    />
  )
}

export {
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteStatus,
  AutocompleteEmpty,
}
