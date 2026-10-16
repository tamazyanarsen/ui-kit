import * as React from "react"

/** Ближайший прокручиваемый предок или `null`, если прокручивается окно. */
function getScrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return node
    }
    node = node.parentElement
  }
  return null
}

/**
 * Прилипла ли полоса к верху прокрутки — то есть экран уже проскроллен, а
 * полоса держится у верхнего края.
 *
 * Макет («Использование в макете», 70482:6679): «При скроллировании экрана
 * кнопка „Назад“ меняет форму на круг с иконкой, а компонент фиксируется в
 * верхней части экрана». Над полосой обычно стоит шапка, которая уезжает
 * вместе с контентом, поэтому одного `scrollTop > 0` мало: форма должна
 * смениться в момент, когда полоса дошла до края и прилипла, а не на первом
 * пикселе прокрутки.
 *
 * Слушается ближайший прокручиваемый предок (в витринах и микрофронтах это
 * часто не окно), а если его нет — окно.
 */
function useScrolled(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!enabled || !el) {
      setScrolled(false)
      return
    }
    const parent = getScrollParent(el)
    const target: HTMLElement | Window = parent ?? window

    const check = () => {
      const scrollTop = parent ? parent.scrollTop : window.scrollY
      const edge = parent ? parent.getBoundingClientRect().top : 0
      const stickyTop = parseFloat(getComputedStyle(el).top) || 0
      // +0.5px — запас на субпиксельное положение прилипшей полосы.
      const stuck = el.getBoundingClientRect().top <= edge + stickyTop + 0.5
      setScrolled(scrollTop > 0 && stuck)
    }

    check()
    target.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    return () => {
      target.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [ref, enabled])

  return scrolled
}

export { useScrolled }
