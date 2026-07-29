import { NotificationItem, NotificationPanel } from "@/components/ui/notification"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const SAMPLE_ITEMS = [
  {
    title: "Платёж отправлен",
    viewed: false,
    sum: "5 000,00 ₽",
    status: "Status",
    description: "Description",
    timestamp: "11.08.2025, 16:30",
    buttonLabel: "Button",
  },
  {
    title: "Платёж отправлен",
    viewed: false,
    sum: "5 000,00 ₽",
    status: "Status",
    description: "Description",
    timestamp: "11.08.2025, 16:30",
    buttonLabel: "Button",
  },
  {
    title: "Платёж отправлен",
    viewed: true,
    sum: "5 000,00 ₽",
    status: "Status",
    description: "Description",
    timestamp: "11.08.2025, 16:30",
    buttonLabel: "Button",
  },
]

function NotificationDemo() {
  return (
    <AccordionItem value="notification">
      <AccordionTrigger>Notification</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Not Viewed / Viewed (наведите — Hover/Pressed через CSS)</RowLabel>
          <div className="flex max-w-sm flex-col overflow-hidden rounded-2xl ring-1 ring-border">
            <NotificationItem
              title="Title"
              sum="5 000,00 ₽"
              status="Status"
              description="Description"
              timestamp="11.08.2025, 16:30"
              buttonLabel="Button"
              onClick={() => {}}
            />
            <div className="border-t border-border" />
            <NotificationItem
              title="Title"
              viewed
              sum="5 000,00 ₽"
              status="Status"
              description="Description"
              timestamp="11.08.2025, 16:30"
              buttonLabel="Button"
              onClick={() => {}}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Панель — Уведомления и новости</RowLabel>
          <NotificationPanel
            items={SAMPLE_ITEMS}
            primaryButtonLabel="В центр уведомлений"
            secondaryButtonLabel="Прочитать все (23)"
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Красная точка привязана к <code>viewed=false</code> — отдельного
          пропа для неё в спеке нет. Sum / Status / Description / Button —
          опциональны, как Show Sum / Show Status / Show Description / Show
          Button. <code>NotificationPanel</code> собирает список
          NotificationItem с разделителями (Show Divider) и футером (Show
          Secondary Button); список скроллится при переполнении (Show
          ScrollBar управляет видимостью нативного скроллбара). Расстояние
          от шапки сайта до списка — 8px.{" "}
          <strong>Внимание:</strong> в отличие от остальных компонентов
          message/*, эта спека помечена «Actual old», а не «Actual new» —
          вероятно, наименее стабильная из пяти.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { NotificationDemo }
