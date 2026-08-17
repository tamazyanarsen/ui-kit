import * as React from "react"
import { Search } from "@/icons"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { ComboboxFooter } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel } from "./shell"

// FilterSelect — вид «Множественный выбор» (node 70295:22663).
//
// "Ширина раскрытого фильтра – 384 px. Наполнение строки по компоненту Menu
// Point (ELK). В фильтре может быть задана группировка значений. Список может
// быть представлен в виде дерева. В фильтре показывается весь список
// возможных значений, независимо от наличия в реестре."
//
// The one non-obvious rule, spelled out at length in the spec: selecting
// every option is NOT the same as switching the filter off — "если клиент
// выбрал все значения (например, 16 из 16 возможных), а в реальном времени
// добавляется новое возможное значение — система определяет, что новое
// значение не добавляется к выбранным". So "all selected" stays a normal
// multiple selection and the chip keeps reporting a count.
//
// Search rules inside the popup (node 70295:22621): it hides non-matching
// options, keeps matches regardless of whether they are selected, never
// touches the selection itself, never reorders, and matches at every nesting
// level — group headings included, which is why a group whose *title*
// matches keeps all of its children.

interface FilterSelectOption {
  value: string
  label: string
  /** Nesting depth for the tree form; each level indents by 16px. */
  level?: number
  disabled?: boolean
}

interface FilterSelectGroup {
  label: string
  options: FilterSelectOption[]
}

interface FilterSelectProps {
  label: React.ReactNode
  options?: FilterSelectOption[]
  groups?: FilterSelectGroup[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  searchable?: boolean
  searchPlaceholder?: string
  chip?: boolean
  background?: "white" | "grey"
  disabled?: boolean
  className?: string
}

const NESTING_INDENT = 16

function FilterSelect({
  label,
  options,
  groups,
  value,
  defaultValue = [],
  onValueChange,
  searchable = true,
  searchPlaceholder = "Поиск",
  chip = false,
  background = "white",
  disabled = false,
  className,
}: FilterSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue)
  const applied = value ?? uncontrolled
  const [draft, setDraft] = React.useState<string[]>(applied)

  // The popup unmounts on close, so a reopen starts from what is actually
  // applied rather than from an abandoned draft.
  React.useEffect(() => {
    if (open) {
      setDraft(applied)
      setQuery("")
    }
  }, [open, applied])

  const resolvedGroups = React.useMemo<FilterSelectGroup[]>(
    () => groups ?? [{ label: "", options: options ?? [] }],
    [groups, options]
  )

  const visibleGroups = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return resolvedGroups
    return resolvedGroups
      .map((group) => {
        // A matching group heading keeps the whole group — "Поиск срабатывает
        // по всем уровням вложенности списка — как выбираемым, так и
        // заголовкам групп."
        if (group.label.toLowerCase().includes(needle)) return group
        return {
          ...group,
          options: group.options.filter((option) =>
            option.label.toLowerCase().includes(needle)
          ),
        }
      })
      .filter((group) => group.options.length > 0)
  }, [resolvedGroups, query])

  function commit(next: string[]) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function toggle(optionValue: string) {
    setDraft((prev) =>
      prev.includes(optionValue)
        ? prev.filter((entry) => entry !== optionValue)
        : [...prev, optionValue]
    )
  }

  function handleApply() {
    commit(draft)
    setOpen(false)
  }

  function handleReset() {
    setDraft([])
    commit([])
    setOpen(false)
  }

  const appliedCount = applied.length
  const active = appliedCount > 0
  const allOptions = resolvedGroups.flatMap((group) => group.options)
  const singleLabel =
    appliedCount === 1
      ? allOptions.find((option) => option.value === applied[0])?.label
      : undefined

  return (
    <FilterShell
      label={label}
      // Выбранный чип НАЗЫВАЕТ выбранное: одно значение подписывается им
      // самим («Действующий»), несколько сворачиваются в «Подпись: N»
      // («Статус: 3») — по продуктовому шаблону. «Всё выбрано» намеренно
      // остаётся обычным множественным выбором.
      //
      // ⚠️ Число здесь — обычный текст подписи, а НЕ плашка `Badge`: вариант
      // сета с `Counter` существует, но в продукте не используется, и по
      // шаблону фон вокруг цифры тот же, что и у чипа. Плашка остаётся за
      // явным пропом `count` у `Filter`, по умолчанию выключена.
      //
      // Нечисловая подпись (иконка, разметка) в строку не склеивается —
      // тогда остаётся прежний нейтральный формат.
      valueLabel={
        singleLabel ??
        (typeof label === "string"
          ? `${label}: ${appliedCount}`
          : `Несколько (${appliedCount})`)
      }
      active={active}
      onClear={() => commit([])}
      chip={chip}
      background={background}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
      width={384}
      className={className}
    >
      {searchable && (
        <div className="p-4 pb-0">
          <Input
            size="sm"
            placeholder={searchPlaceholder}
            iconLeft={<Search aria-hidden="true" className="size-4" />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      )}

      <div className="themed-scrollbar max-h-[336px] overflow-y-auto py-2">
        {visibleGroups.map((group, groupIndex) => (
          <div key={group.label || groupIndex} data-slot="filter-select-group">
            {group.label && (
              <p className="px-4 py-2 text-p3-medium text-[var(--filter-icon-fg)]">
                {group.label}
              </p>
            )}
            {group.options.map((option) => (
              <label
                key={option.value}
                data-slot="filter-select-option"
                className={cn(
                  "flex cursor-pointer items-center gap-4 p-4",
                  option.disabled && "pointer-events-none opacity-50"
                )}
                style={
                  option.level
                    ? { paddingLeft: 16 + option.level * NESTING_INDENT }
                    : undefined
                }
              >
                <Checkbox
                  checked={draft.includes(option.value)}
                  disabled={option.disabled}
                  onCheckedChange={() => toggle(option.value)}
                />
                <span className="min-w-0 flex-1 truncate text-p1-medium text-[var(--filter-fg)]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        ))}
        {visibleGroups.length === 0 && (
          <p className="px-4 py-3 text-p2-medium text-[var(--filter-icon-fg)]">
            Ничего не найдено
          </p>
        )}
      </div>

      <ComboboxFooter
        applyLabel={filterApplyLabel(draft.length)}
        onReset={handleReset}
        onApply={handleApply}
      />
    </FilterShell>
  )
}

export { FilterSelect }
export type { FilterSelectProps, FilterSelectOption, FilterSelectGroup }
