import * as React from "react"

import { cn } from "@/lib/utils"
import { SelectionButton } from "@/components/ui/selection-button"
import type { SelectionButtonItem } from "@/components/ui/selection-button"
import { Tag } from "@/components/ui/tag"
import type { TagColor } from "@/components/ui/tag"
import { PaymentLogo } from "@/components/ui/thumbnail"
import type { PaymentSystem } from "@/components/ui/thumbnail"

// Card — the "ELK / card" bank-card row (Figma node 42383:43897). Every text
// block (title, subtitle, value) is single-line-only per the spec
// ("Ограничения текстовых блоков": overflow is clipped to an ellipsis, never
// wraps). `titleSuffix`, `tag`, `subtitle`, `value` and `menuItems` are all
// optional and simply omit their slot when absent — mirrors the spec's own
// "Show Number Card / Show Tag / Show User Name / Show Value / Show Button"
// boolean properties, all demoed as content toggles rather than a separate
// flag per field.
//
// `value` (the account number) lives in the top row alongside title/tag, not
// as a separate block below — per Figma it's a `flex-[1_0_0]` sibling of
// Title,Number and Tag inside the "Top" row, right-aligned and growing to
// fill the row's remaining width. It is NOT a sibling of the whole
// title+subtitle column, so it must never be vertically centered across the
// full card height (that would visibly detach it from the title once a
// subtitle is present) — it only ever centers within the Top row itself.
//
// The "..." button is a SelectionButton (S, secondary-white, down-left —
// the row's own edge is the right side of the viewport in the spec, so the
// list opens leftward/downward from the trigger).
interface CardProps {
  title: React.ReactNode
  titleSuffix?: React.ReactNode
  tag?: React.ReactNode
  tagColor?: TagColor
  subtitle?: React.ReactNode
  value?: React.ReactNode
  showThumbnail?: boolean
  thumbnailNumber?: React.ReactNode
  paymentSystem?: PaymentSystem
  menuItems?: SelectionButtonItem[]
  onClick?: () => void
  className?: string
}

// Mini bank-card mockup ("IB / card account" in Figma) — 48×34, white
// hairline border, the network mark pinned top-left and the card's last 4
// digits bottom-right. The brand mark itself reuses Thumbnail's own
// `PaymentLogo` (same simplified-approximation policy, just its `sm` size)
// rather than a second, duplicated logo implementation.
function CardThumbnail({
  number,
  paymentSystem,
}: {
  number?: React.ReactNode
  paymentSystem: PaymentSystem
}) {
  return (
    <div
      aria-hidden="true"
      className="relative h-[34px] w-12 shrink-0 overflow-hidden rounded-[4px] border border-white bg-[var(--card-thumb-bg)]"
    >
      <PaymentLogo
        system={paymentSystem}
        size="sm"
        className="absolute top-[3px] left-[3px]"
      />
      {number && (
        <span className="absolute right-[3px] bottom-[3px] text-p4 font-normal text-[var(--card-thumb-fg)]">
          {number}
        </span>
      )}
    </div>
  )
}

function Card({
  title,
  titleSuffix,
  tag,
  tagColor = "green",
  subtitle,
  value,
  showThumbnail = true,
  thumbnailNumber,
  paymentSystem = "mastercard",
  menuItems,
  onClick,
  className,
}: CardProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      data-slot="card"
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
        "flex min-h-20 items-center gap-6 rounded-[12px] bg-[var(--card-bg)] p-6 transition-colors",
        clickable && "cursor-pointer hover:bg-[var(--card-bg-hover)]",
        className
      )}
    >
      {showThumbnail && (
        <CardThumbnail number={thumbnailNumber} paymentSystem={paymentSystem} />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex min-w-0 items-center gap-2 text-h4">
            <span className="min-w-0 truncate text-[var(--card-title-fg)]">
              {title}
            </span>
            {titleSuffix && (
              <span className="shrink-0 font-normal text-[var(--card-meta-fg)]">
                • {titleSuffix}
              </span>
            )}
          </span>
          {tag && (
            <Tag color={tagColor} size="l" className="shrink-0">
              {tag}
            </Tag>
          )}
          {value && (
            <span className="min-w-0 flex-1 truncate text-right text-p1 font-medium text-[var(--card-meta-fg)]">
              {value}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="truncate text-p2 font-medium text-[var(--card-meta-fg)]">
            {subtitle}
          </span>
        )}
      </div>

      {menuItems && menuItems.length > 0 && (
        <SelectionButton items={menuItems} size="sm" direction="down-left" />
      )}
    </div>
  )
}

export { Card }
export type { CardProps }
