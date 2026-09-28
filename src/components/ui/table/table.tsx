import * as React from "react"

import { cn } from "@/lib/utils"

import { TableScrollContext, useHorizontalScrollState } from "./pin"
import { TableScrollbar } from "./scrollbar"
import { useBelowReserve } from "./use-below-reserve"

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
   *     само: `sticky` ограничен коробкой родителя, то есть блока таблицы;
   *   • пока в блоке ниже таблицы кто-то есть (пагинатор), липкость гасится
   *     вовсе — весь её ход пришёлся бы на него, см. use-below-reserve.ts.
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
  /** Стили для горизонтально прокручиваемой области, оборачивающей таблицу. */
  containerClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}

// forwardRef: `ref` уходит на сам `<table>`, окно прокрутки — через
// `containerRef`. На React 18 обычная функция `ref` молча теряла.
const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table({
  className,
  fixed = false,
  stickyHeader = false,
  gridLines = false,
  containerClassName,
  containerRef,
  ...props
}, ref) {
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
            ref={ref}
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
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { className, selected, added, clickable, tabIndex, onKeyDown, ...props },
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
      event.currentTarget.click()
    }

    return (
      <tr
        ref={ref}
        tabIndex={tabIndex ?? (clickable ? 0 : undefined)}
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
