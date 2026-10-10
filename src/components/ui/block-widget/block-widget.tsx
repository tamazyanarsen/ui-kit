import * as React from "react"

import { cn } from "@/lib/utils"
import { flattenChildren } from "@/lib/flatten-children"
import { pressHandlers } from "@/lib/press"
import { PressTarget } from "@/lib/press-target"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Divider } from "@/components/ui/divider"

import { BlockWidgetTitleContext, useBlockWidgetTitles } from "./title-context"

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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  id,
  className,
  children,
  ...props
}, forwardedRef) {
  const interactive = variant === "solid" && Boolean(onClick)

  // Внутри блока живут своя кнопка и своё управление — нажатие по ним это
  // не нажатие по блоку. Тот же приём, что у строки таблицы.
  const press = pressHandlers<HTMLDivElement>(interactive ? onClick : undefined)

  // Клавиатурный и экранный вход в кликабельный блок — кнопка-подложка
  // (`PressTarget`), а не `role="button"` на корне: у роли `button` дети
  // «презентационные», и вложенные «Действие», флажок и радио скринридер
  // складывал в имя блока (ревью 10.10, п. 25). Имя подложки — заголовок
  // первой шапки блока либо `aria-label`/`aria-labelledby` потребителя.
  // `onKeyDown` потребителя по-прежнему видит Enter/Space (событие
  // всплывает от подложки), и его `preventDefault()` отменяет нажатие.
  const [titleId, registerTitle] = useBlockWidgetTitles()
  // Ни шапки, ни своего имени (блок с произвольным содержимым) — имя
  // подложки собирается из текста всего блока, как у прежней роли `button`.
  const ownId = React.useId()
  const rootId = id ?? ownId

  return (
    <div
      data-slot="block-widget"
      data-variant={variant}
      data-type={type}
      id={interactive ? rootId : id}
      onClick={press.onClick}
      aria-label={interactive ? undefined : ariaLabel}
      aria-labelledby={interactive ? undefined : ariaLabelledBy}
      className={cn(
        "group/block-widget flex w-full flex-col items-center gap-2 rounded-[12px] p-4 desktop:gap-4 desktop:p-6",
        variant === "solid"
          ? "bg-[var(--block-widget-bg)]"
          : // `box-border` явно: у обводки 1px входит в габарит блока, а не
            // прибавляется к нему — иначе сплошной и обведённый варианты
            // разъезжаются на 2px по ширине там, где стоят рядом.
            "box-border border border-[var(--block-widget-border)]",
        interactive &&
          "relative cursor-pointer transition-colors hover:bg-[var(--block-widget-bg-hover)]",
        // OnClick (Active) серого блока — Grey 124 (дизайн-чек от 08.10,
        // замечание 28). Только у сплошного: обведённый блок не серый.
        interactive &&
          variant === "solid" &&
          "active:bg-[var(--block-widget-bg-active)]",
        className
      )}
      ref={forwardedRef}
      {...props}
    >
      {interactive && onClick && (
        <PressTarget
          onPress={onClick}
          label={ariaLabel}
          labelledBy={ariaLabelledBy ?? (ariaLabel ? undefined : (titleId ?? rootId))}
        />
      )}
      <BlockWidgetTitleContext.Provider value={registerTitle}>
        {type === "double" ? <DoubleLayout>{children}</DoubleLayout> : children}
      </BlockWidgetTitleContext.Provider>
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
  const isDesktop = useIsDesktop()
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
        // Мобильный `Double` (мастер): колонки ДРУГ ПОД ДРУГОМ, между ними
        // горизонтальная линия, зазор 8; на десктопе — в ряд через
        // вертикальную.
        className="flex w-full flex-col gap-2 desktop:flex-row desktop:items-center desktop:gap-4"
      >
        {/* Ключ — ключ самой колонки (его выдал разбор детей), а не
            позиция: иначе, когда первая колонка исчезала, вторая
            перемонтировалась и теряла введённый текст и фокус. */}
        {columns.map((column, index) => (
          <React.Fragment
            key={React.isValidElement(column) && column.key != null ? column.key : index}
          >
            {index > 0 && (
              <Divider orientation={isDesktop ? "vertical" : "horizontal"} />
            )}
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
        // Зазор 16 и на мобиле: в мастере `Container` и `Box` мобильного
        // Double идут с зазором 16 (заголовок, кнопка, слот).
        "flex min-w-0 flex-col items-start gap-4 desktop:flex-1",
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
