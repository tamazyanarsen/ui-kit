import type * as React from "react"

import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clock,
  ImageIcon,
} from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon, type IconName } from "@/components/ui/icon"

import { PaymentLogo } from "./payment-logo"
import {
  CARD_TYPES,
  ICON_STATUS_STYLE,
  isIconStatusType,
  SBP_TYPES,
  type PaymentSystem,
  type ThumbnailSize,
  type ThumbnailType,
} from "./variants"

const ICON_STATUS_GLYPH = {
  check: CircleCheck,
  question: CircleHelp,
  clock: Clock,
  alert: CircleAlert,
  "alert-red": CircleAlert,
} as const

// Thumbnail — "Миниатюра": a small icon/logo tile that marks the payment
// system on a card, or an object's status. Card-family types (card/sticker/
// sbp-card/sbp-card-account) render a dark tile with a payment mark;
// icon-status types (check/question/clock/alert/alert-red) render a light
// tinted tile with a glyph; "picture" is a custom illustration slot;
// "icon" is a light grey tile with any 24px glyph from the kit.
interface ThumbnailProps {
  type?: ThumbnailType
  size?: ThumbnailSize
  /**
   * Глиф для `type="icon"`. В Figma это instance swap внутри плитки, и по
   * умолчанию туда положено «многоточие» (`icon / more`) — отсюда прежнее
   * ошибочное имя варианта `more` (дизайн-чек №3 №4).
   */
  icon?: IconName | React.ReactNode
  disabled?: boolean
  paymentSystem?: PaymentSystem
  last4?: string
  showDot?: boolean
  count?: number
  src?: string
  alt?: string
  className?: string
}

function Thumbnail({
  type = "card",
  size = "l",
  icon = "ellipsis",
  disabled = false,
  paymentSystem = "mir",
  last4,
  showDot = false,
  count,
  src,
  alt = "",
  className,
}: ThumbnailProps) {
  const isCardFamily = CARD_TYPES.has(type)
  const isSbp = SBP_TYPES.has(type)
  const isIconStatus = isIconStatusType(type)
  const isIconTile = type === "icon"

  const badgeOffset = type === "picture" ? "top-[58%] right-[8%]" : "top-[-4px] right-[-8px]"
  const badge =
    count !== undefined ? (
      <Badge
        type="counter"
        value={count}
        disabled={disabled}
        className={cn("absolute z-10", badgeOffset)}
      />
    ) : showDot ? (
      <Badge type="point" disabled={disabled} className={cn("absolute z-10", badgeOffset)} />
    ) : null

  // Disabled is a flat opacity-50 on the whole tile for every type (matches
  // Figma's Disabled samples) — no per-type background-color swap.
  const containerClassName = disabled ? "opacity-50" : ""

  let bg: string | undefined
  if (isCardFamily) {
    bg = "var(--tag-black-bg)"
  } else if (isIconTile) {
    bg = "var(--tag-grey-secondary-bg)"
  } else if (isIconStatus) {
    bg = ICON_STATUS_STYLE[type].bg
  }
  // isSbp: left undefined — its dark tile is drawn by the inner absolutely
  // positioned layer(s) below instead of an outer fill (see isSbp block).

  return (
    <span
      data-slot="thumbnail"
      data-type={type}
      data-size={size}
      data-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-[8px]",
        // Size в мастере — три значения: `L / Desktop` (48), `M / Desktop`
        // (40) и `L-M / Mobile` (40), то есть на мобиле L и M совпадают.
        // Поэтому L отзывчив, а M одинаков всегда.
        size === "l" ? "size-10 desktop:size-12" : "size-10",
        containerClassName,
        className
      )}
      style={{ backgroundColor: bg }}
    >
      <span className="flex size-full items-center justify-center overflow-hidden rounded-[8px]">
        {isIconTile &&
          (typeof icon === "string" ? (
            <Icon
              name={icon}
              size={24}
              aria-hidden="true"
              className="size-6 text-[var(--tag-grey-secondary-fg)]"
            />
          ) : (
            icon
          ))}

        {(type === "card" || type === "sticker") && (
          <PaymentLogo system={paymentSystem} disabled={disabled} />
        )}

        {type === "picture" &&
          (src ? (
            <img src={src} alt={alt} className="size-full object-cover" />
          ) : (
            <ImageIcon size={24} aria-hidden="true" className="size-6 text-white/90" />
          ))}

        {isIconStatus && (() => {
          const Glyph = ICON_STATUS_GLYPH[type]
          return (
            <Glyph
              size={24}
              aria-hidden="true"
              className="size-6"
              style={{ color: ICON_STATUS_STYLE[type].fg }}
            />
          )
        })()}
      </span>

      {isSbp && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 overflow-hidden rounded-[4px]",
            type === "sbp-card-account" ? "bottom-[10%]" : "inset-y-0"
          )}
          style={{ backgroundColor: "var(--tag-black-bg)" }}
        >
          <span className="absolute right-1 bottom-1 flex flex-col items-end gap-0.5">
            <PaymentLogo system={paymentSystem} disabled={disabled} size="sm" />
            <span className="text-p4-regular text-white">
              · {last4 ?? "0000"}
            </span>
          </span>
        </span>
      )}

      {type === "sbp-card-account" && (
        <span
          aria-hidden="true"
          className="absolute inset-x-[2.5%] top-[92.5%] bottom-0 rounded-b-[4px]"
          style={{ backgroundColor: "var(--tag-black-bg)" }}
        />
      )}

      {type === "sticker" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 11 11"
          className="absolute right-0 bottom-0 size-[11px]"
        >
          <path
            d="M0 4C0 1.79086 1.79086 0 4 0H11V4C11 7.86599 7.86599 11 4 11H0V4Z"
            fill="var(--badge-dark-grey-bg)"
          />
        </svg>
      )}

      {badge}
    </span>
  )
}

export { Thumbnail }
export type { ThumbnailProps }
