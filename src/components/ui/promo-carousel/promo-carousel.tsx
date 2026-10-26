import * as React from "react"

import { ArrowBackChevron, ArrowNextChevron } from "@/icons"

import { cn } from "@/lib/utils"
import { flattenChildren } from "@/lib/flatten-children"
import { inertProps } from "@/lib/inert"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"
import { CarouselDots } from "@/components/ui/carousel-dots"

import { loopSlides, useLoopTrack } from "./use-loop-track"

// PromoCarousel — карусель баннеров витрины предложений (PromoBanner или
// любые свои карточки). Правки UI-Kit от 25.10, пункт «Карусель баннеров в
// мобильном виде» и правило каркаса «Механики свайпов в мобильном виде».
//
// Устройство одно на обоих видах: общая обёртка со скруглением на ширину
// колонки, внутри листается зацикленная лента (`useLoopTrack`: нативная
// прокрутка со scroll-snap, копии крайних баннеров по краям, перескок на
// настоящий на остановке). Меняются число баннеров в кадре и управление:
//
//   • десктоп — два баннера в кадре, зазор 24, стрелки по краям, видны при
//     наведении на карусель (и на своём фокусе — иначе с клавиатуры их не
//     найти);
//   • мобильный вид (уже 1280) — один баннер на всю ширину обёртки, зазор при
//     листании 16, соседние не выглядывают; стрелок нет, листание пальцем;
//     под обёрткой точки (CarouselDots): от низа баннера до кругов 12;
//     нажатие на точку — к своему баннеру кратчайшим путём по кругу;
//   • листать нечего (баннеров не больше, чем в кадре) — без копий, стрелок
//     и точек.
//
// ⚠️ Документ формулирует последнее как «один-два баннера — без клонов,
// свайпа и точек», но поясняет «листать нечего». Это верно для десктопа (два
// в кадре); в мобильном виде второй из двух баннеров иначе было бы не
// увидеть, поэтому там два баннера листаются, как и больше.

interface PromoCarouselProps extends React.ComponentProps<"div"> {
  /** Баннеров в кадре на десктопе. В мобильном виде всегда один. */
  desktopPerView?: number
  /** Подпись ленты для диктора. */
  "aria-label"?: string
}

const PromoCarousel = React.forwardRef<HTMLDivElement, PromoCarouselProps>(
  function PromoCarousel(
    {
      desktopPerView = 2,
      className,
      children,
      "aria-label": ariaLabel = "Предложения",
      ...props
    },
    ref
  ) {
    const isDesktop = useIsDesktop()
    // С раскрытием фрагментов: `<>…</>` вокруг баннеров иначе считался бы
    // одним слайдом.
    const items = flattenChildren(children)
    const count = items.length
    const perView = isDesktop ? Math.max(1, Math.floor(desktopPerView)) : 1
    const trackRef = React.useRef<HTMLDivElement>(null)
    const { index, clones, goTo, next, prev, onScroll } = useLoopTrack(trackRef, {
      count,
      perView,
    })
    const scrollable = count > perView
    const slides = loopSlides(items, clones)

    if (count === 0) return null

    // Ширина слота: кадр делится на `perView` баннеров с зазорами между ними.
    const gap = isDesktop ? 24 : 16
    const slotWidth =
      perView === 1 ? "100%" : `calc((100% - ${(perView - 1) * gap}px) / ${perView})`

    return (
      <div
        ref={ref}
        data-slot="promo-carousel"
        data-scrollable={scrollable || undefined}
        role="region"
        aria-roledescription="карусель"
        aria-label={ariaLabel}
        className={cn("group/promo flex w-full min-w-0 flex-col", className)}
        {...props}
      >
        <div className="relative overflow-hidden rounded-[16px] desktop:rounded-[24px]">
          <div
            ref={trackRef}
            data-slot="promo-carousel-track"
            onScroll={onScroll}
            className={cn(
              "relative flex w-full gap-4 desktop:gap-6",
              scrollable
                ? "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : "overflow-hidden"
            )}
          >
            {slides.map((slide) => (
              <div
                key={slide.key}
                data-slot="promo-carousel-slide"
                data-clone={slide.clone || undefined}
                aria-hidden={slide.clone || undefined}
                {...inertProps(slide.clone)}
                style={{ width: slotWidth }}
                className="flex shrink-0 snap-start [scroll-snap-stop:always] [&>*]:flex-1"
              >
                {slide.item}
              </div>
            ))}
          </div>
          {isDesktop && scrollable && (
            <>
              <CarouselArrow side="prev" onClick={prev} />
              <CarouselArrow side="next" onClick={next} />
            </>
          )}
        </div>
        {!isDesktop && scrollable && (
          <CarouselDots
            count={count}
            active={index}
            onSelect={goTo}
            aria-label="Баннеры"
            getDotLabel={(i, total) => `Баннер ${i + 1} из ${total}`}
            className="mt-3"
          />
        )}
      </div>
    )
  }
)

function CarouselArrow({
  side,
  onClick,
}: {
  side: "prev" | "next"
  onClick: () => void
}) {
  // Прозрачность и место — на обёртке: свой `transition-*` на самой кнопке
  // вытеснил бы (через twMerge) её переход цвета и нажатия.
  return (
    <span
      data-slot="promo-carousel-arrow"
      data-side={side}
      className={cn(
        "absolute top-1/2 z-[2] flex -translate-y-1/2 opacity-0 transition-opacity duration-[var(--duration-color)] ease-[var(--ease-color)]",
        "group-hover/promo:opacity-100 focus-within:opacity-100",
        side === "prev" ? "left-4" : "right-4"
      )}
    >
      <Button
        variant="secondary-white"
        size="sm"
        icon={side === "prev" ? ArrowBackChevron : ArrowNextChevron}
        iconPosition="only"
        aria-label={side === "prev" ? "Предыдущий баннер" : "Следующий баннер"}
        onClick={onClick}
      />
    </span>
  )
}

export { PromoCarousel }
export type { PromoCarouselProps }
