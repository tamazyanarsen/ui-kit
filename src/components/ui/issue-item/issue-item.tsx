import * as React from "react"

import { Alert } from "@/icons"
import type { IconProps } from "@/icons"
import { cn } from "@/lib/utils"

// Issue Item — строка «что не так»: цветной значок + текст. Ставится под
// формой, в карточке, в модалке подтверждения — везде, где нужно перечислить
// проблемы, не занимая места информером.
//
// ⚠️ Имя. В Figma сет называется `Error (ELK)`, но это имя в ките занято
// ДВАЖДЫ: строка проблемы (библиотека «Templates/Containers | Web LK») и
// подпись-ошибка под полем ввода (она живёт внутри Input, Select, TextArea).
// Различает их только имя библиотеки. Поэтому компонент назван `IssueItem` —
// иначе в публичном API кита оказалось бы два разных `Error`.
//
// Анатомия (замер сета, ширина эталона 880):
//
//   • высота строки        24 (desktop) / 20 (mobile);
//   • значок `icon / alert` 16 × 16, опущен на 2 (desktop) / 1 (mobile);
//   • зазор значок → текст  8 в обоих размерах;
//   • текст                 P1 Medium 16/24 (desktop) / 14/20 (mobile),
//                           Grey 1514.
//
// Состояний, наведения, нажатия и курсора-руки в сете нет вовсе — строка
// ничего не обещает, и делать её кликабельной не нужно.

/**
 * Статус строки.
 *
 * `info` — наша надстройка сверх сета (в Figma только `Error` и
 * `Attention`): строка, которая ничего не требует, а поясняет. Роль
 * совпадает со значком «Information (Grey)» информера, поэтому взят тот же
 * примитив Grey 284; в «Зелёной» палитре серый не меняется.
 */
type IssueStatus = "error" | "attention" | "info"

const STATUS_COLOR: Record<IssueStatus, string> = {
  error: "var(--issue-icon-error)",
  attention: "var(--issue-icon-attention)",
  info: "var(--issue-icon-info)",
}

type IssueIcon = React.ComponentType<IconProps>

interface IssueItemProps extends React.ComponentProps<"div"> {
  status?: IssueStatus
  /**
   * Подмена глифа. Смысл по-прежнему несёт ЦВЕТ, а слот говорит, о ЧЁМ
   * проблема, — поэтому цвет остаётся статусным и через этот проп не
   * меняется (надстройка сверх сета, где глиф зафиксирован `icon / alert`).
   */
  icon?: IssueIcon
  children: React.ReactNode
}

function IssueItem({
  status = "error",
  icon: Icon = Alert,
  className,
  children,
  ...props
}: IssueItemProps) {
  return (
    <div
      data-slot="issue-item"
      data-status={status}
      // `items-start`: значок выравнивается по ПЕРВОЙ строке текста, а не по
      // середине многострочного абзаца.
      className={cn("flex items-start gap-2", className)}
      {...props}
    >
      {/* Опускание значка — замер, а не пропорция. Кит выравнивает центр
          глифа по середине полосы прописных первой строки: на 16/24 это
          даёт ровно 2 (точность −0,34px), а на мобильной строке 20 середина
          полосы 8,54, поэтому подходят только 0 и 1 — взята единица.
          «Пропорциональные» 1,67 промахнулись бы вдвое сильнее. */}
      <span
        aria-hidden="true"
        className="flex shrink-0 pt-px desktop:pt-0.5"
        style={{ color: STATUS_COLOR[status] }}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 text-p2-medium text-[var(--issue-fg)] desktop:text-p1-medium">
        {children}
      </span>
    </div>
  )
}

export { IssueItem }
export type { IssueItemProps, IssueStatus, IssueIcon }
