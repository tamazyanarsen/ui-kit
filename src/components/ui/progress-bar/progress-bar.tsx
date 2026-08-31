import * as React from "react"

import { cn } from "@/lib/utils"

import {
  STATUS_FG,
  TIMELINE_FG,
  timelineColorForValue,
  type ProgressBarStatus,
  type ProgressBarStatusLine,
  type ProgressBarStatusTimeline,
  type ProgressBarVariant,
} from "./variants"

// ProgressBar — "Шкала прогресса". Two variants sharing one Title/Description
// row and an optional "Status Line" group:
// - `step` (default): a wizard-style bar split into `totalSteps` (2–10)
//   equal segments — Done (solid), the current step (Waiting: diagonal
//   hatch) and None (flat track), i.e. the three states of the
//   "Line Progress Bar (ELK)" element. Per the spec, a fully solid bar is
//   never shown — the current step always renders hatched, even on the last
//   step ("Полностью заполненный индикатор прогресса пользователь никогда
//   не увидит").
// - `timeline`: a single continuous fill (0–100 `value`, no steps). Its
//   color auto-follows the documented ranges (0–50 success, 50–99 attention,
//   100 error) unless `statusTimeline` overrides it.
// `status` independently colors the Status Line's Value (Default/Success/
// Attention/Error/Information) — unrelated to the bar's own fill color.
//
// Props mirror the Figma property table (70333:2365): Show Description /
// Show Status / Show Timeline / Line / Status Line / Status / Status
// Timeline.
interface ProgressBarProps {
  variant?: ProgressBarVariant
  title: React.ReactNode
  /** Top-row trailing text (Figma "Description" в блоке Top). */
  description?: React.ReactNode
  /** Figma "Show Description" — скрывает Description в строке Title. */
  showDescription?: boolean
  /** Figma "Show Timeline" — скрывает саму шкалу. */
  showTimeline?: boolean
  /** Figma "Show Status" — скрывает всю группу Status Line. */
  showStatus?: boolean
  /** Figma "Status Line" — какие элементы группы показаны. */
  statusLine?: ProgressBarStatusLine
  /** Status Line: «Value» — красится пропом `status`. */
  subtitle?: React.ReactNode
  /** Status Line: правый текст «Description». */
  statusDescription?: React.ReactNode
  status?: ProgressBarStatus
  totalSteps?: number
  currentStep?: number
  value?: number
  statusTimeline?: ProgressBarStatusTimeline
  className?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Дизайн-чек №4 №2: штриховка «Waiting» замерена по Figma (Line Progress
// Bar (ELK) / Status=Waiting, 70333:2316): полосы идут «/», шаг по
// горизонтали 16px при толщине 6.1px, что на оси градиента даёт период
// 10px и полосу 3.8px под углом 38.7° к горизонтали. Прежние 3px/6px были
// вдвое мельче спецификации.
const WAITING_HATCH =
  "repeating-linear-gradient(-38.7deg, var(--progress-step-hatch) 0, var(--progress-step-hatch) 3.8px, transparent 3.8px, transparent 10px)"

function StepTrack({
  totalSteps,
  currentStep,
}: {
  totalSteps: number
  currentStep: number
}) {
  const total = clamp(Math.round(totalSteps), 2, 10)
  const current = clamp(Math.round(currentStep), 1, total)
  const done = current - 1
  const notDone = total - current

  return (
    // Design-check #43: 8px per the Figma source (ui/progress-bar/*.svg
    // rects are all height="8"), not 4px.
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--progress-track-bg)]">
      <div
        aria-hidden="true"
        className="h-full bg-[var(--progress-step-fill)]"
        style={{ flex: `${done} ${done} 0%` }}
      />
      <div
        aria-hidden="true"
        className="h-full"
        style={{ flex: "1 1 0%", backgroundImage: WAITING_HATCH }}
      />
      <div
        aria-hidden="true"
        className="h-full"
        style={{ flex: `${notDone} ${notDone} 0%` }}
      />
    </div>
  )
}

function TimelineTrack({
  value,
  statusTimeline,
}: {
  value: number
  statusTimeline?: ProgressBarStatusTimeline
}) {
  const clamped = clamp(value, 0, 100)
  const resolved = statusTimeline ?? timelineColorForValue(clamped)

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--progress-track-bg)]">
      <div
        aria-hidden="true"
        className="h-full rounded-full transition-[width]"
        style={{
          width: `${clamped}%`,
          backgroundColor: TIMELINE_FG[resolved],
        }}
      />
    </div>
  )
}

function ProgressBar({
  variant = "step",
  title,
  description,
  showDescription = true,
  showTimeline = true,
  showStatus = true,
  statusLine = "subtitle-description",
  subtitle,
  statusDescription,
  status = "default",
  totalSteps = 2,
  currentStep = 1,
  value = 0,
  statusTimeline,
  className,
}: ProgressBarProps) {
  // Status Line: `statusLine` решает, какие слоты группы видны, `showStatus`
  // гасит группу целиком (Figma "Show Status").
  const showSubtitle =
    showStatus && statusLine !== "description" && Boolean(subtitle)
  const showStatusDescription =
    showStatus && statusLine !== "subtitle" && Boolean(statusDescription)

  return (
    <div data-slot="progress-bar" className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        {/* "Top" (node 70333:2141/70333:1981): Title hugs its content, the
            trailing Description takes the rest of the row and ellipsizes —
            the title is the one line that must never be cut. Type shrinks to
            P1 Medium Mobile (14/20) below `desktop`. */}
        <div className="flex items-start gap-2 text-p2-medium text-[var(--progress-title-fg)] desktop:text-p1-medium">
          <span className="shrink-0">{title}</span>
          {showDescription && description && (
            <span className="min-w-0 flex-1 truncate text-right">
              {description}
            </span>
          )}
        </div>

        {showTimeline &&
          (variant === "step" ? (
            <StepTrack totalSteps={totalSteps} currentStep={currentStep} />
          ) : (
            <TimelineTrack value={value} statusTimeline={statusTimeline} />
          ))}
      </div>

      {(showSubtitle || showStatusDescription) && (
        // "Status Line (ELK)" (node 70333:2242) — 16px gap, the trailing
        // description grows and right-aligns.
        <div className="flex items-center gap-4 text-p2-medium desktop:text-p1-medium">
          {showSubtitle && (
            <span className="shrink-0" style={{ color: STATUS_FG[status] }}>
              {subtitle}
            </span>
          )}
          {showStatusDescription && (
            <span className="min-w-0 flex-1 truncate text-right text-[var(--progress-meta-fg)]">
              {statusDescription}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { ProgressBar }
export type { ProgressBarProps }
