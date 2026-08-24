import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { ComboboxFooter } from "@/components/ui/combobox"
import { Dropdown } from "@/components/ui/dropdown"
import { Input } from "@/components/ui/input"

import { FilterTrigger } from "./filter-trigger"

// Filter — "Фильтр": a Select-like dropdown trigger (ui/chips/chips,
// filter@2x.png) whose popup is a single value field + Сбросить/Применить
// footer (ui/filter-table/filter-table@2x.png's "Взаимодействие с
// фильтром" mockup — reusing ComboboxFooter verbatim, it's the exact same
// two-button layout). Chevron-down (closed) -> chevron-up (open) -> X (has
// a value, popup closed; click clears without reopening) per chips-filter's
// own "Варианты — поведение Select" row.
//
// `chip` opts into the *other* documented look: the filter renders as
// `ELK / filter-table` (node 1303:99241), the capsule used in the filter bar
// above a table — grey #F4F4F4 with a chevron while empty (its Checked=False,
// Select=True variant) and dark #012F42 with a close cross once it has a
// value (Checked=True). Both looks are genuinely in the specs, so it's a prop
// rather than a guess at which one is "right": default off keeps
// chips-filter's own documented behavior, and Table Top opts in.
//
// Внешний вид триггера целиком живёт в `filter-trigger.tsx`; здесь —
// состояние значения и попап с полем ввода.
interface FilterProps {
  label: React.ReactNode
  icon?: React.ReactNode
  background?: "white" | "grey"
  count?: number
  disabled?: boolean
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  chip?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  className?: string
}

function Filter({
  label,
  icon,
  background = "white",
  count,
  disabled = false,
  value,
  defaultValue = null,
  onValueChange,
  chip = false,
  open: openProp,
  onOpenChange,
  placeholder = "Введите значение",
  className,
}: FilterProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp !== undefined ? openProp : internalOpen

  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue
  )
  const activeValue = value !== undefined ? value : internalValue
  const [draft, setDraft] = React.useState(activeValue ?? "")
  const anchorRef = React.useRef<HTMLDivElement>(null)

  // The popup unmounts on close (Base UI default), so every reopen would
  // otherwise start the draft from an empty string — resync it from the
  // last *applied* value instead, matching Calendar/DatePicker's own
  // reopen-shows-current-value behavior.
  React.useEffect(() => {
    if (open) setDraft(activeValue ?? "")
  }, [open, activeValue])

  function setOpen(next: boolean) {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function commitValue(next: string | null) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function handleApply() {
    commitValue(draft.trim() ? draft : null)
    setOpen(false)
  }

  // "При нажатии на кнопку «Сбросить» фильтр закрывается. Значения фильтра
  // возвращаются в исходное состояние" (Фильтрация (ЕЛК), node 70295:22605).
  // This kit's other Сбросить/Применить pairings (Calendar, DatePicker) keep
  // their popup open, but the filter spec is explicit that this one closes —
  // and it also covers the empty case the same way: "Если кнопки «Применить»
  // и «Сбросить» были нажаты, когда внутри фильтра ничего не было выбрано —
  // выпадающий список закрывается без применения фильтра".
  function handleReset() {
    setDraft("")
    commitValue(null)
    setOpen(false)
  }

  function handleClear(event: React.SyntheticEvent) {
    event.stopPropagation()
    commitValue(null)
  }

  // A free-text filter holds exactly one value; the count exists so the
  // multi-select kinds can report how many options the draft covers.
  const selectedCount = draft.trim() ? 1 : 0
  const hasValue = Boolean(activeValue)

  return (
    <div className="w-fit">
      <PopoverPrimitive.Root
        open={disabled ? false : open}
        onOpenChange={setOpen}
      >
        <FilterTrigger
          label={label}
          icon={icon}
          background={background}
          count={count}
          disabled={disabled}
          asChip={chip}
          chipChecked={chip && hasValue}
          open={open}
          hasValue={hasValue}
          activeValue={activeValue}
          onClear={handleClear}
          anchorRef={anchorRef}
          className={className}
        />
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
              render={<Dropdown className="w-96 overflow-hidden" />}
            >
              {/* Round-2 audit fix: outer padding is 16px (Figma node
                  15693:35423, "Input area" wrapper), not 12px — and the
                  input box itself is a literal `px-[16px]` there too
                  (node 15693:35424), wider than the shared Input `sm`
                  size's own `px-3`. Overridden locally via
                  `containerClassName` rather than touching Input's own
                  `sm` token, since that size is shared by other
                  consumers not covered by this audit. */}
              <div className="p-4">
                <Input
                  size="sm"
                  placeholder={placeholder}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  clearable={false}
                  containerClassName="px-4"
                />
              </div>
              {/* "Если выбранно несколько значений, то пишем количество в
                  кнопке – «Применить: 1»". Buttons are never disabled:
                  "Кнопки в фильтрах не блокируются. Если нет выбранных
                  значений — кнопки сброса и применения фильтра в любом
                  случае доступны". */}
              <ComboboxFooter
                applyLabel={
                  draft.trim() ? `Применить: ${selectedCount}` : "Применить"
                }
                onReset={handleReset}
                onApply={handleApply}
              />
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

export { Filter }
export type { FilterProps }
