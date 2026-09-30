import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { stateClassName } from "@/lib/state-class-name"

// Закреплённая полоса заголовка («Modal Top: Title» в макете). Для
// варианта «Modal Top: None» эту часть нужно опустить целиком, а заголовок
// поставить обычным первым ребёнком ModalBody, где он уезжает вверх вместе
// с остальным содержимым. Отступы симметричны (дизайн-чек, замечание 39):
// прежние несимметричные pr-16 и pr-20 стояли только ради обхода кнопки
// закрытия, а замечание 37 вынесло её за карточку целиком, так что
// освобождать место больше не для чего. Зазор между заголовком и описанием
// — 16px на мобильном и 8px на десктопе (в макете у «Modal Top» Texts это
// gap-8, а у мобильного блока заголовка gap-16); второй проход обнаружил
// здесь плоские 4px (gap-1) на обоих брейкпоинтах.
const ModalHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function ModalHeader({ className, ...props }, ref) {
  return (
    <div
      data-slot="modal-header"
      className={cn("flex shrink-0 flex-col gap-4 px-4 pt-6 pb-3 desktop:gap-2 desktop:px-(--modal-px) desktop:pt-12 desktop:pb-4", className)}
      ref={ref}
      {...props}
    />
  )
})

/**
 * Пустой холдер шапки — вариант `Modal Top: None`.
 *
 * Дизайн-чек от 13.09, замечание 15: «Не хватает белой полосы с серым
 * разделителем, когда модалка не в верхнем положении. Разделитель стандартно
 * виден тогда, когда под белую полосу ушла хотя бы какая-то часть контента.
 * По сути это тоже должно быть стандартное модальное окно».
 *
 * До этого при `Top: None` шапки не было ВООБЩЕ, и прокрученный контент
 * упирался в скруглённую кромку карточки: ни полосы, под которую он уходит,
 * ни линии, которая об этом сообщает (линию `ModalBody` рисует своей верхней
 * гранью, но рисовать её было не под чем). Холдер эту полосу и возвращает —
 * ровно тот «пустой холдер 48px», который в макете и стоит.
 *
 * Мобильная высота больше десктопной не по прихоти: на мобиле крестик стоит
 * ВНУТРИ листа (top-6, кнопка 32 → занято 56px), а на десктопе он вынесен за
 * карточку. Без этих 56 контент при `Top: None` начинался прямо под крестиком.
 */
const ModalTopHolder = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function ModalTopHolder({ className, ...props }, ref) {
  return (
    <div
      data-slot="modal-top-holder"
      aria-hidden="true"
      className={cn("h-14 shrink-0 desktop:h-12", className)}
      ref={ref}
      {...props}
    />
  )
})

const ModalTitle = React.forwardRef<HTMLHeadingElement, DialogPrimitive.Title.Props>(function ModalTitle({
  className,
  ...props
}, ref) {
  return (
    <DialogPrimitive.Title
      data-slot="modal-title"
      className={stateClassName(
        "pr-12 text-h2-mobile text-[var(--modal-title-fg)] desktop:pr-0 desktop:text-h2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

const ModalDescription = React.forwardRef<HTMLParagraphElement, DialogPrimitive.Description.Props>(function ModalDescription({
  className,
  ...props
}, ref) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      // Тот же цвет, что у ModalTitle (дизайн-чек, замечание 38): раньше
      // был приглушённый серый, и текст читался как посторонний
      // второстепенный, а не как подзаголовок к заголовку. Размер — P1
      // Medium на мобильном (14/20), вырастающий до P1 Medium на десктопе
      // (16/24): макет «Modal Top» применяет здесь десктопный параграфный
      // стиль, а не фиксированный мобильный размер.
      className={stateClassName("text-p2-medium text-[var(--modal-title-fg)] desktop:text-p1-medium", className)}
      ref={ref}
      {...props}
    />
  )
})

export { ModalHeader, ModalTopHolder, ModalTitle, ModalDescription }
