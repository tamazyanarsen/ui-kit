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
      className={cn(
        "min-w-[360px] rounded-[16px] p-6",
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
              <div className="flex items-start justify-between gap-3">
                <span className="text-p1-medium text-[var(--informer-title-fg)]">
                  {title}
                </span>
                {showCross && (
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={onClose}
                    className="shrink-0 text-[var(--informer-title-fg)] outline-none"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                )}
              </div>
              {date && (
                <span className="text-p2-medium text-[var(--informer-meta-fg)]">
                  {date}
                </span>
              )}
            </div>
            {description && (
              <span className="text-p2-medium text-[var(--informer-description-fg)]">
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
      </div>
    </div>
  )
}

export { Informer }
export type { InformerProps }
