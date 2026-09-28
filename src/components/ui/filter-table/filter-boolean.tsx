import * as React from "react"

import { cn } from "@/lib/utils"
import { filterTablePillClass } from "./filter-table"

// FilterBoolean — «Булев фильтр».
//
// «Не имеет выпадающего окна и срабатывает по значению „Истина“. Примеры
// использования: Ненулевой баланс — система должна показать все счета,
// баланс которых выше нуля».
//
// То есть это вообще не FilterShell: раз всплывающего окна нет, то нет ни
// триггера, который надо заякорить, ни пары «Применить/Сбросить», ни
// значения для показа. Это таблетка-переключатель, которая либо включена
// («фильтр действует»), либо выключена («фильтр не действует»), нарисованная
// той же заливкой `ELK / filter-table`, что и любой другой чип.

interface FilterBooleanProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "onChange" | "defaultValue"
  > {
  label: React.ReactNode
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (value: boolean) => void
}

const FilterBoolean = React.forwardRef<
  HTMLButtonElement,
  FilterBooleanProps
>(function FilterBoolean({
  className,
  label,
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  onClick,
  ...props
}, ref) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const active = value ?? uncontrolled

  return (
    <button
      ref={ref}
      type="button"
      data-slot="filter-boolean"
      aria-pressed={active}
      disabled={disabled}
      onClick={(event) => {
        const next = !active
        if (value === undefined) setUncontrolled(next)
        onValueChange?.(next)
        onClick?.(event)
      }}
      className={cn(
        "max-w-64 min-w-20 cursor-pointer truncate outline-none focus-visible:focus-ring disabled:cursor-not-allowed",
        filterTablePillClass({ selected: active, disabled }),
        className
      )}
      {...props}
    >
      {label}
    </button>
  )
})

export { FilterBoolean }
export type { FilterBooleanProps }
