import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"
import { Tooltip, type TooltipDirection } from "@/components/ui/tooltip"

// InfoHint — подсказка у значка «Информация» (i).
//
// Правки UI-Kit от 25.10, правило каркаса «Значок „Информация“ (i) в
// мобильном виде — штора с текстом, а не подсказка»: на телефоне наведения
// нет, и текст подсказки был недоступен или всплывал случайно. Поэтому:
//   • десктоп — прежний `Tooltip` по наведению;
//   • мобильный вид (уже 1280, `useIsDesktop()`) — на наведение значок не
//     реагирует, нажатие открывает штору `Modal`: заголовок — `title` или
//     «Информация», текст подсказки P1 (штора бывает только в мобильном
//     виде, поэтому сразу мобильная пара P1 Regular Mobile 14/20), кнопок нет — закрывается крестиком
//     или нажатием мимо;
//   • нажатие на значок (и всё, что происходит в шторе) не всплывает к
//     карточке или строке, в которой он стоит: React ведёт события из портала
//     по дереву компонентов, поэтому всплытие гасит обёртка вокруг всего;
//   • значок 16, зона нажатия не меньше 32 × 32 — прозрачный `::before` с
//     выносом 8 во все стороны, вид значка не меняется.
//
// В отличие от `Hint` (подсказка по клику, на мобиле — штора с кнопкой
// «Понятно»), у значка «i» в шторе кнопок нет — так в документе дизайнера.
// `Hint` остаётся как был.

const DEFAULT_TITLE = "Информация"

/** Зона нажатия 32 × 32 вокруг значка 16 — только в мобильном виде. */
const MOBILE_HIT_AREA =
  "relative before:absolute before:-inset-2 before:content-['']"

interface InfoHintProps {
  /** Текст подсказки. */
  content: React.ReactNode
  /** Особый заголовок шторы в мобильном виде; по умолчанию «Информация». */
  title?: React.ReactNode
  /** Сторона тултипа на десктопе (см. `Tooltip`). */
  direction?: TooltipDirection
  /** Кнопка-значок «i» (16 × 16). */
  children: React.ReactElement<{ className?: string }>
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

/** Enter/пробел на значке не должны открыть карточку под ним. */
function stopActivationKeys(event: React.KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") event.stopPropagation()
}

function InfoHint({ content, title, direction, children }: InfoHintProps) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <span
        className="contents"
        onClick={stopPropagation}
        onKeyDown={stopActivationKeys}
      >
        <Tooltip content={content} direction={direction}>
          {children}
        </Tooltip>
      </span>
    )
  }

  const trigger = React.cloneElement(children, {
    className: cn(children.props.className, MOBILE_HIT_AREA),
  })

  return (
    <span
      data-slot="info-hint"
      className="contents"
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
      onKeyDown={stopActivationKeys}
    >
      <Modal>
        <ModalTrigger render={trigger} />
        <ModalContent size="m" data-slot="info-hint-sheet">
          <ModalHeader>
            <ModalTitle>{title ?? DEFAULT_TITLE}</ModalTitle>
          </ModalHeader>
          <ModalBody className="pb-6">
            <div className="text-p1-regular-mobile [overflow-wrap:anywhere] text-[var(--modal-title-fg)]">
              {content}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </span>
  )
}

export { InfoHint }
export type { InfoHintProps }
