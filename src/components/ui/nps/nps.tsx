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

/* Стаггер нижнего блока (дизайн-чек №3 №16). Держим тремя константами, а
   не тремя копиями строки: задержка у каждого элемента своя, всё остальное
   общее. */
const STAGGER_BASE = "transition-all duration-400 ease-out"
const STAGGER_IN = "translate-y-0 opacity-100"
const STAGGER_OUT = "translate-y-2 opacity-0"

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
  // Дизайн-чек №3 №15: «Чипсы должны отрабатывать по одной. Сейчас можно
  // накликать всё и тексты вставляются последовательно… Должен быть „выбор“
  // чипсы, она тогда становится тёмно-синей (активной). Если клиент в поле
  // ввода поменял текст — слетает выбор чипсы, но к нему можно вернуться,
  // повторно нажав на чипсу».
  //
  // То есть чип — не кнопка «дописать», а выбор одного готового ответа:
  // выбранным считается тот, чей текст сейчас лежит в поле. Поэтому
  // состояние хранится, но при любом расхождении с полем сбрасывается —
  // отдельного «снятия выбора» не нужно.
  const [selectedChip, setSelectedChip] = React.useState<string | null>(null)
  const activeChip = selectedChip === activeComment ? selectedChip : null

  function setRating(next: number) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function setComment(next: string) {
    if (comment === undefined) setInternalComment(next)
    onCommentChange?.(next)
  }

  function selectChip(chip: string) {
    setSelectedChip(chip)
    setComment(chip)
  }

  function handleSubmit() {
    if (!activeValue) return
    onSubmit?.({ value: activeValue, comment: activeComment })
  }

  const displayValue = hoverValue ?? activeValue
  const cardClassName = cn(
    "w-[360px] rounded-[16px] border border-[var(--nps-card-border)] bg-[var(--nps-card-bg)] shadow-[0px_8px_12px_rgba(0,0,0,0.06)]",
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
            stars.

            Дизайн-чек №35: подпись читает `activeValue`, а не `displayValue`
            — «надпись должна появляться только по факту выбора конкретной
            оценки». Раньше она бежала за курсором по звёздам ещё до выбора.
            Звёзды по наведению подсвечиваться продолжают: это обычная
            обратная связь на ховер, и к ней замечаний не было. */}
        <p
          className={cn(
            "text-center text-p1-medium text-[var(--nps-subtitle-fg)]",
            !activeValue && "invisible"
          )}
        >
          {activeValue ? RATING_LABELS[activeValue] : " "}
        </p>
      </div>

      {/* Дизайн-чек №3 №16: «Нужна плюс-минус плавная анимация „роста“ окна.
          Сейчас окно растёт рывком… нужно сделать плавное вырастание со
          стаггерами нижних элементов (текстареа, чипсы, кнопка)».

          Нижний блок теперь не монтируется по факту оценки, а всегда есть в
          разметке и раскрывается: grid-строка едет с 0fr до 1fr — это
          единственный способ анимировать высоту «по содержимому», не зная её
          заранее. Отрицательный `-mt-8` в свёрнутом виде гасит зазор
          родительского `gap-8`, иначе пустая строка занимала бы 32px.

          Стаггер сделан переходами с разной задержкой, а не keyframe-
          анимациями: keyframes проигрываются только при монтировании, а
          блок теперь живёт постоянно. */}
      <div
        aria-hidden={activeValue === null}
        className={cn(
          "grid w-full transition-all duration-500 ease-out",
          activeValue !== null ? "mt-0 grid-rows-[1fr]" : "-mt-8 grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex w-full flex-col items-start gap-8">
            {showDescription && (
              <p
                className={cn(
                  "w-full text-center text-p1-medium text-[var(--nps-title-fg)]",
                  STAGGER_BASE,
                  activeValue !== null ? STAGGER_IN : STAGGER_OUT
                )}
                style={{ transitionDelay: activeValue !== null ? "120ms" : "0ms" }}
              >
                Что можно улучшить?
              </p>
            )}

            <div
              className={cn(
                "flex w-full flex-col gap-4",
                STAGGER_BASE,
                activeValue !== null ? STAGGER_IN : STAGGER_OUT
              )}
              style={{ transitionDelay: activeValue !== null ? "200ms" : "0ms" }}
            >
              <Textarea
                label="Комментарий"
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
                      selected={activeChip === chip}
                      // Крестика у выбранного чипа тут нет: выбор снимается
                      // правкой текста в поле, а не кнопкой на самом чипе.
                      showClose={false}
                      aria-pressed={activeChip === chip}
                      onClick={() => selectChip(chip)}
                    >
                      {chip}
                    </FilterTable>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className={cn(
                "w-full",
                STAGGER_BASE,
                activeValue !== null ? STAGGER_IN : STAGGER_OUT
              )}
              style={{ transitionDelay: activeValue !== null ? "280ms" : "0ms" }}
              onClick={handleSubmit}
            >
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Nps }
export type { NpsProps }
