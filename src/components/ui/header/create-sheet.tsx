import { withIconSize } from "@/lib/icon-size"
import { Item } from "@/components/ui/item"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Thumbnail } from "@/components/ui/thumbnail"
import type { CreateMenuItem } from "@/components/ui/header-menu"

// Штора «Создать» мобильной шапки (Правки UI-Kit от 25.10).
//
// На телефоне «+» не раскрывает панель плиток под шапкой, как на десктопе, а
// открывает штору (Modal кита в мобильном виде): заголовок «Создать» с
// крестиком, под ним подсказка о полной версии, ниже — те же `createItems`
// строками `Item` во всю ширину шторы: значок 24 в сером квадрате 40,
// подпись, стрелка-переход справа, разделители между строками (у последней
// нет), высота 72. Нажатие на строку закрывает штору и выполняет пункт.
// Кнопок внизу нет.

interface CreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CreateMenuItem[]
}

function CreateSheet({ open, onOpenChange, items }: CreateSheetProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="m" data-slot="header-create-sheet">
        <ModalHeader>
          <ModalTitle>Создать</ModalTitle>
        </ModalHeader>
        {/* Строки `Item` несут свои поля 16 — у тела боковых полей нет.
            От заголовка до подсказки 24 (поле шапки 12 + поле тела 12), как
            у всех штор кита. */}
        <ModalBody className="px-0">
          {/* P1 Medium Mobile 14/20, Grey 284; поля 16 по бокам, 8 снизу. */}
          <p
            data-slot="header-create-sheet-hint"
            className="px-4 pb-2 text-p1-medium-mobile text-[var(--header-meta-fg)]"
          >
            Откройте corp.domrfbank.ru с компьютера для просмотра всех
            возможностей
          </p>
          <div className="flex flex-col">
            {items.map((item) => (
              <Item
                key={item.value}
                value={item.label}
                thumbnail={
                  item.icon ? (
                    <Thumbnail type="icon" icon={withIconSize(item.icon, 24)} />
                  ) : undefined
                }
                rightElement="navigation"
                onClick={() => {
                  onOpenChange(false)
                  item.onClick?.()
                }}
              />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { CreateSheet }
export type { CreateSheetProps }
