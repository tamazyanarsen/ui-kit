import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import { TableCollapseToggle, collapseLabel } from "./collapse-toggle"
import {
  EDGE_PADDING_CLASS,
  edgeColumnWidth,
  hasColumnDivider,
  headCellPaddingXClass,
  headCellPaddingYClass,
  isControlType,
} from "./geometry"
import { TableHeadCellTitle } from "./head-cell-title"
import type { TablePin } from "./pin"
import { useComposedRefs } from "@/lib/compose-refs"
import { usePinPresentation } from "./pin-presentation"
import { TableRowMenu } from "./row-menu"
import type { TableHeadCellType } from "./types"
import { useColumnResize } from "./use-column-resize"

interface TableHeadCellProps
  extends Omit<React.ComponentProps<"th">, "children" | "onSelect"> {
  type?: TableHeadCellType
  children?: React.ReactNode
  /** «Show Sort» — рисует переключатель ⇅ рядом с текстом Subtitle Left/Right. */
  sortable?: boolean
  /**
   * Куда эта колонка отсортирована сейчас. Задайте значение (то есть не
   * `null`), и ячейка нарисует состояние Active из макета: тёмный текст
   * заголовка плюс затемнённый соответствующий шеврон значка сортировки.
   * `null` — это Default и Hover.
   *
   * ⚠️ Отдельного состояния `Active` у ячейки шапки нет намеренно, хотя в
   * ките оно есть третьим значением `State`: активность — это и есть
   * `sortDirection !== null`. «Active без отмеченной сортировки» не бывает, и
   * невозможную комбинацию лучше не давать выразить; к тому же у типов
   * Checkbox / Icon / Button подписи нет, а состояние меняет только её цвет.
   */
  sortDirection?: "asc" | "desc" | null
  /**
   * ⚠️ **Круг сортировки замкнут на двух направлениях**: «нет → по
   * возрастанию → по убыванию → по возрастанию → …». Нажатием сортировку не
   * сбросить — иначе строки остались бы переставленными, а действующий
   * критерий пропал бы из виду. Состояние живёт у вызывающей стороны, так что
   * это правило нужно соблюсти в обработчике (см. `table-demo.tsx`).
   */
  onSortClick?: () => void
  /** «Show Icon» — необязательный ведущий значок перед текстом Subtitle. */
  icon?: React.ReactNode
  checked?: boolean
  indeterminate?: boolean
  /** Чекбокс «выбрать всё» выключен — выбирать нечего. */
  checkboxDisabled?: boolean
  /**
   * ⚠️ Круг чекбокса «выбрать всё»: **пусто → всё, частично → ВСЁ, всё →
   * пусто**. То есть добрать до полного выбора можно из любого состояния, а
   * сбросить — только из полного.
   *
   * Это правка к документации кита («повторное нажатие сбрасывает сразу все
   * выбранные значения»): по букве доки из частичного состояния выбор
   * обнулялся бы, и набранную вручную выборку можно было бы потерять одним
   * кликом. Выбор живёт у вызывающей стороны, поэтому круг соблюдает она.
   */
  onCheckedChange?: (checked: boolean) => void
  menu?: React.ReactNode
  /**
   * Контрол «свернуть/развернуть всё» («Сворачивание/разворачивание всех
   * строк»). Шеврон вниз — всё свёрнуто до первого уровня, вверх —
   * развёрнуто полностью.
   *
   * Макет запрещает этой колонке две другие возможности шапки: «в таблицах
   * со сворачиванием/разворачиванием не предусмотрена пользовательская
   * сортировка — она невозможна без нарушения вложенностей» и «он также не
   * может менять ширину столбца, идентифицирующего иерархию. Его ширина
   * опредяется в момент проектирования». Поэтому `sortable` и `resizable`
   * здесь игнорируются, а не рисуют молча контролы, которые дизайн
   * запрещает.
   */
  collapsible?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Тянуть правую границу, чтобы менять ширину колонки («при наведении на
   * правую границу ячейки курсор меняется на вертикальную черту с
   * двунаправленной стрелкой»). Колонки Checkbox и Collapse макет из этого
   * исключает. */
  resizable?: boolean
  /** Ширина колонки в пикселях. Неуправляемая, если задан только `defaultWidth`. */
  width?: number
  defaultWidth?: number
  onWidthChange?: (width: number) => void
  /** "Минимальная ширина столбцов — 48px." */
  minWidth?: number
  pin?: TablePin
  /**
   * Первая ячейка шапки — забирает поле строки (см. `ROW_EDGE_PADDING`):
   * левое поле 16 вместо 8, объявленная ширина колонки на 8 больше.
   */
  edge?: boolean
}

// forwardRef: на React 18 обычная функция молча теряет `ref`, хотя тип пропов
// (`ComponentProps<"th">`) его обещает. Внутренний ref закрепа сливается с ним.
const TableHeadCell = React.forwardRef<
  HTMLTableHeaderCellElement,
  TableHeadCellProps
>(function TableHeadCell({
  className,
  type = "subtitle-left",
  children,
  sortable = false,
  sortDirection = null,
  onSortClick,
  icon,
  checked,
  indeterminate,
  checkboxDisabled,
  onCheckedChange,
  menu,
  collapsible = false,
  expanded = true,
  onExpandedChange,
  resizable = false,
  width,
  defaultWidth,
  onWidthChange,
  minWidth,
  pin,
  edge = false,
  style,
  ...props
}, forwardedRef) {
  const isSubtitle = type === "subtitle-left" || type === "subtitle-right"
  const isRight = type === "subtitle-right"
  // Хвостовой остаток ширины — не колонка данных: ни подписи, ни ширины, ни
  // высоты у него нет, он только доносит линию под шапкой до правого края.
  const isSpacer = type === "spacer"

  // Колонка иерархии не сортируется и не меняет ширину — см. описание
  // пропса `collapsible` с двумя строками макета, которые запрещают и то и
  // другое.
  const canSort = sortable && !collapsible
  const canResize = resizable && !collapsible

  const { resolvedWidth, startResize } = useColumnResize({
    type,
    pin,
    width,
    defaultWidth,
    onWidthChange,
    minWidth,
  })
  const pinned = usePinPresentation<HTMLTableHeaderCellElement>(pin, true)
  const ref = useComposedRefs(pinned.ref, forwardedRef)
  const divider = hasColumnDivider(type)

  const collapseToggle = (
    <TableCollapseToggle
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      label={collapseLabel(expanded, "all")}
    />
  )

  return (
    <th
      ref={ref}
      data-slot="table-head-cell"
      data-type={type}
      data-pin={pin}
      scope={isSpacer ? undefined : "col"}
      // Состояние сортировки для скринридера: цвет подписи и шеврон его не
      // сообщают. Только у сортируемой колонки — у прочих атрибута нет.
      aria-sort={
        canSort
          ? sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : "none"
          : undefined
      }
      aria-hidden={isSpacer || undefined}
      style={{
        ...style,
        ...pinned.style,
        width: edgeColumnWidth(resolvedWidth, edge),
      }}
      className={cn(
        headCellPaddingYClass(type),
        headCellPaddingXClass(type, pin, divider),
        // См. `ROW_EDGE_PADDING`: поле строки живёт в первой ячейке.
        edge && EDGE_PADDING_CLASS,
        // Высота ячейки шапки в ките ФИКСИРОВАНА 48 — содержимое обрезается,
        // а не растягивает шапку (подпись усекается многоточием, см.
        // `TableHeadCellTitle`). Без явной высоты длинное название в одном
        // столбце раздвигало бы всю строку шапки, и липкая шапка съезжала бы
        // относительно посчитанного под неё отступа.
        "h-12",
        // C5: ячейка шапки НЕ ЗАДАВАЛА цвет текста — начертание корень
        // задавал, а цвет нет, и любое содержимое слота (чекбокс, кнопка
        // меню) наследовало чистый чёрный документа во всех трёх темах.
        // Правильный цвет — Grey 284; подпись и сортировка ставят его же
        // сами, но полагаться на это нельзя: слот произвольный.
        "font-medium text-[var(--table-description-fg)]",
        // Нижняя линия шапки рисуется на каждой ячейке (`border-b` у
        // `ELK / table-title-cell`), чтобы оставаться на месте под липкими
        // ячейками, — но псевдоэлементом, а не настоящей рамкой. В макете
        // обводка кадров идёт *внутрь*, поэтому линия живёт внутри тех же
        // 48px ячейки, а не добавляет сорок девятый пиксель. Замерено на
        // канонических рендерах: линия шапки — это последний пиксельный ряд
        // её 48px.
        "relative before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-[var(--table-divider)] before:content-['']",
        divider &&
          "after:absolute after:top-1/2 after:right-0 after:h-6 after:w-px after:-translate-y-1/2 after:rounded-[1px] after:bg-[var(--table-divider)] after:content-['']",
        isControlType(type)
          ? "w-px text-center"
          : isRight
            ? "text-right"
            : "text-left",
        pinned.className,
        // Шапка всегда непрозрачно-белая: `bg-inherit` разрешился бы в
        // (прозрачный) `<tr>` и позволил бы прокручиваемым колонкам
        // проезжать под закреплённой или липкой ячейкой шапки.
        "bg-[var(--table-bg)]",
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          disabled={checkboxDisabled}
          onCheckedChange={onCheckedChange}
          aria-label="Выбрать все строки"
        />
      )}

      {/* `flex`, а не `inline-flex`: коробка строчного уровня осталась бы
          в строчном контексте форматирования ячейки таблицы и унаследовала
          бы «распорку» интерлиньяжа 20px от text-sm таблицы, из-за чего
          фактическая коробка значка 16px выросла бы до 20px независимо от
          объявленных отступов самой ячейки. `flex` делает её блочной, а на
          блочную распорка не действует. */}
      {type === "icon" && (
        <span className="flex text-[var(--table-fg)]" aria-hidden="true">
          {icon}
        </span>
      )}

      {type === "collapse" && collapseToggle}

      {type === "button" && menu && (
        <TableRowMenu menu={menu} label="Настроить таблицу" />
      )}

      {/* Filler is deliberately empty — "соответствующие ячейки строк не
          содержат общих названий или групповых действий" — it exists only to
          carry the header's divider and bottom rule over the pinned action
          column. */}

      {isSubtitle && (
        <span
          className={cn("flex items-center gap-2", isRight && "justify-end")}
        >
          {collapsible && collapseToggle}
          <TableHeadCellTitle
            icon={icon}
            sortable={canSort}
            sortDirection={sortDirection}
            onSortClick={onSortClick}
            alignRight={isRight}
          >
            {children}
          </TableHeadCellTitle>
        </span>
      )}

      {canResize && (
        // Сидит прямо на границе колонок, наполовину в каждом соседе,
        // чтобы курсор менялся сразу при касании линии. Зона захвата 9px:
        // сама линия шириной 1px, и в зону уже этой попасть по-настоящему
        // трудно.
        <span
          role="separator"
          aria-orientation="vertical"
          data-slot="table-resize-handle"
          onPointerDown={startResize}
          className="absolute inset-y-0 -right-[4.5px] z-10 w-[9px] cursor-col-resize touch-none select-none"
        />
      )}

      {pinned.divider}
    </th>
  )
})

export { TableHeadCell }
export type { TableHeadCellProps }
