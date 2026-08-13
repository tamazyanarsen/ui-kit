import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, ChevronUp, X } from "@/icons"

import { cn } from "@/lib/utils"
import { filterTablePillClass } from "@/components/ui/filter-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ComboboxFooter } from "@/components/ui/combobox"
import { Dropdown } from "@/components/ui/dropdown"

const ICON_SIZE = "size-4"

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

  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue)
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
  const asChip = chip
  // Figma's `Checked` property on filter-table — the dark pill.
  const chipChecked = chip && hasValue

  // Three mutually exclusive trigger looks (chip / disabled / normal) — only
  // the "normal" one varies further by open state + background, so an
  // if/else chain reads more clearly here than nesting that variation
  // inside a ternary for the other two.
  //
  // Round-2 audit fix: `disabled` is checked FIRST now, not `asChip` — the
  // two aren't actually mutually exclusive (chip + disabled + hasValue is a
  // real combination) and the old asChip-first order silently dropped
  // disabled styling whenever a chip had a value. Figma's own
  // State=Disabled,Checked=True pill (filter-table node 1303:99261) is a
  // literal bg #EFEFEF/fg #C8C8CB — exactly --btn-muted-bg/-fg (which
  // --filter-disabled-fg already equals hex-for-hex), not
  // --filter-disabled-bg's lighter #F4F4F4.
  let triggerToneClass: string
  if (asChip) {
    // The chip look is Figma's `ELK / filter-table` — the same pill NPS
    // renders — so its fill/hover/disabled colours come from the shared
    // helper instead of being restated here, in whichever Checked state the
    // filter is currently in. Only the border stays local: filter-table has
    // none, but this trigger keeps a transparent border-2 so switching
    // between the chip and plain looks doesn't change the box size.
    triggerToneClass = cn(
      "border-transparent",
      filterTablePillClass({ selected: chipChecked, disabled })
    )
  } else if (disabled) {
    triggerToneClass = "border-transparent bg-[var(--filter-disabled-bg)]"
  } else {
    triggerToneClass = cn(
      open ? "border-[var(--filter-active-border)]" : "border-transparent",
      background === "grey"
        ? "bg-[var(--filter-grey-bg)] hover:bg-[var(--filter-grey-bg-hover)]"
        : "bg-[var(--filter-white-bg)] hover:bg-[var(--filter-white-bg-hover)]"
    )
  }

  function renderTriggerAction() {
    if (hasValue) {
      return (
        <button
          type="button"
          aria-label="Сбросить фильтр"
          disabled={disabled}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={handleClear}
          className={cn(
            "outline-none",
            disabled
              ? "text-[var(--filter-disabled-fg)]"
              : asChip
                ? "text-current"
                : "text-[var(--filter-icon-fg)]"
          )}
        >
          <X aria-hidden="true" className={ICON_SIZE} />
        </button>
      )
    }
    const Chevron = open ? ChevronUp : ChevronDown
    return (
      <Chevron
        aria-hidden="true"
        className={cn(
          ICON_SIZE,
          "shrink-0",
          // Design-check #26: was the same dark icon color regardless of
          // disabled, out of step with the label text lightening alongside it.
          disabled
            ? "text-[var(--filter-disabled-fg)]"
            : asChip
              ? "text-current"
              : "text-[var(--filter-icon-fg)]"
        )}
      />
    )
  }

  return (
    <div className="w-fit">
      <PopoverPrimitive.Root open={disabled ? false : open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          disabled={disabled}
          nativeButton={false}
          render={
            <div
              ref={anchorRef}
              data-slot="filter"
              data-disabled={disabled || undefined}
              className={cn(
                // Design-check #24: the open-state border and the generic
                // focus-visible ring used to layer into a double outline —
                // the border alone is the DS's actual "open" indicator, so
                // the ring only kicks in for keyboard focus while closed.
                //
                // Round-2 audit fix: border is `border-2` (not the
                // Tailwind-default 1px) — Figma's Active/Active(Hover)
                // states (nodes 54887:29390/29395/29400/29405) are a
                // literal `border-2 border-[#80e3ff]`. Kept at a constant
                // 2px across every state (color-only swap between
                // transparent/active) rather than growing on open, so the
                // box doesn't jump size when the border becomes visible.
                // Radius is conditionally a full pill for the `asChip`
                // look — its actual Figma source (the filter-table dark
                // pill, node 1303:99241) is `rounded-[16px]` on a ~32px
                // box, i.e. a capsule, not the plain Filter's `rounded-[8px]`.
                //
                // The chip look's fill/geometry now come from
                // filterTablePillClass (see triggerToneClass) so this and
                // NPS render the same pill from one definition; the plain
                // Filter look keeps its own 8px-radius box below.
                "group/filter inline-flex w-fit max-w-64 cursor-pointer flex-col items-start gap-0 border-2 whitespace-nowrap px-4 py-1.5 outline-none transition-colors select-none not-data-popup-open:focus-visible:ring-3 not-data-popup-open:focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
                // filter-table hugs its label (max-w only); the plain
                // chips-filter box keeps its own 80px floor and 8px radius.
                asChip ? "min-w-0" : "min-w-20 rounded-[8px]",
                triggerToneClass,
                className
              )}
            />
          }
        >
          <span className="flex w-full min-w-0 items-center gap-2">
            {icon && !asChip && (
              <span
                aria-hidden="true"
                className={cn(ICON_SIZE, "shrink-0 text-[var(--filter-icon-fg)]")}
              >
                {icon}
              </span>
            )}
            <span
              className={cn(
                // Round-2 audit fix: the `asChip` look's real Figma source
                // (filter-table's dark pill, P2 Medium 14/20) has no
                // separate desktop size — the `md:text-base` bump only
                // applies to the plain Filter label.
                "min-w-0 truncate text-p2-medium",
                !asChip && "md:text-p1-medium",
                // In chip mode the pill class already sets the text colour
                // for its own Checked/Disabled state — overriding it here
                // would repaint the dark pill's white label.
                asChip
                  ? chipChecked
                    ? undefined
                    : "flex-1 text-center"
                  : disabled
                    ? "text-[var(--filter-disabled-fg)]"
                    : "text-[var(--filter-fg)]"
              )}
            >
              {chipChecked ? activeValue : label}
            </span>
            {count !== undefined && (
              <Badge
                type="counter"
                value={count}
                color={asChip ? "dark-grey" : "light-grey"}
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
