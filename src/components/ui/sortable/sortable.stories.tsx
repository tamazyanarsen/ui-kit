import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ArrowDownChevron, ArrowNextChevron } from "@/icons"
import { cn } from "@/lib/utils"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"

import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  sortableRowClass,
  useSortable,
  type SortableEntry,
} from "./index"

/**
 * Drag & drop — целевой вид перетаскивания, макет «03. ELK / drag-and-drop»
 * (нода 42995:34194). Правила корневые: одни и те же для настройки главного
 * меню, настройки избранного, настройки столбцов таблицы и любого следующего
 * раздела.
 *
 * Что показывает витрина (по кадрам макета):
 *
 *   1. Момент захвата — берётся за иконку, строка красится в Active (Grey 124).
 *   2. Область вставки — чёрная линия 2px; список НЕ раздвигается.
 *   3. Вставка в группу — свёрнутая группа подсвечивается Hover (Grey 106)
 *      и через 0,5 с раскрывается.
 *   4. Вставка в низ группы — линия короче на ширину служебной колонки.
 *   5. Вставка под группу — линия обычная, но на том же уровне, что и в п. 4.
 *   6. Автопрокрутка при подводе к границе видимой области.
 *
 * Мышью это проверяется прямо здесь: истории живые, а не картинки состояний.
 */

interface Row extends SortableEntry {
  label: string
}

const INITIAL: Row[] = [
  { id: "general", label: "Общие вопросы" },
  { id: "efficiency", label: "Эффективность и целеполагание", group: true, expanded: false },
  { id: "account", label: "Управление аккаунтом" },
  { id: "payments", label: "Платежи и подписки" },
  { id: "security", label: "Безопасность и конфиденциальность" },
  { id: "training", label: "Обучение сотрудников", group: true, expanded: true },
  { id: "training-required", label: "Обязательные курсы", depth: 1 },
  { id: "training-extra", label: "Повышение квалификации", depth: 1 },
  { id: "feedback", label: "Обратная связь" },
  { id: "contacts", label: "Контактная информация" },
  { id: "policy", label: "Политика использования" },
]

function SectionList({ initial = INITIAL }: { initial?: Row[] }) {
  const [rows, setRows] = React.useState(initial)

  const sortable = useSortable({
    items: rows,
    onReorder: (from, to) =>
      setRows((prev) => {
        const next = [...prev]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)
        return next
      }),
    onExpandGroup: (id) =>
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, expanded: true } : row))
      ),
    // Бросок на свёрнутую группу кладёт раздел первым внутрь неё: группа к
    // этому моменту уже раскрыта таймером, поэтому «внутрь» — это сразу за
    // заголовком.
    onDropInto: (groupId, dragId) =>
      setRows((prev) => {
        const from = prev.findIndex((row) => row.id === dragId)
        if (from < 0) return prev
        const next = [...prev]
        const [moved] = next.splice(from, 1)
        const at = next.findIndex((row) => row.id === groupId)
        next.splice(at + 1, 0, { ...moved, depth: 1 })
        return next
      }),
  })

  // Строки свёрнутой группы не показываются — иначе кадр 3 макета («на
  // заголовок свёрнутой группы… с задержкой 0,5 секунды она разворачивается»)
  // нечем было бы проверить.
  const visible = rows.filter((row) => {
    if (!row.depth) return true
    const group = findGroupOf(rows, row.id)
    return group?.expanded !== false
  })

  return (
    <SortableList className="flex flex-col" {...sortable.listProps}>
      {visible.map((row) => (
        <div
          key={row.id}
          className={sortableRowClass(
            menuItemRowClass(
              "not-data-dragging:not-data-drop-into:hover:bg-[var(--menu-item-bg-highlighted)]",
              "rounded-2xl"
            )
          )}
          {...sortable.itemProps(row.id)}
        >
          <MenuItemContent
            leading={
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center text-[var(--menu-item-fg)]",
                  !row.group && "invisible"
                )}
                aria-hidden="true"
              >
                {row.expanded ? (
                  <ArrowDownChevron size={16} className="size-4" />
                ) : (
                  <ArrowNextChevron size={16} className="size-4" />
                )}
              </span>
            }
            trailing={
              <SortableHandle
                label={`Переместить «${row.label}»`}
                {...sortable.handleProps(row.id)}
              />
            }
          >
            <span className={cn(row.depth ? "pl-8" : undefined)}>{row.label}</span>
          </MenuItemContent>
        </div>
      ))}
      <SortableDropIndicator indicator={sortable.indicator} />
    </SortableList>
  )
}

/** Ближайший заголовок группы выше вложенной строки. */
function findGroupOf(rows: Row[], id: string) {
  const index = rows.findIndex((row) => row.id === id)
  for (let i = index - 1; i >= 0; i -= 1) {
    if (rows[i].group) return rows[i]
    if (!rows[i].depth) return undefined
  }
  return undefined
}

const meta = {
  title: "Компоненты/Drag and Drop",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj

export const Playground: Story = {
  render: () => (
    <div className="max-w-[1031px] rounded-3xl bg-[var(--white-101)] p-8">
      <h3 className="mb-6 text-h3">Управление списком разделов</h3>
      <SectionList />
    </div>
  ),
}

export const Examples: Story = {
  name: "Примеры использования",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col gap-8 bg-[var(--grey-106)] p-8">
      <section className="flex flex-col gap-3">
        <h4 className="text-h4">Правила</h4>
        <ul className="flex flex-col gap-1 text-p2-medium text-[var(--grey-284)]">
          <li>Захват — только за иконку перетаскивания.</li>
          <li>Взятая строка красится в Active (Grey&nbsp;124).</li>
          <li>Область вставки — линия 2&nbsp;px; список не раздвигается.</li>
          <li>
            Наведение на свёрнутую группу подсвечивает её Hover (Grey&nbsp;106)
            и через 0,5&nbsp;с раскрывает.
          </li>
          <li>
            Нижняя половина последней строки группы — короткая линия (вставка в
            группу); верхняя половина строки под группой — обычная, на том же
            уровне.
          </li>
          <li>У границы видимой области список прокручивается сам.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h4 className="text-h4">Список с группами</h4>
        <div className="rounded-3xl bg-[var(--white-101)] p-8">
          <SectionList />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h4 className="text-h4">Автопрокрутка (короткое окно)</h4>
        {/* Окно ниже списка: тащить надо к его верхней или нижней кромке. */}
        <div className="themed-scrollbar max-h-[240px] overflow-y-auto rounded-3xl bg-[var(--white-101)] p-8">
          <SectionList />
        </div>
      </section>
    </div>
  ),
}
