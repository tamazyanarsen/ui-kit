import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, ChevronUp, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ComboboxFooter } from "@/components/ui/combobox"

const ICON_SIZE = "size-4"

// Filter — "Фильтр": a Select-like dropdown trigger (ui/chips/chips,
// filter@2x.png) whose popup is a single value field + Сбросить/Применить
// footer (ui/filter-table/filter-table@2x.png's "Взаимодействие с
// фильтром" mockup — reusing ComboboxFooter verbatim, it's the exact same
// two-button layout). Chevron-down (closed) -> chevron-up (open) -> X (has
// a value, popup closed; click clears without reopening) per chips-filter's
// own "Варианты — поведение Select" row.
//
// `chip` opts into the *other* documented look: filter-table's anatomy
// shows the same filter, once it has a value, rendered as a compact dark
// pill (bg #012F42, badge, X, no chevron/icon) for a filter-bar-above-a-
// table summary — visually distinct from chips-filter's own light-bg+X
// state. Both are genuinely in the specs, so it's a prop rather than a
// guess at which one is "right": default off keeps chips-filter's own
// documented behavior, and a table-usage demo can opt in.
interface FilterProps {
  label: React.ReactNode
  subtitle?: React.ReactNode
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
  subtitle,
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

  // Reset clears the draft but — per the Сбросить/Применить pairing used
  // everywhere else in this kit (Calendar, DatePicker) — leaves the popup
  // open for a fresh entry.
  function handleReset() {
    setDraft("")
    commitValue(null)
  }

  function handleClear(event: React.SyntheticEvent) {
    event.stopPropagation()
    commitValue(null)
  }

  const hasValue = Boolean(activeValue)
  const asChip = chip && hasValue

  // Three mutually exclusive trigger looks (chip / disabled / normal) — only
  // the "normal" one varies further by open state + background, so an
  // if/else chain reads more clearly here than nesting that variation
  // inside a ternary for the other two.
  let triggerToneClass: string
  if (asChip) {
    triggerToneClass =
      "border-transparent bg-[var(--chips-dark-bg)] hover:bg-[var(--chips-dark-bg-hover)]"
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
            asChip ? "text-[var(--chips-dark-fg)]" : "text-[var(--filter-icon-fg)]"
          )}
        >
          <X aria-hidden="true" className={ICON_SIZE} />
        </button>
      )
    }
    if (asChip) return null
    const Chevron = open ? ChevronUp : ChevronDown
    return (
      <Chevron aria-hidden="true" className={cn(ICON_SIZE, "text-[var(--filter-icon-fg)]")} />
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
                "group/filter inline-flex w-fit min-w-20 max-w-64 cursor-pointer flex-col items-start gap-0 rounded-2xl border whitespace-nowrap outline-none transition-colors select-none focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
                subtitle && !asChip ? "px-4 py-2" : "px-4 py-1.5",
                triggerToneClass,
                className
              )}
            />
          }
        >
          {subtitle && !asChip && (
            <span className="truncate text-xs leading-tight text-[var(--filter-subtitle-fg)]">
              {subtitle}
            </span>
          )}
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
                "min-w-0 truncate text-sm font-medium",
                disabled
                  ? "text-[var(--filter-disabled-fg)]"
                  : asChip
                    ? "text-[var(--chips-dark-fg)]"
                    : "text-[var(--filter-fg)]"
              )}
            >
              {asChip ? activeValue : label}
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
              className="w-64 overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              <div className="p-3">
                <Input
                  size="sm"
                  placeholder={placeholder}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  clearable={false}
                />
              </div>
              <ComboboxFooter
                applyLabel="Применить"
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
