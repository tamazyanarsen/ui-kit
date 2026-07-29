import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatDateRu, MONTHS_RU_FULL, parseDateRu } from "@/lib/calendar"
import { Calendar } from "@/components/ui/calendar"
import type { CalendarMode } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import type { InputSize } from "@/components/ui/input"

const ICON_SIZE = { sm: "size-3.5", lg: "size-4" } as const

// Single-month Calendar renders at a fixed ~284px. The field is a
// shrink-to-fit trigger (see below), so without a floor it can end up
// visibly narrower than the dropdown sitting under it — give single/month/
// year that width back as a min, not a hard size, so a wider
// containerClassName from the consumer still wins. Range's own dropdown is
// two months wide (~570px); matching that on the field would make it look
// like an oversized fixed-size input, so it's left at its natural width.
const SINGLE_PANEL_MIN_WIDTH = "min-w-[280px]"

// DatePicker — the missing link between Calendar (pure content, no
// popover/trigger of its own by design — see calendar-demo.tsx) and Input
// (which already has the `mask="date"` + calendar icon pieces). Per spec:
// 8px gap field-to-dropdown. Clicking a day/month/year only *selects* it
// (updates the field, highlights the cell) — the dropdown stays open until
// "Применить" confirms and closes it, uniformly across all four modes.
// Reopening shows the previously-picked value as Active, which falls out
// for free here since the Popover unmounts Calendar on close, so it
// remounts fresh (re-reading the current value as its `defaultMonth`)
// every time it reopens, rather than needing to imperatively re-focus it.
//
// The whole field (not just the icon) is the Popover.Trigger — Base UI's
// Trigger already opens on both click *and* focus on its own (don't layer
// a manual onFocus/onClick handler on top: it fires a second, separately-
// tracked open that Base UI's own outside-press detection then immediately
// closes again, since it doesn't recognize that open as having come from
// its own trigger).
//
// Manual typing (mask="date") is wired for `mode="single"` only, matching
// the spec's own "ручной ввод доступен" callout, which only ever shows it
// for the single-day field — range/month/year stay selection-only (their
// field is read-only), since parsing a typed "DD.MM.YYYY – DD.MM.YYYY"
// range reliably is a materially bigger feature than this pass covers.
interface DatePickerProps {
  mode?: CalendarMode
  size?: InputSize
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  disabled?: boolean
  footer?: boolean
  containerClassName?: string

  // mode="single"
  value?: Date | null
  onChange?: (date: Date | null) => void

  // mode="range"
  rangeValue?: [Date | null, Date | null]
  onRangeChange?: (range: [Date | null, Date | null]) => void

  // mode="month"
  monthValue?: { year: number; month: number } | null
  onMonthChange?: (value: { year: number; month: number }) => void

  // mode="year"
  yearValue?: number | null
  onYearChange?: (year: number) => void
}

function DatePicker({
  mode = "single",
  size = "lg",
  label,
  comment,
  error,
  disabled = false,
  footer = true,
  containerClassName,
  value,
  onChange,
  rangeValue,
  onRangeChange,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  // Uncontrolled fallback — only the state matching the active `mode` is
  // ever read or written.
  const [internalValue, setInternalValue] = React.useState<Date | null>(null)
  const [internalRange, setInternalRange] = React.useState<
    [Date | null, Date | null]
  >([null, null])
  const [internalMonth, setInternalMonth] = React.useState<{
    year: number
    month: number
  } | null>(null)
  const [internalYear, setInternalYear] = React.useState<number | null>(null)

  const activeValue = value !== undefined ? value : internalValue
  const activeRange = rangeValue ?? internalRange
  const activeMonth = monthValue !== undefined ? monthValue : internalMonth
  const activeYear = yearValue !== undefined ? yearValue : internalYear

  const defaultLabel =
    mode === "range"
      ? "Дата начала — Дата окончания"
      : mode === "month"
        ? "Месяц"
        : mode === "year"
          ? "Год"
          : "Дата"

  // Purely decorative — the whole field (see the Trigger wrapping it below)
  // is the click target, not just this glyph.
  const icon = <CalendarDays aria-hidden="true" className={ICON_SIZE[size]} />

  function handleSelectDay(date: Date) {
    if (value === undefined) setInternalValue(date)
    onChange?.(date)
  }

  function handleRangeChange(range: [Date | null, Date | null]) {
    if (rangeValue === undefined) setInternalRange(range)
    onRangeChange?.(range)
  }

  function handleMonthChange(next: { year: number; month: number }) {
    if (monthValue === undefined) setInternalMonth(next)
    onMonthChange?.(next)
  }

  function handleYearChange(next: number) {
    if (yearValue === undefined) setInternalYear(next)
    onYearChange?.(next)
  }

  // Reset clears the draft selection but — per the "Применить" pairing in
  // the spec — leaves the dropdown open for a fresh pick.
  function handleReset() {
    if (mode === "range") handleRangeChange([null, null])
    else if (mode === "month") setInternalMonth(null)
    else if (mode === "year") setInternalYear(null)
    else {
      if (value === undefined) setInternalValue(null)
      onChange?.(null)
    }
  }

  function handleApply() {
    setOpen(false)
  }

  function handleMaskChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseDateRu(e.target.value)
    if (!parsed) return
    if (value === undefined) setInternalValue(parsed)
    onChange?.(parsed)
  }

  const defaultMonth =
    mode === "range"
      ? (activeRange[0] ?? undefined)
      : mode === "single"
        ? (activeValue ?? undefined)
        : undefined

  return (
    // Popover.Root has no DOM node of its own, so its children — including
    // the focus-guard spans Base UI inserts/removes as siblings of Trigger
    // once open — would otherwise land directly in whatever the consumer
    // wraps DatePicker with. A layout that spaces its children by margin
    // (e.g. Tailwind's space-y-*) would then pick up those guards as extra
    // items and visibly grow when the popover opens. This div keeps them
    // contained so DatePicker always presents as exactly one child.
    <div className="w-fit">
      <PopoverPrimitive.Root open={disabled ? false : open} onOpenChange={setOpen}>
        {/* The whole field is the trigger (not just the icon) — Base UI then
            recognizes clicks/focus on it as "inside", so they don't also
            fire its own outside-press dismissal against themselves. */}
        <PopoverPrimitive.Trigger
          disabled={disabled}
          nativeButton={false}
          render={<div ref={anchorRef} className="w-fit" />}
        >
          {mode === "single" ? (
            <Input
              size={size}
              label={label ?? defaultLabel}
              mask="date"
              value={activeValue ? formatDateRu(activeValue) : undefined}
              onChange={handleMaskChange}
              disabled={disabled}
              comment={comment}
              error={error}
              clearable={false}
              trailingIcon={icon}
              containerClassName={cn(SINGLE_PANEL_MIN_WIDTH, containerClassName)}
            />
          ) : (
            <Input
              size={size}
              label={label ?? defaultLabel}
              readOnly
              value={
                mode === "range"
                  ? activeRange[0]
                    ? activeRange[1]
                      ? `${formatDateRu(activeRange[0])} — ${formatDateRu(activeRange[1])}`
                      : `${formatDateRu(activeRange[0])} — `
                    : ""
                  : mode === "month"
                    ? activeMonth
                      ? `${MONTHS_RU_FULL[activeMonth.month]} ${activeMonth.year}`
                      : ""
                    : activeYear
                      ? String(activeYear)
                      : ""
              }
              onChange={() => {}}
              disabled={disabled}
              comment={comment}
              error={error}
              clearable={false}
              trailingIcon={icon}
              containerClassName={cn(
                mode !== "range" && SINGLE_PANEL_MIN_WIDTH,
                containerClassName
              )}
            />
          )}
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
              data-slot="date-picker-content"
              className="outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              <Calendar
                mode={mode}
                layout="popover"
                footer={footer}
                defaultMonth={defaultMonth}
                value={mode === "single" ? activeValue : undefined}
                onChange={mode === "single" ? handleSelectDay : undefined}
                rangeValue={mode === "range" ? activeRange : undefined}
                onRangeChange={mode === "range" ? handleRangeChange : undefined}
                monthValue={mode === "month" ? activeMonth : undefined}
                onMonthChange={mode === "month" ? handleMonthChange : undefined}
                yearValue={mode === "year" ? activeYear : undefined}
                onYearChange={mode === "year" ? handleYearChange : undefined}
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

export { DatePicker }
export type { DatePickerProps }
