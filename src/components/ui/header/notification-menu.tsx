import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Bell } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Notification dropdown — the bell icon's own popup content. Deliberately
// not built on the shared Notification component (src/components/ui/
// notification): that component's own spec is flagged "Actual old" and its
// item shape (title, then a bold sum line, then status/description lines)
// doesn't match this dropdown's row ("Название" + a right-aligned status/
// amount on the same line, then org, timestamp, description) — forcing one
// onto the other would either misrender or require changing a component
// this task isn't scoped to touch.
interface NotificationMenuItem {
  id: string
  title: React.ReactNode
  status?: React.ReactNode
  org: React.ReactNode
  timestamp: React.ReactNode
  description: React.ReactNode
  viewed?: boolean
  onClick?: () => void
}

interface NotificationMenuProps {
  items: NotificationMenuItem[]
  unreadCount?: number
  className?: string
}

function NotificationMenu({ items, unreadCount = 0, className }: NotificationMenuProps) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            aria-label="Уведомления"
            data-slot="notification-menu-trigger"
            className={cn(
              "group relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]",
              className
            )}
          />
        }
      >
        <Bell aria-hidden="true" className="size-6" />
        {unreadCount > 0 && (
          <Badge
            type="counter"
            color="red"
            value={unreadCount}
            className="absolute -top-1 -right-1"
          />
        )}
      </MenuPrimitive.Trigger>

      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="notification-menu-content"
            className="flex w-[380px] flex-col overflow-hidden rounded-2xl bg-[var(--header-bg)] shadow-[0_4px_12px_rgba(139,153,169,0.24)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <p className="border-b border-[var(--header-divider)] px-4 py-3 text-p1 font-medium text-[var(--header-fg)]">
              Уведомления
            </p>
            {/* Spec: fixed 584px height once content reaches it, then
                scrolls, with a 32px bottom padding — capped lower here
                (420px) since this kit's demo content is only two items,
                but the scroll/padding mechanics match. */}
            <div className="flex max-h-[420px] flex-col divide-y divide-[var(--header-divider)] overflow-y-auto pb-8">
              {items.map((item) => (
                <MenuPrimitive.Item
                  key={item.id}
                  onClick={item.onClick}
                  data-slot="notification-menu-item"
                  className="flex cursor-default flex-col gap-1 px-4 py-3 outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex items-start gap-2">
                      {!item.viewed && (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--header-unread-dot)]"
                        />
                      )}
                      <span
                        className={cn(
                          "text-p2",
                          item.viewed
                            ? "font-normal text-[var(--header-meta-fg)]"
                            : "font-medium text-[var(--header-fg)]"
                        )}
                      >
                        {item.title}
                      </span>
                    </span>
                    {item.status && (
                      <span className="shrink-0 text-p2 font-medium text-[var(--header-fg)]">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <span className="pl-3.5 text-p3 text-[var(--header-meta-fg)]">
                    {item.org}
                  </span>
                  <span className="pl-3.5 text-p3 text-[var(--header-meta-fg)]">
                    {item.timestamp}
                  </span>
                  <span className="pl-3.5 text-p3 text-[var(--header-meta-fg)]">
                    {item.description}
                  </span>
                </MenuPrimitive.Item>
              ))}
            </div>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { NotificationMenu }
export type { NotificationMenuProps, NotificationMenuItem }
