import * as React from "react"
import { Search } from "@/icons"

import { compactList } from "@/components/ui/header-menu/compact-list"
import { ComboboxFooter } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"

import { FilterShell, filterApplyLabel } from "./shell"
import { FilterSelectList } from "./filter-select-list"
import { FilterSheetButtons } from "./sheet-buttons"
import { useFilterBarField } from "./filter-bar-context"
import { FilterBarGroup, FilterBarPills } from "./filter-bar-fields"

// FilterSelect — вид «Множественный выбор».
//
// «Ширина раскрытого фильтра – 384 px. Наполнение строки по компоненту Menu
// Point (ELK). В фильтре может быть задана группировка значений. Список может
// быть представлен в виде дерева. В фильтре показывается весь список
// возможных значений, независимо от наличия в реестре».
//
// Единственное неочевидное правило, расписанное в макете подробно: выбрать
// все значения — это НЕ то же самое, что выключить фильтр. «Если клиент
// выбрал все значения (например, 16 из 16 возможных), а в реальном времени
// добавляется новое возможное значение — система определяет, что новое
// значение не добавляется к выбранным». То есть «выбраны все» остаётся
// обычным множественным выбором, и чип продолжает показывать количество.
//
// Правила поиска внутри всплывающего окна: он прячет не совпавшие опции,
// оставляет совпавшие независимо от того, выбраны они или нет, никогда не
// меняет сам выбор, никогда не меняет порядок и ищет на всех уровнях
// вложенности, включая заголовки групп, — поэтому группа, у которой совпало
// *название*, сохраняет всех своих детей.
//
// Мобильный вид (Правки UI-Kit от 25.10): штора с теми же строками-чекбоксами
// и кнопками «Применить: N» / «Сбросить» во всю ширину; в свёрнутом
// `FilterBar` — группа таблеток `FilterTable`.

interface FilterSelectOption {
  value: string
  label: string
  /** Глубина вложенности для формы дерева; каждый уровень отступает на 16px. */
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
  /**
   * Поле поиска над списком. По умолчанию — только у списка от
   * {@link SEARCH_THRESHOLD} вариантов; явное `true`/`false` решает само.
   */
  searchable?: boolean
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
}

/**
 * С какого числа вариантов поиск включается сам.
 *
 * Правки UI-Kit от 25.10, «FilterSelect — поиск по умолчанию»: раньше
 * `searchable` по умолчанию был `true`, и поле поиска стояло даже над списком
 * из 2–3 вариантов. Теперь поиск появляется, когда список длинный (от 8).
 */
const SEARCH_THRESHOLD = 8

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((entry) => b.includes(entry))

function FilterSelect({
  label,
  options,
  groups,
  value,
  defaultValue = [],
  onValueChange,
  searchable,
  searchPlaceholder = "Поиск",
  disabled = false,
  className,
}: FilterSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue)
  const applied = value ?? uncontrolled
  const [draft, setDraft] = React.useState<string[]>(applied)

  // Всплывающее окно размонтируется при закрытии, поэтому повторное
  // открытие начинается с того, что действительно применено, а не с
  // брошенного черновика.
  //
  // ⚠️ Черновик берётся ровно в МОМЕНТ открытия, а не эффектом по `applied`.
  // В управляемом режиме `value` — обычно новый массив на каждый рендер
  // (`value={x ?? []}`), и эффект сбрасывал отмеченные галочки и строку
  // поиска при любой перерисовке родителя, пока окно открыто.
  function handleOpenChange(next: boolean) {
    if (next && !open) {
      setDraft(applied)
      setQuery("")
    }
    setOpen(next)
  }

  const resolvedGroups = React.useMemo<FilterSelectGroup[]>(
    // Пустые элементы (`cond && group`) отбрасываются, иначе `group.label`
    // падало на `null`.
    () =>
      (compactList(groups) ?? [{ label: "", options: options ?? [] }]).map(
        (group) => ({ ...group, options: compactList(group.options) ?? [] })
      ),
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
  const showSearch = searchable ?? allOptions.length >= SEARCH_THRESHOLD
  const singleLabel =
    appliedCount === 1
      ? allOptions.find((option) => option.value === applied[0])?.label
      : undefined

  const collapsed = useFilterBarField<string[]>({
    label,
    active,
    value: applied,
    empty: () => [],
    commit,
    equals: sameSet,
    render: ({ draft: barDraft, setDraft: setBarDraft }) => (
      <FilterBarGroup title={label}>
        <FilterBarPills
          options={allOptions}
          selected={barDraft}
          onToggle={(optionValue) =>
            setBarDraft(
              barDraft.includes(optionValue)
                ? barDraft.filter((entry) => entry !== optionValue)
                : [...barDraft, optionValue]
            )
          }
        />
      </FilterBarGroup>
    ),
  })
  if (collapsed) return null

  const search = showSearch && (
    <div className="p-4 pb-0">
      <Input
        size="sm"
        placeholder={searchPlaceholder}
        iconLeft={<Search aria-hidden="true" className="size-4" />}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
  )

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
      // явным пропом `count` у `FilterTableSelect`, по умолчанию выключена.
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
      disabled={disabled}
      open={open}
      onOpenChange={handleOpenChange}
      width={384}
      className={className}
      sheetBody={
        <>
          {search}
          <FilterSelectList
            groups={visibleGroups}
            selected={draft}
            onToggle={toggle}
          />
        </>
      }
      sheetFooter={
        <FilterSheetButtons
          applyLabel={filterApplyLabel(draft.length)}
          onApply={handleApply}
          onReset={handleReset}
        />
      }
    >
      {search}

      <FilterSelectList
        className="themed-scrollbar max-h-[336px] min-h-0 overflow-y-auto"
        groups={visibleGroups}
        selected={draft}
        onToggle={toggle}
      />

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
