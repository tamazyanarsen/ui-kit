import * as React from "react"

import { cn } from "@/lib/utils"
import { useFloatingCornerInset } from "@/lib/use-floating-corner-inset"

import { CARD_CLASS, CloseButton, FLOATING_CLASS, NpsDone } from "./done"
import { FeedbackPanel } from "./feedback-panel"
import { StarRating } from "./rating"

// NPS — «Обратная связь»: карточка отзыва (оценка пятью звёздами →
// комментарий и чипы быстрых ответов → отправка → состояние «Спасибо за
// оценку»). По макету состояние завершения «автоматически исчезает через
// 2000 ms»: через `autoCloseMs` карточка вызывает `onClose`, а убирать ли её
// из DOM и как именно, по-прежнему решает потребитель. Чипы — один и тот же фиксированный набор при любой
// оценке (сверено с собственными образцами макета на 1–4 звезды, где текст
// чипов везде одинаков), а не меняющийся по баллу, поэтому это обычный
// список по умолчанию, а не производная от `value`. Иллюстрация состояния
// завершения — настоящий ассет из выгрузки макета (та же политика, что и с
// маскотами ErrorPage), а не перерисовка.
//
// Звёзды живут в `rating.tsx`, раскрывающийся низ карточки — в
// `feedback-panel.tsx`.

// Дизайн-чек №4 №10: тексты предлагаемых ответов — из описания компонента
// ДС.
const DEFAULT_CHIPS = [
  "Долго заполнять",
  "Непонятно",
  "Неудобно подписывать",
  "Не понимаю статус платежа",
]

/**
 * Дизайн-чек №4 №13: «Show Chips» — не булев флаг, а выбор из None, 1–5
 * (таблица «Свойства компонента»): сколько предлагаемых
 * ответов показывать, `"none"` — не показывать вовсе.
 */
type NpsShowChips = "none" | 1 | 2 | 3 | 4 | 5

/**
 * Дизайн-чек №4 №11: «Estimate Type» — оценка None, 1–5 (элемент
 * «Estimate (ELK)»).
 */
type NpsEstimateType = 1 | 2 | 3 | 4 | 5

/**
 * Вопрос под звёздами зависит от оценки.
 *
 * Дизайн-чек от 07.09, замечание 22: «Когда оценка „Отлично“ — не
 * спрашиваем, что можно улучшить. Вопрос звучит в этом случае иначе».
 * Раньше строка была одна на все пять оценок, и высшая оценка получала
 * «Что можно улучшить?» — то есть карточка просила пожаловаться того, кто
 * только что похвалил.
 *
 * ⚠️ Формулировка для пятёрки поставлена по смыслу: матрица вопросов лежит
 * в файле `ESnThXjNXu55oAZWZJEKra`, к которому у сборки
 * нет доступа. Правило («у высшей оценки вопрос другой») реализовано, текст
 * подлежит сверке — и переопределяется пропом `question`.
 */
const TOP_RATING = 5

/**
 * ⚠️ Сравнение, а не поиск по словарю с ключами 1…5. Словарь молча отдаёт
 * `undefined` на всём, что пришло не тем типом (например строкой «5» из
 * URL-аргумента Storybook), и вопрос пропадает целиком вместо того, чтобы
 * ошибиться формулировкой.
 */
function ratingQuestion(value: NpsEstimateType) {
  return Number(value) >= TOP_RATING
    ? "Что понравилось больше всего?"
    : "Что можно улучшить?"
}

interface NpsSubmitData {
  value: number
  comment: string
  /** Выбранные чипы в порядке их показа. */
  chips: string[]
}

interface NpsProps {
  title?: React.ReactNode
  /** «Estimate Type»: 1–5 или `null` (None). */
  value?: NpsEstimateType | null
  defaultValue?: NpsEstimateType | null
  onValueChange?: (value: number) => void
  comment?: string
  onCommentChange?: (value: string) => void
  chips?: string[]
  /**
   * Выбранные чипы (управляемо). Дизайн-чек 08.10, замечание 16: чипы — это
   * дополнительные данные от клиента, отдельный мультивыбор; текст
   * комментария от них не зависит и ими не затирается.
   */
  selectedChips?: string[]
  defaultSelectedChips?: string[]
  onSelectedChipsChange?: (chips: string[]) => void
  showDescription?: boolean
  /**
   * Вопрос под звёздами. По умолчанию считается от оценки — см.
   * {@link RATING_QUESTION}.
   */
  question?: React.ReactNode
  showChips?: NpsShowChips
  submitted?: boolean
  /**
   * Показать карточку плавающим окном в правом нижнем углу вьюпорта.
   *
   * Дизайн-чек от 07.09, замечание 21: «Убедиться, что у NPS выше z-index,
   * чем у тостов… окно складывает тосты в стопку и накрывает их, если во
   * вьюпорте мало высоты». Пока карточка была просто узлом в потоке, её
   * слой зависел от места вставки, и «выше тостов» не гарантировалось
   * ничем. В плавающем режиме слой берётся из общего порядка
   * (`--z-nps`, styles/tokens-surfaces.css) — он выше `--z-toast`.
   */
  floating?: boolean
  /** Оценка, свободный комментарий и выбранные чипы — три независимых поля. */
  onSubmit?: (data: NpsSubmitData) => void
  onClose?: () => void
  /**
   * Через сколько миллисекунд после «Спасибо за оценку» вызвать `onClose`.
   * По макету — 2000. `0` отключает автозакрытие.
   */
  autoCloseMs?: number
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
  selectedChips,
  defaultSelectedChips = [],
  onSelectedChipsChange,
  showDescription = true,
  question,
  floating = false,
  showChips = 5,
  submitted = false,
  onSubmit,
  onClose,
  autoCloseMs = 2000,
  className,
}: NpsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  // Оценка вне 1–5 (0 из формы по умолчанию, NaN, строка «5» из URL) — это
  // «оценки нет»: ноль раскрывал форму и рисовал под звёздами голый «0».
  const rawValue = value !== undefined ? value : internalValue
  const numericValue = Math.round(Number(rawValue))
  const activeValue: NpsEstimateType | null =
    rawValue !== null && numericValue >= 1 && numericValue <= TOP_RATING
      ? (numericValue as NpsEstimateType)
      : null
  const [internalComment, setInternalComment] = React.useState("")
  const activeComment = comment ?? internalComment
  // Дизайн-чек 08.10, замечание 16 (заменяет №3 №15 «чип = готовый текст в
  // поле»): «текст комментария не зависит от чипсов, чипсы — это доп. данные
  // от клиента, не затирающие его текст». Чипы — независимый мультивыбор,
  // в поле комментария они больше ничего не пишут.
  const [internalChips, setInternalChips] = React.useState(defaultSelectedChips)
  const activeChips = selectedChips ?? internalChips

  // «Спасибо» → снова форма (управляемый `submitted` вернули в false): новый
  // опрос не должен открываться с оценкой и комментарием прошлого. Сбрасывается
  // только собственное состояние; управляемые `value`/`comment` остаются за
  // потребителем. Корректировка во время рендера — без кадра со старой формой.
  const [wasSubmitted, setWasSubmitted] = React.useState(submitted)
  if (wasSubmitted !== submitted) {
    setWasSubmitted(submitted)
    if (wasSubmitted && !submitted) {
      setInternalValue(defaultValue)
      setInternalComment("")
      setInternalChips(defaultSelectedChips)
    }
  }

  function setRating(next: NpsEstimateType) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function setComment(next: string) {
    if (comment === undefined) setInternalComment(next)
    onCommentChange?.(next)
  }

  function toggleChip(chip: string) {
    const next = activeChips.includes(chip)
      ? activeChips.filter((item) => item !== chip)
      : [...activeChips, chip]
    if (selectedChips === undefined) setInternalChips(next)
    onSelectedChipsChange?.(next)
  }

  // Где фокус — внутри формы или нет. Читается в тот рендер, в котором
  // форму сменяет «Спасибо за оценку», то есть до её размонтирования.
  const focusInside = React.useRef(false)

  // Плавающая карточка занимает правый нижний угол — публикует его высоту,
  // чтобы кнопка «Наверх» вставала над ней, а не под неё.
  const cardRef = useFloatingCornerInset<HTMLDivElement>(floating)

  // Пустые подписи отбрасываются до среза: пустая плашка занимала место
  // в наборе и уменьшала число настоящих.
  const visibleChips =
    showChips === "none"
      ? []
      : chips.filter((chip) => typeof chip === "string" && chip.trim() !== "").slice(0, showChips)

  function handleSubmit() {
    if (!activeValue) return
    // Наружу — обрезанный комментарий: «   » — это пустой комментарий.
    // Чипы — в порядке показа и только видимые: скрытый `showChips` выбор
    // наружу не отдаёт.
    onSubmit?.({
      value: activeValue,
      comment: activeComment.trim(),
      chips: visibleChips.filter((chip) => activeChips.includes(chip)),
    })
  }

  if (submitted)
    return (
      <NpsDone
        cardRef={cardRef}
        onClose={onClose}
        autoCloseMs={autoCloseMs}
        focusOnMount={focusInside.current}
        className={cn(floating && FLOATING_CLASS, className)}
      />
    )

  return (
    <div
      ref={cardRef}
      data-slot="nps"
      onFocusCapture={() => {
        focusInside.current = true
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null
        focusInside.current = Boolean(next && event.currentTarget.contains(next))
      }}
      className={cn(
        CARD_CLASS,
        "flex flex-col items-start gap-8 pt-[23px] pr-[23px] pl-[23px]",
        activeValue !== null ? "pb-[23px]" : "pb-[39px]",
        floating && FLOATING_CLASS,
        className
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span className="text-p1-medium text-[var(--nps-subtitle-fg)]">
          Обратная связь
        </span>
        <CloseButton onClose={onClose} />
      </div>

      <p className="flex min-h-12 w-full items-center justify-center text-center text-p1-medium [overflow-wrap:anywhere] text-[var(--nps-title-fg)]">
        {title}
      </p>

      <StarRating value={activeValue} onChange={setRating} />

      <FeedbackPanel
        open={activeValue !== null}
        showDescription={showDescription}
        question={
          question ?? (activeValue ? ratingQuestion(activeValue) : undefined)
        }
        showChips={visibleChips.length > 0}
        chips={visibleChips}
        selectedChips={activeChips}
        onChipToggle={toggleChip}
        comment={activeComment}
        onCommentChange={setComment}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export { Nps }
export type { NpsProps, NpsEstimateType, NpsShowChips, NpsSubmitData }
