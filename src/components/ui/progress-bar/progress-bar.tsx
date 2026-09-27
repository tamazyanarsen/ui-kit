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

// ProgressBar — «Шкала прогресса». Два варианта, у которых общая строка
// Title/Description и необязательная группа «Status Line»:
// - `step` (по умолчанию): пошаговая полоса, разбитая на `totalSteps`
//   (2–10) равных отрезков — Done (сплошной), текущий шаг (Waiting:
//   диагональная штриховка) и None (пустая дорожка), то есть три состояния
//   элемента «Line Progress Bar (ELK)». По макету полностью залитая полоса
//   не показывается никогда: текущий шаг всегда рисуется штриховкой, даже
//   на последнем шаге («Полностью заполненный индикатор прогресса
//   пользователь никогда не увидит»).
// - `timeline`: одна непрерывная заливка (`value` от 0 до 100, без шагов).
//   Её цвет сам следует описанным диапазонам (0–50 успех, 50–99 внимание,
//   100 ошибка), если только его не перекрыть через `statusTimeline`.
// `status` независимо красит значение в Status Line (Default, Success,
// Attention, Error, Information) и к цвету заливки самой полосы отношения
// не имеет.
//
// Пропсы повторяют таблицу свойств компонента: Show Description /
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
// Bar (ELK) / Status=Waiting): полосы идут «/», шаг по
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
    // Дизайн-чек, замечание 43: по макету высота 8px (во всех
    // прямоугольниках вектора height="8"), а не 4px.
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
        {/* «Top»: заголовок прижимается к своему содержимому, а замыкающее
            описание забирает остаток строки и обрезается многоточием —
            именно заголовок резать нельзя ни при каких условиях. Ниже
            `desktop` шрифт уменьшается до P1 Medium Mobile (14/20). */}
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
        // «Status Line (ELK)» — зазор 16px, замыкающее описание тянется и
        // прижимается вправо.
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
