import * as React from "react"
import { Star, X } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

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
// from `value`.
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

  if (submitted) {
    return (
      <div
        data-slot="nps"
        className={cn(
          "w-80 rounded-2xl bg-white p-6 text-center shadow-lg ring-1 ring-foreground/10",
          className
        )}
      >
        <p className="text-base font-semibold text-[var(--nps-title-fg)]">
          Спасибо за оценку
        </p>
        <p className="mt-1 text-sm text-[var(--nps-subtitle-fg)]">
          Окно закроется автоматически
        </p>
      </div>
    )
  }

  return (
    <div
      data-slot="nps"
      className={cn(
        "w-80 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-foreground/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-[var(--nps-subtitle-fg)]">
          Обратная связь
        </span>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="shrink-0 text-[var(--nps-subtitle-fg)] outline-none"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>

      <p className="mt-3 text-center text-base font-semibold text-[var(--nps-title-fg)]">
        {title}
      </p>

      <div
        role="radiogroup"
        aria-label="Оценка"
        className="mt-4 flex items-center justify-center gap-1"
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
              className="outline-none"
            >
              <Star
                aria-hidden="true"
                filled={filled}
                className={cn(
                  "size-6",
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
          card kept growing/shrinking as the cursor moved across the stars. */}
      <p
        className={cn(
          "mt-1 text-center text-xs text-[var(--nps-subtitle-fg)]",
          !displayValue && "invisible"
        )}
      >
        {displayValue ? RATING_LABELS[displayValue] : " "}
      </p>

      {activeValue !== null && (
        <>
          {showDescription && (
            <p className="mt-4 text-center text-sm font-semibold text-[var(--nps-title-fg)]">
              Что можно улучшить?
            </p>
          )}

          <Textarea
            label="Комментарий"
            rows={3}
            value={activeComment}
            onChange={(e) => setComment(e.target.value)}
            containerClassName="mt-3"
          />

          {showChips && (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() =>
                    setComment(activeComment ? `${activeComment} ${chip}` : chip)
                  }
                  className="rounded-full bg-[var(--nps-chip-bg)] px-4 py-1.5 text-sm text-[var(--nps-chip-fg)] outline-none hover:bg-[var(--nps-chip-bg-hover)]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            className="mt-4 w-full"
            onClick={handleSubmit}
          >
            Отправить
          </Button>
        </>
      )}
    </div>
  )
}

export { Nps }
export type { NpsProps }
