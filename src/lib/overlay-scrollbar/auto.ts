/**
 * Автоподключение наложенной полосы ко ВСЕМ областям `.themed-scrollbar`
 * на странице — выпадающие списки, Select, меню, подсказки, textarea:
 * многие из них ставят класс на свой узел напрямую, без `<Scrollbar>`.
 *
 * Правки UI-Kit от 25.10, «Scrollbar — родные полосы браузера вместо полос
 * кита»: так же сделано и в прототипе — скрипт находит области и следит за
 * добавлением узлов. Запускает его `PageScrollbar` (экран монтирует его один
 * раз); `<Scrollbar>` подключает себя сам и без него. Пока автоподключение
 * не запущено, у голых `.themed-scrollbar` остаётся прежний запасной вид
 * через `::-webkit-scrollbar`.
 *
 * Запуски считаются: второй экземпляр не заводит второго наблюдателя.
 */

import { attachOverlayScrollbar, hasOverlayScrollbar, type OverlayScrollbarHandle } from "./attach"

const SELECTOR = ".themed-scrollbar"

let starts = 0
let observer: MutationObserver | null = null
const handles = new Map<HTMLElement, OverlayScrollbarHandle>()

function adopt(element: Element) {
  if (!(element instanceof HTMLElement) || handles.has(element)) return
  // Уже подключён своим компонентом (`<Scrollbar>` со своими параметрами).
  if (hasOverlayScrollbar(element)) return
  handles.set(element, attachOverlayScrollbar(element))
}

function scan(root: ParentNode) {
  if (root instanceof Element && root.matches(SELECTOR)) adopt(root)
  root.querySelectorAll(SELECTOR).forEach(adopt)
}

function sweep() {
  for (const [element, handle] of handles) {
    if (element.isConnected && element.classList.contains("themed-scrollbar")) continue
    handle.release()
    handles.delete(element)
  }
}

/** Запустить автоподключение. Возвращает остановку. */
export function startOverlayScrollbars(): () => void {
  if (typeof document === "undefined") return () => {}
  starts += 1
  if (starts === 1) {
    scan(document)
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver((records) => {
        let removed = false
        for (const record of records) {
          if (record.type === "attributes") {
            const target = record.target as Element
            if (target.classList.contains("themed-scrollbar")) adopt(target)
            else if (handles.has(target as HTMLElement)) removed = true
            continue
          }
          record.addedNodes.forEach((node) => {
            if (node instanceof Element) scan(node)
          })
          if (record.removedNodes.length) removed = true
        }
        if (removed) sweep()
      })
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      })
    }
  }
  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    starts -= 1
    if (starts > 0) return
    observer?.disconnect()
    observer = null
    for (const handle of handles.values()) handle.release()
    handles.clear()
  }
}
