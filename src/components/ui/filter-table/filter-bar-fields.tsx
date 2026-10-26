import * as React from "react"

import { useStableId } from "@/lib/use-stable-id"

import { FilterTable } from "./filter-table"

/**
 * Поля шторы «Фильтры» (`FilterBar` в мобильном виде).
 *
 * Правки UI-Kit от 25.10, правило каркаса «Фильтры над списком в мобильном
 * виде»: выбор из вариантов — группа, заголовок H4 Mobile 18/24, под ним
 * через 12 таблетки `FilterTable` в мобильном размере (28 / текст 12) по
 * нескольку в строку, через 8 в обе стороны; выбранная — тёмная с крестиком.
 */
function FilterBarGroup({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  const titleId = useStableId()
  return (
    <div
      role="group"
      aria-labelledby={titleId}
      data-slot="filter-bar-group"
      className="flex flex-col gap-3"
    >
      <p id={titleId} className="text-h4-mobile text-[var(--modal-title-fg)]">
        {title}
      </p>
      {children}
    </div>
  )
}

interface PillOption {
  value: string
  label: string
  disabled?: boolean
}

function FilterBarPills({
  options,
  selected,
  onToggle,
}: {
  options: PillOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div data-slot="filter-bar-pills" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value)
        return (
          <FilterTable
            key={option.value}
            selected={isSelected}
            aria-pressed={isSelected}
            disabled={option.disabled}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </FilterTable>
        )
      })}
    </div>
  )
}

export { FilterBarGroup, FilterBarPills }
