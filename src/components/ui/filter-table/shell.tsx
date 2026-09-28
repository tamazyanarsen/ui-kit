import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, ChevronUp, X } from "@/icons"

import { cn } from "@/lib/utils"
import { filterTablePillClass } from "./filter-table"
import { Badge } from "@/components/ui/badge"
import { Dropdown } from "@/components/ui/dropdown"

// FilterShell — триггер-чип и всплывающее окно, общие для всех видов
// фильтра.
//
// «Фильтрация (ЕЛК)» описывает один триггер и несколько видов выпадающего
// окна, которые к нему подвешиваются (Множественный выбор / Date / Сумма /
// Search / Булев). Правила триггера у всех общие:
//
//   • «Минимальная ширина — 80 px, максимальная ширина — 256 px. Если
//     название не умещается в максимальную ширину, то оно скрывается в
//     многоточие».
//   • «Кнопки в фильтрах не блокируются» — «Сбросить» и «Применить» всегда
//     живые.
//
// По видам меняются только тело всплывающего окна и его ширина — именно эти
// две вещи оболочка и берёт у вызывающего кода.

const ICON_SIZE = "size-4"

// Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 5: коробка chips-filter
// из фильтра убрана целиком — элемент вызова у всех видов фильтра один и тот
// же, пилюля `ELK / filter-table`. Свойства коробки (`Type` со значениями
// Filter White/Grey/Subtitle) реализует компонент `Chips`, и дублировать их
// здесь больше нельзя.
interface FilterShellProps {
  label: React.ReactNode
  /** Текст, который показывается вместо подписи, когда фильтр применён. */
  valueLabel?: React.ReactNode
  count?: number
  disabled?: boolean
  active?: boolean
  onClear?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Ширина всплывающего окна в пикселях — 384 для большинства видов, 560 для даты. */
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

  // Отключённый фильтр закрывается по-настоящему, а не только глушится
  // через `open={false}`: иначе внутреннее `open` владельца оставалось
  // истинным, и после включения окно открывалось само, без нажатия.
  React.useEffect(() => {
    if (disabled && open) onOpenChange(false)
  }, [disabled, open, onOpenChange])

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
              // Ширина из макета — не больше видимой области минус поля по
              // 16px: на узком экране окно 384 (а у FilterDate 560) выходило
              // за правый край и давало горизонтальную прокрутку страницы.
              style={{ width, maxWidth: "calc(100vw - 32px)" }}
            >
              {children}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

/** «Если выбранно несколько значений, то пишем количество в кнопке –
 * «Применить: 1»» — одна общая подпись, чтобы все виды фильтра
 * формулировали её одинаково. */
function filterApplyLabel(count: number) {
  return count > 0 ? `Применить: ${count}` : "Применить"
}

export { FilterShell, filterApplyLabel }
export type { FilterShellProps }
