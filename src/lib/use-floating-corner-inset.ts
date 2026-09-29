import * as React from "react"

import { useComposedRefs } from "@/lib/compose-refs"

// Сколько правого нижнего угла экрана занято плавающей карточкой (NPS).
// Кнопка «Наверх» живёт в том же углу и без этого ложилась под карточку:
// на 375 целиком, на 1280 — оставалась видна одна кромка.
//
// Публикуется не число, а выражение от `--floating-bottom` (занятый низ
// для плавающих слоёв, см. base.css): карточка
// сама стоит над занятым низом вьюпорта, и тот меняется при прокрутке
// (sticky-панель доезжает до края). Пересчитывать собственную величину на
// каждый сдвиг панели не нужно — браузер подставит свежий inset сам, а
// порядок обработчиков прокрутки на итог не влияет.

const VARIABLE = "--floating-corner-inset"
const INSET = "--floating-bottom"
/**
 * Составляющие `--floating-bottom`. Саму её числом не прочитать: это
 * незарегистрированное свойство со значением `max(…)`, и getComputedStyle
 * отдаёт строку «max(89px, 0px)» без вычисления — parseFloat давал NaN, inset
 * считался нулём, и высота панели входила в угол дважды (проверка правок r22:
 * «Наверх» висел над NPS на 89px выше). Читаем обе и берём большую.
 */
const INSET_PARTS = ["--viewport-inset-bottom", "--floating-inset-bottom"]

function readInset(): number {
  const style = getComputedStyle(document.documentElement)
  return Math.max(
    0,
    ...INSET_PARTS.map((name) => Number.parseFloat(style.getPropertyValue(name)) || 0)
  )
}
/** Зазор между верхом карточки и тем, что встаёт над ней. */
const GAP = 16

/** Живые карточки и их высота над занятым низом. Две карточки в одном
 * углу стоят друг на друге, а не складываются — берётся наибольшая. */
const cards = new Map<symbol, number>()

function publish() {
  const root = document.documentElement
  if (cards.size === 0) {
    root.style.removeProperty(VARIABLE)
    return
  }
  const height = Math.round(Math.max(...cards.values()))
  root.style.setProperty(VARIABLE, `calc(var(${INSET}, 0px) + ${height}px)`)
}

/**
 * Публикует в `--floating-corner-inset` на `<html>` высоту, которую
 * плавающая карточка занимает в правом нижнем углу (её отступ снизу + своя
 * высота + зазор), поверх занятого низа вьюпорта. Нет активных карточек —
 * переменная снимается, и соседи стоят как раньше.
 *
 * @param active выключено — вклад снимается (карточка не плавающая)
 * @param forwardedRef ref потребителя — получает тот же узел
 */
export function useFloatingCornerInset<T extends HTMLElement>(
  active = true,
  forwardedRef?: React.ForwardedRef<T>
): React.RefCallback<T> {
  const id = React.useRef<symbol>(undefined as unknown as symbol)
  if (id.current === undefined) id.current = Symbol("floating-card")

  const [element, setElement] = React.useState<T | null>(null)
  const ref = useComposedRefs<T>(setElement, forwardedRef)

  React.useLayoutEffect(() => {
    const key = id.current
    if (!active || !element) return

    const measure = () => {
      // Вычисленный `bottom` уже включает текущий inset — он вычитается,
      // остаётся собственный отступ карточки (16 на мобильном, 40 на
      // десктопе). Оба значения читаются в одном состоянии стилей.
      const bottom = Number.parseFloat(getComputedStyle(element).bottom) || 0
      const inset = readInset()
      const height = element.getBoundingClientRect().height
      const occupied = Math.max(0, bottom - inset) + height + GAP
      if (cards.get(key) === occupied) return
      cards.set(key, occupied)
      publish()
    }

    measure()
    // Смена формы (десктоп ↔ мобильный) меняет отступ без смены размера.
    window.addEventListener("resize", measure)
    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      window.removeEventListener("resize", measure)
      observer.disconnect()
      cards.delete(key)
      publish()
    }
  }, [element, active])

  return ref
}
