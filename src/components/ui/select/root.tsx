import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { manualChangeDetails } from "@/lib/change-details"
import { useLatest } from "@/lib/use-latest"
import { useIsDesktop } from "@/lib/use-is-desktop"

import { clipText } from "./clip-text"
import { SelectSheetContext, useSelectSheet } from "./sheet"

// Сброс значения для кнопки «Очистить» в SelectTrigger. Base UI не даёт
// публичного способа сбросить выбор снаружи, поэтому значение держит обёртка:
// неуправляемый Select хранит его сам, управляемый просит родителя через
// `onValueChange`. Без этого крестик у выбранного значения вызывал только
// необязательный `onClear` и в витринах (сортировка TableTop) не делал ничего.
const SelectClearContext = React.createContext<((event: Event) => void) | null>(null)

export function useSelectClear() {
  return React.useContext(SelectClearContext)
}

type RootProps<Value, Multiple extends boolean | undefined> = SelectPrimitive.Root.Props<
  Value,
  Multiple
>
type RootValue<Value, Multiple extends boolean | undefined> = RootProps<Value, Multiple>["value"]

/** Детали события сброса в форме, которую ждёт `onValueChange` Base UI. */
function clearDetails(event: Event): SelectPrimitive.Root.ChangeEventDetails {
  return manualChangeDetails("none", event)
}

export function Select<Value, Multiple extends boolean | undefined = false>({
  value,
  defaultValue,
  onValueChange,
  multiple,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: RootProps<Value, Multiple>) {
  const isDesktop = useIsDesktop()
  const controlled = value !== undefined
  const [ownValue, setOwnValue] = React.useState<RootValue<Value, Multiple>>(
    defaultValue ?? null
  )
  const current = controlled ? value : ownValue

  // Колбэк потребителя может отменить смену (`details.cancel()`) — тогда и
  // своё значение не трогаем, как делает сам Base UI.
  const change = (
    next: Parameters<NonNullable<RootProps<Value, Multiple>["onValueChange"]>>[0],
    details: SelectPrimitive.Root.ChangeEventDetails
  ) => {
    onValueChange?.(next, details)
    if (!controlled && !details.isCanceled) setOwnValue(next as RootValue<Value, Multiple>)
  }

  const changeRef = useLatest(change)
  const clear = React.useCallback((event: Event) => {
    const empty = (multiple ? [] : null) as Parameters<typeof change>[0]
    changeRef.current(empty, clearDetails(event))
  }, [multiple, changeRef])

  // Мобильная штора (Правки UI-Kit от 25.10, см. ./sheet.tsx). Открытость
  // держит обёртка: `open`/`defaultOpen`/`onOpenChange` потребителя
  // относятся к шторе, а окно примитива всегда закрыто.
  const [ownSheetOpen, setOwnSheetOpen] = React.useState(defaultOpen ?? false)
  const sheetOpen = open ?? ownSheetOpen
  const titleRef = React.useRef<React.ReactNode>(null)
  const onOpenChangeRef = useLatest(onOpenChange)
  const setSheetOpen = React.useCallback(
    (next: boolean, event?: Event) => {
      if (open === undefined) setOwnSheetOpen(next)
      onOpenChangeRef.current?.(
        next,
        manualChangeDetails(next ? "trigger-press" : "none", event ?? new Event("change")) as Parameters<
          NonNullable<RootProps<Value, Multiple>["onOpenChange"]>
        >[1]
      )
    },
    [open, onOpenChangeRef]
  )
  const isItemEqualToValue = props.isItemEqualToValue
  const isSelected = React.useCallback(
    (itemValue: unknown) => {
      const equal = (a: unknown, b: unknown) =>
        isItemEqualToValue ? isItemEqualToValue(a as Value, b as Value) : Object.is(a, b)
      if (multiple) {
        return Array.isArray(current) && current.some((v) => equal(itemValue, v))
      }
      return current != null && equal(itemValue, current)
    },
    [current, multiple, isItemEqualToValue]
  )
  const choose = React.useCallback(
    (itemValue: unknown, event: Event) => {
      let next: unknown = itemValue
      if (multiple) {
        const list = Array.isArray(current) ? (current as unknown[]) : []
        next = isSelected(itemValue)
          ? list.filter((v) => !(isItemEqualToValue ? isItemEqualToValue(itemValue as Value, v as Value) : Object.is(itemValue, v)))
          : [...list, itemValue]
      }
      changeRef.current(
        next as Parameters<typeof change>[0],
        manualChangeDetails("item-press", event) as SelectPrimitive.Root.ChangeEventDetails
      )
    },
    [multiple, current, isSelected, isItemEqualToValue, changeRef]
  )
  const sheet = React.useMemo(
    () => ({
      open: sheetOpen,
      setOpen: setSheetOpen,
      choose,
      isSelected,
      multiple: Boolean(multiple),
      locked: Boolean(props.disabled || props.readOnly),
      titleRef,
    }),
    [sheetOpen, setSheetOpen, choose, isSelected, multiple, props.disabled, props.readOnly]
  )

  if (!isDesktop) {
    return (
      <SelectClearContext.Provider value={clear}>
        <SelectSheetContext.Provider value={sheet}>
          <SelectPrimitive.Root
            {...props}
            multiple={multiple}
            value={current}
            onValueChange={change}
            open={false}
            // Указатель открывает штору щелчком по триггеру (см.
            // SelectTrigger); здесь — только клавиатура (стрелка, Enter,
            // пробел на триггере), которую обрабатывает сам примитив.
            onOpenChange={(next, details) => {
              const type = details.event?.type ?? ""
              if (next && type.startsWith("key")) setSheetOpen(true, details.event)
            }}
          />
        </SelectSheetContext.Provider>
      </SelectClearContext.Provider>
    )
  }

  return (
    <SelectClearContext.Provider value={clear}>
      <SelectPrimitive.Root
        {...props}
        multiple={multiple}
        value={current}
        onValueChange={change}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      />
    </SelectClearContext.Provider>
  )
}

export function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  // В мобильной шторе пунктов примитива нет — группа становится обычной.
  if (useSelectSheet()) {
    return (
      <div
        role="group"
        data-slot="select-group"
        className={typeof className === "string" ? className : undefined}
      >
        {props.children as React.ReactNode}
      </div>
    )
  }
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

export function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      // Подпись значения (или несколько через запятую) Base UI кладёт голым
      // текстом прямо во флекс — анонимный блок, которому многоточие не
      // достаётся: длинное значение срезалось посреди буквы. Текст
      // оборачивается в свой узел с многоточием; разметка из
      // `children`-функции потребителя (логотип + подписи) проходит как есть.
      render={(renderProps) => <span {...renderProps}>{clipText(renderProps.children)}</span>}
      {...props}
    />
  )
}
