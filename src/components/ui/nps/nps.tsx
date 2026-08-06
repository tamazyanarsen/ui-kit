import * as React from "react"
import { Star, X } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FilterTable } from "@/components/ui/filter-table"
import { Textarea } from "@/components/ui/textarea"

import doneIllustration from "@/assets/nps/done-illustration.png"

const RATING_LABELS: Record<number, string> = {
  1: "Очень плохо",
  2: "Плохо",
  3: "Нормально",
  4: "Хорошо",
  5: "Отлично",
}

const DEFAULT_CHIPS = [
  "Долго заполнять",
  "Непонятно",
  "Неудобно подписывать",
  "Не понимаю статус платежа",
]

// NPS — "Обратная связь": a feedback card (5-star rating → comment + quick-
// reply chips → submit → "Спасибо за оценку" done state). Per spec the
// done state "автоматически исчезает через 2000 ms" — modeled here via
// onOpenChange/onClose rather than a timer inside the card itself, so the
// consumer decides whether/how the card is actually removed from the DOM.
// Chips are the same fixed set at every rating (confirmed against the
// spec's own 1–4 star swatches, all showing identical chip text) rather
// than varying per score, so they're a plain default list, not derived
// from `value`. The done-state illustration is a real asset extracted from
// the Figma export (same policy as ErrorPage's mascots) — not redrawn.
interface NpsProps {
  title?: React.ReactNode
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number) => void
  comment?: string
  onCommentChange?: (value: string) => void
  chips?: string[]
  showDescription?: boolean
  showChips?: boolean
  submitted?: boolean
  onSubmit?: (data: { value: number; comment: string }) => void
  onClose?: () => void
  className?: string
}

function CloseButton({ onClose, className }: { onClose?: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Закрыть"
      onClick={onClose}
      className={cn("shrink-0 cursor-pointer text-[var(--nps-close-fg)] outline-none", className)}
    >
      {/* Figma's NPS card closes with `icon / close cross` at 24px
          (node 64534:44748). */}
      <X size={24} aria-hidden="true" className="size-6" />
    </button>
  )
}

function Nps({
  title = "Оцените процесс отправки платёжных поручений",
  value,
  defaultValue = null,
  onValueChange,
  comment,
  onCommentChange,
  chips = DEFAULT_CHIPS,
  showDescription = true,
  showChips = true,
  submitted = false,
  onSubmit,
  onClose,
  className,
}: NpsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeValue = value !== undefined ? value : internalValue
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const [internalComment, setInternalComment] = React.useState("")
  const activeComment = comment ?? internalComment

  function setRating(next: number) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function setComment(next: string) {
    if (comment === undefined) setInternalComment(next)
    onCommentChange?.(next)
  }

  function handleSubmit() {
    if (!activeValue) return
    onSubmit?.({ value: activeValue, comment: activeComment })
  }

  const displayValue = hoverValue ?? activeValue
  const cardClassName = cn(
    "w-[360px] rounded-[16px] border border-[#EFEFEF] bg-white shadow-[0px_8px_12px_rgba(0,0,0,0.06)]",
    className
  )

  if (submitted) {
    return (
      <div data-slot="nps" className={cn(cardClassName, "flex flex-col items-center gap-8 pt-6 pr-6 pb-10 pl-6")}>
        <div className="flex w-full flex-col items-center">
          <CloseButton onClose={onClose} className="ml-auto" />
          <img src={doneIllustration} alt="" aria-hidden="true" className="h-[176px] w-[232px] object-contain" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-h3 text-[var(--nps-title-fg)]">
            Спасибо за оценку
          </p>
          <p className="text-p1-medium text-[var(--nps-subtitle-fg)]">
            Окно закроется автоматически
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="nps"
      className={cn(
        cardClassName,
        "flex flex-col items-start gap-8 pt-6 pr-6 pl-6",
        activeValue !== null ? "pb-6" : "pb-10"
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span className="text-p1-medium text-[var(--nps-subtitle-fg)]">
          Обратная связь
        </span>
        <CloseButton onClose={onClose} />
      </div>

      <p className="flex min-h-12 w-full items-center justify-center text-center text-p1-medium text-[var(--nps-title-fg)]">
        {title}
      </p>

      <div className="flex w-full flex-col items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Оценка"
          className="flex items-center justify-center gap-3"
          onMouseLeave={() => setHoverValue(null)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = displayValue !== null && star <= displayValue
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={activeValue === star}
                aria-label={`${star} из 5, ${RATING_LABELS[star]}`}
                onMouseEnter={() => setHoverValue(star)}
                onClick={() => setRating(star)}
                className="cursor-pointer outline-none"
              >
                <Star
                  aria-hidden="true"
                  filled={filled}
                  className={cn(
                    "size-8",
                    filled
                      ? "text-[var(--nps-star-fg)]"
                      : "text-[var(--nps-star-empty-fg)]"
                  )}
                />
              </button>
            )
          })}
        </div>
        {/* Design-check #42: always rendered (with a reserved-space
            placeholder when empty) instead of conditionally mounting — the
            conditional version collapsed to 0 height between hovers, so the
            card kept growing/shrinking as the cursor moved across the
            stars. */}
        <p
          className={cn(
            "text-center text-p1-medium text-[var(--nps-subtitle-fg)]",
            !displayValue && "invisible"
          )}
        >
          {displayValue ? RATING_LABELS[displayValue] : " "}
        </p>
      </div>

      {activeValue !== null && (
        <>
          {showDescription && (
            <p className="w-full text-center text-p1-medium text-[var(--nps-title-fg)]">
              Что можно улучшить?
            </p>
          )}

          <div className="flex w-full flex-col gap-4">
            <Textarea
              label="Комментарий"
              rows={3}
              value={activeComment}
              onChange={(e) => setComment(e.target.value)}
            />

            {showChips && (
              <div className="flex flex-wrap gap-2">
                {/* Figma builds these from `ELK / filter-table` in its
                    unselected (Checked=False) look — the frame is named
                    "Chips" on the canvas, but the instances inside are
                    filter-table, not `ELK / chips` (node 64534:44873). */}
                {chips.map((chip) => (
                  <FilterTable
                    key={chip}
                    onClick={() =>
                      setComment(activeComment ? `${activeComment} ${chip}` : chip)
                    }
                  >
                    {chip}
                  </FilterTable>
                ))}
              </div>
            )}
          </div>

          <Button type="button" variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
            Отправить
          </Button>
        </>
      )}
    </div>
  )
}

export { Nps }
export type { NpsProps }
