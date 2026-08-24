import * as React from "react"

import { cn } from "@/lib/utils"
import { Tag, type TagColor } from "@/components/ui/tag"
import { Tooltip } from "@/components/ui/tooltip"

import {
  TableCellUnit,
  withTabularDigits,
} from "./number-cell"
import { useTruncated } from "./use-truncated"

/**
 * Значение ячейки Text/Number с необязательной подписью под ним.
 *
 * Подсказка ОДНА на всю ячейку, а не по одной на строку: макет вешает над
 * ячейкой единственный `ELK / tooltip & hint` и кладёт в него значение
 * первой строкой (Medium) и подпись второй (Regular) — см. node 70279:7012,
 * где подсказка читается «Длинный текст в ячейке / Длинное пояснение в
 * ячейке». Открывается, когда усечена ЛЮБАЯ из двух строк.
 */
function TableCellValue({
  children,
  description,
  alignRight,
  numeric,
  tone,
  unit,
  unitVariants,
}: {
  children?: React.ReactNode
  description?: React.ReactNode
  alignRight: boolean
  numeric: boolean
  tone: "default" | "positive"
  unit?: string
  unitVariants?: string[]
}) {
  const value = useTruncated<HTMLSpanElement>()
  const sub = useTruncated<HTMLSpanElement>()
  const truncated = value.truncated || sub.truncated

  return (
    <Tooltip
      content={
        description ? (
          <span className="flex flex-col gap-2">
            <span className="text-p3-medium">{children}</span>
            <span>{description}</span>
          </span>
        ) : (
          children
        )
      }
      disabled={!truncated}
    >
      <span
        className={cn("flex min-w-0 flex-col", alignRight && "items-end")}
        data-truncated={truncated || undefined}
      >
        <span
          ref={value.ref}
          className={cn(
            "truncate font-medium",
            // "Ячейка для финансовых показателей использует моноширинный
            // шрифт для всех символов, обеспечивая выравнивание чисел по
            // разрядам («запятая под запятой»)". Второе шрифтовое семейство
            // запрещено правилом проекта, а `tabular-nums` в Object Sans
            // ничего не даёт — фичи `tnum` в шрифте нет вовсе, и браузер
            // табличные цифры не синтезирует. Выравнивание даёт
            // `withTabularDigits`; правило оставлено на будущее, см. его
            // JSDoc.
            numeric && "tabular-nums",
            tone === "positive"
              ? "text-[var(--table-number-positive-fg)]"
              : "text-[var(--table-fg)]"
          )}
        >
          {numeric ? withTabularDigits(children) : children}
          <TableCellUnit
            unit={unit}
            unitVariants={unitVariants}
            hasValue={
              children !== undefined && children !== null && children !== ""
            }
          />
        </span>
        {/* Round-2 font-weight audit: confirmed Object Sans Regular against
            get_design_context (node 10623:48132), not a gap. */}
        {description && (
          <span
            ref={sub.ref}
            className={cn(
              "truncate text-p3-regular text-[var(--table-description-fg)]",
              numeric && "tabular-nums"
            )}
          >
            {description}
          </span>
        )}
      </span>
    </Tooltip>
  )
}

/**
 * Тег в ячейке. Сам `Tag` — `w-fit whitespace-nowrap` и вылез бы из узкой
 * колонки, поэтому макет кладёт его в обрезающую коробку (node 70279:7063 —
 * `overflow-clip w-[40px]`) и вешает на ячейку подсказку с полным статусом.
 * По спецификации самого `Tag` подсказки у него не бывает — эта принадлежит
 * ячейке, а не тегу.
 */
function TableCellTag({
  children,
  color,
}: {
  children?: React.ReactNode
  color: TagColor
}) {
  const tag = useTruncated<HTMLSpanElement>()

  return (
    <Tooltip content={children} disabled={!tag.truncated}>
      <span
        className="flex min-w-0 overflow-hidden"
        data-truncated={tag.truncated || undefined}
      >
        <Tag color={color} className="min-w-0">
          <span ref={tag.ref} className="truncate">
            {children}
          </span>
        </Tag>
      </span>
    </Tooltip>
  )
}

export { TableCellTag, TableCellValue }
