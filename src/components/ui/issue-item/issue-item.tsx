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
// Анатомия — по мастеру `Sample Error (ELK)` (символы 70427:3666 Desktop и
// 70427:3670 Mobile, сверено дизайн-чеком от 13.09, замечание 9):
//
//   • высота строки        24 (desktop) / 20 (mobile);
//   • значок `icon / alert` 16 × 16, опущен на 2 в ОБОИХ размерах
//     (`pt-[2px]` у коробки значка и там, и там);
//   • зазор значок → текст  8 в обоих размерах;
//   • текст                 P1 Medium 16/24 (desktop) / P1 Medium Mobile
//                           14/20 (mobile), Grey 1514.
//
// Состояний, наведения, нажатия и курсора-руки в сете нет вовсе — строка
// ничего не обещает, и делать её кликабельной не нужно.

/**
 * Статус строки — ось `Status` мастера, все три значения из сета.
 *
 * Документация сета: «Error — текст ошибки, блокирующее состояние;
 * Attention — текст предупреждения, не блокирующего подписание;
 * Information — информационное сообщение».
 *
 * ⚠️ `info` больше НЕ надстройка. Раньше здесь стояло, что в Figma только
 * `Error` и `Attention`, а серый статус мы добавили сами по аналогии с
 * информером; в сете `Sample Error (ELK)` символ `Status=Information`
 * (70427:3658) есть, и цвет в нём тот же Grey 284 #999999 — угадали,
 * но записано это было неверно.
 *
 * Цвета сняты с самих ассетов мастера: #D74B54 / #EEA20F / #999999 —
 * ровно `--red-418` / `--yellow-214` / `--grey-284`.
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
      {/* Опускание значка — 2px, и на мобильной строке ТОЖЕ. Раньше здесь
          стоял 1: он был выведен рассуждением про середину полосы прописных
          (на строке 20 она приходится на 8,54, значит «подходят только 0 и
          1»). Мастер это рассуждение отменяет — у коробки значка `pt-[2px]`
          в обоих символах, и Desktop, и Mobile. Вывод из этого общий:
          выводить число там, где мастер его называет, нельзя. */}
      <span
        aria-hidden="true"
        className="flex shrink-0 pt-0.5"
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
