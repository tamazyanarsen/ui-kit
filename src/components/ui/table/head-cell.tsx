import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import { TableCollapseToggle, collapseLabel } from "./collapse-toggle"
import {
  hasColumnDivider,
  headCellPaddingXClass,
  headCellPaddingYClass,
  isControlType,
} from "./geometry"
import { TableHeadCellTitle } from "./head-cell-title"
import type { TablePin } from "./pin"
import { usePinPresentation } from "./pin-presentation"
import { TableRowMenu } from "./row-menu"
import type { TableHeadCellType } from "./types"
import { useColumnResize } from "./use-column-resize"

interface TableHeadCellProps
  extends Omit<React.ComponentProps<"th">, "children" | "onSelect"> {
  type?: TableHeadCellType
  children?: React.ReactNode
  /** "Show Sort" — renders the ⇅ toggle next to Subtitle Left/Right text. */
  sortable?: boolean
  /**
   * Which way this column is currently sorted. Set it (i.e. non-`null`) and
   * the cell renders the spec's Active state: dark title text plus the
   * matching chevron of the sort icon darkened. `null` is Default/Hover.
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
  /** "Show Icon" — an optional leading icon before Subtitle text. */
  icon?: React.ReactNode
  checked?: boolean
  indeterminate?: boolean
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
   * Collapse-all control ("Сворачивание/разворачивание всех строк"). Chevron
   * down = everything collapsed to the first level, up = fully expanded.
   *
   * The spec bars this column from the other two header affordances: "в
   * таблицах со сворачиванием/разворачиванием не предусмотрена
   * пользовательская сортировка — она невозможна без нарушения
   * вложенностей", and "он также не может менять ширину столбца,
   * идентифицирующего иерархию. Его ширина опредяется в момент
   * проектирования". So `sortable` and `resizable` are ignored here rather
   * than silently rendering controls the design forbids.
   */
  collapsible?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Drag the right border to resize the column ("при наведении на правую
   * границу ячейки курсор меняется на вертикальную черту с двунаправленной
   * стрелкой"). Checkbox and Collapse columns are excluded by the spec. */
  resizable?: boolean
  /** Column width in px. Uncontrolled when only `defaultWidth` is given. */
  width?: number
  defaultWidth?: number
  onWidthChange?: (width: number) => void
  /** "Минимальная ширина столбцов — 48px." */
  minWidth?: number
  pin?: TablePin
}

function TableHeadCell({
  className,
  type = "subtitle-left",
  children,
  sortable = false,
  sortDirection = null,
  onSortClick,
  icon,
  checked,
  indeterminate,
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
  style,
  ...props
}: TableHeadCellProps) {
  const isSubtitle = type === "subtitle-left" || type === "subtitle-right"
  const isRight = type === "subtitle-right"

  // The hierarchy column is neither sortable nor resizable — see the
  // `collapsible` prop docs for the two spec lines that rule both out.
  const canSort = sortable && !collapsible
  const canResize = resizable && !collapsible

  const { resolvedWidth, startResize } = useColumnResize({
    type,
    width,
    defaultWidth,
    onWidthChange,
    minWidth,
  })
  const pinned = usePinPresentation<HTMLTableHeaderCellElement>(pin, true)
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
      ref={pinned.ref}
      data-slot="table-head-cell"
      data-type={type}
      data-pin={pin}
      scope="col"
      style={{ ...style, ...pinned.style, width: resolvedWidth }}
      className={cn(
        headCellPaddingYClass(type),
        headCellPaddingXClass(type, pin, divider),
        "font-medium",
        // The header's bottom rule is drawn per cell (`border-b` on
        // `ELK / table-title-cell`) so it stays put under sticky cells — but
        // as a pseudo-element, not a real border. Figma strokes frames on the
        // *inside*, so the rule lives within the cell's 48px rather than
        // adding a 49th pixel: measured on the canonical renders (the header
        // rule is the last pixel row of the 48px header in both node
        // 70279:10368 and node 70279:7390).
        "relative before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-[var(--table-divider)] before:content-['']",
        divider &&
          "after:absolute after:top-1/2 after:right-0 after:h-6 after:w-px after:-translate-y-1/2 after:rounded-[1px] after:bg-[var(--table-divider)] after:content-['']",
        isControlType(type)
          ? "w-px text-center"
          : isRight
            ? "text-right"
            : "text-left",
        pinned.className,
        // The header is always opaque white — `bg-inherit` would resolve to
        // the (transparent) `<tr>` and let the scrolling columns slide under
        // a pinned or sticky header cell.
        "bg-[var(--table-bg)]",
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
          aria-label="Выбрать все строки"
        />
      )}

      {/* `flex`, not `inline-flex` — an inline-level box here would stay in
          the table cell's inline formatting context and inherit a 20px
          line-height "strut" from the table's text-sm, forcing the 16px
          icon's effective box up to 20px regardless of the cell's own
          declared padding. `flex` makes it a block box, which isn't subject
          to the strut. */}
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
        // Sits on the column border itself, half in each neighbour, so the
        // cursor flips as soon as it touches the line. 9px of grab zone: the
        // line is 1px and a zone narrower than this is genuinely hard to hit.
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
}

export { TableHeadCell }
export type { TableHeadCellProps }
