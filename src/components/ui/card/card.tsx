import * as React from "react"

import { cn } from "@/lib/utils"
import { SelectionButton } from "@/components/ui/selection-button"
import type { SelectionButtonItem } from "@/components/ui/selection-button"

// Card — the "Card / Компонент" bank-card row. Every text block (title,
// subtitle, value) is single-line-only per the spec ("Ограничения текстовых
// блоков": overflow is clipped to an ellipsis, never wraps). `titleSuffix`,
// `tag`, `subtitle`, `value` and `menuItems` are all optional and simply
// omit their slot when absent — mirrors the spec's own "Show Number Card /
// Show Tag / Show User Name / Show Value / Show Button" boolean properties,
// all demoed as content toggles rather than a separate flag per field.
//
// The "..." button is a SelectionButton (S, secondary-white, down-left —
// the row's own edge is the right side of the viewport in the spec, so the
// list opens leftward/downward from the trigger).
interface CardProps {
  title: React.ReactNode
  titleSuffix?: React.ReactNode
  tag?: React.ReactNode
  subtitle?: React.ReactNode
  value?: React.ReactNode
  showThumbnail?: boolean
  thumbnailNumber?: React.ReactNode
  menuItems?: SelectionButtonItem[]
  onClick?: () => void
  className?: string
}

function CardThumbnail({ number }: { number?: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-16 shrink-0 flex-col justify-between rounded-lg bg-[var(--card-thumb-bg)] px-2 py-1.5"
    >
      <div className="flex">
        <span className="size-2.5 rounded-full bg-[var(--card-thumb-dot-a)]" />
        <span className="-ml-1 size-2.5 rounded-full bg-[var(--card-thumb-dot-b)]" />
      </div>
      {number && (
        <span className="text-right text-[10px] leading-none font-medium text-[var(--card-thumb-fg)]">
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
  subtitle,
  value,
  showThumbnail = true,
  thumbnailNumber,
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
        "flex min-h-20 items-center gap-6 rounded-3xl bg-[var(--card-bg)] px-6 py-4 transition-colors",
        clickable && "cursor-pointer hover:bg-[var(--card-bg-hover)]",
        className
      )}
    >
      {showThumbnail && <CardThumbnail number={thumbnailNumber} />}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 truncate font-medium text-[var(--card-title-fg)]">
              {title}
            </span>
            {titleSuffix && (
              <span className="shrink-0 text-[var(--card-meta-fg)]">
                · {titleSuffix}
              </span>
            )}
          </span>
          {tag && (
            <span className="shrink-0 rounded-md bg-[var(--card-tag-bg)] px-2 py-0.5 text-xs font-medium text-[var(--card-tag-fg)]">
              {tag}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="truncate text-xs text-[var(--card-meta-fg)]">
            {subtitle}
          </span>
        )}
      </div>

      {value && (
        <span className="max-w-[240px] shrink truncate text-right text-[var(--card-meta-fg)]">
          {value}
        </span>
      )}

      {menuItems && menuItems.length > 0 && (
        <SelectionButton items={menuItems} size="sm" direction="down-left" />
      )}
    </div>
  )
}

export { Card }
export type { CardProps }
