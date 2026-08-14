import { Event } from "@/components/ui/event"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const SIGNATORIES = [
  { status: "success" as const, name: "Петров Пётр Петрович", attribute: "Первая подпись" },
  {
    status: "attention" as const,
    name: "Для завершения подписания нужна Вторая или Единственная подпись",
  },
]

const INFO = [
  { label: "Дата и время закрытия:", value: "12.03.2022 11:00:15" },
  { label: "Период:", value: "Сокращённый" },
  { label: "Проект:", value: "ЖК «Династия»" },
]

const DOCUMENTS = [
  { name: "File.doc", meta: "21.06.2021, 16:34 · 589 Кб" },
  { name: "File.doc", meta: "21.06.2021, 16:34 · 589 Кб" },
  { name: "File.doc", meta: "21.06.2021, 16:34 · 589 Кб" },
  { name: "File.doc", meta: "21.06.2021, 16:34 · 589 Кб" },
]

const COMMENT =
  "Банковское сопровождение: Не следует, однако, забывать, что постоянный количественный рост и сфера нашей активности обеспечивает широкому кругу (специалистов) участие в форуме."

function EventDemo() {
  return (
    <AccordionItem value="event">
      <AccordionTrigger>Event</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Полный набор секций (по умолчанию)</RowLabel>
          <Event
            title="Подписан"
            timestamp="12.03.2023 18:56"
            author="Иванов Иван Иванович · Название должности"
            signatories={SIGNATORIES}
            info={INFO}
            comment={COMMENT}
            documents={DOCUMENTS}
            buttonLabel="Посмотреть документ"
            showConnector={false}
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Минимальный вариант — только Title + Author</RowLabel>
          <Event
            title="Подписан"
            timestamp="12.03.2023 18:56"
            author="Иванов Иван Иванович · Название должности"
            showConnector={false}
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>type="tag" — только для ЕЛК (статус вместо текста)</RowLabel>
          <Event
            type="tag"
            title="Подписание"
            status="attention"
            timestamp="12.03.2023 18:56"
            author="Иванов Иван Иванович · Название должности"
            signatories={SIGNATORIES}
            info={INFO}
            showConnector={false}
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            История изменений — таймлайн (Type/Status вперемешку с Text)
          </RowLabel>
          <div className="rounded-2xl border border-border p-4">
            <Event title="Подписан" timestamp="12.03.2023 18:56" />
            <Event
              type="tag"
              title="Черновик"
              status="default"
              timestamp="13.03.2023 18:56"
            />
            <Event
              type="tag"
              title="Готов к подписанию"
              status="attention"
              timestamp="14.03.2023 18:56"
            />
            <Event
              type="tag"
              title="Подписание"
              status="attention"
              timestamp="14.03.2023 18:56"
            />
            <Event
              title="Подписание завершено"
              timestamp="16.03.2023 18:56"
              signatories={[
                { status: "success", name: "Петров Пётр Петрович", attribute: "Вторая подпись" },
              ]}
            />
            <Event
              type="tag"
              title="В обработке"
              status="attention"
              timestamp="16.03.2023 18:57"
            />
            <Event
              type="tag"
              title="Исполнен"
              status="success"
              timestamp="17.03.2023 18:56"
              showConnector={false}
            />
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Каждая секция под заголовком (author, signatories, info, comment,
          documents, кнопка) необязательна и просто не рендерится без своих
          данных — как Show Author / Show Button / Show Signatories / Show
          Information / Show Comment / Show Documents в спеке.{" "}
          <code>type="tag"</code> красит заголовок статусом вместо обычного
          текста — по спеке это используется только на ЕЛК, для остальных
          продуктов — <code>type="text"</code>. Компонент рисует свой
          собственный коннектор (точка + вертикальная линия) слева — при
          вставке подряд получается таймлайн, как в модалке «История
          изменений»; у последнего элемента списка передайте{" "}
          <code>showConnector={"{false}"}</code>, чтобы линия не свисала в
          пустоту.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { EventDemo }
