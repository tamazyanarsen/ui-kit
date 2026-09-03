import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import type { TagColor } from "@/components/ui/tag"

import {
  TableCellAction,
  type TableCellActionProps,
} from "./cell-action"
import { TableCellTag, TableCellValue, type TableSignTone } from "./cell-value"
import { TableCollapseToggle, collapseLabel } from "./collapse-toggle"
import {
  NESTING_INDENT,
  cellPaddingXClass,
  cellPaddingYClass,
  isControlType,
} from "./geometry"
import { handleNumberCopy } from "./number-cell"
import type { TablePin } from "./pin"
import { usePinPresentation } from "./pin-presentation"
import type { TableCellType } from "./types"

interface TableCellProps
  extends Omit<React.ComponentProps<"td">, "children" | "onSelect">,
    TableCellActionProps {
  type?: TableCellType
  children?: React.ReactNode
  /** "Show Description" — a muted second line under Text/Number cells. */
  description?: React.ReactNode
  /**
   * Знак ПЕРЕД пояснением — стрелка дельты, «+», «−» и т.п.
   *
   * Отдельно от `description` ровно потому, что цвет у них разный: цветным
   * должен быть только знак, а не весь комментарий. «↑ 12 % к прошлому
   * месяцу» — статус несёт стрелка, остальное служебный текст.
   */
  descriptionSign?: React.ReactNode
  /** Статусный цвет знака. По умолчанию — цвет самого пояснения. */
  descriptionSignTone?: TableSignTone
  icon?: React.ReactNode
  tagColor?: TagColor
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  align?: "left" | "right"
  /** Nesting depth, 0-based: "С каждым уровнем вложенности контент
   * сдвигвается вправо на 16px". */
  level?: number
  /** Renders the row's collapse chevron before the content. Omit it on the
   * deepest level — the spec keeps the indent but drops the control. */
  expandable?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Colours a Number cell's value: incoming money is the kit's success
   * green ("+31 922 980 133 515,05 ₽" in the spec's own sample). */
  tone?: "default" | "positive"
  /**
   * Знак после значения: `₽`, `$`, `%`, `шт.` Стоит **в ячейке через
   * неразрывный пробел после числа**, а не в заголовке столбца: в одной
   * колонке значения бывают в разных единицах, и заголовок «Сумма, ₽» это
   * выразить не может. Заголовок остаётся чистым — «Сумма».
   *
   * Пустая строка — «у этого значения знака нет», но место под него
   * сохраняется (см. `unitVariants`), и разряды не разъезжаются.
   */
  unit?: string
  /**
   * Все знаки, встречающиеся в КОЛОНКЕ. Когда их больше одного, слот знака
   * резервирует ширину по самому широкому: невидимые двойники лежат в той же
   * клетке грида, что и видимый, и растягивают её по фактической ширине
   * глифов. Иначе строка с «шт.» сдвинула бы своё число влево относительно
   * строки с «₽» и «запятая под запятой» сломалась бы.
   *
   * ⚠️ Считать ширину в `ch` здесь нельзя: «₽» и «$» одной длины, но разной
   * ширины. Заполняет вызывающая сторона — ячейка своей колонки не видит.
   */
  unitVariants?: string[]
  pin?: TablePin
}

function TableCell({
  className,
  type = "text",
  children,
  description,
  descriptionSign,
  descriptionSignTone,
  icon,
  tagColor = "green",
  checked,
  onCheckedChange,
  actions,
  action,
  menu,
  align = "left",
  level = 0,
  expandable = false,
  expanded = true,
  onExpandedChange,
  tone = "default",
  unit,
  unitVariants,
  pin,
  style,
  ...props
}: TableCellProps) {
  const pinned = usePinPresentation<HTMLTableDataCellElement>(pin, false)
  const isRight = align === "right" || type === "number"

  const collapseToggle = (
    <TableCollapseToggle
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      label={collapseLabel(expanded, "row")}
    />
  )
  const indent = level ? { paddingLeft: level * NESTING_INDENT } : undefined

  return (
    <td
      ref={pinned.ref}
      data-slot="table-cell"
      data-type={type}
      data-pin={pin}
      onCopy={type === "number" ? handleNumberCopy : undefined}
      style={{ ...style, ...pinned.style }}
      className={cn(
        cellPaddingYClass(type),
        cellPaddingXClass(pin, type === "button" || type === "checkbox"),
        // No rule between data rows. Verified at 1:1 against two independent
        // canonical renders (nodes 70279:7390 and 70279:10368): scanning an
        // empty column top-to-bottom finds exactly two #DEDEDE lines — the
        // one under the table top and the header's own — and none between
        // rows, which are separated by whitespace alone. An earlier pass had
        // put a divider under every row.
        isControlType(type)
          ? "w-px text-center"
          : isRight
            ? "text-right"
            : "text-left",
        pinned.className,
        // ⚠️ Заливка строки идёт ВО ВСЮ ширину, включая правый закреп с
        // действиями: закреплённая ячейка — часть строки и наследует её Line
        // Fill. Непрозрачность закрепу при этом нужна всегда, иначе на
        // прокрутке сквозь него просвечивают подвижные ячейки, — её и даёт
        // `inherit` от непрозрачной строки.
        //
        // Заход в обратную сторону (правый закреп держит белый, как нарисован
        // на макете множественного выбора) откачен: у кнопки `Secondary
        // (White)` ховер и нажатие — Grey 114 / Grey 124, то есть РОВНО цвета
        // заливки строки, и кнопка исчезала ровно в момент наведения на неё.
        // Читаемость на залитой строке даёт сама кнопка — она остаётся белой
        // (правило в styles/base.css), а не подложка под ней.
        pin ? "bg-inherit" : undefined,
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label="Выбрать строку"
        />
      )}

      {/* See the header's note on `flex` vs `inline-flex` and the 20px
          line-height strut. */}
      {type === "icon" && (
        <span className="flex text-[var(--table-fg)]" aria-hidden="true">
          {icon}
        </span>
      )}

      {type === "collapse" && (
        <span className="flex" style={indent}>
          {expandable && collapseToggle}
        </span>
      )}

      {(type === "text" || type === "number") && (
        <span
          className={cn(
            "flex min-w-0 items-center gap-2",
            isRight && "justify-end"
          )}
          style={type === "text" ? indent : undefined}
        >
          {expandable && type === "text" && collapseToggle}
          <TableCellValue
            description={description}
            descriptionSign={descriptionSign}
            descriptionSignTone={descriptionSignTone}
            alignRight={isRight}
            numeric={type === "number"}
            tone={tone}
            unit={unit}
            unitVariants={unitVariants}
          >
            {children}
          </TableCellValue>
        </span>
      )}

      {type === "tag" && (
        <TableCellTag color={tagColor}>{children}</TableCellTag>
      )}

      {type === "button" && (
        <TableCellAction action={action} actions={actions} menu={menu} />
      )}

      {pinned.divider}
    </td>
  )
}

export { TableCell }
export type { TableCellProps }
