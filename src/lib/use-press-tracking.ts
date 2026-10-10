import * as React from "react"

/**
 * Помечает нажатый элемент атрибутом `data-pressing`, пока палец/кнопка мыши
 * не отпущены.
 *
 * Зачем, если есть `:active`: триггеры Base UI (меню, Select) открывают
 * всплывашку на `mousedown` и гасят его действие по умолчанию — в Chrome
 * вместе с ним пропадает и `:active`. Кнопка «Ещё», кнопки-триггеры Dropdown
 * и Selection Button на зажатие не отвечали вовсе (дизайн-чек 08.10,
 * замечание 8). Атрибут ставится по `pointerdown` в фазе ПЕРЕХВАТА на
 * документе — раньше любого обработчика компонента, — так что ему
 * `preventDefault` не помеха.
 *
 * Слушатели одни на документ и ставятся один раз; метятся только узлы с утилитами
 * `press-scale`/`press-scale-content` (см. styles/motion.css — они читают
 * атрибут наравне с `:active`).
 */
const PRESS_SELECTOR = ".press-scale, .press-scale-content"

let installed = false
let pressed: Element | null = null

function release() {
  pressed?.removeAttribute("data-pressing")
  pressed = null
}

function install() {
  if (installed || typeof document === "undefined") return
  installed = true
  document.addEventListener(
    "pointerdown",
    (event) => {
      // Только основная кнопка мыши и касание/перо; правый щелчок — нет.
      if (event.button !== 0) return
      release()
      const target = event.target instanceof Element ? event.target : null
      const hit = target?.closest(PRESS_SELECTOR)
      if (!hit) return
      pressed = hit
      hit.setAttribute("data-pressing", "")
    },
    true
  )
  for (const type of ["pointerup", "pointercancel", "dragstart"] as const) {
    document.addEventListener(type, release, true)
  }
  window.addEventListener("blur", release)
}

// Ставится уже при импорте модуля (его тянет Button, то есть любой экран
// кита), а хук — страховка для узлов, отрисованных раньше первого импорта.
install()

function usePressTracking() {
  React.useEffect(install, [])
}

export { usePressTracking }
