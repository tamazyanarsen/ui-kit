import * as React from "react"

import { cn } from "@/lib/utils"

// TableBlock — "Анатомия табличных блоков" (node 70279:7385). The spec
// assembles a table page-block from, top to bottom:
//
//   Название (опционально) → Вкладки (опционально) → Блок фильтрации
//   (опционально) → Сводка (есть всегда) и настройка нижестоящего контента
//   (опционально) → Шапка → Блок с данными или пустым результатом →
//   Пагинатор (опционально)
//
// and states the container itself plainly: "Для табличных блоков заливка
// white 101, padding = 0px, gap = 0px. Для элементов внутри блока итоговый
// горизонтальный padding = 16px, радиусы скруглений 16px."
//
// So this is only the card: the 16px inset belongs to the elements inside it
// (`TableTop` already carries its own p-16, `Pagination` its own), and the
// rules between sections are the bottom borders the header/rows already
// draw. `overflow-hidden` is what keeps the rows' full-bleed fills inside
// the 16px radius.
function TableBlock({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-block"
      className={cn(
        "w-full overflow-hidden rounded-[16px] bg-[var(--table-bg)]",
        className
      )}
      {...props}
    />
  )
}

// The empty/zero-result slot — "Нулевой результат фильтрации, нет записей.
// Замещают собой строки таблицы внутри блока."
//
// It deliberately sits *outside* the table's horizontal scroll viewport,
// because the spec is explicit that it must not move with it:
// "Горизонтальная прокрутка не прокручивает элементы пустых состояний —
// информация всегда размещается по центру блока по горизонтали." The header
// row above it stays as-is ("Конструкция таблицы (фильтры, заголовки и тд)
// остаётся без изменений, так как на страницах может быть онбординг на
// элементы таблиц"), and the bottom rule keeps the paginator separated the
// same way a last data row would.
function TableBlockEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-block-empty"
      className={cn(
        "flex w-full items-center justify-center border-b border-[var(--table-divider)]",
        className
      )}
      {...props}
    />
  )
}

export { TableBlock, TableBlockEmpty }
