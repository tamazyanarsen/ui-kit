import * as React from "react"

import { cn } from "@/lib/utils"
import { filterTablePillClass } from "@/components/ui/filter-table"

// FilterBoolean — «Булев фильтр» (node 70295:22807).
//
// "Не имеет выпадающего окна и срабатывает по значению «Истина». Примеры
// использования: Ненулевой баланс — система должна показать все счета,
// баланс которых выше нуля."
//
// So this one is not a FilterShell at all: with no popup there is no trigger
// to anchor, no Apply/Reset pair and no value to display — it is a toggle
// pill that is either on ("фильтр действует") or off ("фильтр не действует"),
// drawn with the same `ELK / filter-table` fill as every other chip.

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

function FilterBoolean({
  className,
  label,
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  onClick,
  ...props
}: FilterBooleanProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const active = value ?? uncontrolled

  return (
    <button
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
        "max-w-64 min-w-20 cursor-pointer truncate outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
        filterTablePillClass({ selected: active, disabled }),
        className
      )}
      {...props}
    >
      {label}
    </button>
  )
}

export { FilterBoolean }
export type { FilterBooleanProps }
