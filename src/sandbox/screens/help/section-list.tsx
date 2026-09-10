import { ChevronDown } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import { isGroup, type HelpNode } from "./types"

// Список разделов слева — `Menu` из острова «Поиск + меню» (нода
// 70400:30499). Не `Sidebar` кита: тот — навигационная полоса сотрудника со
// своим контекстом раскрытия, шириной 312/56 и тёмной палитрой (`SidebarItem`
// без `Sidebar` вообще не отрисовывается). Здесь элемент страницы со своими
// метриками, снятыми с эталона: строка — поле 12 и радиус 8, зазор до
// значка 8 у простой и 16 у группы, вложенная строка — 24 слева, выбранная
// заливается Grey 109.
//
// ⚠️ Счётчик совпадений в макете — `Bank / count` с заливкой Grey 284
// (#999999). У китового `Badge` такого оттенка нет: ближайший `dark-grey` —
// Grey 517 (#6D6D6D). Взят он, а не своя плашка: заводить четвёртый серый
// ради одного экрана дороже, чем расхождение в полтона.

const ROW_BASE =
  "flex w-full cursor-pointer items-center rounded-[8px] p-3 text-left text-p1-medium text-[var(--grey-1514)] outline-none focus-visible:focus-ring transition-colors"

interface SectionRowProps {
  title: string
  count?: number
  active?: boolean
  nested?: boolean
  onClick: () => void
}

function SectionRow({
  title,
  count,
  active,
  nested,
  onClick,
}: SectionRowProps) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        ROW_BASE,
        "gap-2",
        // Вложенная строка в эталоне — `pl-[24px] pr-[12px] py-[12px]`.
        nested && "pl-6",
        active ? "bg-[var(--grey-109)]" : "hover:bg-[var(--grey-106)]"
      )}
    >
      <span className="min-w-0 flex-1 truncate">{title}</span>
      {count != null && count > 0 && (
        <Badge type="counter" color="dark-grey" value={count} />
      )}
    </button>
  )
}

interface SectionListProps {
  nodes: HelpNode[]
  activeSection: string
  onSectionChange: (value: string) => void
  counts: Record<string, number>
  expanded: string[]
  onToggleGroup: (value: string) => void
}

function SectionList({
  nodes,
  activeSection,
  onSectionChange,
  counts,
  expanded,
  onToggleGroup,
}: SectionListProps) {
  return (
    <nav className="flex w-full flex-col">
      {nodes.map((node) => {
        if (!isGroup(node)) {
          return (
            <SectionRow
              key={node.value}
              title={node.title}
              count={counts[node.value]}
              active={node.value === activeSection}
              onClick={() => onSectionChange(node.value)}
            />
          )
        }

        const open = expanded.includes(node.value)
        return (
          <div key={node.value} className="flex w-full flex-col">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => onToggleGroup(node.value)}
              className={cn(ROW_BASE, "gap-4 hover:bg-[var(--grey-106)]")}
            >
              <span className="min-w-0 flex-1 truncate">{node.title}</span>
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 text-[var(--grey-1514)] transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </button>
            {open && (
              // `Sidebar Menu (ELK)` — вложенный список с полем 8 снизу.
              <div className="flex w-full flex-col pb-2">
                {node.children.map((child) => (
                  <SectionRow
                    key={child.value}
                    nested
                    title={child.title}
                    count={counts[child.value]}
                    active={child.value === activeSection}
                    onClick={() => onSectionChange(child.value)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export { SectionList }
