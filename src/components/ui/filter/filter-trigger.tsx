import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { ChevronDown, ChevronUp, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { filterTablePillClass } from "@/components/ui/filter-table"

const ICON_SIZE = "size-4"

/**
 * `Type` фильтра — из чего собран его элемент вызова.
 *
 * Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 6. В макете
 * (`ELK / filter-table`, нода 1303:99241) это два независимых булевых
 * свойства `Select` и `Counter`, но встречаются они только по одному:
 * символов `Select=True, Counter=True` в сете нет. Дизайнер и свёл их в один
 * список из трёх значений — здесь ровно он.
 */
type FilterType = "text" | "select" | "counter"

interface FilterTriggerProps {
  label: React.ReactNode
  type: FilterType
  count?: number
  disabled: boolean
  /** Свойство `Checked` — тёмная пилюля с выбранным значением. */
  checked: boolean
  open: boolean
  activeValue: string | null
  onClear: (event: React.SyntheticEvent) => void
  anchorRef: React.RefObject<HTMLDivElement>
  className?: string
}

/** Значок справа: крестик у выбранного фильтра, иначе шеврон у типа Select. */
function TriggerAction({
  type,
  checked,
  open,
  disabled,
  onClear,
}: Pick<
  FilterTriggerProps,
  "type" | "checked" | "open" | "disabled" | "onClear"
>) {
  if (checked) {
    return (
      <button
        type="button"
        aria-label="Сбросить фильтр"
        disabled={disabled}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={onClear}
        className="text-current outline-none focus-visible:focus-ring"
      >
        <X aria-hidden="true" className={ICON_SIZE} />
      </button>
    )
  }

  if (type !== "select") return null

  const Chevron = open ? ChevronUp : ChevronDown
  return (
    <Chevron
      aria-hidden="true"
      className={cn(ICON_SIZE, "shrink-0 text-current")}
    />
  )
}

/**
 * Элемент вызова фильтра — пилюля `ELK / filter-table`.
 *
 * Дизайн-чек «Сторибук Ч.2», замечание 5: «Нужно разделить компоненты filter
 * и chips на разные, компонент chips уже есть, необходимо перенести эти
 * свойства к нему». Раньше у триггера было два вида: пилюля и коробка
 * chips-filter (`variant`), а вместе с коробкой — её же заливка `background`
 * (White/Grey) и слот иконки. Всё это — свойства `Type` компонент-сета
 * `ELK / chips, filter`, и все пять его значений уже реализует компонент
 * `Chips`. Поэтому здесь остался ОДИН вид — тот, который дизайн-чек от 07.09
 * (замечание 17) и назвал основным для фильтра.
 */
function FilterTrigger({
  label,
  type,
  count,
  disabled,
  checked,
  open,
  activeValue,
  onClear,
  anchorRef,
  className,
}: FilterTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      disabled={disabled}
      nativeButton={false}
      render={
        <div
          ref={anchorRef}
          data-slot="filter"
          data-type={type}
          data-checked={checked || undefined}
          data-disabled={disabled || undefined}
          className={cn(
            "group/filter w-fit cursor-pointer outline-none select-none not-data-popup-open:focus-visible:focus-ring data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
            filterTablePillClass({ selected: checked, disabled }),
            className
          )}
        />
      }
    >
      <span className="flex w-full min-w-0 items-center gap-2">
        <span
          className={cn("min-w-0 truncate", !checked && "flex-1 text-center")}
        >
          {checked ? activeValue : label}
        </span>
        {/* Счётчик — свойство `Counter` того же сета: плашка `ELK / badge`
            одна и та же на светлой и на тёмной пилюле (ноды 1303:99335 и
            1303:99338). */}
        {type === "counter" && count !== undefined && (
          <Badge
            type="counter"
            value={count}
            color="dark-grey"
            disabled={disabled}
          />
        )}
        <span className="ml-auto flex shrink-0 items-center empty:hidden">
          <TriggerAction
            type={type}
            checked={checked}
            open={open}
            disabled={disabled}
            onClear={onClear}
          />
        </span>
      </span>
    </PopoverPrimitive.Trigger>
  )
}

export { FilterTrigger, ICON_SIZE }
export type { FilterType }
