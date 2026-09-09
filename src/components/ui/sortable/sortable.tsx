import * as React from "react"
import { Drag } from "@/icons"

import { cn } from "@/lib/utils"

import type { SortableIndicator } from "./use-sortable"

/**
 * Оформление перетаскивания — вторая половина системы из `use-sortable.ts`
 * (макет «03. ELK / drag-and-drop», нода 42995:34194). Хук считает, ЧТО
 * происходит; эти три узла отвечают за то, КАК это выглядит, и потому одни
 * на весь кит.
 */

/**
 * Контейнер списка. Обязателен: линия вставки позиционируется от него.
 *
 * ⚠️ `forwardRef` здесь не украшение. Хук отдаёт `ref` в составе `listProps`,
 * а проект на React 18, где `ref` — не обычный проп: обычная функция-компонент
 * его молча теряет (и React пишет в консоль «Function components cannot be
 * given refs»). Без ссылки на список весь расчёт координат линии вставки
 * работает от `null` и линия не появляется вовсе.
 */
const SortableList = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  function SortableList({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="sortable-list"
        // `relative` — система координат для линии вставки. Без него линия
        // уехала бы к ближайшему позиционированному предку, то есть куда угодно.
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

/**
 * Линия «Область вставки» — 2px Grey 1514 со скруглением 2 (нода 45329:30623).
 *
 * ⚠️ Абсолютная и без места в потоке — это требование макета, а не приём
 * вёрстки: «при этом элементы списка не раздвигаются при появлении линии».
 * Раздвигающийся список сдвигал бы и ту границу, на которую целится курсор, —
 * место вставки прыгало бы под рукой.
 */
function SortableDropIndicator({
  indicator,
  className,
}: {
  indicator: SortableIndicator | null
  className?: string
}) {
  if (!indicator) return null
  return (
    <span
      aria-hidden="true"
      data-slot="sortable-drop-indicator"
      className={cn(
        "pointer-events-none absolute right-0 z-10 h-(--dnd-indicator-height) rounded-(--dnd-indicator-radius) bg-[var(--dnd-indicator-bg)]",
        className
      )}
      style={{
        top: indicator.top,
        // Вложенная строка — линия короче ровно на служебную колонку группы
        // («вставка в низ группы», кадр 4 макета).
        left: `calc(var(--dnd-indicator-nested-inset) * ${indicator.depth})`,
      }}
    />
  )
}

/**
 * Ручка захвата — иконка `icon / drag` 24×24. Отдельная кнопка, а не
 * `<span>`: перетаскивание мышью недоступно с клавиатуры, и стрелки
 * вверх/вниз на ручке — единственный способ поменять порядок без мыши.
 */
function SortableHandle({
  label,
  className,
  disabled,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      data-slot="sortable-handle"
      aria-label={label}
      disabled={disabled}
      className={cn(
        "flex shrink-0 cursor-grab text-[var(--sortable-handle-fg)] outline-none focus-visible:focus-ring active:cursor-grabbing disabled:cursor-default disabled:opacity-40",
        className
      )}
      {...props}
    >
      <Drag size={24} aria-hidden="true" className="size-6 shrink-0" />
    </button>
  )
}

/**
 * Классы строки: заливка взятого элемента (Active, Grey 124) и подсветка
 * группы под курсором (Hover, Grey 106). Функцией, а не компонентом: строки
 * у списков разные (`Menu Point`, строка таблицы, ряд настройки столбцов), и
 * общего у них ровно эти два состояния.
 */
function sortableRowClass(...extra: Parameters<typeof cn>) {
  return cn(
    "data-dragging:bg-[var(--dnd-dragging-bg)] data-drop-into:bg-[var(--dnd-drop-group-bg)]",
    ...extra
  )
}

export { SortableList, SortableDropIndicator, SortableHandle, sortableRowClass }
