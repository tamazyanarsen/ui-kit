import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Bell } from "@/icons"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Scrollbar } from "@/components/ui/scrollbar"

import { HEADER_ICON_TILE_ACCENT, HeaderMenuPopup } from "./menu-popup"

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

/** Подписи под заголовком выровнены по тексту, а не по точке-индикатору. */
const META_LINE = "pl-3.5 text-p3-regular text-[var(--header-meta-fg)]"

function NotificationRow({ item }: { item: NotificationMenuItem }) {
  return (
    <MenuPrimitive.Item
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
              "text-p2-regular",
              item.viewed
                ? "font-normal text-[var(--header-meta-fg)]"
                : "font-medium text-[var(--header-fg)]"
            )}
          >
            {item.title}
          </span>
        </span>
        {item.status && (
          <span className="shrink-0 text-p2-medium text-[var(--header-fg)]">
            {item.status}
          </span>
        )}
      </div>
      <span className={META_LINE}>{item.org}</span>
      <span className={META_LINE}>{item.timestamp}</span>
      <span className={META_LINE}>{item.description}</span>
    </MenuPrimitive.Item>
  )
}

function NotificationMenu({
  items,
  unreadCount = 0,
  className,
}: NotificationMenuProps) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            aria-label="Уведомления"
            data-slot="notification-menu-trigger"
            className={cn(HEADER_ICON_TILE_ACCENT, className)}
          />
        }
      >
        {/* Бейдж крепится к самой иконке, а не к плитке: иначе он уезжает
            в угол блока 56×64 вместо угла глифа 24×24. */}
        <span className="relative flex">
          <Bell size={24} aria-hidden="true" className="size-6" />
          {unreadCount > 0 && (
            <Badge
              type="counter"
              color="red"
              value={unreadCount}
              className="absolute -top-1 -right-1"
            />
          )}
        </span>
      </MenuPrimitive.Trigger>

      <HeaderMenuPopup
        slot="notification-menu-content"
        align="start"
        className="flex w-[380px] flex-col"
      >
        <p className="border-b border-[var(--header-divider)] px-4 py-3 text-p1-medium text-[var(--header-fg)]">
          Уведомления
        </p>
        {/* Spec: fixed 584px height once content reaches it, then scrolls,
            with a 32px bottom padding — capped lower here (420px) since this
            kit's demo content is only two items, but the scroll/padding
            mechanics match. */}
        <Scrollbar className="flex max-h-[420px] flex-col divide-y divide-[var(--header-divider)] pb-8">
          {items.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </Scrollbar>
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

export { NotificationMenu }
export type { NotificationMenuItem, NotificationMenuProps }
