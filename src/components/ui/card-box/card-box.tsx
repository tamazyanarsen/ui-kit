import * as React from "react"

import { cn } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { hasNode } from "@/lib/has-node"
import { Scrollbar } from "@/components/ui/scrollbar"

import { CARD_BOX_MAX_HEIGHT, type CardBoxType } from "./variants"

// CardBox — «Блок» (`ELK / card-box`): белая карточка со
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
//   в мастере нет ни скроллбара, ни разделителей.
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
   *
   * Сторону разделителя решает ПОЛОЖЕНИЕ прокрутки, а не этот проп: сверху
   * он появляется, только когда уже прокрутили, снизу — пока не домотали до
   * конца (дизайн-чек от 07.09, замечание 6 — правило корневое). Проп умеет
   * ровно одно: `false` гасит оба разделителя. `true` и `undefined`
   * равнозначны.
   */
  showScrollbar?: boolean
  /**
   * Ограничение высоты для `type="small"`, по умолчанию 792px из макета.
   * Применяется только в десктопной форме.
   */
  maxHeight?: number | string
  /**
   * Низ области прокрутки у `type="small"`.
   *
   *   • `divider` (по умолчанию) — прежний низ макета: непрозрачная полоса
   *     в нижний отступ блока и разделитель над ней, пока не домотано;
   *   • `fade` — белый фейд высотой 96 поверх содержимого (Правки UI-Kit от
   *     25.10, «Блок с внутренней прокруткой — фейд у нижней кромки»):
   *     прежний Tint 32 ложился на нижнее поле списка и почти не читался.
   *     Указатель не ловит; докручено до конца или всё помещается — гаснет
   *     (`opacity` 200 мс `ease`), прокрутили обратно — появляется. Признак
   *     конца пересчитывается при прокрутке и при смене размеров области и
   *     содержимого.
   */
  bottom?: "divider" | "fade"
  /** Классы на прокручиваемую область (`small`) или на слот контента. */
  contentClassName?: string
  children?: React.ReactNode
  className?: string
}

// Общий корень: белая заливка + радиус 16px во всех типах и формах.
const ROOT = "w-full rounded-[16px] bg-[var(--card-box-bg)]"
const TITLE = "text-h3-adaptive [overflow-wrap:anywhere] text-[var(--card-box-title-fg)]"

function CardBox({
  type = "large",
  title,
  showTitle,
  showScrollbar,
  maxHeight = CARD_BOX_MAX_HEIGHT,
  bottom = "divider",
  contentClassName,
  children,
  className,
}: CardBoxProps) {
  // Пустой заголовок (`false` из условной разметки, `""`) — это «без
  // заголовка»: иначе рисовалась пустая шапка, а верхний отступ контента,
  // рассчитанный на её отсутствие, не применялся.
  const hasTitle = hasNode(title)
  const withTitle = (showTitle ?? hasTitle) && hasTitle

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
        // `overflow-clip`, а не `hidden`: подрезает строки по радиусу так
        // же, но не создаёт области прокрутки — иначе липкая нижняя полоса
        // таблицы считалась бы от блока, а не от вьюпорта (дизайн-чек от
        // 07.09, замечание 32; то же самое сделано у песочного блока).
        className={cn(ROOT, "flex flex-col overflow-clip", className)}
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
      bottom={bottom}
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
  bottom,
  contentClassName,
  children,
  className,
}: Pick<
  CardBoxProps,
  | "title"
  | "showScrollbar"
  | "maxHeight"
  | "bottom"
  | "contentClassName"
  | "children"
  | "className"
>) {
  const { ref, scrolledFromTop, scrolledToEnd, update } =
    useScrollEdges<HTMLDivElement>()

  // ⚠️ Положение прокрутки решает ВСЕГДА, а `showScrollbar` может только
  // погасить оба разделителя.
  //
  // Дизайн-чек от 07.09, замечание 6: «При достижении края со стороны края
  // не должен быть виден серый разделитель. Правило КОРНЕВОЕ, применить ко
  // всем компонентам». Раньше здесь стояло `showScrollbar ?? положение`, то
  // есть переданный `true` включал ОБА разделителя разом — и верхний
  // светился у области, прокрученной в самый верх. ModalBody и Notification
  // считают то же самое только по положению, так что расходился с правилом
  // ровно этот компонент.
  const overflowing = showScrollbar !== false
  const topDivider = overflowing && scrolledFromTop
  const bottomDivider = overflowing && !scrolledToEnd

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
              — border добавил бы 97-й. */}
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
          отступы догоняют контент до 32/16px от края.

          Правки UI-Kit от 25.10 («Scrollbar — родные полосы браузера вместо
          полос кита»): полоса наложенная и места не занимает, поэтому поле
          справа считается без её ширины — 8 (обёртка) + 24 = 32, как слева;
          раньше при переполнении выходило 36. Дорожка — 8 от верха области
          и 32 от низа (`--ovs-start` / `--ovs-end`). Полоса блока видна при
          наведении и во время прокрутки, у края блок передаёт колесо
          странице (`visibility="hover"`, «Scrollbar — видимость полосы и
          передача прокрутки странице»). */}
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col desktop:pr-2">
        <Scrollbar
          ref={ref}
          onScroll={update}
          visibility="hover"
          className={cn(
            "min-h-0 flex-1 px-4 pb-4 desktop:pr-6 desktop:pb-8 desktop:pl-8",
            "desktop:[--ovs-start:8px] desktop:[--ovs-end:32px]",
            // Верхний отступ обычно даёт шапка (`p-4 desktop:p-8`). Без неё
            // контент упирался в верхний край карточки при 16/32 слева и снизу.
            title == null && "pt-4 desktop:pt-8",
            contentClassName
          )}
        >
          {children}
        </Scrollbar>
      </div>

      {bottom === "fade" ? (
        // Фейд 96 поверх содержимого: белый блока → прозрачный. Гаснет в
        // конце прокрутки и когда всё помещается (`scrolledToEnd` считает
        // и то и другое, `useScrollEdges` следит за размерами области и
        // содержимого). Не зависит от `showScrollbar`: тот про разделители.
        <div
          aria-hidden="true"
          data-slot="card-box-fade"
          data-end={scrolledToEnd || undefined}
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-24 rounded-b-[inherit] bg-linear-to-t from-(--card-box-bg) to-transparent transition-opacity duration-200 ease-[ease]",
            scrolledToEnd && "opacity-0"
          )}
        />
      ) : (
        // «Bottom» — непрозрачная полоса высотой в нижний отступ блока:
        // контент уходит под неё, а разделитель над ней показывает, что
        // прокрутка ещё не домотана. На мобайле её нет.
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden h-8 border-t border-transparent bg-[var(--card-box-bg)] desktop:block",
            bottomDivider && "border-t-[var(--card-box-divider)]"
          )}
        />
      )}
    </section>
  )
}

export { CardBox }
export type { CardBoxProps }
