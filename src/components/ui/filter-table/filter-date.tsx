import * as React from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { ComboboxFooter } from "@/components/ui/combobox"
import { filterTablePillClass } from "./filter-table"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel } from "./shell"

// FilterDate — вид «Date».
//
// «Ширина раскрытого фильтра – 560 px. Состав шаблонов периодов описывается
// в рамках каждой функциональности, ввиду невозможности собрать
// универсальный набор диапазонов для разных бизнес-задач» — поэтому чипы
// периодов задаются пропсом, а не зашиты списком. Единственная заготовка,
// которую макет закрепляет прямо: «Выбор варианта «Неделя» из чипсов
// выделяет диапазон «Текущая дата + 6 дней» (то есть совокупно диапзон
// равен семи дням)», и это то, что реализует `datePresetWeek` для
// вызывающего кода, которому нужен стандартный набор.
//
// Раскладка снята с мастера: голова с отступом 16px и двумя полями даты по
// 176px с тире между ними, ряд чипов периодов, затем Calendar диапазона и
// общий подвал.

interface FilterDatePreset {
  label: string
  /** Возвращает диапазон, который выбирает эта заготовка. */
  range: () => [Date, Date]
}

interface FilterDateProps {
  label: React.ReactNode
  value?: [Date | null, Date | null]
  defaultValue?: [Date | null, Date | null]
  onValueChange?: (value: [Date | null, Date | null]) => void
  presets?: FilterDatePreset[]
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
  disabled = false,
  className,
}: FilterDateProps) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] =
    React.useState<[Date | null, Date | null]>(defaultValue)
  const applied = value ?? uncontrolled
  const [draft, setDraft] = React.useState<[Date | null, Date | null]>(applied)

  // Черновик берётся в момент открытия, а не эффектом по `applied`: в
  // управляемом режиме `value` — новый кортеж на каждый рендер, и эффект
  // сбрасывал выбранные даты при любой перерисовке родителя.
  function handleOpenChange(next: boolean) {
    if (next && !open) setDraft(applied)
    setOpen(next)
  }

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
      disabled={disabled}
      open={open}
      onOpenChange={handleOpenChange}
      width={560}
      className={className}
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Каждое поле — в своей половине ряда, коробка 176px, но на узком
            окне сжимается: жёсткая `w-44` держала ряд, и второе поле
            обрезалось краем окна. */}
        <div className="flex items-center gap-2">
          <div className="w-full min-w-0">
            <Input
              size="sm"
              label="С"
              readOnly
              value={formatDate(draft[0])}
              containerClassName="w-44 max-w-full"
            />
          </div>
          <span aria-hidden="true" className="h-px w-2 bg-[var(--filter-fg)]" />
          <div className="w-full min-w-0">
            <Input
              size="sm"
              label="По"
              readOnly
              value={formatDate(draft[1])}
              containerClassName="w-44 max-w-full"
            />
          </div>
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
                {/* Подпись в своём узле: голый текст во флексе кнопки не
                    обрезается многоточием (см. FilterBoolean). */}
                <span className="min-w-0 overflow-clip text-ellipsis whitespace-nowrap [overflow-clip-margin:4px]">{preset.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Окно уже двух месяцев (560) бывает только на узком экране: там
          Calendar сам показывает один месяц — стрелки листают его, — иначе
          вторая сетка уходила за край окна вместе с кнопкой «Применить». */}
      {/* В низком окне сжимается и прокручивается календарь — поля и
          «Применить» остаются на виду (см. FilterShell). Поля -mt-2 pt-2 и
          -mb-4 pb-4 — место под тень карточки календаря (0 4px 12px: 8px
          сверху, 16px снизу): область прокрутки обрезает всё, что за её
          краем, и без них тень срезалась, а раскладка — прежняя. */}
      <div
        data-slot="filter-date-calendar"
        className="themed-scrollbar -mt-2 -mb-4 min-h-0 overflow-y-auto pt-2 pb-4"
      >
        <Calendar
          mode="range"
          footer={false}
          rangeValue={draft}
          onRangeChange={(range) => setDraft(range)}
          className="w-full"
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

export { FilterDate, datePresetWeek }
export type { FilterDateProps, FilterDatePreset }
