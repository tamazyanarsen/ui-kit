import * as React from "react"
import { CircleAlert, X } from "@/icons"

import { TopFixedMessage } from "@/components/ui/top-fixed-message"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from "@/components/ui/modal"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function GroupedNotificationsModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="l">
        <ModalHeader>
          <ModalTitle>У вас есть критичные уведомления</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-[#F8F8F8] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CircleAlert
                      aria-hidden="true"
                      className="size-5 shrink-0 text-[#D74B54]"
                    />
                    <span className="font-medium text-[#252628]">Title</span>
                  </div>
                  <button type="button" aria-label="Закрыть" className="text-[#252628]">
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 pl-8">
                  <Button variant="secondary-black" size="sm">
                    Button
                  </Button>
                  <Button variant="secondary-white" size="sm">
                    Button
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function TopFixedMessageDemo() {
  const [visible, setVisible] = React.useState(true)
  const [groupedOpen, setGroupedOpen] = React.useState(false)

  return (
    <AccordionItem value="top-fixed-message">
      <AccordionTrigger>Top Fixed Message</AccordionTrigger>
      <AccordionPanel>
        <div className="space-y-6">
          <div className="space-y-2">
            <RowLabel>Type: Blue (System)</RowLabel>
            <TopFixedMessage
              type="blue"
              text="Notification Text Example"
              showButton
              buttonLabel="Button"
            />
          </div>

          <div className="space-y-2">
            <RowLabel>Type: Red (Error)</RowLabel>
            <TopFixedMessage
              type="red"
              text="Notification Text Example"
              showButton
              buttonLabel="Button"
            />
          </div>

          <div className="space-y-2">
            <RowLabel>Show Icon: False</RowLabel>
            <TopFixedMessage
              type="blue"
              showIcon={false}
              text="Notification Text Example"
              showButton
              buttonLabel="Button"
            />
          </div>

          <div className="space-y-2">
            <RowLabel>Show Button: False</RowLabel>
            <TopFixedMessage type="blue" text="Notification Text Example" />
          </div>

          <div className="space-y-2">
            <RowLabel>Show Icon Close: False</RowLabel>
            <TopFixedMessage
              type="blue"
              text="Notification Text Example"
              showButton
              buttonLabel="Button"
              showIconClose={false}
            />
          </div>

          <div className="space-y-2">
            <RowLabel>Длинный текст (ellipsis + tooltip при наведении)</RowLabel>
            <TopFixedMessage
              type="red"
              text="Пример очень длинного текста, который превышает допустимое значение. Пример очень длинного текста, который превышает допустимое значение. Пример очень длинного текста, который превышает допустимое значение."
              showButton
              buttonLabel="Подробнее"
            />
          </div>

          <div className="space-y-2">
            <RowLabel>
              Взаимодействие — «Подробнее» открывает модалку со
              сгруппированными уведомлениями
            </RowLabel>
            <TopFixedMessage
              type="red"
              text="Внимание! У вас есть 3 важных уведомления"
              showButton
              buttonLabel="Подробнее"
              onButtonClick={() => setGroupedOpen(true)}
            />
            <GroupedNotificationsModal
              open={groupedOpen}
              onOpenChange={setGroupedOpen}
            />
          </div>

          <div className="space-y-2">
            <RowLabel>Закрываемое сообщение</RowLabel>
            {visible ? (
              <TopFixedMessage
                type="blue"
                text="Notification Text Example"
                showButton
                buttonLabel="Button"
                onClose={() => setVisible(false)}
              />
            ) : (
              <Button
                type="button"
                variant="secondary-outline"
                size="sm"
                onClick={() => setVisible(true)}
              >
                Показать снова
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          2 типа (Blue/System, Red/Error) — цвет фона и иконки берутся из{" "}
          <code>type</code>. Иконка, кнопка и крестик закрытия — опциональны
          (<code>showIcon</code>/<code>showButton</code>/
          <code>showIconClose</code>). Сообщение занимает всю ширину экрана,
          отображается под шапкой без отступа и скроллится вместе с
          контентом (не position:fixed). Текст не ограничен по количеству
          символов (рекомендуемая длина — не более 100), при переполнении
          обрезается многоточием — полный текст показывается в тултипе при
          наведении.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TopFixedMessageDemo }
