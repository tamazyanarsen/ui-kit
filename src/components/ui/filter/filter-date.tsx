import * as React from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { ComboboxFooter } from "@/components/ui/combobox"
import { filterTablePillClass } from "@/components/ui/filter-table"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel } from "./shell"

// FilterDate — вид «Date» (node 70295:22736).
//
// "Ширина раскрытого фильтра – 560 px. Состав шаблонов периодов описывается
// в рамках каждой функциональности, ввиду невозможности собрать
// универсальный набор диапазонов для разных бизнес-задач" — so the period
// chips are a prop, not a baked-in list. The one template the spec does pin
// down: "Выбор варианта «Неделя» из чипсов выделяет диапазон «Текущая дата +
// 6 дней» (то есть совокупно диапзон равен семи дням)", which is what
// `datePresetWeek` implements for callers that want the standard set.
//
// Layout off the master: a 16px-padded head with two 176px date inputs and a
// dash between them, a row of period chips, then the range Calendar, then the
// shared footer.

interface FilterDatePreset {
  label: string
  /** Returns the range this template selects. */
  range: () => [Date, Date]
}

interface FilterDateProps {
  label: React.ReactNode
  value?: [Date | null, Date | null]
  defaultValue?: [Date | null, Date | null]
  onValueChange?: (value: [Date | null, Date | null]) => void
  presets?: FilterDatePreset[]
  chip?: boolean
  background?: "white" | "grey"
  disabled?: boolean
  className?: string
}

const EMPTY: [Date | null, Date | null] = [null, null]

function formatDate(date: Date | null) {
  if (!date) return ""
  return date.toLocaleDateString("ru-RU")
}

/** "Текущая дата + 6 дней (то есть совокупно диапзон равен семи дням)". */
function datePresetWeek(from: Date = new Date()): [Date, Date] {
  const to = new Date(from)
  to.setDate(to.getDate() + 6)
  return [from, to]
}

function FilterDate({
  label,
  value,
  defaultValue = EMPTY,
  onValueChange,
  presets = [],
  chip = false,
  background = "white",
  disabled = false,
  className,
}: FilterDateProps) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] =
    React.useState<[Date | null, Date | null]>(defaultValue)
  const applied = value ?? uncontrolled
  const [draft, setDraft] = React.useState<[Date | null, Date | null]>(applied)

  React.useEffect(() => {
    if (open) setDraft(applied)
  }, [open, applied])

  function commit(next: [Date | null, Date | null]) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  const filled = (range: [Date | null, Date | null]) =>
    Number(Boolean(range[0])) + Number(Boolean(range[1]))
  const active = filled(applied) > 0
  const valueLabel =
    applied[0] && applied[1]
      ? `${formatDate(applied[0])} – ${formatDate(applied[1])}`
      : applied[0]
        ? `С ${formatDate(applied[0])}`
        : applied[1]
          ? `До ${formatDate(applied[1])}`
          : undefined

  return (
    <FilterShell
      label={label}
      valueLabel={valueLabel}
      active={active}
      onClear={() => commit(EMPTY)}
      chip={chip}
      background={background}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
      width={560}
      className={className}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <Input
            size="sm"
            label="С"
            readOnly
            value={formatDate(draft[0])}
            containerClassName="w-44"
          />
          <span aria-hidden="true" className="h-px w-2 bg-[var(--filter-fg)]" />
          <Input
            size="sm"
            label="По"
            readOnly
            value={formatDate(draft[1])}
            containerClassName="w-44"
          />
        </div>
        {presets.length > 0 && (
          <div
            data-slot="filter-date-presets"
            className="flex flex-wrap items-center gap-2"
          >
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setDraft(preset.range())}
                className={cn(
                  "cursor-pointer outline-none focus-visible:focus-ring",
                  filterTablePillClass({ selected: false })
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <Calendar
        mode="range"
        footer={false}
        rangeValue={draft}
        onRangeChange={(range) => setDraft(range)}
        className="w-full"
      />
      <ComboboxFooter
        applyLabel={filterApplyLabel(filled(draft))}
        onReset={() => {
          setDraft(EMPTY)
          commit(EMPTY)
          setOpen(false)
        }}
        onApply={() => {
          commit(draft)
          setOpen(false)
        }}
      />
    </FilterShell>
  )
}

export { FilterDate, datePresetWeek }
export type { FilterDateProps, FilterDatePreset }
