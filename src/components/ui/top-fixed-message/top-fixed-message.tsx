import * as React from "react"
import { CircleAlert, X } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"

import {
  TOP_FIXED_MESSAGE_BG,
  TOP_FIXED_MESSAGE_ICON_COLOR,
  type TopFixedMessageType,
} from "./variants"

// Top Fixed Message — "Закреплённое сообщение". Full-width, sits flush
// under the header (0px offset) and scrolls together with the page
// content rather than staying pinned to the viewport (per spec: "Сообщение
// скролируеться вместе с контентом" — the name is about visual anchoring
// to the top of the content, not CSS position:fixed).
//
// Text truncates to one line with an ellipsis; the full text is always
// available via a hover Tooltip (spec: recommended length ≤100 chars, not
// hard-capped, so overflow can happen with any content).
interface TopFixedMessageProps {
  type?: TopFixedMessageType
  showIcon?: boolean
  text: React.ReactNode
  showButton?: boolean
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  showIconClose?: boolean
  onClose?: () => void
  className?: string
}

function TopFixedMessage({
  type = "blue",
  showIcon = true,
  text,
  showButton = false,
  buttonLabel,
  onButtonClick,
  showIconClose = true,
  onClose,
  className,
}: TopFixedMessageProps) {
  return (
    <div
      data-slot="top-fixed-message"
      className={cn("flex h-14 w-full items-center gap-6 px-10 py-3", className)}
      style={{ backgroundColor: TOP_FIXED_MESSAGE_BG[type] }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {showIcon && (
          <CircleAlert
            size={24}
            aria-hidden="true"
            className="size-6 shrink-0"
            style={{ color: TOP_FIXED_MESSAGE_ICON_COLOR[type] }}
          />
        )}

        <Tooltip content={text}>
          <span className="min-w-0 truncate text-p2-medium text-[var(--top-fixed-message-title-fg)]">
            {text}
          </span>
        </Tooltip>

        {showButton && (
          <Button
            type="button"
            variant="secondary-black"
            size="sm"
            className="shrink-0"
            onClick={onButtonClick}
          >
            {buttonLabel}
          </Button>
        )}
      </div>

      {showIconClose && (
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="shrink-0 text-[var(--top-fixed-message-close-fg)] outline-none"
        >
          {/* Дизайн-чек №3 №9: «Некорректное начертание крестика».
              Коробка 24px — значит и рисунок 24px (`icon / close cross`,
              нода 263:6442), а не 16px, растянутый в полтора раза. */}
          <X size={24} aria-hidden="true" className="size-6" />
        </button>
      )}
    </div>
  )
}

export { TopFixedMessage }
export type { TopFixedMessageProps }
