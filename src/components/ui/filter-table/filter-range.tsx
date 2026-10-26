import * as React from "react"

import { hasNode } from "@/lib/has-node"
import { ComboboxFooter } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel } from "./shell"
import { FilterSheetButtons } from "./sheet-buttons"
import { useFilterBarField } from "./filter-bar-context"
import {
  RANGE_ERROR,
  digitsOnly,
  isRangeInverted,
  rangeValueLabel,
  type RangeValue,
} from "./range-format"

// FilterRange — «Раскрытый фильтр сумм и количеств».
//
// «Ширина раскрытого фильтра – 384 px. Валидация производстися на обоих
// полях, но отображется только на втором поле с универсальным текстом
// (независимо от валюты)» — отсюда ошибка всегда под вторым полем, независимо
// от того, какое из них не прошло проверку. Мастер рисует два поля шириной
// 352px внутри коробки с отступом 16px, затем разделитель и подвал.
//
// Правки UI-Kit от 25.10 («FilterRange — подпись, маска суммы, кнопка
// „Применить“, валидация»):
//   • денежный режим `amount` — маска суммы с разбивкой на разряды, наружу
//     уходят сырые цифры, подпись чипа — «Название: 3 000 ₽» /
//     «3 000 – 300 000 ₽» / «От 3 000 ₽» / «До 3 000 ₽» (см. range-format.ts);
//   • кнопка поповера — просто «Применить», без счётчика заполненных полей
//     (в мобильной шторе счётчик остаётся: «Применить: N»);
//   • проверка «до» < «от» встроена: ошибка на втором поле, «Применить» не
//     применяет и окно не закрывает, сама кнопка при этом не выключается
//     («Кнопки в фильтрах не блокируются»). Внешний `error` важнее.

interface FilterRangeProps {
  label: React.ReactNode
  fromLabel?: string
  toLabel?: string
  value?: RangeValue
  defaultValue?: RangeValue
  /** В денежном режиме — сырые цифры («3000000»), без пробелов и знака. */
  onValueChange?: (value: RangeValue) => void
  /**
   * Сообщение под вторым полем. Важнее встроенной проверки диапазона: если
   * оно задано, показывается оно.
   */
  error?: React.ReactNode
  /** Currency form: "в маске полей ввода добавляется инпут". */
  suffix?: React.ReactNode
  /**
   * Денежный режим: поля с маской суммы (`mask="amount"`, знак «₽»),
   * значения — сырые цифры, подпись чипа с разрядами и валютой.
   */
  amount?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Пустое значение — НОВЫЙ объект на каждый вызов, а не общая константа.
 * Константа уходила наружу через `onValueChange` и в черновик, и
 * потребитель, поправивший полученное значение на месте, портил её для всех
 * фильтров до конца сессии (ревью 10.10, КК-5).
 */
const empty = (): RangeValue => ({ from: "", to: "" })

const filled = (entry: RangeValue) =>
  Number(Boolean(entry.from.trim())) + Number(Boolean(entry.to.trim()))

const sameRange = (a: RangeValue, b: RangeValue) =>
  a.from === b.from && a.to === b.to

/** Поля «от» и «до»: в поповере — столбиком S, в шторе — строкой L через 16. */
function RangeFields({
  draft,
  onDraftChange,
  fromLabel,
  toLabel,
  amount,
  suffix,
  error,
  layout,
}: {
  draft: RangeValue
  onDraftChange: (next: RangeValue) => void
  fromLabel: string
  toLabel: string
  amount: boolean
  suffix?: React.ReactNode
  error?: React.ReactNode
  layout: "popover" | "sheet"
}) {
  const read = (event: React.ChangeEvent<HTMLInputElement>) =>
    amount ? digitsOnly(event.target.value) : event.target.value
  const common = {
    size: layout === "popover" ? ("sm" as const) : ("lg" as const),
    mask: amount ? ("amount" as const) : undefined,
    // Знак «₽» у маски суммы рисует само поле.
    trailingIcon: amount ? undefined : suffix,
  }
  return (
    <div
      data-slot="filter-range-fields"
      className={
        layout === "popover"
          ? "flex flex-col gap-4 p-4"
          : "grid grid-cols-2 items-start gap-4"
      }
    >
      <Input
        {...common}
        label={fromLabel}
        value={draft.from}
        onChange={(event) => onDraftChange({ ...draft, from: read(event) })}
      />
      <Input
        {...common}
        label={toLabel}
        value={draft.to}
        onChange={(event) => onDraftChange({ ...draft, to: read(event) })}
        error={error}
      />
    </div>
  )
}

function FilterRange({
  label,
  fromLabel = "От",
  toLabel = "До",
  value,
  defaultValue = empty(),
  onValueChange,
  error,
  suffix,
  amount = false,
  disabled = false,
  className,
}: FilterRangeProps) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const applied = value ?? uncontrolled
  const [draft, setDraft] = React.useState(applied)
  // Ошибка диапазона показывается после первой попытки применить, а дальше
  // гаснет сама, как только диапазон исправлен.
  const [attempted, setAttempted] = React.useState(false)

  // Черновик берётся в момент открытия, а не эффектом по `applied`: в
  // управляемом режиме `value` — новый объект на каждый рендер, и эффект
  // стирал введённые «от» и «до» при любой перерисовке родителя.
  function handleOpenChange(next: boolean) {
    if (next && !open) {
      setDraft(applied)
      setAttempted(false)
    }
    setOpen(next)
  }

  function commit(next: RangeValue) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  const shownError = (entry: RangeValue, showErrors: boolean) =>
    hasNode(error)
      ? error
      : showErrors && isRangeInverted(entry, amount)
        ? RANGE_ERROR
        : undefined

  function handleApply() {
    if (isRangeInverted(draft, amount)) {
      setAttempted(true)
      return
    }
    // Наружу уходят обрезанные значения: «   » — это пустое поле.
    commit({ from: draft.from.trim(), to: draft.to.trim() })
    setOpen(false)
  }

  function handleReset() {
    setDraft(empty())
    commit(empty())
    setOpen(false)
  }

  const active = filled(applied) > 0
  const { full, short } = rangeValueLabel({
    value: applied,
    label,
    fromLabel,
    toLabel,
    amount,
  })

  const barLabel = (part: string) =>
    typeof label === "string" ? `${label} ${part.toLowerCase()}` : part

  const collapsed = useFilterBarField<RangeValue>({
    label,
    active,
    value: applied,
    empty,
    commit: (next) => commit({ from: next.from.trim(), to: next.to.trim() }),
    equals: sameRange,
    validate: (next) => !isRangeInverted(next, amount),
    render: ({ draft: barDraft, setDraft: setBarDraft, showErrors }) => (
      <RangeFields
        layout="sheet"
        draft={barDraft}
        onDraftChange={setBarDraft}
        fromLabel={barLabel(fromLabel)}
        toLabel={barLabel(toLabel)}
        amount={amount}
        suffix={suffix}
        error={shownError(barDraft, showErrors)}
      />
    ),
  })
  if (collapsed) return null

  const fieldProps = {
    draft,
    onDraftChange: setDraft,
    fromLabel,
    toLabel,
    amount,
    suffix,
    error: shownError(draft, attempted),
  }

  return (
    <FilterShell
      label={label}
      valueLabel={full}
      valueLabelShort={short}
      active={active}
      onClear={() => commit(empty())}
      disabled={disabled}
      open={open}
      onOpenChange={handleOpenChange}
      width={384}
      className={className}
      sheetBody={
        <div className="px-4 py-3">
          <RangeFields layout="sheet" {...fieldProps} />
        </div>
      }
      sheetFooter={
        <FilterSheetButtons
          applyLabel={filterApplyLabel(filled(draft))}
          onApply={handleApply}
          onReset={handleReset}
        />
      }
    >
      <RangeFields layout="popover" {...fieldProps} />
      <ComboboxFooter
        applyLabel="Применить"
        onReset={handleReset}
        onApply={handleApply}
      />
    </FilterShell>
  )
}

export { FilterRange }
export type { FilterRangeProps }
