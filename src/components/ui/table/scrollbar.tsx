import * as React from "react"

import { cn } from "@/lib/utils"

// Собственная горизонтальная полоса прокрутки таблицы. В Figma её нет вовсе —
// собрана по трём требованиям, ни одно из которых нативная полоса выразить не
// может:
//
//  1. полоса идёт ТОЛЬКО по подвижной области и не заходит под закреплённые
//     блоки — нативная тянется на всю ширину прокручиваемого узла;
//  2. видна всё время, пока курсор в зоне таблицы, — иначе о самой
//     возможности прокрутить нечем догадаться (нативная показывается по
//     правилам ОС);
//  3. `sticky` прижимает её к низу вьюпорта, пока таблица уходит вниз за
//     экран, и отпускает на низ последней строки — нативная сидит у нижнего
//     края прокручиваемой области.
//
// Прижимается она не к кромке экрана, а к низу его СВОБОДНОЙ части:
// `--viewport-inset-bottom` — высота полос, прибитых к низу вьюпорта
// (`ButtonMenuBlack` 72, `ButtonMenu` 88), её публикует
// `useViewportInsetBottom`. Иначе полоса уходила бы под панель массовых
// действий, которая поднимается как раз при выборе строк.
//
// Своего перехода по `inset-block-end` здесь нет намеренно: пока панель едет,
// величина пересчитывается по её фактическому положению, и переход поверх
// этого добавил бы собственную задержку.

/** Бегунок не короче собственной высоты × 4, иначе на длинной таблице он
 * вырождается в точку и его нечем ухватить. */
const MIN_THUMB = 32

interface BarState {
  /** Ширина левого закрепа — на неё сдвинуто начало дорожки. */
  start: number
  /** Ширина правого закрепа — на неё укорочен конец дорожки. */
  end: number
  thumb: number
  offset: number
  scrollable: boolean
}

const EMPTY: BarState = {
  start: 0,
  end: 0,
  thumb: 0,
  offset: 0,
  scrollable: false,
}

/**
 * Считает геометрию полосы по прокручиваемому узлу таблицы.
 *
 * ⚠️ Доля бегунка считается по ПОДВИЖНОЙ области, а не по всей ширине блока.
 * Закреплённые колонки липкие: они сидят внутри прокручиваемого узла, то есть
 * входят и в `clientWidth`, и в `scrollWidth`, но не едут. Доля
 * `clientWidth / scrollWidth` из-за них всегда завышена — вычесть одно и то же
 * из числителя и знаменателя значит уменьшить дробь, — и бегунок выходит
 * заметно длиннее видимой части. Правило: бегунок/дорожка = видимая
 * часть/полная длина.
 */
function useScrollbar(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [bar, setBar] = React.useState<BarState>(EMPTY)

  const measure = React.useCallback(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    const track = trackRef.current

    // Ширины закрепов снимаются с ячеек ШАПКИ: в шапке присутствуют все
    // закреплённые колонки сразу, тогда как в отдельной строке правая ячейка
    // действий может отсутствовать.
    const head = scroll.querySelector("thead tr")
    let start = 0
    let end = 0
    if (head) {
      for (const cell of head.querySelectorAll('[data-pin="left"]')) {
        start += cell.getBoundingClientRect().width
      }
      for (const cell of head.querySelectorAll('[data-pin="right"]')) {
        end += cell.getBoundingClientRect().width
      }
    }

    const scrollable = scroll.scrollWidth - scroll.clientWidth > 1
    const trackWidth = track?.clientWidth ?? 0
    const frozen = start + end
    const viewport = Math.max(0, scroll.clientWidth - frozen)
    const content = Math.max(1, scroll.scrollWidth - frozen)
    const ratio = Math.min(1, viewport / content)
    const thumb = Math.min(
      trackWidth,
      Math.max(MIN_THUMB, Math.round(trackWidth * ratio))
    )
    const maxScroll = scroll.scrollWidth - scroll.clientWidth
    const progress = maxScroll > 0 ? scroll.scrollLeft / maxScroll : 0
    const offset = Math.round(progress * Math.max(0, trackWidth - thumb))

    // Сравнение перед записью: замер висит на событии прокрутки, и без него
    // каждый кадр создавал бы новый объект состояния впустую.
    setBar((prev) =>
      prev.start === start &&
      prev.end === end &&
      prev.thumb === thumb &&
      prev.offset === offset &&
      prev.scrollable === scrollable
        ? prev
        : { start, end, thumb, offset, scrollable }
    )
  }, [scrollRef])

  React.useLayoutEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    measure()

    scroll.addEventListener("scroll", measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(scroll)
    // Ширина колонок меняет `scrollWidth`, но не размер контейнера — саму
    // таблицу наблюдаем отдельно.
    const table = scroll.firstElementChild
    if (table) observer.observe(table)
    // ⚠️ И дорожку тоже: её ширина зависит от полей, которые считает этот же
    // замер. Без второго прохода бегунок остаётся посчитанным по полной
    // ширине блока, то есть длиннее, чем нужно.
    if (trackRef.current) observer.observe(trackRef.current)

    return () => {
      scroll.removeEventListener("scroll", measure)
      observer.disconnect()
    }
    // `bar.scrollable` в зависимостях: дорожка появляется в DOM только когда
    // прокручивать есть что, и наблюдать её раньше этого момента нечего.
  }, [measure, scrollRef, bar.scrollable])

  // Object Sans грузится асинхронно и меняет ширины текста. Замер, сделанный
  // один раз на маунте, фиксирует раскладку на fallback-метриках — то есть
  // «переполнения нет» там, где оно есть.
  React.useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) measure()
    })
    return () => {
      alive = false
    }
  }, [measure])

  return { bar, trackRef, measure }
}

interface TableScrollbarProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

function TableScrollbar({ scrollRef }: TableScrollbarProps) {
  const { bar, trackRef } = useScrollbar(scrollRef)
  const drag = React.useRef<{
    startX: number
    startScroll: number
    ratio: number
  } | null>(null)
  const [dragging, setDragging] = React.useState(false)

  if (!bar.scrollable) return null

  const onThumbPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const scroll = scrollRef.current
    const track = trackRef.current
    if (!scroll || !track) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const maxScroll = scroll.scrollWidth - scroll.clientWidth
    const maxOffset = Math.max(1, track.clientWidth - bar.thumb)
    drag.current = {
      startX: event.clientX,
      startScroll: scroll.scrollLeft,
      ratio: maxScroll / maxOffset,
    }
    setDragging(true)
  }

  const onThumbPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const current = drag.current
    const scroll = scrollRef.current
    if (!current || !scroll) return
    scroll.scrollLeft =
      current.startScroll + (event.clientX - current.startX) * current.ratio
  }

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return
    const target = event.currentTarget
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
    }
    drag.current = null
    setDragging(false)
  }

  // Клик мимо бегунка — прыжок на экран в его сторону, как у нативной полосы.
  // ⚠️ Шаг — экран ПОДВИЖНОЙ области (за вычетом закрепов), а не полная ширина
  // блока: иначе прыжок перелетал бы на ширину закреплённых колонок.
  const onTrackPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const scroll = scrollRef.current
    const track = trackRef.current
    if (!scroll || !track || event.target !== track) return
    const point = event.clientX - track.getBoundingClientRect().left
    const direction = point < bar.offset ? -1 : 1
    const page = Math.max(1, scroll.clientWidth - bar.start - bar.end)
    scroll.scrollBy({ left: direction * page, behavior: "smooth" })
  }

  return (
    <div
      data-slot="table-scrollbar"
      data-dragging={dragging || undefined}
      aria-hidden="true"
      className={cn(
        // Полоса НАКРЫВАЕТ низ последней строки, а не занимает своё место в
        // потоке: отрицательный отступ гасит её вклад в высоту блока.
        "sticky z-[2] mt-[calc(var(--table-scrollbar-size)*-1)] h-[var(--table-scrollbar-size)]",
        "bottom-[var(--viewport-inset-bottom)]",
        // Ловит указатель только дорожка: остальная ширина не должна
        // перехватывать клики по строке под ней.
        "pointer-events-none opacity-0 transition-opacity duration-150 ease-out",
        // Видна, пока курсор в зоне таблицы. Во время перетаскивания курсор
        // может уйти за её пределы — там правило без ховера.
        "group-hover/table:opacity-100 data-[dragging]:opacity-100"
      )}
    >
      <div
        ref={trackRef}
        data-slot="table-scrollbar-track"
        style={{ marginInlineStart: bar.start, marginInlineEnd: bar.end }}
        onPointerDown={onTrackPointerDown}
        className="pointer-events-auto relative h-full cursor-pointer"
      >
        <div
          data-slot="table-scrollbar-thumb"
          style={{
            width: bar.thumb,
            transform: `translateX(${bar.offset}px)`,
          }}
          onPointerDown={onThumbPointerDown}
          onPointerMove={onThumbPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          // Перетаскивание бегунка — прямое манипулирование, оно НЕ
          // анимируется: позиция обязана идти за курсором пиксель в пиксель.
          // Анимируется только цвет.
          className={cn(
            "absolute inset-y-0 left-0 touch-none rounded-[calc(var(--table-scrollbar-size)/2)] transition-colors duration-150",
            dragging
              ? "bg-[var(--table-scrollbar-thumb-hover)]"
              : "bg-[var(--table-scrollbar-thumb)] hover:bg-[var(--table-scrollbar-thumb-hover)]"
          )}
        />
      </div>
    </div>
  )
}

export { TableScrollbar, MIN_THUMB }
