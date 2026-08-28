import * as React from "react"

import { cn } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { Scrollbar } from "@/components/ui/scrollbar"

import { CARD_BOX_MAX_HEIGHT, type CardBoxType } from "./variants"

// CardBox — «Блок» (`ELK / card-box`, node 70333:11271): белая карточка со
// скруглением 16px, в которую страница укладывает свои секции. Три типа из
// макета (свойство Type) отличаются только раскладкой заголовка и отступами
// контента:
//
// - `large`  — «Стандартный блок (Large)»: заголовок и контент лежат в одной
//   колонке с общим padding. Desktop 32px, Mobile 16px (и padding, и зазор
//   между секциями).
// - `small`  — «Стандартный блок (Small)»: заголовок вынесен в отдельную
//   непрозрачную шапку, контент прокручивается ПОД ней. «Блок имеет
//   ограничение по высоте в 792 px. Если контент превышает доступную область,
//   то часть контента скрывается за границами блока и отображается скролл.
//   При скроллировании контент уходит под блок заголовка». Ограничение по
//   высоте и скролл-обвязка — только на десктопе: у `Size=Mobile, Type=Small`
//   (node 70333:11283) в мастере нет ни скроллбара, ни разделителей.
// - `table`  — «Блок для таблиц (Table)»: шапка с padding 16px в обеих
//   формах, слот во всю ширину без внутренних отступов (строки таблицы
//   должны доходить до краёв), `overflow-hidden` подрезает их по радиусу.
//
// Заголовок во всех типах — H3 Medium (24/32 desktop, 18/24 mobile).
interface CardBoxProps {
  type?: CardBoxType
  title?: React.ReactNode
  /**
   * Свойство `Show Title` мастера. По умолчанию заголовок рисуется, если
   * `title` передан; `false` убирает шапку целиком (вместе с её
   * разделителем у типа `small`).
   */
  showTitle?: boolean
  /**
   * Свойство `Show Scrollbar` мастера — признак «контент не поместился»:
   * разделители под шапкой и над нижней кромкой. Только для `type="small"`.
   * По умолчанию (`undefined`) вычисляется сам по положению прокрутки, как
   * у ModalBody: сверху разделитель появляется, только когда уже прокрутили,
   * снизу — пока не домотали до конца. `true`/`false` форсируют вид (нужно
   * для матрицы состояний, где скролла нет).
   */
  showScrollbar?: boolean
  /**
   * Ограничение высоты для `type="small"`, по умолчанию 792px из макета.
   * Применяется только в десктопной форме.
   */
  maxHeight?: number | string
  /** Классы на прокручиваемую область (`small`) или на слот контента. */
  contentClassName?: string
  children?: React.ReactNode
  className?: string
}

// Общий корень: белая заливка + радиус 16px во всех типах и формах.
const ROOT = "w-full rounded-[16px] bg-[var(--card-box-bg)]"
const TITLE = "text-h3-mobile text-[var(--card-box-title-fg)] desktop:text-h3"

function CardBox({
  type = "large",
  title,
  showTitle,
  showScrollbar,
  maxHeight = CARD_BOX_MAX_HEIGHT,
  contentClassName,
  children,
  className,
}: CardBoxProps) {
  const withTitle = (showTitle ?? title != null) && title != null

  if (type === "large") {
    return (
      <section
        data-slot="card-box"
        data-type={type}
        className={cn(ROOT, "flex flex-col gap-4 p-4 desktop:gap-8 desktop:p-8", className)}
      >
        {withTitle && <h2 className={TITLE}>{title}</h2>}
        {children}
      </section>
    )
  }

  if (type === "table") {
    return (
      <section
        data-slot="card-box"
        data-type={type}
        className={cn(ROOT, "flex flex-col overflow-hidden", className)}
      >
        {/* padding 16px в обеих формах — в отличие от `small`, шапка
            табличного блока на десктопе не увеличивается. */}
        {withTitle && (
          <div className="shrink-0 p-4">
            <h2 className={TITLE}>{title}</h2>
          </div>
        )}
        <div className={cn("min-w-0", contentClassName)}>{children}</div>
      </section>
    )
  }

  return (
    <CardBoxSmall
      title={withTitle ? title : undefined}
      showScrollbar={showScrollbar}
      maxHeight={maxHeight}
      contentClassName={contentClassName}
      className={className}
    >
      {children}
    </CardBoxSmall>
  )
}

function CardBoxSmall({
  title,
  showScrollbar,
  maxHeight,
  contentClassName,
  children,
  className,
}: Pick<
  CardBoxProps,
  "title" | "showScrollbar" | "maxHeight" | "contentClassName" | "children" | "className"
>) {
  const { ref, scrolledFromTop, scrolledToEnd, update } =
    useScrollEdges<HTMLDivElement>([children])

  const topDivider = showScrollbar ?? scrolledFromTop
  const bottomDivider = showScrollbar ?? !scrolledToEnd

  return (
    <section
      data-slot="card-box"
      data-type="small"
      style={
        {
          "--card-box-max-h":
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        } as React.CSSProperties
      }
      className={cn(
        ROOT,
        "relative isolate flex flex-col overflow-hidden desktop:max-h-(--card-box-max-h)",
        className
      )}
    >
      {title != null && (
        // z-index + собственная заливка: контент прокручивается ПОД шапкой,
        // поэтому шапка обязана быть непрозрачной и лежать выше слота.
        <div className="relative z-[2] shrink-0 bg-[var(--card-box-bg)] p-4 desktop:p-8">
          <h2 className={TITLE}>{title}</h2>
          {/* Линия рисуется абсолютом, а не border-bottom: в макете шапка
              ровно 96px, а разделитель лежит ПОВЕРХ её последнего пикселя
              (nodes 70333:11276/11281) — border добавил бы 97-й. */}
          {topDivider && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 hidden h-px bg-[var(--card-box-divider)] desktop:block"
            />
          )}
        </div>
      )}

      {/* Внешняя обёртка отодвигает саму полосу прокрутки на 8px от края
          карточки (в макете скроллбар стоит `right: 8px`), а внутренние
          отступы догоняют контент до 32/16px от края. Вертикальный отступ
          полосы (8px сверху и снизу) нативным скроллбаром не выражается —
          он всегда во всю высоту области прокрутки. */}
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col desktop:pr-2">
        <Scrollbar
          ref={ref}
          onScroll={update}
          className={cn(
            "min-h-0 flex-1 px-4 pb-4 desktop:pr-6 desktop:pb-8 desktop:pl-8",
            contentClassName
          )}
        >
          {children}
        </Scrollbar>
      </div>

      {/* «Bottom» (node 70333:11279) — непрозрачная полоса высотой в нижний
          отступ блока: контент уходит под неё, а разделитель над ней
          показывает, что прокрутка ещё не домотана. На мобайле её нет. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden h-8 border-t border-transparent bg-[var(--card-box-bg)] desktop:block",
          bottomDivider && "border-t-[var(--card-box-divider)]"
        )}
      />
    </section>
  )
}

export { CardBox }
export type { CardBoxProps }
