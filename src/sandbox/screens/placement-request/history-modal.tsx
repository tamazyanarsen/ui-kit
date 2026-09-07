import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { CircleCheck } from "@/icons"
import { Tag, type TagColor } from "@/components/ui/tag"

// Модальное окно «История изменений» — эталон 70371:25061.
//
// Не отдельная витрина, а СОСТОЯНИЕ экрана заявки: по конструкции оно
// открывается ссылкой «История изменений» в шапке страницы и вне её не
// существует. Принадлежность читается по коннекторам секции (ноды
// 70371:25085 / 70371:25086), которые ведут от кромки экрана к кромке окна,
// а не по догадке.

interface HistoryEvent {
  /** Подпись события. Если задан `tag` — рисуется тегом статуса. */
  label: string
  tag?: TagColor
  timestamp: string
  /** Подписант — строка со значком галочки под событием. */
  signer?: { name: string; role: string }
}

const EVENTS: HistoryEvent[] = [
  { label: "Создан", timestamp: "12.03.2023 18:56" },
  { label: "Черновик", tag: "grey", timestamp: "13.03.2023 18:56" },
  { label: "Готов к подписанию", tag: "orange", timestamp: "14.03.2023 18:56" },
  { label: "Подписание", tag: "orange", timestamp: "14.03.2023 18:56" },
  {
    label: "Подписание завершено",
    timestamp: "16.03.2023 18:56",
    signer: { name: "Петров Пётр Петрович", role: "Вторая подпись" },
  },
  { label: "В обработке", tag: "orange", timestamp: "16.03.2023 18:57" },
  { label: "Исполнен", tag: "green", timestamp: "17.03.2023 18:56" },
]

interface HistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="l">
        <ModalHeader>
          <ModalTitle>История изменений</ModalTitle>
          <ModalDescription>
            Исходящий платёж СБП от 24.05.2023
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <ol className="flex flex-col">
            {EVENTS.map((event, index) => (
              <li key={index} className="relative flex gap-4 pb-4 pl-6 last:pb-0">
                {/* Лента событий: точка и соединяющая линия рисуются
                    псевдоэлементами строки, а не отдельным столбцом —
                    иначе высота линии не следовала бы за высотой события
                    с подписантом. */}
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-0 size-1.5 rounded-full bg-[var(--grey-166)]"
                />
                {index < EVENTS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-4 bottom-0 left-[2.5px] w-px bg-[var(--grey-166)]"
                  />
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-6">
                    {event.tag ? (
                      <Tag color={event.tag}>{event.label}</Tag>
                    ) : (
                      <span className="text-p2-regular text-[var(--grey-1514)]">
                        {event.label}
                      </span>
                    )}
                    <span className="shrink-0 text-p3-regular text-[var(--grey-284)]">
                      {event.timestamp}
                    </span>
                  </div>

                  {event.signer && (
                    <span className="flex items-center gap-2 text-p2-regular text-[var(--grey-1514)]">
                      <CircleCheck
                        aria-hidden="true"
                        className="size-4 text-[var(--progress-green)]"
                      />
                      {event.signer.name}
                      <span className="text-[var(--grey-284)]">
                        — {event.signer.role}
                      </span>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary-grey" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { HistoryModal }
export type { HistoryEvent, HistoryModalProps }
