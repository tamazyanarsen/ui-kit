import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, ChevronUp, X } from "@/icons"

import { cn } from "@/lib/utils"
import { filterTablePillClass } from "@/components/ui/filter-table"
import { Badge } from "@/components/ui/badge"
import { Dropdown } from "@/components/ui/dropdown"

// FilterShell — the chip trigger + popup that every filter kind shares.
//
// "Фильтрация (ЕЛК)" (node 70295:22565) defines one trigger and several
// dropdown kinds hanging off it (Множественный выбор / Date / Сумма /
// Search / Булев). The trigger's rules are common to all of them:
//
//   • "Минимальная ширина — 80 px, максимальная ширина — 256 px. Если
//     название не умещается в максимальную ширину, то оно скрывается в
//     многоточие."
//   • "Кнопки в фильтрах не блокируются" — Reset/Apply are always live.
//
// Only the popup body and its width change per kind, so those are the two
// things this shell takes from the caller.

const ICON_SIZE = "size-4"

// Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 5: коробка chips-filter
// из фильтра убрана целиком — элемент вызова у всех видов фильтра один и тот
// же, пилюля `ELK / filter-table`. Свойства коробки (`Type` со значениями
// Filter White/Grey/Subtitle) реализует компонент `Chips`, и дублировать их
// здесь больше нельзя.
interface FilterShellProps {
  label: React.ReactNode
  /** Text shown in place of the label once the filter is applied. */
  valueLabel?: React.ReactNode
  count?: number
  disabled?: boolean
  active?: boolean
  onClear?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Popup width in px — 384 for most kinds, 560 for Date. */
  width?: number
  children?: React.ReactNode
  className?: string
}

function FilterShell({
  label,
  valueLabel,
  count,
  disabled = false,
  active = false,
  onClear,
  open,
  onOpenChange,
  width = 384,
  children,
  className,
}: FilterShellProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null)

  function renderTriggerAction() {
    if (active && onClear) {
      return (
        <button
          type="button"
          aria-label="Сбросить фильтр"
          disabled={disabled}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            onClear()
          }}
          className="text-current outline-none focus-visible:focus-ring"
        >
          <X aria-hidden="true" className={ICON_SIZE} />
        </button>
      )
    }
    const Chevron = open ? ChevronUp : ChevronDown
    return (
      <Chevron
        aria-hidden="true"
        className={cn(ICON_SIZE, "shrink-0 text-current")}
      />
    )
  }

  return (
    <div className="w-fit">
      <PopoverPrimitive.Root
        open={disabled ? false : open}
        onOpenChange={onOpenChange}
      >
        <PopoverPrimitive.Trigger
          disabled={disabled}
          nativeButton={false}
          render={
            <div
              ref={anchorRef}
              data-slot="filter"
              data-checked={active || undefined}
              data-disabled={disabled || undefined}
              className={cn(
                "group/filter w-fit min-w-20 cursor-pointer outline-none select-none not-data-popup-open:focus-visible:focus-ring data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
                filterTablePillClass({ selected: active, disabled }),
                className
              )}
            />
          }
        >
          <span className="flex w-full min-w-0 items-center gap-2">
            <span
              className={cn(
                "min-w-0 truncate",
                !active && "flex-1 text-center"
              )}
            >
              {active && valueLabel !== undefined ? valueLabel : label}
            </span>
            {count !== undefined && (
              <Badge
                type="counter"
                value={count}
                color="dark-grey"
                disabled={disabled}
              />
            )}
            <span className="ml-auto flex shrink-0 items-center">
              {renderTriggerAction()}
            </span>
          </span>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            anchor={anchorRef}
            side="bottom"
            align="start"
            sideOffset={8}
            className="z-50"
          >
            <PopoverPrimitive.Popup
              data-slot="filter-content"
              render={<Dropdown className="overflow-hidden" />}
              style={{ width }}
            >
              {children}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

/** "Если выбранно несколько значений, то пишем количество в кнопке –
 * «Применить: 1»" — one shared label so every kind words it identically. */
function filterApplyLabel(count: number) {
  return count > 0 ? `Применить: ${count}` : "Применить"
}

export { FilterShell, filterApplyLabel }
export type { FilterShellProps }
