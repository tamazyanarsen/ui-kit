import * as React from "react"

import { sharedRegistry } from "@/lib/shared-registry"

// Нижняя кромка шапки страницы в координатах вьюпорта — для тех, кто
// отсчитывает своё место «от конца шапки», прежде всего для стопки тостов
// (Правки UI-Kit от 25.10: «отсчёт сверху — от нижней кромки шапки плюс
// 32»). Шапка публикует её в `--header-bottom` на `<html>`.
//
// Чем отличается от `--viewport-inset-top`: тот — ПЕРЕКРЫТИЕ вьюпорта
// закреплёнными узлами (у шапки в потоке он 0), а здесь — где кончается шапка
// прямо сейчас, закреплена она или нет. В начале страницы это 128 у
// десктопной шапки, после прокрутки — 64 (липнет только нижний ряд) или 0
// (шапка уехала целиком, как мобильная).
//
// Публикуется всегда, в любой форме шапки; не меньше нуля. Если шапок на
// странице несколько (витрины), берётся самая нижняя кромка. Последняя
// снятая шапка убирает переменную совсем, и потребитель видит свой запасной
// вариант `var(--header-bottom, …)`.

const VARIABLE = "--header-bottom"

function registry() {
  return sharedRegistry("header-bottom", () => new Map<symbol, number>())
}

function publish() {
  const bottoms = registry()
  const root = document.documentElement.style
  if (bottoms.size === 0) {
    root.removeProperty(VARIABLE)
    return
  }
  root.setProperty(VARIABLE, `${Math.round(Math.max(0, ...bottoms.values()))}px`)
}

/**
 * Нижняя кромка узла. У корня с `display: contents` (десктопная шапка,
 * у которой липнет только нижний ряд) своей коробки нет — тогда кромка
 * считается по детям.
 */
function bottomOf(element: HTMLElement): number {
  const rect = element.getBoundingClientRect()
  if (rect.width > 0 || rect.height > 0) return rect.bottom
  let bottom = 0
  for (const child of Array.from(element.children)) {
    const box = child.getBoundingClientRect()
    if (box.width > 0 || box.height > 0) bottom = Math.max(bottom, box.bottom)
  }
  return bottom
}

/**
 * Публикует нижнюю кромку узла (px от верха вьюпорта, ≥ 0) в
 * `--header-bottom`. Обновляется по прокрутке, изменению окна и размера узла.
 *
 * @param ref    корень шапки
 * @param active выключено — вклад снимается
 * @param layout признак раскладки: при его смене узел мог смениться
 *               (десктоп ↔ мобильная форма), и замер ставится заново
 */
export function useHeaderBottom(
  ref: React.RefObject<HTMLElement | null>,
  active = true,
  layout?: string
) {
  const id = React.useRef<symbol>(undefined as unknown as symbol)
  if (id.current === undefined) id.current = Symbol("header-bottom")

  React.useLayoutEffect(() => {
    const key = id.current
    const element = ref.current
    if (!active || !element) return

    const measure = () => {
      const bottom = Math.max(0, bottomOf(element))
      const bottoms = registry()
      if (bottoms.get(key) === bottom) return
      bottoms.set(key, bottom)
      publish()
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true, capture: true })
    window.addEventListener("resize", measure)
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null
    observer?.observe(element)
    // Корень-`contents` своего размера не меняет — следим и за детьми.
    for (const child of Array.from(element.children)) observer?.observe(child)

    return () => {
      window.removeEventListener("scroll", measure, { capture: true })
      window.removeEventListener("resize", measure)
      observer?.disconnect()
      registry().delete(key)
      publish()
    }
  }, [ref, active, layout])
}
