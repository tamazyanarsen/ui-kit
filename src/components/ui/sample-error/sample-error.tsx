import * as React from "react"

import { Alert } from "@/icons"
import { cn } from "@/lib/utils"

// Sample Error — строка «что не так»: цветной значок + текст. Ставится под
// формой, в карточке, в модалке подтверждения — везде, где нужно перечислить
// проблемы, не занимая места информером; несколько строк собирает
// `ListOfErrors`.
//
// Дизайн-чек от 08.10, замечание 13: «Пересобрать Issue Item и назвать
// Sample Error — в фигме компонент доделали, нужно привести код к его
// состоянию». Мастер — сет `Sample Error (ELK)` на канвасе Item (копия
// `lSQi6Xn5HHrt1yvGCIFPZb`, сет 70441:26423, рядом с `03. ELK / list-errors`).
// Прежнее имя `IssueItem` оставлено устаревшим псевдонимом в
// `ui/issue-item`.
//
// Оси сета ровно две — `Size` (Desktop | Mobile) и `Status` (Error |
// Attention | Information); других свойств, слотов и состояний нет. Поэтому
// пересборка свелась к тому, чтобы снять наши надстройки сверх мастера:
// подмену глифа (`icon`) — в мастере значок зафиксирован `icon / alert` и
// различается только цветом — и имя статуса `info` (в мастере
// `Information`).
//
// Анатомия (символы Desktop и Mobile):
//
//   • коробка                `flex gap-[8px] items-start`;
//   • значок `icon / alert`  16 × 16 в коробке `pt-[2px]` — в ОБОИХ
//                            размерах;
//   • текст                  P1 Medium 16/24 (desktop) / P1 Medium Mobile
//                            14/20 (mobile), Grey 1514, перенос по словам.
//
// Состояний, наведения, нажатия и курсора-руки в сете нет — строка ничего
// не обещает, и делать её кликабельной не нужно.

/**
 * Статус строки — ось `Status` мастера.
 *
 * Документация сета: «Error — текст ошибки, блокирующее состояние;
 * Attention — текст предупреждения, не блокирующего подписание;
 * Information — информационное сообщение».
 *
 * Цвета сняты с ассетов мастера: #D74B54 / #EEA20F / #999999 — ровно
 * `--red-418` / `--yellow-214` / `--grey-284`.
 */
type SampleErrorStatus = "error" | "attention" | "information"

const STATUS_COLOR: Record<SampleErrorStatus, string> = {
  error: "var(--issue-icon-error)",
  attention: "var(--issue-icon-attention)",
  information: "var(--issue-icon-info)",
}

interface SampleErrorProps extends React.ComponentProps<"div"> {
  status?: SampleErrorStatus
  children: React.ReactNode
}

const SampleError = React.forwardRef<HTMLDivElement, SampleErrorProps>(function SampleError({
  status = "error",
  className,
  children,
  ...props
}, ref) {
  return (
    <div
      data-slot="sample-error"
      data-status={status}
      // `items-start`: значок выравнивается по ПЕРВОЙ строке текста, а не по
      // середине многострочного абзаца.
      className={cn("flex items-start gap-2", className)}
      ref={ref}
      {...props}
    >
      {/* Опускание значка — 2px и на мобильной строке тоже: у коробки
          значка `pt-[2px]` в обоих символах. */}
      <span
        aria-hidden="true"
        className="flex shrink-0 pt-0.5"
        style={{ color: STATUS_COLOR[status] }}
      >
        <Alert className="size-4" />
      </span>
      <span className="min-w-0 text-p1-medium-adaptive [overflow-wrap:anywhere] text-[var(--issue-fg)]">
        {children}
      </span>
    </div>
  )
})

export { SampleError }
export type { SampleErrorProps, SampleErrorStatus }
