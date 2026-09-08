import * as React from "react"

import { cn } from "@/lib/utils"

import { TableScrollContext, useHorizontalScrollState } from "./pin"
import { TableScrollbar } from "./scrollbar"
import { useBelowReserve } from "./use-below-reserve"

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
   * Липкая шапка: «Шапка (закрепляется всегда при достижении верха вьюпорта,
   * открепляется вместе с достижением низа блока данных)».
   *
   * ⚠️ ЛИПНЕТ НЕ СТРОКА ШАПКИ, А ВЕСЬ БЛОК ТАБЛИЦЫ — и это единственный
   * способ выполнить правило, не ломая закреплённые столбцы.
   *
   * Суть ограничения: коробка с горизонтальной прокруткой по правилу CSS
   * становится областью прокрутки ПО ОБЕИМ осям (`overflow-x: auto`
   * выводит `overflow-y` из `visible`), а `position: sticky` считается от
   * ближайшей области прокрутки. Пока окно таблицы даёт горизонтальную
   * прокрутку — а оно обязано её давать, на ней держатся закреплённые
   * столбцы, — шапка внутри него физически не может липнуть к вьюпорту
   * страницы. Проверено замером: строка честно получала `top: 64px` и всё
   * равно уезжала вместе со страницей.
   *
   * Поэтому липнет обёртка `table-root`: она остаётся у верхнего края
   * экрана, пока страница идёт мимо, а шапка внутри неё липнет к её нулю —
   * то есть ровно к верху вьюпорта под закреплённой шапкой страницы.
   * Отсюда же два следствия:
   *
   *   • окно прокрутки ограничивается свободной высотой вьюпорта
   *     (`100dvh` минус занятый верх и низ — обе величины публикуют шапка
   *     страницы и нижние панели), поэтому длинная таблица листается внутри
   *     блока, а короткая ведёт себя как раньше;
   *   • «открепляется вместе с достижением низа блока данных» получается
   *     само: `sticky` ограничен коробкой родителя, то есть блока таблицы.
   *
   * `--table-header-top` остаётся ручным перекрытием отступа строки внутри
   * окна, `containerClassName` — ограничения высоты.
   */
  stickyHeader?: boolean
  /**
   * Разлиновка — сетка тонких линий между ячейками.
   *
   * Отдельное свойство таблицы, а не умолчание: по умолчанию строки
   * отделены только воздухом (замер двух эталонных рендеров показывает в
   * пустой колонке ровно две линии #DEDEDE — под шапкой блока и под самой
   * шапкой таблицы, между строками ни одной).
   *
   * ⚠️ Линии рисуются по МАРКЕРУ на таблице, а не селекторами вида
   * `td:not(:first-child)`. Такие правила промахиваются мимо ячеек — первая
   * ячейка бывает шевроном или чекбоксом, последняя филлером, — проигрывают
   * по специфичности собственным правилам ячейки и попадают в уже занятый
   * псевдоэлемент. Здесь занят только `::after` подвижной ячейки, а линия
   * закрепа остаётся отдельным узлом.
   */
  gridLines?: boolean
  className?: string
  /** Styles the horizontally scrolling viewport that wraps the table. */
  containerClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}

function Table({
  className,
  fixed = false,
  stickyHeader = false,
  gridLines = false,
  containerClassName,
  containerRef,
  ...props
}: TableProps) {
  const innerRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(containerRef, () => innerRef.current as HTMLDivElement)

  const scrollState = useHorizontalScrollState(innerRef)

  // Место под тем, что стоит в блоке НИЖЕ таблицы (пагинатор), — см.
  // use-below-reserve.ts.
  const rootRef = React.useRef<HTMLDivElement>(null)
  useBelowReserve(rootRef, stickyHeader)

  return (
    <TableScrollContext.Provider value={scrollState}>
      {/* Обёртка нужна полосе прокрутки: она стоит РЯДОМ с прокручиваемым
          узлом, а не внутри него (внутри она ехала бы вместе с колонками), и
          показывается по наведению на всю зону таблицы — отсюда `group`.
 
          ⚠️ ОНА ЖЕ — липкий узел, а не строка шапки. Разбор — в комментарии
          к `stickyHeader` выше: `overflow-x: auto` у окна прокрутки делает
          его областью прокрутки, и `sticky` у `th` считается от него, а не
          от вьюпорта. Липнет поэтому весь блок таблицы: он остаётся у
          верхнего края экрана, пока страница проходит мимо, а шапка внутри
          него липнет к его нулю — то есть ровно к верху вьюпорта.
 
          Липнуть обязана именно эта обёртка, а не окно прокрутки: `sticky`
          ограничен коробкой РОДИТЕЛЯ, а родитель окна — эта самая обёртка,
          высота которой равна высоте окна. Ехать было бы некуда. */}
      <div
        ref={rootRef}
        data-slot="table-root"
        className={cn(
          "group/table relative",
          stickyHeader && "sticky top-(--viewport-inset-top)"
        )}
      >
        <div
          ref={innerRef}
          data-slot="table-container"
          // См. `scrollbar.tsx`: окно прокрутки — фокусируемый узел без
          // `tabindex`, кольцо ему выдаёт правило по этому маркеру.
          data-scroll-window=""
          // `themed-scrollbar` оставлен ради ВЕРТИКАЛЬНОЙ полосы (её растит
          // липкая шапка с ограниченной высотой контейнера); горизонтальная
          // нативная погашена в styles/base.css — вместо неё своя, см.
          // `scrollbar.tsx`.
          className={cn(
            "themed-scrollbar w-full overflow-x-auto",
            // ⚠️ Ограничение высоты стоит на САМОМ ОКНЕ прокрутки, а не на
            // липкой обёртке. Через обёртку не выходит: у неё автовысота, и
            // процентные ограничения окна (`max-h-full`) от такого родителя
            // резолвятся в `none` — окно оставалось безразмерным, а строки
            // вываливались за подрезанную обёртку. Обёртка же получает свою
            // высоту от окна сама.
            // `--table-below` — место под пагинатором и всем, что стоит в
            // блоке ниже таблицы (см. use-below-reserve.ts). Без него окно
            // забирало всю свободную высоту, и пагинатор рисовался поверх
            // последней строки (дизайн-чек от 08.09, замечание 11).
            stickyHeader &&
              "max-h-[calc(100dvh-var(--viewport-inset-top,0px)-var(--viewport-inset-bottom,0px)-var(--table-below,0px))]",
            containerClassName
          )}
        >
          <table
            data-slot="table"
            data-sticky-header={stickyHeader || undefined}
            data-grid-lines={gridLines || undefined}
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
