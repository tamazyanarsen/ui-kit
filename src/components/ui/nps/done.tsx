import * as React from "react"

import { cn } from "@/lib/utils"
import { useLatest } from "@/lib/use-latest"
import { CloseCross } from "@/components/ui/close-cross"

// Карточка NPS: общие классы, крестик и состояние «Спасибо за оценку».
// Вынесено из `nps.tsx` ради лимита 400 строк на файл.

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

// Рамка 1px в макете лежит ВНУТРИ размера карточки (обводка Figma
// внутренняя), и контент при этом 312px, а размеры 360×668, 360×232 и
// 360×356. CSS-рамка занимает место, поэтому отступы карточки на 1px
// меньше макетных (23 вместо 24, 39 вместо 40): иначе контент выходил 310px,
// а карточка на 2px выше (670, 234, 358).
//
// `max-w-full`: встроенная карточка не шире своего контейнера — на 375 с
// полями страницы 360px давали горизонтальную прокрутку.
const CARD_CLASS =
  "w-[360px] max-w-full rounded-[16px] border border-[var(--nps-card-border)] bg-[var(--nps-card-bg)] shadow-big-blur"

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
  const onCloseRef = useLatest(onClose)
  const autoClose = Boolean(onClose) && autoCloseMs > 0

  React.useEffect(() => {
    if (!autoClose) return
    const timer = window.setTimeout(() => onCloseRef.current?.(), autoCloseMs)
    return () => window.clearTimeout(timer)
  }, [autoClose, autoCloseMs, onCloseRef])

  return (
    <div
      ref={cardRef}
      data-slot="nps"
      className={cn(
        CARD_CLASS,
        "flex flex-col items-center gap-8 pt-[23px] pr-[23px] pb-[39px] pl-[23px]",
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

export { CARD_CLASS, CloseButton, FLOATING_CLASS, NpsDone }
