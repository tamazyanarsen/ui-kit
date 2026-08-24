import * as React from "react"

import { cn } from "@/lib/utils"

import { TableScrollContext, useHorizontalScrollState } from "./pin"
import { TableScrollbar } from "./scrollbar"

// Table — "Проектирование таблиц ЕЛК" (node 70279:6891). Anatomy per spec: a
// Title Cell row (the header, `<thead>`) and a Cell grid of data rows
// (`<tbody>`/`TableRow`). Built on real `<table>`/`<thead>`/`<tbody>`/`<tr>`/
// `<th>`/`<td>` — the spec's cell "Type" variants (Checkbox/Collapse/Text/
// Number/Tag/Button) are genuinely heterogeneous per-column content, which
// real table semantics (row/column screen-reader navigation, `scope="col"`)
// support directly; nothing in the rest of this kit's div-based components
// (Item, Accordion List) covers a data grid like this.
//
// Здесь — только каркас таблицы. Ячейки живут рядом: шапка в `head-cell.tsx`,
// данные в `cell.tsx`, общая пиксельная геометрия обеих — в `geometry.ts`.

interface TableProps extends React.ComponentProps<"table"> {
  /** `table-layout: fixed`. Required for the spec's truncation and column
   * resizing to mean anything — with the default `auto` layout a cell grows
   * to fit its content instead of clipping it. */
  fixed?: boolean
  /**
   * Sticky header: "Шапка (закрепляется всегда при достижении верха
   * вьюпорта, открепляется вместе с достижением низа блока данных)".
   *
   * It sticks to the top of the table's *own* scrolling viewport, so pair it
   * with a height on `containerClassName` (e.g. `max-h-[480px]`). That is
   * not a shortcut: a box that scrolls horizontally is a scroll container on
   * both axes by CSS rule (`overflow-x: auto` forces `overflow-y` off
   * `visible`), which scopes `position: sticky` inside it — the header
   * physically cannot pin to the page viewport while the same box provides
   * the spec's horizontal scrolling. `--table-header-top` offsets the row
   * below a fixed site header.
   */
  stickyHeader?: boolean
  className?: string
  /** Styles the horizontally scrolling viewport that wraps the table. */
  containerClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}

function Table({
  className,
  fixed = false,
  stickyHeader = false,
  containerClassName,
  containerRef,
  ...props
}: TableProps) {
  const innerRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(containerRef, () => innerRef.current as HTMLDivElement)

  const scrollState = useHorizontalScrollState(innerRef)

  return (
    <TableScrollContext.Provider value={scrollState}>
      {/* Обёртка нужна полосе прокрутки: она стоит РЯДОМ с прокручиваемым
          узлом, а не внутри него (внутри она ехала бы вместе с колонками), и
          показывается по наведению на всю зону таблицы — отсюда `group`. */}
      <div data-slot="table-root" className="group/table relative">
        <div
          ref={innerRef}
          data-slot="table-container"
          // `themed-scrollbar` оставлен ради ВЕРТИКАЛЬНОЙ полосы (её растит
          // липкая шапка с ограниченной высотой контейнера); горизонтальная
          // нативная погашена в styles/base.css — вместо неё своя, см.
          // `scrollbar.tsx`.
          className={cn(
            "themed-scrollbar w-full overflow-x-auto",
            containerClassName
          )}
        >
          <table
            data-slot="table"
            data-sticky-header={stickyHeader || undefined}
            className={cn(
              "w-full border-separate border-spacing-0 bg-[var(--table-bg)] text-p2-regular text-[var(--table-fg)]",
              fixed && "table-fixed",
              className
            )}
            {...props}
          />
        </div>
        <TableScrollbar scrollRef={innerRef} />
      </div>
    </TableScrollContext.Provider>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={className} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
}

// Row states ("Варианты — Line Fill", node 70279:7145): Default has no fill,
// Hover/Active are plain CSS `:hover`/`:active` — but *only on a row that
// navigates somewhere*, since the spec says "если переход невозможен, строка
// не меняет цвет и сохраняет стандартный курсор, исключая состояния
// наведения и активности", hence the explicit `clickable` prop. `selected`
// is the multi-select fill (checkbox checked) and `added` marks a
// just-created row, which fades itself out over 2000ms (see `--table-added`
// keyframes in styles/base.css).
interface TableRowProps extends React.ComponentProps<"tr"> {
  /** Multi-select fill (the row's checkbox is checked). */
  selected?: boolean
  /** "Added" — a just-created row. The highlight lives 2000ms: 1000ms static
   * then 1000ms fading out, per "Добавление новой строки/строк". */
  added?: boolean
  /** The row navigates to a detail page: enables the Hover/Active fills and
   * the pointer cursor. Without it the spec keeps the row inert. */
  clickable?: boolean
}

function TableRow({
  className,
  selected,
  added,
  clickable,
  ...props
}: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected || undefined}
      data-added={added || undefined}
      data-clickable={clickable || undefined}
      className={cn(
        // Every row carries an explicit fill rather than inheriting the
        // table's: pinned cells paint themselves with `bg-inherit`, so a
        // transparent row would let the scrolling columns show through them.
        "bg-[var(--table-bg)] transition-colors",
        // Выбранная чекбоксом строка — Grey 124. Состояния `Selected` в сете
        // «line fill» нет: цвет снят с макетов режима множественного выбора.
        selected
          ? "bg-[var(--table-row-active-bg)]"
          : added
            ? "animate-[table-row-added_2000ms_linear_forwards]"
            : undefined,
        // ⚠️ Ховер ПЕРЕБИВАЕТ выбор и делает выбранную строку СВЕТЛЕЕ:
        // покой 124 → наведение 114 → нажатие снова 124. Клиент должен
        // видеть реакцию строки и понимать, что провалиться можно и при
        // включённом чекбоксе, — поэтому `selected` тут больше не гасит
        // ховер. Работает это только благодаря порядку каскада: Tailwind
        // печатает вариантные утилиты после безвариантных, так что
        // `hover:` бьёт голый `bg-*` при равной специфичности, а `active:`
        // бьёт `hover:` и возвращает строку в 124.
        clickable &&
          "cursor-pointer hover:bg-[var(--table-row-hover-bg)] active:bg-[var(--table-row-active-bg)]",
        // "Hover, работа с кнопкой действий (изменения от 19.12.2025):
        // Строка также меняет цвет — для понимания пользователя, к какой
        // именно строке относятся раскрытые действия." The fill has to
        // outlive the cursor, which moves off the row and onto the portalled
        // menu, so it keys off the trigger's own open state rather than
        // `:hover`. Independent of `clickable`: this is about attributing the
        // open menu, not about navigating.
        "has-[[data-popup-open]]:bg-[var(--table-row-hover-bg)]",
        className
      )}
      {...props}
    />
  )
}

export { Table, TableBody, TableHeader, TableRow }
export type { TableProps, TableRowProps }
