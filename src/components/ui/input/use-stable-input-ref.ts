import * as React from "react"

import { assignRef } from "@/lib/compose-refs"

/**
 * Постоянный callback-ref для поля с маской.
 *
 * ⚠️ react-imask берёт `inputRef` ОДИН раз, в конструкторе, и новый проп
 * больше не вызывает. А `register()` из react-hook-form отдаёт новый
 * ref-колбэк на каждом рендере и после `reset()` ждёт, что React вызовет
 * его заново: `reset` очищает реестр полей, и без повторного вызова поле
 * отвязывалось от формы — в DOM оставалось старое значение, ввод уходил в
 * форму как `undefined`, `setValue` до поля не доезжал.
 *
 * Поэтому маске отдаётся колбэк, который не меняется, а смену ref
 * потребителя хук разыгрывает сам — так же, как это делает React для
 * обычного элемента: старому ref `null`, новому — узел.
 */
function useStableInputRef(
  inner: React.MutableRefObject<HTMLInputElement | null>,
  consumer: React.Ref<HTMLInputElement> | undefined
) {
  const node = React.useRef<HTMLInputElement | null>(null)
  const attached = React.useRef(consumer)

  React.useLayoutEffect(() => {
    if (attached.current === consumer) return
    const previous = attached.current
    attached.current = consumer
    if (!node.current) return
    assignRef(previous, null)
    assignRef(consumer, node.current)
  })

  return React.useCallback(
    (element: HTMLInputElement | null) => {
      node.current = element
      inner.current = element
      assignRef(attached.current, element)
    },
    [inner]
  )
}

export { useStableInputRef }
