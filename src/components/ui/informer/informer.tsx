import * as React from "react"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  ICON_COLOR,
  ICON_COMPONENT,
  SOLID_BG,
  type InformerIcon,
  type InformerSolid,
} from "./variants"

// Informer — "Уведомление": a notification for use inside a content
// block. Noticeable but doesn't block the user's work; its size auto-fits
// the text. Width: min 360px, max unlimited (min drops to 240px for the
// link-only variant used in modals, per the spec's own exception note —
// callers control that via `className`, this component doesn't clamp
// width itself). Date/description/buttons/cross are all optional — the
// spec's minimal form is just icon + Title.
interface InformerProps {
  icon?: InformerIcon
  title: React.ReactNode
  date?: React.ReactNode
  description?: React.ReactNode
  solid?: InformerSolid
  showCross?: boolean
  onClose?: () => void
  mainButtonLabel?: React.ReactNode
  onMainButtonClick?: () => void
  additionalButtonLabel?: React.ReactNode
  onAdditionalButtonClick?: () => void
  className?: string
}

function Informer({
  icon = "attention-red",
  title,
  date,
  description,
  solid = "white",
  showCross = true,
  onClose,
  mainButtonLabel,
  onMainButtonClick,
  additionalButtonLabel,
  onAdditionalButtonClick,
  className,
}: InformerProps) {
  const Icon = ICON_COMPONENT[icon]

  return (
    <div
      data-slot="informer"
      // Design-check #27: padding/icon-gap read directly off the anatomy
      // sheet (ui/message/informer) — 24px padding (was 16, p-4) and a 16px
      // gap between the icon and the text column (was 12, gap-3).
      // Size=Mobile is a 328px card with 16px padding, Size=Desktop a
      // 592px one (min 400) with 24px — the min-width was 360 and the
      // padding was desktop-only.
      className={cn(
        "rounded-[16px] p-4 md:min-w-[400px] md:p-6",
        className
      )}
      style={{ backgroundColor: SOLID_BG[solid] }}
    >
      <div className="flex items-start gap-4">
        <Icon
          aria-hidden="true"
          className="size-6 shrink-0"
          style={{ color: ICON_COLOR[icon] }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {/* Mobile steps the whole text block down one notch:
                  Title 14/20 and date/description 12/16 (Size=Mobile,
                  node 70240:35984), against 16/24 and 14/20 on desktop. */}
              <span className="text-p2-medium text-[var(--informer-title-fg)] md:text-p1-medium">
                {title}
              </span>
              {date && (
                <span className="text-p3-medium text-[var(--informer-meta-fg)] md:text-p2-medium">
                  {date}
                </span>
              )}
            </div>
            {description && (
              <span className="text-p3-medium text-[var(--informer-description-fg)] md:text-p2-medium">
                {description}
              </span>
            )}
          </div>
          {(mainButtonLabel || additionalButtonLabel) && (
            <div className="flex items-center gap-2">
              {mainButtonLabel && (
                <Button
                  type="button"
                  variant="secondary-black"
                  size="sm"
                  onClick={onMainButtonClick}
                >
                  {mainButtonLabel}
                </Button>
              )}
              {additionalButtonLabel && (
                <Button
                  type="button"
                  variant="secondary-grey"
                  size="sm"
                  onClick={onAdditionalButtonClick}
                >
                  {additionalButtonLabel}
                </Button>
              )}
            </div>
          )}
        </div>
        {/* The cross is a sibling of the whole text Box in the master
            (v2.0.5, node 70240:35984) — one 16px-gap row of
            [icon 24][Box][cross] — not a child of the title line. Its
            `py-1` wrapper is what centres the 16px glyph against the 24px
            status icon; nested in the title row it sat 4px high, and the
            gap was 12px instead of 16. */}
        {showCross && (
          <span className="flex shrink-0 items-center py-1">
            <button
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
              className="flex text-[var(--informer-title-fg)] outline-none"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

export { Informer }
export type { InformerProps }
