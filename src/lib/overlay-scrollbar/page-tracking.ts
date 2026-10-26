/**
 * Кто и когда прокручивался последним — для правила передачи колеса
 * (`wheel-handoff.ts`): «страница двигалась в последние 250 мс».
 *
 * Событие scroll не всплывает, поэтому слушатель один на документ, в фазе
 * захвата; он ставится при первом обращении и больше не снимается (дёшев и
 * общий для всех блоков).
 */

const lastScroll = new WeakMap<object, number>()
let installed = false

function pageElement(): Element {
  return document.scrollingElement ?? document.documentElement
}

function install() {
  if (installed || typeof document === "undefined") return
  installed = true
  document.addEventListener(
    "scroll",
    (event) => {
      const target = event.target === document ? pageElement() : event.target
      if (target) lastScroll.set(target, Date.now())
    },
    { capture: true, passive: true }
  )
}

/** Когда `element` прокручивался последний раз (−∞, если не было). */
export function lastScrollOf(element: Element): number {
  install()
  return lastScroll.get(element) ?? -Infinity
}

function isPage(element: Element) {
  return element === pageElement() || element === document.documentElement || element === document.body
}

/**
 * «Страница» для блока — ближайший прокручиваемый по вертикали предок
 * (тело модалки, панель) или сам документ.
 */
export function findScrollParent(area: Element): Element {
  install()
  for (let node = area.parentElement; node; node = node.parentElement) {
    if (isPage(node)) break
    const { overflowY } = getComputedStyle(node)
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight - node.clientHeight > 1) {
      return node
    }
  }
  return pageElement()
}

/** Прокрутить «страницу» на `delta` по вертикали. */
export function scrollElementBy(element: Element, delta: number) {
  if (isPage(element)) window.scrollBy(0, delta)
  else element.scrollTop += delta
}
