import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import type { TagColor, TagVariant } from "@/components/ui/tag"

import {
  TableCellAction,
  type TableCellActionProps,
} from "./cell-action"
import {
  TableCellTag,
  TableCellValue,
  type TableSignTone,
  type TableValueTone,
} from "./cell-value"
import { TableCollapseToggle, collapseLabel } from "./collapse-toggle"
import {
  EDGE_PADDING_CLASS,
  NESTING_INDENT,
  cellPaddingXClass,
  cellPaddingYClass,
  isControlType,
} from "./geometry"
import { useComposedRefs } from "@/lib/compose-refs"
import { handleNumberCopy } from "./number-cell"
import type { TablePin } from "./pin"
import { usePinPresentation } from "./pin-presentation"
import type { TableCellType } from "./types"

interface TableCellProps
  extends Omit<React.ComponentProps<"td">, "children" | "onSelect">,
    TableCellActionProps {
  type?: TableCellType
  children?: React.ReactNode
  /** «Show Description» — приглушённая вторая строка под ячейками Text и
   * Number. */
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
  /** Цвет всего пояснения: серый Information по умолчанию либо статус
   * (Description Cell — Mint, Yellow, Red). */
  descriptionTone?: TableSignTone
  icon?: React.ReactNode
  tagColor?: TagColor
  /**
   * Вариант тега ячейки `tag`. Раньше `TableFieldTag.variant` считался в
   * модели, но до Tag не доходил — тег всегда рисовался вариантом по
   * умолчанию.
   */
  tagVariant?: TagVariant
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /**
   * Ячейка выбора без чекбокса: строку выбрать нельзя (`isRowSelectable`).
   * Колонка и её ширина остаются, а мёртвого чекбокса, который выглядит
   * рабочим и не нажимается, нет.
   */
  hideCheckbox?: boolean
  align?: "left" | "right"
  /** Nesting depth, 0-based: "С каждым уровнем вложенности контент
   * сдвигвается вправо на 16px". */
  level?: number
  /** Рисует шеврон сворачивания строки перед содержимым. На самом
   * глубоком уровне его опускают: макет оставляет отступ, но убирает контрол. */
  expandable?: boolean
  /**
   * Ячейка колонки иерархии: строка без вложенных (`expandable={false}`)
   * держит на месте шеврона пустую коробку той же ширины. Без неё лист
   * уезжал левее соседа с шевроном, а вложенный уровень оказывался левее
   * собственного родителя (аудит 17; пакет дизайнера,
   * 05-geometry-and-colors: «ур. 4 — кнопки нет, текст x 80»). В плоской
   * таблице не передаётся — там места под шеврон нет.
   */
  hierarchy?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Цвет значения ячеек Text и Number: приходящие деньги идут зелёным
   * цветом успеха кита («+31 922 980 133 515,05 ₽» в образце макета),
   * остальные варианты — Yellow, Red и приглушённый Grey (Value Cell). */
  tone?: TableValueTone
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
  /**
   * Первая ячейка строки — забирает поле строки (см. `ROW_EDGE_PADDING`):
   * левое поле 16 вместо 8. Правый край поля не получает: «правый закреп
   * дополнительных отступов не получает».
   */
  edge?: boolean
}

// forwardRef: на React 18 обычная функция молча теряет `ref`, хотя тип пропов
// (`ComponentProps<"td">`) его обещает.
const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
  function TableCell({
    className,
    type = "text",
    children,
    description,
    descriptionSign,
    descriptionSignTone,
    descriptionTone,
    icon,
    tagColor = "green",
    tagVariant,
    checked,
    onCheckedChange,
    hideCheckbox = false,
    actions,
    action,
    menu,
    align = "left",
    level = 0,
    expandable = false,
    hierarchy = false,
    expanded = true,
    onExpandedChange,
    tone = "default",
    unit,
    unitVariants,
    pin,
    edge = false,
    style,
    ...props
  }, forwardedRef) {
    const pinned = usePinPresentation<HTMLTableDataCellElement>(pin, false)
    const ref = useComposedRefs(pinned.ref, forwardedRef)
    const isRight = align === "right" || type === "number"

    const collapseToggle = (
      <TableCollapseToggle
        expanded={expanded}
        onExpandedChange={onExpandedChange}
        label={collapseLabel(expanded, "row")}
      />
    )
    const indent = level ? { paddingLeft: level * NESTING_INDENT } : undefined
    // Шеврон или, у строки без вложенных в колонке иерархии, пустая коробка
    // той же ширины (глиф 16px) — см. `hierarchy`.
    const toggleSlot = expandable ? (
      collapseToggle
    ) : hierarchy ? (
      <span aria-hidden="true" data-slot="table-collapse-spacer" className="size-4 shrink-0" />
    ) : null

    return (
      <td
        ref={ref}
        data-slot="table-cell"
        data-type={type}
        data-pin={pin}
        onCopy={type === "number" ? handleNumberCopy : undefined}
        style={{ ...style, ...pinned.style }}
        className={cn(
          cellPaddingYClass(type),
          cellPaddingXClass(
            pin,
            type === "button" || type === "checkbox" || type === "spacer"
          ),
          // Печатается ПОСЛЕ базовых полей: Tailwind сортирует `pl-*` после
          // `px-*`, поэтому одиночная сторона перебивает пару, а `pl-2` от
          // `pl-4` отличит уже `twMerge`.
          edge && EDGE_PADDING_CLASS,
          // Между строками данных линии нет. Проверено один в один на двух
          // независимых канонических рендерах: проход по пустой колонке
          // сверху вниз находит ровно две линии #DEDEDE — под верхом таблицы
          // и собственную линию шапки, — и ни одной между строками, которые
          // разделены только пустым местом. Прежний проход ставил разделитель
          // под каждой строкой.
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
        {type === "checkbox" && !hideCheckbox && (
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-label="Выбрать строку"
          />
        )}

        {/* См. примечание в шапке про `flex` против `inline-flex` и распорку
            интерлиньяжа 20px. */}
        {type === "icon" && (
          <span
            className="flex justify-center text-[var(--table-fg)]"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {type === "collapse" && (
          <span className="flex" style={indent}>
            {toggleSlot}
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
            {type === "text" && toggleSlot}
            <TableCellValue
              description={description}
              descriptionSign={descriptionSign}
              descriptionSignTone={descriptionSignTone}
              descriptionTone={descriptionTone}
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
          <TableCellTag color={tagColor} variant={tagVariant}>
            {children}
          </TableCellTag>
        )}

        {type === "button" && (
          <TableCellAction action={action} actions={actions} menu={menu} />
        )}

        {pinned.divider}
      </td>
    )
  }
)

export { TableCell }
export type { TableCellProps }
