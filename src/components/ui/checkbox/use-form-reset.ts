import * as React from "react"

/**
 * Зовёт `onReset` после нативного сброса формы, в которой стоит `node`:
 * сам input или обёртка группы (тогда форма — у первого input внутри).
 *
 * Событие `reset` приходит ДО того, как браузер вернёт полям исходные
 * значения, поэтому обработчик откладывается на следующую задачу. Слушается
 * документ, а не форма: узел может ссылаться на форму атрибутом `form`, и
 * форма находится по `input.form` в момент события. Отменённый сброс
 * (`preventDefault`) ничего не сбрасывает — и обработчик не зовётся.
 */
function useFormReset(node: HTMLElement | null, onReset: () => void) {
  const onResetRef = React.useRef(onReset)
  onResetRef.current = onReset
  React.useEffect(() => {
    if (!node) return
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const handle = (event: Event) => {
      const form = formOf(node)
      if (!form || event.target !== form) return
      const timer = setTimeout(() => {
        timers.delete(timer)
        if (!event.defaultPrevented) onResetRef.current()
      })
      timers.add(timer)
    }
    const doc = node.ownerDocument
    doc.addEventListener("reset", handle)
    return () => {
      doc.removeEventListener("reset", handle)
      timers.forEach(clearTimeout)
    }
  }, [node])
}

function formOf(node: HTMLElement) {
  if (node instanceof HTMLInputElement) return node.form
  return node.querySelector("input")?.form ?? node.closest("form")
}

export { useFormReset }
