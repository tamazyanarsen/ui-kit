import * as React from "react"
import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clock,
  ImageIcon,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
// sbp-card/sbp-card-account/more) render a dark tile with a payment mark;
// icon-status types (check/question/clock/alert/alert-red) render a light
// tinted tile with a lucide glyph; "picture" is a custom illustration slot.
interface ThumbnailProps {
  type?: ThumbnailType
  size?: ThumbnailSize
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

  const badge =
    count !== undefined ? (
      <Badge
        type="counter"
        value={count}
        disabled={disabled}
        className="absolute -top-1.5 -right-1.5 z-10"
      />
    ) : showDot ? (
      <Badge
        type="point"
        disabled={disabled}
        className="absolute -top-1.5 -right-1.5 z-10"
      />
    ) : null

  let bg: string | undefined
  let containerClassName = ""

  if (isCardFamily) {
    bg = disabled ? "var(--tag-grey-bg)" : "var(--tag-black-bg)"
  } else if (isIconStatus) {
    bg = ICON_STATUS_STYLE[type].bg
    containerClassName = disabled ? "opacity-60" : ""
  } else {
    bg = "var(--tag-red-bg)"
    containerClassName = disabled ? "opacity-60" : ""
  }

  return (
    <span
      data-slot="thumbnail"
      data-type={type}
      data-size={size}
      data-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-visible",
        size === "l" ? "size-12 rounded-xl" : "size-10 rounded-lg",
        containerClassName,
        className
      )}
      style={{ backgroundColor: bg }}
    >
      <span
        className={cn(
          "flex size-full items-center justify-center overflow-hidden",
          size === "l" ? "rounded-xl" : "rounded-lg"
        )}
      >
        {type === "more" && (
          <MoreHorizontal
            aria-hidden="true"
            className={cn(
              size === "l" ? "size-6" : "size-5",
              disabled ? "text-white/50" : "text-white"
            )}
          />
        )}

        {(type === "card" || type === "sticker") && (
          <PaymentLogo system={paymentSystem} disabled={disabled} />
        )}

        {isSbp && (
          <span className="flex flex-col items-start gap-0.5 px-1.5">
            <PaymentLogo system={paymentSystem} disabled={disabled} />
            <span
              className={cn(
                "text-[9px] leading-none",
                disabled ? "text-white/60" : "text-white/85"
              )}
            >
              · {last4 ?? "0000"}
            </span>
          </span>
        )}

        {type === "picture" &&
          (src ? (
            <img
              src={src}
              alt={alt}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon aria-hidden="true" className="size-5 text-white/90" />
          ))}

        {isIconStatus && (() => {
          const Glyph = ICON_STATUS_GLYPH[type]
          return (
            <Glyph
              aria-hidden="true"
              className={size === "l" ? "size-6" : "size-5"}
              style={{ color: ICON_STATUS_STYLE[type].fg }}
            />
          )
        })()}
      </span>

      {type === "sticker" && (
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 size-3.5 rounded-tl-sm rounded-br-xl bg-white/50"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
      )}

      {type === "sbp-card-account" && (
        <span
          aria-hidden="true"
          className="absolute inset-x-1.5 -bottom-1 h-1.5 rounded-b-md"
          style={{ backgroundColor: bg, opacity: 0.7 }}
        />
      )}

      {badge}
    </span>
  )
}

export { Thumbnail }
export type { ThumbnailProps }
