import * as React from "react"

import { cn } from "@/lib/utils"
import { useFloatingCornerInset } from "@/lib/use-floating-corner-inset"

import { FeedbackPanel } from "./feedback-panel"
import { StarRating } from "./rating"
import { CloseCross } from "@/components/ui/close-cross"

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
  onSubmit?: (data: { value: number; comment: string }) => void
  onClose?: () => void
  /**
   * Через сколько миллисекунд после «Спасибо за оценку» вызвать `onClose`.
   * По макету — 2000. `0` отключает автозакрытие.
   */
  autoCloseMs?: number
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
    /* Карточка NPS в макете закрывается через `icon / close cross`
       размером 24px. */
    <CloseCross
      size={24}
      onClick={onClose}
      className={cn("text-[var(--nps-close-fg)]", className)}
    />
  )
}

// `max-w-full`: встроенная карточка не шире своего контейнера — на 375 с
// полями страницы 360px давали горизонтальную прокрутку.
const CARD_CLASS =
  "w-[360px] max-w-full rounded-[16px] border border-[var(--nps-card-border)] bg-[var(--nps-card-bg)] shadow-[0px_8px_12px_rgba(0,0,0,0.06)]"

/**
 * Плавающее окно: правый нижний угол, поверх тостов.
 *
 * На мобильном — поля 16px и ширина не больше видимой области: карточка
 * 360px с отступом 40px на экране 375 уходила за левый край на 40px.
 *
 * ⚠️ Отступ снизу — над ЗАНЯТЫМ низом вьюпорта (`--floating-bottom`: максимум
 * из `--viewport-inset-bottom` закреплённой панели и блока ButtonMenuBlack с
 * «Выбрать на всех страницах», см. base.css), как у кнопки «Наверх».
 * От кромки экрана карточка ложилась на панель, и её «Отправить» была
 * недоступна, пока опрос не закрыт.
 *
 * ⚠️ Высота — не больше видимой области за вычетом тех же полей сверху и
 * снизу и занятого низа, остальное прокручивается внутри. Раскрытая форма
 * (оценка + чипсы + комментарий) выше 600px, и на невысоком экране верх
 * карточки уходил за экран вместе с крестиком — закрыть опрос было нечем.
 */
// Пока открыта модалка, плавающий опрос уходит под её подложку (`z-40`
// при подложке `z-50`): иначе он лежал поверх окна и на телефоне
// закрывал «Подтвердить». Слой по-прежнему выше тостов, когда окна нет
// (дизайн-чек от 07.09, замечание 21), — см. styles/tokens-surfaces.css.
//
// Так же он уходит под любой открытый всплывающий слой и под меню шапки
// (`z-[35]`: ниже оверлея меню `z-40` и попапов `z-50`, выше нижней панели
// `z-30`). Открытый попап Base UI — это позиционер и попап с
// `[data-side][data-open]` (списки «…», Select, фильтры, подсказки).
// Раньше раскрытый вверх список «…» у закреплённой панели и разделы меню
// шапки оказывались под опросом и не нажимались (аудит 15).
const FLOATING_CLASS =
  "[:root:has([data-slot=modal-backdrop])_&]:z-40 [:root:has([data-side][data-open],[data-slot=header-menu-overlay])_&]:z-[35] fixed right-4 bottom-[calc(1rem+var(--floating-bottom,0px))] z-(--z-nps) max-h-[calc(100dvh_-_2rem_-_var(--floating-bottom,0px))] max-w-[calc(100%_-_32px)] overflow-y-auto desktop:right-10 desktop:bottom-[calc(2.5rem+var(--floating-bottom,0px))] desktop:max-h-[calc(100dvh_-_5rem_-_var(--floating-bottom,0px))] desktop:max-w-none"

/** Состояние «Спасибо за оценку». */
function NpsDone({
  cardRef,
  onClose,
  autoCloseMs,
  focusOnMount,
  className,
}: {
  cardRef?: React.Ref<HTMLDivElement>
  onClose?: () => void
  autoCloseMs: number
  /** Фокус был внутри формы, которую сменило это состояние. */
  focusOnMount: boolean
  className?: string
}) {
  // Форма с кнопкой «Отправить» размонтируется целиком, и фокус с неё падал
  // на body — клавиатурного пользователя выбрасывало в начало документа.
  // Поэтому он переходит на заголовок нового состояния, но только если был
  // внутри формы: чужой фокус на странице карточка не отбирает.
  const titleRef = React.useRef<HTMLParagraphElement>(null)
  React.useEffect(() => {
    if (focusOnMount) titleRef.current?.focus()
    // Только при монтировании: это переход «форма → спасибо».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Текст состояния обещает «Окно закроется автоматически» — раньше таймера
  // не было вовсе. Последний `onClose` держится в ref: новый колбэк на
  // каждом рендере родителя не должен перезапускать отсчёт.
  const onCloseRef = React.useRef(onClose)
  onCloseRef.current = onClose
  const autoClose = Boolean(onClose) && autoCloseMs > 0

  React.useEffect(() => {
    if (!autoClose) return
    const timer = window.setTimeout(() => onCloseRef.current?.(), autoCloseMs)
    return () => window.clearTimeout(timer)
  }, [autoClose, autoCloseMs])

  return (
    <div
      ref={cardRef}
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
            приходит из CSS классом `.nps-done-image`, а не жёстким путём.
            Это фон, а не <img>: иначе выбор картинки пришлось бы тащить в JS
            и дублировать логику темы, которая целиком живёт в CSS.

            Именно класс, а не токен с `url()`: относительный путь внутри
            пользовательского свойства браузер резолвит от документа, из-за
            чего картинка 404-ила в собранном Storybook и у потребителя
            пакета (см. комментарий в src/styles/tokens-content.css). */}
        <div
          role="presentation"
          className="nps-done-image h-[176px] w-[232px] bg-contain bg-center bg-no-repeat"
        />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          ref={titleRef}
          tabIndex={-1}
          className="text-h3 text-[var(--nps-title-fg)] outline-none"
        >
          Спасибо за оценку
        </p>
        {autoClose && (
          <p className="text-p1-medium text-[var(--nps-subtitle-fg)]">
            Окно закроется автоматически
          </p>
        )}
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

  // Где фокус — внутри формы или нет. Читается в тот рендер, в котором
  // форму сменяет «Спасибо за оценку», то есть до её размонтирования.
  const focusInside = React.useRef(false)

  // Плавающая карточка занимает правый нижний угол — публикует его высоту,
  // чтобы кнопка «Наверх» вставала над ней, а не под неё.
  const cardRef = useFloatingCornerInset<HTMLDivElement>(floating)

  function handleSubmit() {
    if (!activeValue) return
    onSubmit?.({ value: activeValue, comment: activeComment })
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
        "flex flex-col items-start gap-8 pt-6 pr-6 pl-6",
        activeValue !== null ? "pb-6" : "pb-10",
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

      <p className="flex min-h-12 w-full items-center justify-center text-center text-p1-medium text-[var(--nps-title-fg)]">
        {title}
      </p>

      <StarRating value={activeValue} onChange={setRating} />

      <FeedbackPanel
        open={activeValue !== null}
        showDescription={showDescription}
        question={
          question ?? (activeValue ? ratingQuestion(activeValue) : undefined)
        }
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
