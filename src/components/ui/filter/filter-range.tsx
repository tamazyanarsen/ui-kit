import * as React from "react"

import { ComboboxFooter } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel } from "./shell"

// FilterRange — "Раскрытый фильтр сумм и количеств" (node 70295:22796).
//
// "Ширина раскрытого фильтра – 384 px. Валидация производстися на обоих
// полях, но отображется только на втором поле с универсальным текстом
// (независимо от валюты)" — hence a single `error` prop that always renders
// under the second field no matter which one failed. The master draws the
// two inputs 352px wide inside a 16px-padded box, then a divider and the
// footer.

interface FilterRangeProps {
  label: React.ReactNode
  fromLabel?: string
  toLabel?: string
  value?: { from: string; to: string }
  defaultValue?: { from: string; to: string }
  onValueChange?: (value: { from: string; to: string }) => void
  /** Universal validation message, always shown on the second field. */
  error?: React.ReactNode
  /** Currency form: "в маске полей ввода добавляется инпут". */
  suffix?: React.ReactNode
  chip?: boolean
  background?: "white" | "grey"
  disabled?: boolean
  className?: string
}

const EMPTY = { from: "", to: "" }

function FilterRange({
  label,
  fromLabel = "От",
  toLabel = "До",
  value,
  defaultValue = EMPTY,
  onValueChange,
  error,
  suffix,
  chip = false,
  background = "white",
  disabled = false,
  className,
}: FilterRangeProps) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const applied = value ?? uncontrolled
  const [draft, setDraft] = React.useState(applied)

  React.useEffect(() => {
    if (open) setDraft(applied)
  }, [open, applied])

  function commit(next: { from: string; to: string }) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  const filled = (entry: { from: string; to: string }) =>
    Number(Boolean(entry.from.trim())) + Number(Boolean(entry.to.trim()))

  const active = filled(applied) > 0
  // "Выбрано одно значение ОТ" / "ДО" / "Выбран диапазон" — the chip reports
  // whichever half is filled.
  const valueLabel = applied.from && applied.to
    ? `${applied.from} – ${applied.to}`
    : applied.from
      ? `${fromLabel} ${applied.from}`
      : applied.to
        ? `${toLabel} ${applied.to}`
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
      width={384}
      className={className}
    >
      <div className="flex flex-col gap-4 p-4">
        <Input
          size="sm"
          label={fromLabel}
          value={draft.from}
          onChange={(event) => setDraft({ ...draft, from: event.target.value })}
          trailingIcon={suffix}
        />
        <Input
          size="sm"
          label={toLabel}
          value={draft.to}
          onChange={(event) => setDraft({ ...draft, to: event.target.value })}
          trailingIcon={suffix}
          error={error}
        />
      </div>
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

export { FilterRange }
export type { FilterRangeProps }
