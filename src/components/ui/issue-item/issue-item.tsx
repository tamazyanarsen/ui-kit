import * as React from "react"

import {
  SampleError,
  type SampleErrorProps,
  type SampleErrorStatus,
} from "@/components/ui/sample-error"

// Устаревший псевдоним. Компонент переименован в `SampleError` по имени
// мастера `Sample Error (ELK)` — дизайн-чек от 08.10, замечание 13. Подпуть
// `@core/ui-kit/issue-item` и имя `IssueItem` оставлены, чтобы не ломать
// уже написанный код; новый код импортирует `SampleError`.
//
// Отличия от прежнего `IssueItem`, которые пересборка по мастеру сняла:
// статус `info` называется `information` (здесь он по-прежнему принимается
// и переводится), а слота `icon` больше нет — в мастере глиф зафиксирован.

/** @deprecated Используйте `SampleErrorStatus` из `ui/sample-error`. */
type IssueStatus = Exclude<SampleErrorStatus, "information"> | "info" | "information"

/** @deprecated Используйте `SampleErrorProps` из `ui/sample-error`. */
interface IssueItemProps extends Omit<SampleErrorProps, "status"> {
  status?: IssueStatus
}

/** @deprecated Используйте `SampleError` из `ui/sample-error`. */
const IssueItem = React.forwardRef<HTMLDivElement, IssueItemProps>(function IssueItem(
  { status, ...props },
  ref
) {
  return (
    <SampleError
      ref={ref}
      status={status === "info" ? "information" : status}
      {...props}
    />
  )
})

export { IssueItem }
export type { IssueItemProps, IssueStatus }
