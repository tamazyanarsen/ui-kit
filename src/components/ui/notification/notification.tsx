import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
        "flex flex-col gap-1 bg-[var(--notification-bg)] px-4 py-3",
        clickable &&
          "cursor-pointer transition-colors hover:bg-[var(--notification-bg-hover)] active:bg-[var(--notification-bg-pressed)]",
        className
      )}
    >
      <div className="flex items-start gap-2">
        {!viewed && (
          <span
            aria-hidden="true"
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--notification-dot)]"
          />
        )}
        <span
          className={cn(
            "text-[var(--notification-title-fg)]",
            viewed ? "font-normal" : "font-medium"
          )}
        >
          {title}
        </span>
      </div>

      {sum && (
        <p className="font-medium text-[var(--notification-title-fg)]">
          {sum}
        </p>
      )}
      {status && (
        <p className="text-sm text-[var(--notification-meta-fg)]">{status}</p>
      )}
      {description && (
        <p className="text-sm text-[var(--notification-meta-fg)]">
          {description}
        </p>
      )}

      {(buttonLabel || timestamp) && (
        <div className="mt-1 flex items-center justify-between gap-3">
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
            <span className="shrink-0 text-xs text-[var(--notification-meta-fg)]">
              {timestamp}
            </span>
          )}
        </div>
      )}
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
        "flex w-[380px] flex-col overflow-hidden rounded-2xl bg-[var(--notification-bg)] shadow-lg ring-1 ring-foreground/10",
        className
      )}
    >
      {title && (
        <div className="border-b border-[var(--notification-divider)] px-4 py-3">
          <p className="font-medium text-[var(--notification-title-fg)]">
            {title}
          </p>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col overflow-y-auto",
          showDivider && "divide-y divide-[var(--notification-divider)]",
          !showScrollBar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        style={{ maxHeight }}
      >
        {items.map((item, index) => (
          <NotificationItem key={index} {...item} />
        ))}
      </div>

      {(primaryButtonLabel || secondaryButtonLabel) && (
        <div className="flex items-center gap-2 border-t border-[var(--notification-divider)] px-4 py-3">
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
