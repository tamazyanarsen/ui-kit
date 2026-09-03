import * as React from "react"

import { Info } from "@/icons"
import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Tooltip } from "@/components/ui/tooltip"

// Шапка блока-виджета — фрейм `Top` компонент-сета плюс мобильный `Bottom`.
//
// Складывается из трёх вложенных сетов кита:
//   • `Block Element (ELK)` (70343:13388) — левый слот: Card / Checkbox /
//     Radio. Здесь это просто узел: перечисление в Figma говорит, ЧТО туда
//     кладут, а не заводит три варианта разметки;
//   • `Title Block (Default | Label, ELK)` (70343:13440 / 70343:13491) —
//     заголовок с подписью, значком и тегом. Свойство `Type` = Large Text /
//     Small Text, и это две ступени типографики, а не размер коробки;
//   • `Value Status (ELK)` — приписка справа от заголовка.
//
// ⚠️ Мобильная форма РЕСТРУКТУРИРУЕТСЯ, а не сжимается, поэтому ветка идёт
// через `useIsDesktop`, а не через `desktop:`:
//   1. приписка и кнопка уезжают из верхнего ряда в отдельный нижний ряд,
//      который на десктопе не существует вовсе, — а между ними стоит слот
//      содержимого, то есть CSS-порядком это не выражается;
//   2. подзаголовок уходит из строки заголовка на свою строку под ним.

/** `Type` сета `Title Block`: две ступени типографики заголовка. */
type BlockWidgetTitleType = "large" | "small"

const TITLE_CLASS: Record<BlockWidgetTitleType, string> = {
  // Large Text: H4 20/28 на десктопе, H4 Mobile 18/24 на мобиле.
  large: "text-h4-mobile desktop:text-h4",
  // Small Text: P1 16/24 на десктопе, P1 Mobile 14/20 на мобиле.
  small: "text-p2-medium desktop:text-p1-medium",
}

const DESCRIPTION_CLASS: Record<BlockWidgetTitleType, string> = {
  large: "text-p2-medium desktop:text-p1-medium",
  small: "text-p3-medium desktop:text-p2-medium",
}

// Собственный верхний отступ блока заголовка — он выравнивает первую строку
// по левому слоту, и у каждой ступени он свой (замер мастеров: Large на
// десктопе 0, Small 4; на мобиле 2 и 4).
const TITLE_BLOCK_PT: Record<BlockWidgetTitleType, string> = {
  large: "pt-0.5 desktop:pt-0",
  small: "pt-1",
}

interface BlockWidgetHeadProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  description?: React.ReactNode
  /** Тег статуса — инстанс `Tag` кита. */
  tag?: React.ReactNode
  /** Содержимое подсказки у значка `icon / information`. Нет — нет и значка. */
  info?: React.ReactNode
  /**
   * `Block Element` — левый слот: радиокнопка, чекбокс или мини-карта.
   * Есть только у типа `Default`: у `Label` его в сете нет вовсе.
   */
  leading?: React.ReactNode
  /**
   * Как ставить левый слот по вертикали. Управление (радио, чекбокс) кит
   * прижимает к верху и опускает на 2, мини-карту — центрирует по высоте
   * ряда (мастера 70343:13397 и 70343:13389).
   */
  leadingAlign?: "start" | "center"
  /** `Value Status (ELK)` — приписка справа. */
  status?: React.ReactNode
  /** Кнопка справа — инстанс `Button` кита размера `sm`. */
  action?: React.ReactNode
  titleType?: BlockWidgetTitleType
  /**
   * `Type=Label`: тег встаёт ПЕРЕД заголовком, а не после него. Отдельного
   * блока под это в ките нет — это тот же `Title Block`, только собранный
   * из другого сета (`Title Block (Label, ELK)`).
   */
  labelFirst?: boolean
}

function BlockWidgetHead({
  title,
  subtitle,
  description,
  tag,
  info,
  leading,
  leadingAlign = "start",
  status,
  action,
  titleType = "large",
  labelFirst = false,
  className,
  ...props
}: BlockWidgetHeadProps) {
  const isDesktop = useIsDesktop()

  const infoIcon = info ? (
    <Tooltip content={info}>
      <button
        type="button"
        aria-label="Информация"
        className="flex size-4 shrink-0 items-center justify-center text-[var(--block-widget-muted-fg)] outline-none focus-visible:focus-ring"
      >
        <Info aria-hidden="true" className="size-4" />
      </button>
    </Tooltip>
  ) : null

  const statusNode = status ? (
    <div
      data-slot="block-widget-status"
      className={cn(
        "flex shrink-0 items-start gap-2 text-p2-medium text-[var(--block-widget-muted-fg)]",
        // Приписка на десктопе стоит в верхнем ряду и опущена на 4, чтобы
        // сесть на строку заголовка; на мобиле она в нижнем ряду и тянется
        // по ширине, оттесняя кнопку вправо.
        isDesktop ? "py-1 desktop:text-p1-medium" : "min-w-0 flex-1"
      )}
    >
      {status}
    </div>
  ) : null

  const titleRow = (
    <div className="flex w-full items-center gap-2">
      {labelFirst && tag}
      <span
        className={cn(
          "min-w-0 truncate text-[var(--block-widget-title-fg)]",
          TITLE_CLASS[titleType],
          // На мобиле заголовок забирает свободное место: подзаголовок ушёл
          // на свою строку, и справа от него остаются только значок и тег.
          !isDesktop && "flex-1"
        )}
      >
        {title}
      </span>
      {isDesktop && subtitle && (
        <span
          className={cn(
            "min-w-0 truncate text-[var(--block-widget-muted-fg)]",
            TITLE_CLASS[titleType]
          )}
        >
          {subtitle}
        </span>
      )}
      {infoIcon}
      {!labelFirst && tag}
    </div>
  )

  const titleBlock = (
    <div
      data-slot="block-widget-title-block"
      className={cn(
        "flex min-w-0 flex-1 flex-col justify-end gap-1",
        TITLE_BLOCK_PT[titleType]
      )}
    >
      {titleRow}
      {!isDesktop && subtitle && (
        <span
          className={cn(
            "min-w-0 truncate text-[var(--block-widget-muted-fg)]",
            TITLE_CLASS[titleType]
          )}
        >
          {subtitle}
        </span>
      )}
      {description && (
        <p
          className={cn(
            "w-full break-words text-[var(--block-widget-muted-fg)]",
            DESCRIPTION_CLASS[titleType]
          )}
        >
          {description}
        </p>
      )}
    </div>
  )

  return (
    <>
      <div
        data-slot="block-widget-head"
        className={cn("flex w-full items-start gap-4", className)}
        {...props}
      >
        {leading && (
          <div
            data-slot="block-widget-leading"
            className={cn(
              "flex h-14 shrink-0 self-stretch",
              leadingAlign === "center"
                ? "flex-col justify-center"
                : // Опускание на 2 — только на десктопе: там строка
                  // заголовка 28, и без него управление сидит выше
                  // прописных. На мобильной строке 24 оно уже совпадает.
                  "items-start desktop:pt-0.5"
            )}
          >
            {leading}
          </div>
        )}
        {titleBlock}
        {isDesktop && statusNode}
        {isDesktop && action}
      </div>

      {/* Нижний ряд существует ТОЛЬКО на мобиле — на десктопе приписка и
          кнопка стоят в верхнем ряду. */}
      {!isDesktop && (statusNode || action) && (
        <div
          data-slot="block-widget-bottom"
          className="flex w-full items-center justify-end gap-4"
        >
          {statusNode}
          {action}
        </div>
      )}
    </>
  )
}

export { BlockWidgetHead }
export type { BlockWidgetHeadProps, BlockWidgetTitleType }
