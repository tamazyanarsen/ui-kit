import * as React from "react"

import { cn } from "@/lib/utils"

import {
  STATUS_FG,
  TIMELINE_FG,
  timelineColorForValue,
  type ProgressBarStatus,
  type ProgressBarTimelineColor,
  type ProgressBarVariant,
} from "./variants"

// ProgressBar — "Шкала прогресса". Two variants sharing one Title/Label +
// optional Subtitle/Description frame:
// - `step` (default): a wizard-style bar split into `totalSteps` (2–10)
//   equal segments — done (solid), the current step (diagonal hatch,
//   "waiting"), and not-yet-reached (flat track). Per the spec, a fully
//   solid bar is never shown — the current step always renders hatched,
//   even on the last step ("Полностью заполненный индикатор прогресса
//   пользователь никогда не увидит").
// - `timeline`: a single continuous fill (0–100 `value`, no steps). Its
//   color auto-follows the documented ranges (0–50 green, 50–99 amber, 100
//   red) unless `color` overrides it.
// `status` independently colors the Subtitle line (Default/Success/
// Attention/Error/Information) — unrelated to the bar's own fill color.
interface ProgressBarProps {
  variant?: ProgressBarVariant
  title: React.ReactNode
  label?: React.ReactNode
  subtitle?: React.ReactNode
  description?: React.ReactNode
  status?: ProgressBarStatus
  totalSteps?: number
  currentStep?: number
  value?: number
  color?: ProgressBarTimelineColor
  className?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

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
        style={{
          flex: "1 1 0%",
          backgroundImage:
            "repeating-linear-gradient(-45deg, var(--progress-step-hatch) 0, var(--progress-step-hatch) 3px, transparent 3px, transparent 6px)",
        }}
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
  color,
}: {
  value: number
  color?: ProgressBarTimelineColor
}) {
  const clamped = clamp(value, 0, 100)
  const resolvedColor = color ?? timelineColorForValue(clamped)

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--progress-track-bg)]">
      <div
        aria-hidden="true"
        className="h-full rounded-full transition-[width]"
        style={{
          width: `${clamped}%`,
          backgroundColor: TIMELINE_FG[resolvedColor],
        }}
      />
    </div>
  )
}

function ProgressBar({
  variant = "step",
  title,
  label,
  subtitle,
  description,
  status = "default",
  totalSteps = 2,
  currentStep = 1,
  value = 0,
  color,
  className,
}: ProgressBarProps) {
  return (
    <div data-slot="progress-bar" className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium text-[var(--progress-title-fg)]">
          {title}
        </span>
        {label && (
          <span className="shrink-0 font-medium text-[var(--progress-title-fg)]">
            {label}
          </span>
        )}
      </div>

      {variant === "step" ? (
        <StepTrack totalSteps={totalSteps} currentStep={currentStep} />
      ) : (
        <TimelineTrack value={value} color={color} />
      )}

      {(subtitle || description) && (
        <div className="flex items-baseline gap-4 text-sm">
          {subtitle && (
            <span style={{ color: STATUS_FG[status] }}>{subtitle}</span>
          )}
          {description && (
            <span className="ml-auto shrink-0 text-[var(--progress-meta-fg)]">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { ProgressBar }
export type { ProgressBarProps }
