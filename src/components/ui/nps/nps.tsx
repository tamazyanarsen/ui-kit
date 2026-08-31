import * as React from "react"

import { X } from "@/icons"
import { cn } from "@/lib/utils"

import { FeedbackPanel } from "./feedback-panel"
import { StarRating } from "./rating"

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
//
// Звёзды живут в `rating.tsx`, раскрывающийся низ карточки — в
// `feedback-panel.tsx`.

// Дизайн-чек №4 №10: тексты предлагаемых ответов — из описания компонента
// ДС (нода 64540:44922).
const DEFAULT_CHIPS = [
  "Долго заполнять",
  "Непонятно",
  "Неудобно подписывать",
  "Не понимаю статус платежа",
]

/**
 * Дизайн-чек №4 №13: «Show Chips» — не булев флаг, а выбор из None, 1–5
 * (таблица «Свойства компонента», нода 70326:40017): сколько предлагаемых
 * ответов показывать, `"none"` — не показывать вовсе.
 */
type NpsShowChips = "none" | 1 | 2 | 3 | 4 | 5

/**
 * Дизайн-чек №4 №11: «Estimate Type» — оценка None, 1–5 (элемент
 * «Estimate (ELK)», нода 70326:40173).
 */
type NpsEstimateType = 1 | 2 | 3 | 4 | 5

interface NpsProps {
  title?: React.ReactNode
  /** «Estimate Type»: 1–5 или `null` (None). */
  value?: NpsEstimateType | null
  defaultValue?: NpsEstimateType | null
  onValueChange?: (value: number) => void
  comment?: string
  onCommentChange?: (value: string) => void
  chips?: string[]
  showDescription?: boolean
  showChips?: NpsShowChips
  submitted?: boolean
  onSubmit?: (data: { value: number; comment: string }) => void
  onClose?: () => void
  className?: string
}

function CloseButton({
  onClose,
  className,
}: {
  onClose?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label="Закрыть"
      onClick={onClose}
      className={cn(
        "shrink-0 cursor-pointer text-[var(--nps-close-fg)] outline-none",
        className
      )}
    >
      {/* Figma's NPS card closes with `icon / close cross` at 24px
          (node 64534:44748). */}
      <X size={24} aria-hidden="true" className="size-6" />
    </button>
  )
}

const CARD_CLASS =
  "w-[360px] rounded-[16px] border border-[var(--nps-card-border)] bg-[var(--nps-card-bg)] shadow-[0px_8px_12px_rgba(0,0,0,0.06)]"

/** Состояние «Спасибо за оценку». */
function NpsDone({
  onClose,
  className,
}: {
  onClose?: () => void
  className?: string
}) {
  return (
    <div
      data-slot="nps"
      className={cn(
        CARD_CLASS,
        "flex flex-col items-center gap-8 pt-6 pr-6 pb-10 pl-6",
        className
      )}
    >
      <div className="flex w-full flex-col items-center">
        <CloseButton onClose={onClose} className="ml-auto" />
        {/* Дизайн-чек №3 №17: иллюстрация зависит от палитры, поэтому
            приходит токеном `--nps-done-image`, а не жёстким путём. Это
            фон, а не <img>: иначе выбор картинки пришлось бы тащить в JS
            и дублировать логику темы, которая целиком живёт в CSS. */}
        <div
          role="presentation"
          className="h-[176px] w-[232px] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "var(--nps-done-image)" }}
        />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-h3 text-[var(--nps-title-fg)]">Спасибо за оценку</p>
        <p className="text-p1-medium text-[var(--nps-subtitle-fg)]">
          Окно закроется автоматически
        </p>
      </div>
    </div>
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
  showChips = 5,
  submitted = false,
  onSubmit,
  onClose,
  className,
}: NpsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeValue = value !== undefined ? value : internalValue
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

  function setRating(next: NpsEstimateType) {
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

  if (submitted) return <NpsDone onClose={onClose} className={className} />

  return (
    <div
      data-slot="nps"
      className={cn(
        CARD_CLASS,
        "flex flex-col items-start gap-8 pt-6 pr-6 pl-6",
        activeValue !== null ? "pb-6" : "pb-10",
        className
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

      <StarRating value={activeValue} onChange={setRating} />

      <FeedbackPanel
        open={activeValue !== null}
        showDescription={showDescription}
        showChips={showChips !== "none"}
        chips={showChips === "none" ? [] : chips.slice(0, showChips)}
        activeChip={activeChip}
        onChipSelect={selectChip}
        comment={activeComment}
        onCommentChange={setComment}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export { Nps }
export type { NpsProps, NpsEstimateType, NpsShowChips }
