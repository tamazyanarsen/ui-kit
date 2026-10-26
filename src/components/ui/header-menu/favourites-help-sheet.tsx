import type * as React from "react"

import { NumberOne, NumberTwo, ShareNetwork1 } from "@/icons"
import { Button } from "@/components/ui/button"
import { Informer } from "@/components/ui/informer"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Thumbnail } from "@/components/ui/thumbnail"

// Штора «Настройте избранное с компьютера» — мобильное меню шапки (Правки
// UI-Kit от 25.10). На телефоне избранное не настраивается: кнопка «Как
// настроить избранное» и звёзды у разделов открывают не модалку «Настройка
// избранного» со списками и перетаскиванием, а эту подсказку.
//
// Состав: два шага строками в раскладке `Item` без разделителей (номер —
// значок 24 в сером квадрате 40, Grey 106, скругление 8; подпись P1;
// пояснение P3 Grey 284), под ними серый `Informer` со значком «i» без
// крестика (поля 8 и 16), внизу основная кнопка L во всю ширину
// «Поделиться ссылкой» — системное «Поделиться» телефона со ссылкой на ЕЛК
// (окно рисует операционная система, тоста в ответ нет).

/** Ссылка на ЕЛК, которой делится кнопка «Поделиться ссылкой». */
const ELK_URL = "https://corp.domrfbank.ru"

interface FavouritesHelpSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Ссылка для «Поделиться». По умолчанию — corp.domrfbank.ru. */
  shareUrl?: string
}

/**
 * Шаг подсказки. Раскладка — как у мобильной строки `Item` (поля 16, зазор
 * 16, квадрат 40, подпись P1 Mobile 14/20, пояснение P3 12/16), но строка
 * статичная: сам `Item` всегда нажимаемый (кнопка-подложка, наведение), а
 * шагу нажимать нечего.
 */
function HelpStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
}) {
  return (
    <li data-slot="favourites-help-step" className="flex w-full items-start gap-4 p-4">
      <Thumbnail type="icon" icon={icon} className="shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 self-stretch">
        <span className="text-p1-medium-mobile text-[var(--item-value-fg)]">{title}</span>
        <span className="text-p3-medium-mobile text-[var(--item-comment-grey-fg)]">
          {description}
        </span>
      </span>
    </li>
  )
}

function share(url: string) {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return
  }
  // Отказ пользователя (AbortError) и неподдержанные данные — не ошибка
  // экрана: окно «Поделиться» рисует система, ответа от неё не ждём.
  navigator.share({ url }).catch(() => {})
}

function FavouritesHelpSheet({
  open,
  onOpenChange,
  shareUrl = ELK_URL,
}: FavouritesHelpSheetProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="m" data-slot="favourites-help-sheet">
        <ModalHeader>
          <ModalTitle>Настройте избранное с компьютера</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-0">
          <ol className="flex flex-col">
            <HelpStep
              icon={<NumberOne size={24} aria-hidden="true" className="size-6" />}
              title="Авторизуйтесь в ЕЛК с компьютера"
              description="corp.domrfbank.ru"
            />
            <HelpStep
              icon={<NumberTwo size={24} aria-hidden="true" className="size-6" />}
              title="Откройте меню и отметьте нужные разделы"
              description="Там же вы сможете поменять порядок избранных разделов"
            />
          </ol>
          <div className="px-4 py-2">
            <Informer
              icon="information"
              solid="grey"
              showCross={false}
              title="Часть разделов открывается только с компьютера"
              description="Все отмеченные разделы сохраняются, в мобильной версии они появляются по мере разработки"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            size="lg"
            icon={ShareNetwork1}
            onClick={() => share(shareUrl)}
          >
            Поделиться ссылкой
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { FavouritesHelpSheet }
export type { FavouritesHelpSheetProps }
