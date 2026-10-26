import * as React from "react"

import { ComboboxFooter } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel, type FilterType } from "./shell"
import { FilterSheetButtons } from "./sheet-buttons"
import { useFilterBarField } from "./filter-bar-context"

// FilterTableSelect — «Фильтр таблицы» с выпадающим списком: элемент
// вызова ведёт себя как у Select, а во всплывашке одно поле значения и
// подвал «Сбросить / Применить» (кадр «Взаимодействие с фильтром» в
// мастере filter-table). ComboboxFooter переиспользован дословно: там
// ровно та же раскладка на две кнопки.
//
// Глиф элемента вызова меняется по кругу: шеврон вниз (закрыто) → шеврон
// вверх (открыто) → крестик (значение выбрано, всплывашка закрыта; нажатие
// очищает и НЕ открывает список заново) — по строке «Варианты — поведение
// Select» у chips-filter.
//
// Элемент вызова у фильтра ОДИН — пилюля `ELK / filter-table`: серая
// #F4F4F4, пока пусто, и тёмная #012F42 с крестиком,
// когда значение выбрано.
//
// Дизайн-чек от 07.09, замечание 17: «Не тот элемент вызова фильтра. В
// компоненте Filter по умолчанию используется не Chips, а Table Filter».
// Дизайн-чек «Сторибук Ч.2» от 10.09, замечание 5, довёл это до конца:
// «Нужно разделить компоненты filter и chips на разные, компонент chips уже
// есть, необходимо перенести эти свойства к нему». Поэтому второй вид
// (коробка chips-filter) и его заливка `background` из фильтра убраны — все
// пять значений `Type` компонент-сета `ELK / chips, filter` живут в `Chips`.
//
// Триггер и окно — общие для всех фильтров, из `FilterShell`; здесь —
// состояние значения и тело окна с полем ввода. Раньше у этого фильтра был
// свой триггер и своё окно, и правки двух копий расходились (ревью 10.10,
// КК-2).
//
// Дизайн-чек от 13.09, замечание 6: компонент назывался `Filter` и стоял в
// витрине отдельной папкой рядом с `Filter Table`, хотя рисует ровно ту же
// пилюлю. Своей витрины у него больше нет — см. `./index.ts`.
interface FilterTableSelectProps {
  label: React.ReactNode
  /** Свойство `Type` — см. {@link FilterType}. */
  type?: FilterType
  /** Число в плашке у типа `counter`. */
  count?: number
  disabled?: boolean
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  className?: string
}

function FilterTableSelect({
  label,
  type = "select",
  count,
  disabled = false,
  value,
  defaultValue = null,
  onValueChange,
  open: openProp,
  onOpenChange,
  placeholder = "Введите значение",
  className,
}: FilterTableSelectProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp !== undefined ? openProp : internalOpen

  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue
  )
  const activeValue = value !== undefined ? value : internalValue
  const [draft, setDraft] = React.useState(activeValue ?? "")

  // Всплывающее окно размонтируется при закрытии (умолчание Base UI),
  // поэтому иначе каждое повторное открытие начинало бы черновик с пустой
  // строки. Вместо этого он берётся с последнего *применённого* значения —
  // так же, как Calendar и DatePicker показывают при повторном открытии
  // текущее значение.
  //
  // ⚠️ Ровно в МОМЕНТ открытия, а не эффектом по `[open, activeValue]`, — как
  // у FilterSelect, FilterRange и FilterDate. Эффект перезаписывал набранное,
  // стоило управляемому родителю обновить `value` при открытом окне
  // (обновление стора, синхронизация с адресной строкой) (ревью 10.10,
  // п. 22). Открытие ловится сравнением с прошлым рендером, а не в `setOpen`:
  // окно открывает и управляемый `open` снаружи.
  const [openSeen, setOpenSeen] = React.useState(open)
  if (openSeen !== open) {
    setOpenSeen(open)
    if (open) setDraft(activeValue ?? "")
  }

  function setOpen(next: boolean) {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function commitValue(next: string | null) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function handleApply() {
    // Наружу — обрезанная строка (как у FilterRange): «  ООО  » из буфера
    // иначе давало поиску пустую выдачу.
    commitValue(draft.trim() ? draft.trim() : null)
    setOpen(false)
  }

  // «При нажатии на кнопку „Сбросить“ фильтр закрывается. Значения фильтра
  // возвращаются в исходное состояние» (Фильтрация (ЕЛК)). Остальные пары
  // «Сбросить/Применить» в этом ките (Calendar, DatePicker) оставляют своё
  // всплывающее окно открытым, но макет фильтра прямо говорит, что это —
  // закрывается. Он же покрывает и пустой случай тем же образом: «Если
  // кнопки „Применить“ и „Сбросить“ были нажаты, когда внутри фильтра ничего
  // не было выбрано — выпадающий список закрывается без применения
  // фильтра».
  function handleReset() {
    setDraft("")
    commitValue(null)
    setOpen(false)
  }

  // У фильтра со свободным вводом ровно одно значение; счётчик существует
  // для того, чтобы виды с множественным выбором могли сообщить, сколько
  // опций охватывает черновик.
  const selectedCount = draft.trim() ? 1 : 0
  // Значение снаружи из пробелов — это пустой фильтр, а не выбранный с
  // пустой подписью; в чипе показывается обрезанная строка.
  const shownValue = activeValue?.trim() || null
  const hasValue = shownValue !== null

  // Свёрнутый `FilterBar` (мобильный вид, Правки UI-Kit от 25.10): свободный
  // ввод — полем `Input` в шторе «Фильтры».
  const collapsed = useFilterBarField<string>({
    label,
    active: hasValue,
    value: shownValue ?? "",
    empty: () => "",
    commit: (next) => commitValue(next.trim() ? next.trim() : null),
    render: ({ draft: barDraft, setDraft: setBarDraft }) => (
      <Input
        label={label}
        value={barDraft}
        onChange={(event) => setBarDraft(event.target.value)}
      />
    ),
  })
  if (collapsed) return null

  return (
    // Отключение закрывает окно по-настоящему — это делает `FilterShell`.
    <FilterShell
      label={label}
      type={type}
      // Плашка счётчика — только у типа `counter`, как в сете.
      count={type === "counter" ? count : undefined}
      disabled={disabled}
      active={hasValue}
      valueLabel={shownValue}
      // Крестик очищает и НЕ открывает список заново.
      onClear={() => commitValue(null)}
      open={open}
      onOpenChange={setOpen}
      className={className}
      sheetBody={
        <div className="px-4 py-3">
          <Input
            placeholder={placeholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
      }
      sheetFooter={
        <FilterSheetButtons
          applyLabel={filterApplyLabel(selectedCount)}
          onApply={handleApply}
          onReset={handleReset}
        />
      }
    >
      {/* Исправление второго прохода: внешний отступ равен 16px
          (обёртка «Input area» в макете), а не 12px, — и сама коробка поля
          там тоже литерально `px-[16px]`, то есть шире, чем собственный
          `px-3` у общего размера `sm` у Input. Переопределено локально через
          `containerClassName`, а не правкой самого токена `sm` у Input: этот
          размер используют и другие потребители, не охваченные данной
          сверкой. */}
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
      {/* "Если выбранно несколько значений, то пишем количество в кнопке –
          «Применить: 1»". Buttons are never disabled: "Кнопки в фильтрах
          не блокируются. Если нет выбранных значений — кнопки сброса и
          применения фильтра в любом случае доступны". */}
      <ComboboxFooter
        applyLabel={draft.trim() ? `Применить: ${selectedCount}` : "Применить"}
        onReset={handleReset}
        onApply={handleApply}
      />
    </FilterShell>
  )
}

export { FilterTableSelect }
export type { FilterTableSelectProps }
