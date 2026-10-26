import * as React from "react"

import { cn } from "@/lib/utils"

// CarouselDots — точки карусели (индикатор страниц) под листаемыми лентами:
// постраничный список (PagedList), карусель промо-баннеров (PromoCarousel),
// «Проекты». Правки UI-Kit от 25.10, пункт «Постраничный список и точки
// карусели»: вид — по образцу Pagination Dots (SB) из Ui-kit | Web Site,
// свой компонент в ДС ЕЛК появится позже, вид и смысл не изменятся.
//
//   • ячейки вплотную: на десктопе 16 в ширину и круг 8 (между кругами 8),
//     в мобильном виде 12 и круг 6 (между кругами 6);
//   • все круги одного размера, состояние — только цветом: обычная Grey 166,
//     наведение Grey 284 (только мышь), текущая и нажатая Grey 1514, смена
//     цвета 200 мс `ease`;
//   • зона нажатия — 24 по высоте; у текущей `aria-current`;
//   • одна страница — точек нет.
//
// ⚠️ В раскладке ряд занимает ровно высоту КРУГА (8 / 6), а зона нажатия 24
// выносится псевдоэлементом за коробку. Так отступы «от списка до кругов 12,
// от кругов до низа блока 16» у потребителя — обычные `mt-3` / `pb-4`, без
// поправок на пустое поле ячейки.

interface CarouselDotsProps
  extends Omit<React.ComponentProps<"div">, "onSelect" | "children"> {
  /** Число страниц. Меньше двух — ничего не рисуется. */
  count: number
  /** Текущая страница, с нуля. */
  active: number
  /** Нажатие на точку — листать к своей странице. Не задан — точки только показывают. */
  onSelect?: (index: number) => void
  /** Подпись точки для диктора. По умолчанию «Страница N из M». */
  getDotLabel?: (index: number, count: number) => string
}

const defaultDotLabel = (index: number, count: number) =>
  `Страница ${index + 1} из ${count}`

const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  function CarouselDots(
    {
      count,
      active,
      onSelect,
      getDotLabel = defaultDotLabel,
      className,
      "aria-label": ariaLabel = "Страницы",
      ...props
    },
    ref
  ) {
    if (!Number.isFinite(count) || count < 2) return null

    return (
      <div
        ref={ref}
        data-slot="carousel-dots"
        role="group"
        aria-label={ariaLabel}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        {Array.from({ length: Math.floor(count) }, (_, index) => {
          const current = index === active
          return (
            <button
              key={index}
              type="button"
              data-slot="carousel-dot"
              data-current={current || undefined}
              aria-label={getDotLabel(index, count)}
              aria-current={current || undefined}
              tabIndex={onSelect ? undefined : -1}
              onClick={onSelect ? () => onSelect(index) : undefined}
              className={cn(
                "group/dot relative flex h-1.5 w-3 shrink-0 items-center justify-center outline-none desktop:h-2 desktop:w-4",
                // Зона нажатия 24 по высоте и во всю ширину ячейки.
                "before:absolute before:inset-x-0 before:top-1/2 before:h-6 before:-translate-y-1/2 before:content-['']",
                onSelect ? "cursor-pointer" : "pointer-events-none"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-[var(--duration-color)] ease-[var(--ease-color)] desktop:size-2",
                  "group-focus-visible/dot:focus-ring",
                  current
                    ? "bg-[var(--carousel-dots-fg-current)]"
                    : cn(
                        "bg-[var(--carousel-dots-fg)]",
                        "[@media(hover:hover)_and_(pointer:fine)]:group-hover/dot:bg-[var(--carousel-dots-fg-hover)]",
                        "group-active/dot:bg-[var(--carousel-dots-fg-current)]"
                      )
                )}
              />
            </button>
          )
        })}
      </div>
    )
  }
)

export { CarouselDots }
export type { CarouselDotsProps }
