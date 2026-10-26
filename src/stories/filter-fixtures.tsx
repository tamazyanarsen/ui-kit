import * as React from "react"
import { Search } from "@/icons"

import { Input } from "@/components/ui/input"
import {
  FilterBoolean,
  FilterDate,
  FilterRange,
  FilterSelect,
  FilterSingleSelect,
  datePresetWeek,
} from "@/components/ui/filter-table"

/* Помощники историй фильтров (Filter Bar, Filter Single Select). Лежат здесь,
   а не рядом с компонентом: см. «Помощники витрин живут в src/stories» в
   docs/conventions.md. */

export const DIRECTION_OPTIONS = [
  { value: "in", label: "Поступления" },
  { value: "out", label: "Списания" },
]

export const OPERATION_OPTIONS = [
  { value: "payment", label: "Платёж" },
  { value: "transfer", label: "Перевод между счетами" },
  { value: "tax", label: "Налоги и сборы" },
  { value: "salary", label: "Зарплатный проект" },
  { value: "fee", label: "Комиссия банка" },
]

export const TERM_OPTIONS = [
  { value: "3", label: "В ближайшие 3 дня" },
  { value: "7", label: "В ближайшие 7 дней" },
  { value: "30", label: "В ближайшие 30 дней" },
  {
    value: "custom",
    label: "До конца действия договора — длинная подпись переносится, а не обрезается",
  },
]

/** Поле поиска ряда фильтров — `Input variant="filter-search"`. */
export function FilterSearchField({ placeholder = "Поиск по операциям" }: { placeholder?: string }) {
  const [query, setQuery] = React.useState("")
  return (
    <Input
      variant="filter-search"
      size="sm"
      placeholder={placeholder}
      iconLeft={<Search aria-hidden="true" />}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  )
}

/** Ряд из пяти фильтров «Ленты операций» — дети `FilterBar`. */
export function OperationFilters() {
  return (
    <>
      <FilterSelect label="Направление" options={DIRECTION_OPTIONS} />
      <FilterSelect label="Тип операции" options={OPERATION_OPTIONS} defaultValue={["payment"]} />
      <FilterDate
        label="Период"
        presets={[{ label: "Неделя", range: () => datePresetWeek() }]}
      />
      <FilterRange label="Сумма" amount />
      <FilterSingleSelect label="Срок" options={TERM_OPTIONS} />
      <FilterBoolean label="Ненулевой баланс" />
    </>
  )
}
