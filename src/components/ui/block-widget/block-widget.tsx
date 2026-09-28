import * as React from "react"

import { cn } from "@/lib/utils"
import { flattenChildren } from "@/lib/flatten-children"
import { pressHandlers } from "@/lib/press"
import { Divider } from "@/components/ui/divider"

// BlockWidget — «блок-виджет»: карточка с шапкой и слотом содержимого,
// из которой собираются виджеты дашборда.
//
// В Figma это ДВА компонент-сета, а не одно свойство:
//   • `ELK / block-widget (solid)` — заливка Grey 106,
//     свойства Size / State (Default, Hover) / Type;
//   • `ELK / block-widget (border)` — обводка Grey 134,
//     свойства Size / Type, состояния Hover НЕТ.
// Оба Version 1.0.0, Release 67.32.
//
// Разделение осмысленное, и оно же — правило: **сплошной блок умеет быть
// кликабельным, обводка не умеет никогда**. Поэтому здесь это одно свойство
// `variant` плюс запрет на `onClick` у обводки, а не два компонента: коробка,
// отступы, радиус и вся начинка у них совпадают до пикселя.
//
// Геометрия (замер мастеров):
//
//   |                 | Desktop | Mobile |
//   |-----------------|---------|--------|
//   | поле            | 24      | 16     |
//   | зазор рядов     | 16      | 8      |
//   | радиус          | 12      | 12     |
//
// Свойство `Type` — три раскладки шапки:
//   • `Default` — левый слот (радио/чекбокс/карта) + заголовок;
//   • `Label`   — без левого слота, тег переезжает ПЕРЕД заголовком;
//   • `Double`  — две колонки, разделённые ВЕРТИКАЛЬНЫМ разделителем, и
//     общий нижний слот под ними.
// Первые два — это `<BlockWidgetHead>` с разными пропами, третий —
// `<BlockWidgetColumn>` внутри `<BlockWidget type="double">`.

type BlockWidgetVariant = "solid" | "border"
type BlockWidgetType = "default" | "label" | "double"

interface BlockWidgetProps
  extends Omit<React.ComponentProps<"div">, "onClick"> {
  variant?: BlockWidgetVariant
  type?: BlockWidgetType
  /**
   * Нажатие на весь блок. Задано — блок получает состояние наведения,
   * кольцо фокуса и обход клавиатурой.
   *
   * ⚠️ У `variant="border"` игнорируется: состояния `Hover` у сета обводки
   * нет вовсе, то есть кликабельной обводка в ките не бывает. Молча рисовать
   * ей ховер значило бы выдумать состояние, которого в макете нет.
   */
  onClick?: () => void
}

const BlockWidget = React.forwardRef<HTMLDivElement, BlockWidgetProps>(function BlockWidget({
  variant = "solid",
  type = "default",
  onClick,
  onKeyDown,
  role,
  tabIndex,
  className,
  children,
  ...props
}, ref) {
  const interactive = variant === "solid" && Boolean(onClick)

  // Внутри блока живут своя кнопка и своё управление — нажатие по ним это
  // не нажатие по блоку. Тот же приём, что у строки таблицы.
  const press = pressHandlers<HTMLDivElement>(interactive ? onClick : undefined)

  return (
    <div
      data-slot="block-widget"
      data-variant={variant}
      data-type={type}
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      onClick={press.onClick}
      // Свой `onKeyDown` потребителя (аналитика, горячие клавиши) раньше
      // разворачивался из `props` поверх внутреннего и отключал Enter/Space:
      // кликабельный блок переставал нажиматься с клавиатуры. Теперь оба
      // вызываются, а `preventDefault()` потребителя отменяет нажатие.
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) press.onKeyDown?.(event)
      }}
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-[12px] p-4 desktop:gap-4 desktop:p-6",
        variant === "solid"
          ? "bg-[var(--block-widget-bg)]"
          : // `box-border` явно: у обводки 1px входит в габарит блока, а не
            // прибавляется к нему — иначе сплошной и обведённый варианты
            // разъезжаются на 2px по ширине там, где стоят рядом.
            "box-border border border-[var(--block-widget-border)]",
        interactive &&
          "cursor-pointer outline-none transition-colors hover:bg-[var(--block-widget-bg-hover)] focus-visible:focus-ring",
        className
      )}
      ref={ref}
      {...props}
    >
      {type === "double" ? <DoubleLayout>{children}</DoubleLayout> : children}
    </div>
  )
})

/**
 * Раскладка типа `Double`: колонки в ряд через вертикальный разделитель,
 * всё остальное (общий нижний слот) — под ними во всю ширину.
 *
 * Разделитель — инстанс `ELK / divider` кита, а не своя линия: правило
 * «везде, где в макете виден серый разделитель — это он» действует и здесь,
 * и вертикальную ориентацию он уже умеет.
 */
function DoubleLayout({ children }: { children?: React.ReactNode }) {
  const items = flattenChildren(children)
  const columns = items.filter(
    (child) => React.isValidElement(child) && child.type === BlockWidgetColumn
  )
  const rest = items.filter(
    (child) => !(React.isValidElement(child) && child.type === BlockWidgetColumn)
  )

  return (
    <>
      <div
        data-slot="block-widget-columns"
        className="flex w-full items-center gap-4"
      >
        {columns.map((column, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider orientation="vertical" />}
            {column}
          </React.Fragment>
        ))}
      </div>
      {rest}
    </>
  )
}

/** Колонка типа `Double` — фрейм `Container` сета. */
const BlockWidgetColumn = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function BlockWidgetColumn({ className, ...props }, ref) {
  return (
    <div
      data-slot="block-widget-column"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-start gap-2 desktop:gap-4",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

/**
 * Слот содержимого — фреймы `Slot 1` / `Slot 2` / `Slot 3` сета.
 *
 * Собственной высоты у него нет: в мастерах она стоит (152 и 120 у слота
 * содержимого, 64 у нижнего), но это высота ЗАГЛУШКИ, а не правило —
 * настоящий виджет растёт от того, что в него положили. Слоты в сете
 * выключаемые (`Show Conteiner` / `Show Bottom Container`), то есть в коде
 * это просто «не рендерить».
 */
const BlockWidgetSlot = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function BlockWidgetSlot({ className, ...props }, ref) {
  return (
    <div
      data-slot="block-widget-slot"
      className={cn("w-full min-w-0", className)}
      ref={ref}
      {...props}
    />
  )
})

export { BlockWidget, BlockWidgetColumn, BlockWidgetSlot }
export type { BlockWidgetProps, BlockWidgetType, BlockWidgetVariant }
