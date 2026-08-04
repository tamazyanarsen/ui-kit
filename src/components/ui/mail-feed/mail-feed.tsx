import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

export type MailFeedState = "default" | "new" | "used" | "error"

const STATE_BG: Record<MailFeedState, string> = {
  default: "var(--mail-feed-default-bg)",
  new: "var(--mail-feed-new-bg)",
  used: "var(--mail-feed-used-bg)",
  error: "var(--mail-feed-error-bg)",
}

// MailFeed — "Письмо" (список входящих): a single message row in a mail
// list. `state` is the message's own status (Default/New — unread/Used —
// read/Error — a failed/problem message), independent of `checked`/
// `onCheckedChange` which is the row's bulk-select checkbox. Message/
// preview text is always two lines (message truncates to 1 line via
// `line-clamp-1`, matching the spec's own fixed-height anatomy) regardless
// of state.
interface MailFeedProps {
  id: React.ReactNode
  sender: React.ReactNode
  date: React.ReactNode
  subject: React.ReactNode
  message: React.ReactNode
  preview?: React.ReactNode
  state?: MailFeedState
  showCheckbox?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
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
  checked = false,
  onCheckedChange,
  onClick,
  className,
}: MailFeedProps) {
  return (
    <div
      data-slot="mail-feed"
      data-state={state}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer flex-col items-start gap-4 rounded-[16px] p-4 transition-shadow hover:shadow-[0px_4px_12px_rgba(139,153,169,0.24)]",
        className
      )}
      style={{ backgroundColor: STATE_BG[state] }}
    >
      <div className="flex w-full items-center gap-2">
        {showCheckbox && (
          <div onClick={(event) => event.stopPropagation()} className="shrink-0">
            <Checkbox
              checked={checked}
              onCheckedChange={(next) => onCheckedChange?.(next === true)}
            />
          </div>
        )}
        <span className="shrink-0 text-p3-medium text-[var(--mail-feed-fg)]">{id}</span>
        <div className="flex min-w-0 flex-1 items-end justify-between gap-2 text-p3-regular">
          <span className="min-w-0 truncate font-medium text-[var(--mail-feed-fg)]">
            {sender}
          </span>
          <span className="shrink-0 text-[var(--mail-feed-meta-fg)]">{date}</span>
        </div>
      </div>

      <p className="w-full truncate text-p2-medium text-[var(--mail-feed-fg)]">{subject}</p>

      <div className="flex w-full flex-col gap-1 text-p3-regular">
        <span className="text-[var(--mail-feed-fg)]">{message}</span>
        {preview && <span className="line-clamp-1 text-[var(--mail-feed-meta-fg)]">{preview}</span>}
      </div>
    </div>
  )
}

export { MailFeed }
export type { MailFeedProps }
