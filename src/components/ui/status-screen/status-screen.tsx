import * as React from "react"
import {
  Check,
  X,
  CircleAlert,
  CircleHelp,
  Search,
  Lock,
  Pencil,
  Clock,
} from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Status Screen — "Экран результата операции": a result-of-action template
// (icon + Title + Subtitle + Button(s)). The spec's illustration is a
// bespoke 3D mascot per status (a whole scene, not just an icon) — same
// call as ErrorPage/GosuslugiLogo elsewhere in this kit: a flat colored
// badge icon stands in rather than vendoring that artwork.
//
// The spec's own "Type" property (Primary/Secondary/Two Buttons) and "Show
// Buttons" toggle are both just derived here from which button label props
// are passed — matching EmptySearchResults/ErrorPage's convention of
// content-presence controlling visibility, rather than a redundant enum.

type StatusType =
  | "success"
  | "error"
  | "attention"
  | "question"
  | "search"
  | "clock"
  | "lock"
  | "edit"
  | "search-attention"
  | "time-attention"

const STATUS_ICON: Record<StatusType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  success: Check,
  error: X,
  attention: CircleAlert,
  question: CircleHelp,
  search: Search,
  clock: Clock,
  lock: Lock,
  edit: Pencil,
  "search-attention": Search,
  "time-attention": Clock,
}

// Figma groups the 10 mascots into 3 color families regardless of icon:
// green (Success/Search/Clock), red (Error), amber (Attention/Question/Lock/
// Edit/Search(Attention)/Time(Attention)) — Question shares Attention's
// amber, it is not a neutral/grey state.
const STATUS_COLOR: Record<StatusType, { bg: string; fg: string }> = {
  success: { bg: "var(--status-screen-success-bg)", fg: "var(--status-screen-success-fg)" },
  clock: { bg: "var(--status-screen-success-bg)", fg: "var(--status-screen-success-fg)" },
  search: { bg: "var(--status-screen-success-bg)", fg: "var(--status-screen-success-fg)" },
  error: { bg: "var(--status-screen-error-bg)", fg: "var(--status-screen-error-fg)" },
  attention: { bg: "var(--status-screen-attention-bg)", fg: "var(--status-screen-attention-fg)" },
  question: { bg: "var(--status-screen-attention-bg)", fg: "var(--status-screen-attention-fg)" },
  lock: { bg: "var(--status-screen-attention-bg)", fg: "var(--status-screen-attention-fg)" },
  edit: { bg: "var(--status-screen-attention-bg)", fg: "var(--status-screen-attention-fg)" },
  "search-attention": {
    bg: "var(--status-screen-attention-bg)",
    fg: "var(--status-screen-attention-fg)",
  },
  "time-attention": {
    bg: "var(--status-screen-attention-bg)",
    fg: "var(--status-screen-attention-fg)",
  },
}

interface StatusScreenProps {
  status?: StatusType
  title: React.ReactNode
  subtitle?: React.ReactNode
  primaryLabel?: React.ReactNode
  onPrimaryClick?: () => void
  secondaryLabel?: React.ReactNode
  onSecondaryClick?: () => void
  className?: string
}

function StatusScreen({
  status = "success",
  title,
  subtitle,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  className,
}: StatusScreenProps) {
  const Icon = STATUS_ICON[status]
  const { bg, fg } = STATUS_COLOR[status]

  return (
    <div
      data-slot="status-screen"
      className={cn(
        "flex flex-col items-center gap-8 px-6 py-10 text-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: bg }}
      >
        <Icon className="size-8" style={{ color: fg }} strokeWidth={2.5} />
      </span>

      <div className="flex flex-col gap-4">
        <h2 className="text-h3 text-[var(--status-screen-title-fg)]">
          {title}
        </h2>

        {subtitle && (
          // Figma's Title/Subtitle column is `w-full` inside the 768px
          // screen — the 384px cap wrapped subtitles a line early.
          <p className="w-full text-p1-medium text-[var(--status-screen-title-fg)]">
            {subtitle}
          </p>
        )}
      </div>

      {(primaryLabel || secondaryLabel) && (
        <div className="flex items-center gap-6">
          {primaryLabel && (
            <Button type="button" variant="primary" size="lg" onClick={onPrimaryClick}>
              {primaryLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button type="button" variant="secondary-grey" size="lg" onClick={onSecondaryClick}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { StatusScreen }
export type { StatusScreenProps, StatusType }
