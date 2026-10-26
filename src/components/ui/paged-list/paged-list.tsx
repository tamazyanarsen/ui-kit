import * as React from "react"

import { cn } from "@/lib/utils"
import { flattenChildren } from "@/lib/flatten-children"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { CarouselDots } from "@/components/ui/carousel-dots"

// PagedList — мобильный постраничный список. Правки UI-Kit от 25.10, пункт
// «Постраничный список и точки карусели»: короткий список-сводка («Дела»,
// «Счета») в мобильном виде не тянется длинным столбиком, а разбит на
// страницы по N строк.
//
//   • страницы листаются горизонтально НАТИВНОЙ прокруткой с шагом в
//     страницу: `scroll-snap-type: x mandatory`, у страницы
//     `scroll-snap-align: start` и `scroll-snap-stop: always` — лента идёт за
//     пальцем и трекпадом, один жест — одна страница; своих обработчиков
//     жестов нет; полосы прокрутки нет;
//   • страницы одной высоты: флекс-ряд тянет их по самой высокой, поэтому
//     блок не прыгает на неполной последней странице;
//   • под списком — точки карусели (CarouselDots): от списка до кругов 12,
//     от кругов до низа 16; нажатие на точку листает к своей странице;
//   • одна страница — ни ленты, ни точек;
//   • на десктопе — обычный список (`paged` по умолчанию = мобильный вид).

interface PagedListProps extends React.ComponentProps<"div"> {
  /** Строк на странице. */
  pageSize: number
  /**
   * Листать страницами. По умолчанию — в мобильном виде (уже 1280), на
   * десктопе обычный список.
   */
  paged?: boolean
  /** Подпись страницы для диктора. По умолчанию «Страница N из M». */
  getPageLabel?: (index: number, count: number) => string
}

const defaultPageLabel = (index: number, count: number) =>
  `Страница ${index + 1} из ${count}`

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

const PagedList = React.forwardRef<HTMLDivElement, PagedListProps>(
  function PagedList(
    {
      pageSize,
      paged,
      getPageLabel = defaultPageLabel,
      className,
      children,
      ...props
    },
    ref
  ) {
    const isDesktop = useIsDesktop()
    const pagedMode = paged ?? !isDesktop
    const trackRef = React.useRef<HTMLDivElement>(null)
    const [active, setActive] = React.useState(0)

    // С раскрытием фрагментов: `<>…</>` вокруг строк иначе считался бы
    // одной строкой.
    const rows = flattenChildren(children)
    const size = Math.max(1, Math.floor(pageSize) || 1)
    const pages: React.ReactNode[][] = []
    for (let start = 0; start < rows.length; start += size) {
      pages.push(rows.slice(start, start + size))
    }
    const pageCount = pages.length

    // Набор строк сократился — текущая страница могла пропасть.
    React.useEffect(() => {
      if (active > 0 && active >= pageCount) setActive(Math.max(0, pageCount - 1))
    }, [active, pageCount])

    const handleScroll = () => {
      const track = trackRef.current
      if (!track || track.clientWidth === 0) return
      const next = Math.round(track.scrollLeft / track.clientWidth)
      setActive(Math.min(pageCount - 1, Math.max(0, next)))
    }

    const goTo = (index: number) => {
      const track = trackRef.current
      if (!track) return
      setActive(index)
      track.scrollTo({
        left: index * track.clientWidth,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      })
    }

    if (!pagedMode || pageCount < 2) {
      return (
        <div
          ref={ref}
          data-slot="paged-list"
          data-paged="false"
          className={cn("flex flex-col", className)}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        data-slot="paged-list"
        data-paged="true"
        className={cn("flex flex-col", className)}
        {...props}
      >
        <div
          ref={trackRef}
          data-slot="paged-list-track"
          onScroll={handleScroll}
          className={cn(
            "flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {pages.map((page, index) => (
            <div
              key={index}
              data-slot="paged-list-page"
              role="group"
              aria-label={getPageLabel(index, pageCount)}
              className="flex w-full shrink-0 snap-start flex-col [scroll-snap-stop:always]"
            >
              {page}
            </div>
          ))}
        </div>
        <CarouselDots
          count={pageCount}
          active={active}
          onSelect={goTo}
          getDotLabel={getPageLabel}
          className="mt-3 mb-4"
        />
      </div>
    )
  }
)

export { PagedList }
export type { PagedListProps }
