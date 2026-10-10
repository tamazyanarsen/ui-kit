import * as React from "react"

import { Tooltip } from "@/components/ui/tooltip"

/**
 * Подсказка с полным текстом обрезанной ячейки — монтируется, ТОЛЬКО когда
 * текст действительно обрезан.
 *
 * Ревью 10.10, КК-3: раньше каждая ячейка Text/Number/Tag и каждая подпись
 * столбца держали свой Tooltip (Provider, Root, Trigger) выключенным
 * (`disabled`), даже если текст помещался, — тысячи деревьев подсказок на
 * большую таблицу, из которых нужны единицы.
 *
 * ⚠️ Цена — перемонтирование узла ячейки в момент, когда текст начинает
 * или перестаёт помещаться (смена ширины колонки): обёртка появляется или
 * исчезает. Замер это переносит — `useTruncated` отдаёт callback-ref и
 * подхватывает новый узел. Заголовок страницы (`title/heading.tsx`) держит
 * подсказку смонтированной всегда: он один на странице, и перемонтировать
 * его незачем.
 */
function TruncationTooltip({
  truncated,
  content,
  children,
}: {
  truncated: boolean
  content: React.ReactNode
  /** Один элемент — триггер подсказки. */
  children: React.ReactElement
}) {
  if (!truncated) return children
  return <Tooltip content={content}>{children}</Tooltip>
}

export { TruncationTooltip }
