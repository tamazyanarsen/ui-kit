import * as React from "react"
import { Check } from "@/icons"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"

import { FilterShell } from "./shell"
import { useFilterBarField } from "./filter-bar-context"
import { FilterBarGroup, FilterBarPills } from "./filter-bar-fields"

// FilterSingleSelect — фильтр с одиночным выбором.
//
// Правки UI-Kit от 25.10, «Фильтр с одиночным выбором — нет готового
// компонента»: `FilterSelect` умеет только множественный выбор (чекбоксы и
// «Сбросить / Применить»), а экранам нужен и одиночный («Срок» в мониторинге
// сделок). Собран на той же оболочке `FilterShell`:
//   • строки — обычные пункты списка (`menu-row`: наведение Grey 114, нажатие
//     Grey 124), без галок и чекбоксов; по умолчанию ничего не выбрано;
//   • выбор строки сразу применяет фильтр и закрывает список — подвала нет;
//     чип становится тёмным с названием варианта и крестиком сброса;
//   • клавиатура: фокус при открытии — на выбранной строке (или первой),
//     стрелки и Home/End ходят по строкам, Enter/пробел выбирают, Esc
//     закрывает.
// Мобильный вид — штора со строками во всю ширину; у выбранной галка справа
// (правило каркаса «Выпадающие списки в мобильном виде — шторы»), выбор
// закрывает штору. В свёрнутом `FilterBar` — группа таблеток.

interface FilterSingleSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FilterSingleSelectProps {
  label: React.ReactNode
  options: FilterSingleSelectOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  disabled?: boolean
  className?: string
}

function isFocusVisible(element: Element) {
  try {
    return element.matches(":focus-visible")
  } catch {
    return true
  }
}

function FilterSingleSelect({
  label,
  options,
  value,
  defaultValue = null,
  onValueChange,
  disabled = false,
  className,
}: FilterSingleSelectProps) {
  const isDesktop = useIsDesktop()
  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(
    defaultValue
  )
  const applied = value !== undefined ? value : uncontrolled
  const selectedOption = options.find((option) => option.value === applied)
  const focusRef = React.useRef<HTMLDivElement | null>(null)
  const rowsRef = React.useRef<(HTMLDivElement | null)[]>([])
  const [highlighted, setHighlighted] = React.useState<number | null>(null)

  function commit(next: string | null) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function handleOpenChange(next: boolean) {
    if (next && !open) setHighlighted(null)
    setOpen(next)
  }

  function choose(option: FilterSingleSelectOption) {
    if (option.disabled) return
    commit(option.value)
    setOpen(false)
  }

  const enabledIndexes = options
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0)

  function move(from: number, step: 1 | -1 | "first" | "last") {
    if (enabledIndexes.length === 0) return
    let target: number
    if (step === "first") target = enabledIndexes[0]
    else if (step === "last") target = enabledIndexes[enabledIndexes.length - 1]
    else {
      const position = enabledIndexes.indexOf(from)
      const next =
        position === -1
          ? 0
          : (position + step + enabledIndexes.length) % enabledIndexes.length
      target = enabledIndexes[next]
    }
    rowsRef.current[target]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, 1 | -1 | "first" | "last"> = {
      ArrowDown: 1,
      ArrowUp: -1,
      Home: "first",
      End: "last",
    }
    if (event.key in keys) {
      event.preventDefault()
      move(index, keys[event.key])
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      choose(options[index])
    }
  }

  // Фокус при открытии — на выбранной строке, иначе на первой доступной.
  const focusIndex = Math.max(
    0,
    options.findIndex((option) => option.value === applied && !option.disabled)
  )
  const initialIndex =
    options[focusIndex] && !options[focusIndex].disabled
      ? focusIndex
      : (enabledIndexes[0] ?? -1)

  const collapsed = useFilterBarField<string | null>({
    label,
    active: selectedOption !== undefined,
    value: applied,
    empty: () => null,
    commit,
    render: ({ draft, setDraft }) => (
      <FilterBarGroup title={label}>
        <FilterBarPills
          options={options}
          selected={draft === null ? [] : [draft]}
          onToggle={(optionValue) =>
            setDraft(draft === optionValue ? null : optionValue)
          }
        />
      </FilterBarGroup>
    ),
  })
  if (collapsed) return null

  const list = (
    <div
      role="listbox"
      aria-label={typeof label === "string" ? label : undefined}
      data-slot="filter-single-select-list"
      className={cn(
        "flex flex-col",
        isDesktop && "themed-scrollbar max-h-[336px] min-h-0 overflow-y-auto"
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === applied
        return (
          <div
            key={option.value}
            ref={(node) => {
              rowsRef.current[index] = node
              if (index === initialIndex) focusRef.current = node
            }}
            role="option"
            aria-selected={isSelected}
            aria-disabled={option.disabled || undefined}
            data-slot="filter-single-select-option"
            data-highlighted={highlighted === index ? "" : undefined}
            data-disabled={option.disabled ? "" : undefined}
            tabIndex={index === initialIndex ? 0 : -1}
            onClick={() => choose(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            // Подсветка `data-highlighted` — только у фокуса с клавиатуры:
            // открытие мышью тоже ставит фокус на строку, но серой она от
            // этого становиться не должна (наведение рисует `:hover`).
            onFocus={(event) => {
              if (isFocusVisible(event.currentTarget)) setHighlighted(index)
            }}
            onBlur={() =>
              setHighlighted((current) => (current === index ? null : current))
            }
            onPointerEnter={(event) => {
              // Мышь ведёт ту же подсветку, что и клавиатура: иначе после
              // стрелок подсвечены были бы две строки сразу.
              if (event.pointerType === "mouse" && !option.disabled) {
                rowsRef.current[index]?.focus({ preventScroll: true })
              }
            }}
            className={cn(
              "menu-row flex cursor-pointer items-start gap-4 p-4 outline-none select-none",
              "press-scale-content",
              // Выключенную строку гасит обработчик выбора, а не
              // `pointer-events: none` — иначе не виден курсор `not-allowed`.
              "data-disabled:opacity-50"
            )}
          >
            {/* Содержимое строки — в ОДНОЙ обёртке: сжатие при нажатии
                уменьшает её целиком к центру строки (см. press-scale-content). */}
            <span className="flex min-w-0 flex-1 items-start gap-4">
              <span className="min-w-0 flex-1 text-p1-medium-adaptive [overflow-wrap:anywhere] text-[var(--filter-fg)]">
                {option.label}
              </span>
              {!isDesktop && isSelected && (
                <Check
                  size={24}
                  aria-hidden="true"
                  className="size-6 shrink-0 text-[var(--check-mark-fg)]"
                />
              )}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <FilterShell
      label={label}
      valueLabel={selectedOption?.label}
      active={selectedOption !== undefined}
      onClear={() => commit(null)}
      disabled={disabled}
      open={open}
      onOpenChange={handleOpenChange}
      width={384}
      className={className}
      initialFocus={focusRef}
      sheetBody={list}
    >
      {list}
    </FilterShell>
  )
}

export { FilterSingleSelect }
export type { FilterSingleSelectProps, FilterSingleSelectOption }
