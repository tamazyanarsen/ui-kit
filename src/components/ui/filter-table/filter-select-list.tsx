import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import type { FilterSelectGroup } from "./filter-select"

const NESTING_INDENT = 16

/**
 * Строки FilterSelect — общие для поповера и мобильной шторы.
 *
 * Правки UI-Kit от 25.10:
 *   • у области строк нет полей сверху и снизу (было `py-2`): первая строка —
 *     у верхнего края списка, последняя — у подвала «Сбросить / Применить»;
 *   • строка — `menu-row`: наведение Grey 114, нажатие Grey 124, смена цвета
 *     200 мс. Нажатие самого чекбокса строку НЕ серит — это правило сидит в
 *     `menu-row` (`:has([role=checkbox]:active)`), строке ничего добавлять
 *     не нужно;
 *   • текст переносится целиком, без `line-clamp-2` и многоточия: строка
 *     растёт по высоте. Варианты вида «Расчётный счёт № 40702810000000001234»
 *     различаются хвостом, и обрезанные они читались одинаково (аудит 20);
 *     теперь хвост виден всегда, подсказка `title` больше не нужна.
 */
function FilterSelectList({
  groups,
  selected,
  onToggle,
  className,
}: {
  groups: FilterSelectGroup[]
  selected: string[]
  onToggle: (value: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      {groups.map((group, groupIndex) => (
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
                // `items-start`: у многострочного варианта флажок стоит у
                // первой строки, как у Checkbox и ComboboxItem. Однострочные
                // не меняются — флажок и строка одной высоты (24px).
                "menu-row flex cursor-pointer items-start gap-4 p-4",
                option.disabled && "pointer-events-none opacity-50"
              )}
              style={
                option.level
                  ? { paddingLeft: 16 + option.level * NESTING_INDENT }
                  : undefined
              }
            >
              <Checkbox
                checked={selected.includes(option.value)}
                disabled={option.disabled}
                onCheckedChange={() => onToggle(option.value)}
              />
              <span className="min-w-0 flex-1 text-p1-medium-adaptive [overflow-wrap:anywhere] text-[var(--filter-fg)]">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      ))}
      {groups.length === 0 && (
        <p className="px-4 py-3 text-p2-medium text-[var(--filter-icon-fg)]">
          Ничего не найдено
        </p>
      )}
    </div>
  )
}

export { FilterSelectList }
