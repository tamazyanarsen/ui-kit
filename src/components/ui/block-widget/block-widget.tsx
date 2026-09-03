import * as React from "react"

import { cn } from "@/lib/utils"
import { Divider } from "@/components/ui/divider"

// BlockWidget — «блок-виджет»: карточка с шапкой и слотом содержимого,
// из которой собираются виджеты дашборда.
//
// В Figma это ДВА компонент-сета, а не одно свойство:
//   • `ELK / block-widget (solid)` (70343:13144) — заливка Grey 106,
//     свойства Size / State (Default, Hover) / Type;
//   • `ELK / block-widget (border)` (70343:13300) — обводка Grey 134,
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

/** Узлы, нажатие по которым НЕ считается нажатием на сам блок. */
const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "label",
  "[role='checkbox']",
  "[role='radio']",
  "[role='button']",
  "[role='menuitem']",
].join(", ")

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

function BlockWidget({
  variant = "solid",
  type = "default",
  onClick,
  className,
  children,
  ...props
}: BlockWidgetProps) {
  const interactive = variant === "solid" && Boolean(onClick)

  /**
   * Нажатие пришло по вложенному управлению (кнопка, чекбокс, ссылка)?
   *
   * ⚠️ Найденный узел обязательно сверяется с самим блоком: кликабельный
   * блок и сам получает `role="button"`, поэтому `closest` от любой точки
   * внутри него находит ЕГО — и без этой проверки блок не срабатывал
   * никогда.
   */
  function fromNestedControl(event: { target: EventTarget | null; currentTarget: EventTarget }) {
    const hit = (event.target as Element | null)?.closest(INTERACTIVE_SELECTOR)
    return Boolean(hit) && hit !== event.currentTarget
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!interactive) return
    // Внутри блока живут своя кнопка и своё управление — нажатие по ним это
    // не нажатие по блоку. Тот же приём, что у строки таблицы.
    if (fromNestedControl(event)) return
    onClick?.()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return
    if (event.key !== "Enter" && event.key !== " ") return
    if (fromNestedControl(event)) return
    event.preventDefault()
    onClick?.()
  }

  return (
    <div
      data-slot="block-widget"
      data-variant={variant}
      data-type={type}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
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
      {...props}
    >
      {type === "double" ? <DoubleLayout>{children}</DoubleLayout> : children}
    </div>
  )
}

/**
 * Дети списком, с раскрытием фрагментов.
 *
 * ⚠️ `React.Children.toArray` фрагмент НЕ раскрывает — он считает его одним
 * ребёнком. А `<>…</>` вокруг колонок вызывающий код пишет естественно (без
 * него не собрать условную разметку), и тогда ни одна колонка не находится:
 * блок молча рисуется в один столбец. Ровно это и случилось при сборке.
 */
function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) &&
    child.type === React.Fragment
      ? flattenChildren(child.props.children)
      : [child]
  )
}

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
function BlockWidgetColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="block-widget-column"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-start gap-2 desktop:gap-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Слот содержимого — фреймы `Slot 1` / `Slot 2` / `Slot 3` сета.
 *
 * Собственной высоты у него нет: в мастерах она стоит (152 и 120 у слота
 * содержимого, 64 у нижнего), но это высота ЗАГЛУШКИ, а не правило —
 * настоящий виджет растёт от того, что в него положили. Слоты в сете
 * выключаемые (`Show Conteiner` / `Show Bottom Container`), то есть в коде
 * это просто «не рендерить».
 */
function BlockWidgetSlot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="block-widget-slot"
      className={cn("w-full min-w-0", className)}
      {...props}
    />
  )
}

export { BlockWidget, BlockWidgetColumn, BlockWidgetSlot }
export type { BlockWidgetProps, BlockWidgetType, BlockWidgetVariant }
