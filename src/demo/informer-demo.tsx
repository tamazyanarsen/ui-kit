import { Informer } from "@/components/ui/informer"
import type { InformerIcon } from "@/components/ui/informer"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const ICONS: InformerIcon[] = [
  "attention-red",
  "attention-yellow",
  "check",
  "information",
  "clock",
]

function InformerDemo() {
  return (
    <AccordionItem value="informer">
      <AccordionTrigger>Informer</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Add — None / One (Additional) / One (Main) / Two</RowLabel>
          <div className="flex flex-col gap-4">
            <Informer title="Title" date="12:12 26.11.2022" description="Description" />
            <Informer
              title="Title"
              date="12:12 26.11.2022"
              description="Description"
              additionalButtonLabel="Button"
            />
            <Informer
              title="Title"
              date="12:12 26.11.2022"
              description="Description"
              mainButtonLabel="Button"
            />
            <Informer
              title="Title"
              date="12:12 26.11.2022"
              description="Description"
              mainButtonLabel="Button"
              additionalButtonLabel="Button"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Solid — White / Grey</RowLabel>
          <div className="flex flex-col gap-4 rounded-2xl bg-[#EFEFEF] p-4">
            <Informer
              solid="white"
              title="Title"
              date="12:12 26.11.2022"
              description="Description"
              mainButtonLabel="Button"
              additionalButtonLabel="Button"
            />
            <Informer
              solid="grey"
              title="Title"
              date="12:12 26.11.2022"
              description="Description"
              mainButtonLabel="Button"
              additionalButtonLabel="Button"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Type Icon</RowLabel>
          <div className="flex flex-col gap-4">
            {ICONS.map((icon) => (
              <Informer key={icon} icon={icon} title={icon} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Минимальный вариант — только иконка и Title</RowLabel>
          <Informer title="Title" showCross={false} />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Использование внутри контентного блока</RowLabel>
          <div className="max-w-md rounded-2xl border border-border p-4">
            <p className="text-p2 text-muted-foreground">Субсублимит</p>
            <div className="mt-1 mb-4 flex items-center justify-between rounded-lg border border-border px-3 py-2 text-p2">
              Сублимит №3 от 02.07.2022
            </div>
            <Informer
              icon="attention-red"
              solid="grey"
              title="Превышен лимит предоставления с учетом платежей в обработке"
              description="по сублимиту №1234345455 от ДД.ММ.ГГГГ на 20 000,00 RUB"
              showCross={false}
            />
          </div>
        </div>

        <p className="mt-4 text-p3 text-muted-foreground">
          Минимальная ширина — 360px, максимальная не ограничена; высота
          зависит от контента. Каждый элемент под заголовком (дата,
          описание, кнопки, крестик) — опционален, как Show Date / Show
          Description / Show Cross и Add (None / One Main / One Additional
          / Two) в спеке. Обычно располагается внутри Top Fixed Message или
          прямо внутри контентного блока страницы.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { InformerDemo }
