import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"

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
  const details = {
    reason: "none" as const,
    event,
    isCanceled: false,
    isPropagationAllowed: false,
    trigger: undefined,
    cancel() {
      details.isCanceled = true
    },
    allowPropagation() {
      details.isPropagationAllowed = true
    },
  }
  return details
}

export function Select<Value, Multiple extends boolean | undefined = false>({
  value,
  defaultValue,
  onValueChange,
  multiple,
  ...props
}: RootProps<Value, Multiple>) {
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

  const changeRef = React.useRef(change)
  changeRef.current = change
  const clear = React.useCallback((event: Event) => {
    const empty = (multiple ? [] : null) as Parameters<typeof change>[0]
    changeRef.current(empty, clearDetails(event))
  }, [multiple])

  return (
    <SelectClearContext.Provider value={clear}>
      <SelectPrimitive.Root
        {...props}
        multiple={multiple}
        value={current}
        onValueChange={change}
      />
    </SelectClearContext.Provider>
  )
}

export function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
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
      {...props}
    />
  )
}
