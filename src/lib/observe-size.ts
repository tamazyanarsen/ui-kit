/**
 * Один `ResizeObserver` на страницу для множества мелких узлов.
 *
 * Ячейки таблицы меряют, обрезан ли их текст. Раньше каждая заводила свой
 * наблюдатель: 300 строк × 8 колонок — 2400 живых наблюдателей (ревью
 * 10.10, КК-3). Браузер обрабатывает один наблюдатель с тысячами целей
 * дешевле, чем тысячи наблюдателей с одной целью, а уведомления приходят
 * одной пачкой на кадр.
 *
 * Состояние — на `window` под общим ключом, как у замка прокрутки
 * (`use-page-scroll-lock.ts`), не нужно: каждая копия кита наблюдает только
 * свои узлы, и две копии друг другу не мешают.
 */
type Callback = () => void

let observer: ResizeObserver | null = null
const callbacks = new Map<Element, Set<Callback>>()

function shared(): ResizeObserver | null {
  if (typeof ResizeObserver === "undefined") return null
  observer ??= new ResizeObserver((entries) => {
    for (const entry of entries) callbacks.get(entry.target)?.forEach((callback) => callback())
  })
  return observer
}

/** Звать `callback` при смене размера `element`. Возвращает отписку. */
function observeSize(element: Element, callback: Callback): () => void {
  const instance = shared()
  if (!instance) return () => {}
  let set = callbacks.get(element)
  if (!set) {
    set = new Set()
    callbacks.set(element, set)
    instance.observe(element)
  }
  set.add(callback)
  return () => {
    const current = callbacks.get(element)
    if (!current) return
    current.delete(callback)
    if (current.size === 0) {
      callbacks.delete(element)
      instance.unobserve(element)
    }
  }
}

export { observeSize }
