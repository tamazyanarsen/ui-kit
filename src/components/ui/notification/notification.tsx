import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Scrollbar } from "@/components/ui/scrollbar"

// Notification — "Уведомления и новости" panel + its item row. Per the
// spec (marked "Actual old", unlike its message/* siblings — treat as the
// least stable of the five): shows brief messages about events, successful
// actions, errors or warnings, usually from a bell icon in the header.
// `viewed` alone controls the unread dot (there's no separate toggle for
// it in the spec's property table); every other section (sum/status/
// description/button) is optional the same way as Event/Informer.
interface NotificationItemProps {
  title: React.ReactNode
  viewed?: boolean
  sum?: React.ReactNode
  status?: React.ReactNode
  description?: React.ReactNode
  timestamp?: React.ReactNode
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  onClick?: () => void
  className?: string
}

function NotificationItem({
  title,
  viewed = false,
  sum,
  status,
  description,
  timestamp,
  buttonLabel,
  onButtonClick,
  onClick,
  className,
}: NotificationItemProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      data-slot="notification-item"
      data-viewed={viewed || undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={cn(
        "flex items-start gap-4 bg-[var(--notification-bg)] px-4 py-6",
        clickable &&
          "cursor-pointer transition-colors hover:bg-[var(--notification-bg-hover)] active:bg-[var(--notification-bg-pressed)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-5 w-2 shrink-0 items-center justify-center"
      >
        {!viewed && (
          <span className="size-2 rounded-full bg-[var(--notification-dot)]" />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-p1-medium",
              viewed
                ? "text-[var(--notification-meta-fg)]"
                : "text-[var(--notification-title-fg)]"
            )}
          >
            {title}
          </span>
          {sum && (
            <p
              className={cn(
                "text-p2-medium",
                viewed
                  ? "text-[var(--notification-meta-fg)]"
                  : "text-[var(--notification-title-fg)]"
              )}
            >
              {sum}
            </p>
          )}
        </div>
        {status && (
          <p className="text-p2-medium text-[var(--notification-meta-fg)]">
            {status}
          </p>
        )}
        {description && (
          <p className="text-p2-medium text-[var(--notification-meta-fg)]">
            {description}
          </p>
        )}

        {(buttonLabel || timestamp) && (
          <div className="flex items-center justify-between gap-6 pt-2">
            {buttonLabel ? (
              <Button
                type="button"
                variant="secondary-grey"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  onButtonClick?.()
                }}
              >
                {buttonLabel}
              </Button>
            ) : (
              <span />
            )}
            {timestamp && (
              <span className="shrink-0 text-p2-medium text-[var(--notification-timestamp-fg)]">
                {timestamp}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface NotificationPanelProps {
  title?: React.ReactNode
  items: NotificationItemProps[]
  showDivider?: boolean
  showScrollBar?: boolean
  maxHeight?: number
  primaryButtonLabel?: React.ReactNode
  onPrimaryButtonClick?: () => void
  secondaryButtonLabel?: React.ReactNode
  onSecondaryButtonClick?: () => void
  className?: string
}

function NotificationPanel({
  title = "Уведомления и новости",
  items,
  showDivider = true,
  showScrollBar = true,
  maxHeight = 400,
  primaryButtonLabel,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  className,
}: NotificationPanelProps) {
  return (
    <div
      data-slot="notification-panel"
      className={cn(
        "flex w-[480px] flex-col overflow-hidden rounded-[16px] bg-[var(--notification-bg)] shadow-universal",
        className
      )}
    >
      {title && (
        <div className="border-b border-[var(--notification-divider)] px-4 pt-4 pb-3">
          <p className="text-h3 text-[var(--notification-title-fg)]">
            {title}
          </p>
        </div>
      )}

      <Scrollbar
        className={cn(
          "flex flex-col",
          showDivider && "divide-y divide-[var(--notification-divider)]",
          !showScrollBar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        style={{ maxHeight }}
      >
        {items.map((item, index) => (
          <NotificationItem key={index} {...item} />
        ))}
      </Scrollbar>

      {(primaryButtonLabel || secondaryButtonLabel) && (
        // Design-check #41: each button fills half the row (was sized to
        // its own text, letting "Прочитать все" and "Настройки" end up
        // visibly different widths).
        <div className="flex items-center gap-4 border-t border-[var(--notification-divider)] p-4 [&>*]:flex-1">
          {primaryButtonLabel && (
            <Button
              type="button"
              variant="secondary-black"
              size="sm"
              onClick={onPrimaryButtonClick}
            >
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButtonLabel && (
            <Button
              type="button"
              variant="secondary-grey"
              size="sm"
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { NotificationItem, NotificationPanel }
export type { NotificationItemProps, NotificationPanelProps }
