import * as React from "react"
import { ChevronLeft, ChevronRight } from "@/icons"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

// Стрелки ленты «Сводки» (`TableTopDetails`) и передача фокуса при их
// исчезновении. Вынесены из table-top.tsx, чтобы он укладывался в предел
// строк: поведение не менялось.

// Один шеврон в конце полосы.
//
// ⚠️ Это НЕ своя плашка, а инстанс кнопки кита: в сете под стрелкой
// лежит `ELK / button` — белый круг
// 32 × 32, радиус 16, поле 8, глиф 16. Свёрстанная по замеру пикселя
// «таблетка» совпала бы по картинке и разошлась бы по состояниям, фокусу и
// поведению в темах. Правило общее: прежде чем верстать вложенный узел,
// проверьте, не инстанс ли это компонента кита.
//
// Стрелка ЛЕЖИТ НА ленте у кромки, а не встаёт рядом с ней: иначе её
// появление съедало бы ширину ленты и пересчитывало переполнение по кругу.
// Текст под стрелкой поэтому обрезан — так же, как в сете.
const DetailsArrow = React.forwardRef<
  HTMLButtonElement,
  {
    direction: "left" | "right"
    onClick: () => void
    onFocus: () => void
    onBlur: () => void
  }
>(function DetailsArrow({ direction, onClick, onFocus, onBlur }, ref) {
  return (
    <Button
      ref={ref}
      onFocus={onFocus}
      onBlur={onBlur}
      variant="secondary-white"
      size="sm"
      icon={direction === "left" ? ChevronLeft : ChevronRight}
      iconPosition="only"
      data-slot="table-top-details-arrow"
      data-direction={direction}
      aria-label={
        direction === "left" ? "Прокрутить сводку назад" : "Прокрутить сводку вперёд"
      }
      onClick={onClick}
      className={cn(
        // `motion-safe`: `prefers-reduced-motion` гасит и плавную прокрутку
        // ленты (см. scrollToNeighbour), и проявление самой стрелки.
        // Центровка без translate: у Button на :active стоит `translate-y-px`, и
        // обе утилиты пишут в одну переменную --tw-translate-y, так что стрелка
        // при нажатии мыши прыгала на 17px из-под курсора и щелчок пропадал.
        "absolute inset-y-0 z-10 my-auto motion-safe:animate-in motion-safe:fade-in",
        // Дизайн-чек «Storybook 3», замечание 1: «скорректировать отступ
        // кнопки до края элемента, поправить и правую, и левую». Обе стрелки
        // стояли вплотную к кромке ленты (`left-0`/`right-0`) — замер по
        // скриншоту чека это подтвердил (левая на 835 при кромке 832, правая
        // на 1800 при кромке 1804 в пикселях снимка). Отступ — китовые 8.
        direction === "left" ? "left-2" : "right-2"
      )}
    />
  )
})

type ArrowDirection = "left" | "right"

function useArrowFocusHandoff(
  trackRef: React.RefObject<HTMLDivElement>,
  scrolledFromStart: boolean,
  scrolledFromEnd: boolean
) {
  const leftArrowRef = React.useRef<HTMLButtonElement>(null)
  const rightArrowRef = React.useRef<HTMLButtonElement>(null)
  const focusedArrow = React.useRef<ArrowDirection | null>(null)

  // ⚠️ Стрелка исчезает, когда лента дошла до края, — и если листали с
  // клавиатуры, фокус был на ней: снятая кнопка роняла его на `<body>`, и
  // пользователь оказывался в начале документа. Фокус переходит на обратную
  // стрелку (дошли до конца — назад листать уже есть куда), а если её нет —
  // на саму ленту. `blur` на снятом узле React не присылает, поэтому
  // отметка о фокусе переживает размонтирование.
  React.useLayoutEffect(() => {
    const lost =
      (focusedArrow.current === "right" && !scrolledFromEnd) ||
      (focusedArrow.current === "left" && !scrolledFromStart)
    if (!lost) return
    const fallback =
      focusedArrow.current === "right" ? leftArrowRef.current : rightArrowRef.current
    focusedArrow.current = null
    const track = trackRef.current
    if (fallback) {
      fallback.focus()
    } else if (track) {
      // `tabindex` ставится только на этот перенос и снимается с уходом
      // фокуса: постоянный `-1` вывел бы ленту из порядка Tab, а Chrome сам
      // делает прокручиваемую область без фокусируемых детей доступной с
      // клавиатуры.
      if (!track.hasAttribute("tabindex")) {
        track.setAttribute("tabindex", "-1")
        track.addEventListener("blur", () => track.removeAttribute("tabindex"), {
          once: true,
        })
      }
      track.focus()
    }
  }, [trackRef, scrolledFromStart, scrolledFromEnd])

  return { leftArrowRef, rightArrowRef, focusedArrow }
}

export { DetailsArrow, useArrowFocusHandoff }
