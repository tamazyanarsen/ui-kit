import * as React from "react"

import { cn } from "@/lib/utils"
import { pressHandlers } from "@/lib/press"
import { Checkbox } from "@/components/ui/checkbox"

export type MailFeedState = "default" | "new" | "used" | "error"

const STATE_BG: Record<MailFeedState, string> = {
  default: "var(--mail-feed-default-bg)",
  new: "var(--mail-feed-new-bg)",
  used: "var(--mail-feed-used-bg)",
  error: "var(--mail-feed-error-bg)",
}

// MailFeed — «Письмо» (список входящих): одна строка сообщения в списке
// почты. `state` — это собственный статус сообщения (Default; New —
// непрочитанное; Used — прочитанное; Error — сбойное или проблемное), и он
// не связан с `checked` и `onCheckedChange`, которые относятся к флажку
// массового выбора строки. Текст сообщения и превью всегда занимают две
// строки (само сообщение обрезается до одной через `line-clamp-1`, как в
// анатомии макета с фиксированной высотой) независимо от состояния.
interface MailFeedProps {
  id: React.ReactNode
  sender: React.ReactNode
  date: React.ReactNode
  subject: React.ReactNode
  message: React.ReactNode
  preview?: React.ReactNode
  state?: MailFeedState
  showCheckbox?: boolean
  /** Управляемое состояние флажка. Без него флажок хранит состояние сам. */
  checked?: boolean
  /** Начальное состояние неуправляемого флажка. */
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Доступное имя чекбокса — видимой подписи у него нет. */
  checkboxLabel?: string
  onClick?: () => void
  className?: string
}

function MailFeed({
  id,
  sender,
  date,
  subject,
  message,
  preview,
  state = "default",
  showCheckbox = false,
  // Без умолчания `false`: с ним флажок был всегда управляемым, и без
  // `checked` клик звал `onCheckedChange(true)`, а галочка не ставилась.
  checked,
  defaultChecked,
  onCheckedChange,
  checkboxLabel = "Выбрать письмо",
  onClick,
  className,
}: MailFeedProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      data-slot="mail-feed"
      data-state={state}
      // Карточка с `onClick` — кнопка и для клавиатуры: раньше это был
      // голый `div` с `cursor-pointer`, недоступный без мыши.
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...pressHandlers<HTMLDivElement>(onClick)}
      className={cn(
        // Тень на наведении — общая `shadow-universal` кита (0/4/12
        // #8B99A9 24%), а не свой литерал: значение то же, но оно уже живёт
        // токеном, и переписанное вручную расходится с ним при следующей
        // правке темы.
        "flex w-full flex-col items-start gap-4 rounded-[16px] p-4 outline-none transition-shadow hover:shadow-universal focus-visible:focus-ring",
        clickable && "cursor-pointer",
        className
      )}
      style={{ backgroundColor: STATE_BG[state] }}
    >
      <div className="flex w-full items-center gap-2">
        {showCheckbox && (
          <div onClick={(event) => event.stopPropagation()} className="shrink-0">
            <Checkbox
              aria-label={checkboxLabel}
              checked={checked}
              defaultChecked={defaultChecked}
              onCheckedChange={(next) => onCheckedChange?.(next === true)}
            />
          </div>
        )}
        <span className="shrink-0 text-p3-medium text-[var(--mail-feed-fg)]">{id}</span>
        <div className="flex min-w-0 flex-1 items-end justify-between gap-2 text-p3-medium">
          <span className="min-w-0 truncate font-medium text-[var(--mail-feed-fg)]">
            {sender}
          </span>
          <span className="shrink-0 text-[var(--mail-feed-meta-fg)]">{date}</span>
        </div>
      </div>

      <p className="w-full truncate text-p2-medium text-[var(--mail-feed-fg)]">{subject}</p>

      <div className="flex w-full flex-col gap-1 text-p3-medium">
        <span className="text-[var(--mail-feed-fg)]">{message}</span>
        {preview && <span className="line-clamp-1 text-[var(--mail-feed-meta-fg)]">{preview}</span>}
      </div>
    </div>
  )
}

export { MailFeed }
export type { MailFeedProps }
