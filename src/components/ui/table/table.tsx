import * as React from "react"

import { cn } from "@/lib/utils"

import { TableScrollContext, useHorizontalScrollState } from "./pin"
import { useComposedRefs } from "@/lib/compose-refs"

import { TableScrollbar } from "./scrollbar"
import { useStickyHead } from "./use-sticky-head"

// Table — по документу «Проектирование таблиц ЕЛК». Анатомия по макету:
// ряд ячеек заголовка (шапка, `<thead>`) и сетка ячеек с данными
// (`<tbody>` и `TableRow`). Построено на настоящих
// `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>` и `<td>`: варианты
// свойства «Type» у ячейки (Checkbox, Collapse, Text, Number, Tag, Button)
// — это действительно разнородное содержимое по колонкам, а настоящая
// семантика таблицы (навигация по строкам и колонкам в скринридере,
// `scope="col"`) поддерживает такое напрямую. Ничто из остальных
// компонентов кита на div (Item, Accordion List) сетку данных такого рода
// не покрывает.
//
// Здесь — только каркас таблицы. Ячейки живут рядом: шапка в `head-cell.tsx`,
// данные в `cell.tsx`, общая пиксельная геометрия обеих — в `geometry.ts`.

interface TableProps extends React.ComponentProps<"table"> {
  /** `table-layout: fixed`. Без него обрезка текста и изменение ширины
   * колонок из макета лишены смысла: при раскладке `auto` по умолчанию
   * ячейка растёт под содержимое, а не подрезает его. */
  fixed?: boolean
  /**
   * Липкая строка названий столбцов: «закрепляется на промежуточном скролле
   * и открепляется по выходу блока из вьюпорта» (дизайн-чек от 08.10,
   * замечания 21 и 35). Включена по умолчанию — правило действует «во всех
   * таблицах».
   *
   * ⚠️ Своей вертикальной прокрутки у таблицы НЕТ и быть не может: «у
   * страницы должен быть единый скролл». Строка липнет к верху вьюпорта под
   * закреплённой шапкой страницы (`--viewport-inset-top`) и уходит вместе с
   * низом таблицы. Почему это не `position: sticky` и как устроено — см.
   * use-sticky-head.ts.
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
  /** Стили для горизонтально прокручиваемой области, оборачивающей таблицу. */
  containerClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}

// forwardRef: `ref` уходит на сам `<table>`, окно прокрутки — через
// `containerRef`. На React 18 обычная функция `ref` молча теряла.
const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table({
  className,
  fixed = false,
  stickyHeader = true,
  gridLines = false,
  containerClassName,
  containerRef,
  ...props
}, ref) {
  const innerRef = React.useRef<HTMLDivElement>(null)
  // Без зависимостей хэндл пересоздавался на каждый рендер, и callback-ref
  // потребителя получал `null`, а следом узел — на любую перерисовку
  // (ревью 10.10, КК-3). Узел окна прокрутки не меняется за жизнь таблицы.
  React.useImperativeHandle(containerRef, () => innerRef.current as HTMLDivElement, [])

  const scrollState = useHorizontalScrollState(innerRef)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const composedTableRef = useComposedRefs(tableRef, ref)
  useStickyHead(rootRef, tableRef, stickyHeader)

  return (
    <TableScrollContext.Provider value={scrollState}>
      {/* Обёртка нужна полосе прокрутки: она стоит РЯДОМ с прокручиваемым
          узлом, а не внутри него (внутри она ехала бы вместе с колонками), и
          показывается по наведению на всю зону таблицы — отсюда `group`.

          Она же — субъект шкалы просмотра, по которой сдвигается липкая
          строка шапки (`data-sticky-head`, см. use-sticky-head.ts), и
          собственный контекст наложения (`isolate`): шапка поднята над
          закреплёнными ячейками строк, но не над слоями страницы. */}
      <div
        ref={rootRef}
        data-slot="table-root"
        data-sticky-head={stickyHeader || undefined}
        className="group/table relative isolate"
      >
        <div
          ref={innerRef}
          data-slot="table-container"
          // См. `scrollbar.tsx`: окно прокрутки — фокусируемый узел без
          // `tabindex`, кольцо ему выдаёт правило по этому маркеру.
          data-scroll-window=""
          // Только горизонтальная прокрутка: вертикальной у таблицы нет
          // «навсегда» (замечание 35) — страница листается единым скроллом.
          // `overflow-y-hidden` явно, потому что `overflow-x: auto` иначе
          // вывел бы `auto` и по второй оси.
          className={cn(
            "w-full overflow-x-auto overflow-y-hidden",
            containerClassName
          )}
        >
          <table
            ref={composedTableRef}
            data-slot="table"
            data-sticky-header={stickyHeader || undefined}
            data-grid-lines={gridLines || undefined}
            className={cn(
              "w-full border-separate border-spacing-0 bg-[var(--table-bg)] text-p2-medium text-[var(--table-fg)]",
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
})

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} data-slot="table-header" className={className} {...props} />
})

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} data-slot="table-body" className={className} {...props} />
})

// Состояния строки («Варианты — Line Fill»): у Default заливки нет, Hover и
// Active — обычные `:hover` и `:active` в CSS, но *только у строки, которая
// куда-то ведёт*, потому что макет говорит: «если переход невозможен, строка
// не меняет цвет и сохраняет стандартный курсор, исключая состояния
// наведения и активности», — отсюда и явный пропс `clickable`. `selected` —
// это заливка множественного выбора (флажок отмечен), а `added` помечает
// только что созданную строку, которая сама затухает за 2000 мс (см.
// ключевые кадры `--table-added` в styles/base.css).
interface TableRowProps extends React.ComponentProps<"tr"> {
  /** Заливка множественного выбора (флажок строки отмечен). */
  selected?: boolean
  /** «Added» — только что созданная строка. Подсветка живёт 2000 мс: 1000 мс
   * статично, затем 1000 мс затухает, по разделу «Добавление новой строки/строк». */
  added?: boolean
  /** Строка ведёт на страницу детального просмотра: включает заливки Hover
   * и Active и курсор-указатель. Без этого макет оставляет строку инертной.
   * Такая строка встаёт в обход по Tab и открывается по Enter и пробелу. */
  clickable?: boolean
  /**
   * Что делает нажатие на кликабельную строку — для скринридера.
   *
   * Строка остаётся `row` (роль `button` сломала бы таблицу), и без
   * описания фокус на ней объявлялся как обычная строка: о том, что её
   * можно открыть, человек не узнавал (ревью 10.10, п. 27). Уходит в
   * `aria-description`.
   */
  actionDescription?: string
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    {
      className,
      selected,
      added,
      clickable,
      actionDescription = "Открывается по Enter",
      tabIndex,
      onKeyDown,
      ...props
    },
    ref
  ) {
    // Клавиатура для кликабельной строки: без неё карточку можно было открыть
    // только мышью. Нажатие ловится лишь на САМОЙ строке — Enter на чекбоксе
    // или кнопке внутри остаётся их собственным действием.
    function handleKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>) {
      onKeyDown?.(event)
      if (event.defaultPrevented || !clickable) return
      if (event.target !== event.currentTarget) return
      if (event.key !== "Enter" && event.key !== " ") return
      event.preventDefault()
      // Автоповтор пробела не открывает карточку снова: нативная кнопка
      // срабатывает на пробел один раз. `preventDefault` выше остаётся —
      // иначе удержание пробела прокручивало бы страницу. Enter повторяется,
      // как у кнопки.
      if (event.key === " " && event.repeat) return
      // Метка на время клика: обработчик строки различает по ней нажатие
      // клавиши и «клик после протяжки по тексту» — выделение, оставшееся в
      // строке, не должно глушить Enter (иначе строку с выделенным текстом
      // с клавиатуры не открыть, пока выделение не снято).
      const row = event.currentTarget
      row.setAttribute("data-key-activation", "")
      try {
        row.click()
      } finally {
        row.removeAttribute("data-key-activation")
      }
    }

    return (
      <tr
        ref={ref}
        tabIndex={tabIndex ?? (clickable ? 0 : undefined)}
        aria-description={clickable ? actionDescription : undefined}
        onKeyDown={handleKeyDown}
        data-slot="table-row"
        data-selected={selected || undefined}
        data-added={added || undefined}
        data-clickable={clickable || undefined}
        className={cn(
          // Каждая строка несёт явную заливку, а не наследует заливку
          // таблицы: закреплённые ячейки красят себя через `bg-inherit`, и
          // сквозь прозрачную строку прокручиваемые колонки просвечивали бы.
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
            "cursor-pointer outline-none hover:bg-[var(--table-row-hover-bg)] focus-visible:focus-ring-inset active:bg-[var(--table-row-active-bg)]",
          // «Hover, работа с кнопкой действий (изменения от 19.12.2025):
          // Строка также меняет цвет — для понимания пользователя, к какой
          // именно строке относятся раскрытые действия». Заливка обязана
          // пережить курсор, который уходит со строки на меню в портале,
          // поэтому она завязана на собственное состояние открытия триггера, а
          // не на `:hover`. С `clickable` это не связано: речь о том, чтобы
          // показать принадлежность открытого меню, а не о переходе.
          "has-[[data-popup-open]]:bg-[var(--table-row-hover-bg)]",
          className
        )}
        {...props}
      />
    )
  }
)

export { Table, TableBody, TableHeader, TableRow }
export type { TableProps, TableRowProps }
