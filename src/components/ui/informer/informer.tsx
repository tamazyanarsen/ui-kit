import * as React from "react"
import { X } from "lucide-react"

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
      className={cn(
        "min-w-[360px] rounded-2xl p-4",
        className
      )}
      style={{ backgroundColor: SOLID_BG[solid] }}
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0"
          style={{ color: ICON_COLOR[icon] }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-3">
            <span className="font-medium text-[var(--informer-title-fg)]">
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
            <span className="text-sm text-[var(--informer-meta-fg)]">
              {date}
            </span>
          )}
          {description && (
            <span className="text-sm text-[var(--informer-title-fg)]">
              {description}
            </span>
          )}
          {(mainButtonLabel || additionalButtonLabel) && (
            <div className="mt-1.5 flex items-center gap-2">
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
