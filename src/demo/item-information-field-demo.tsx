import { ItemInformationField } from "@/components/ui/item-information-field"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function ItemInformationFieldDemo() {
  return (
    <AccordionItem value="item-information-field">
      <AccordionTrigger>Item.Information Field</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <RowLabel>Label Left — реальный пример из спека</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <ItemInformationField label="Сумма" value="19 009,51 ₽" copyable />
              <ItemInformationField label="Комиссия" value="239 ₽" copyable />
              <ItemInformationField
                label="ФИО"
                value="Смирнов Виктор Евгеньевич"
                subText="Пользователь"
                copyable
              />
              <ItemInformationField
                label="Номер счёта"
                value="5678930982"
                copyable
                divider={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Value Status — Default / Success / Error / Attention / Information</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <ItemInformationField label="Label" value="Value" subText="Sub Text" copyable />
              <ItemInformationField
                label="Label"
                value="Value"
                subText="Sub Text"
                valueStatus="success"
                subTextStatus="success"
                copyable
              />
              <ItemInformationField
                label="Label"
                value="Value"
                subText="Sub Text"
                valueStatus="error"
                subTextStatus="error"
                copyable
              />
              <ItemInformationField
                label="Label"
                value="Value"
                subText="Sub Text"
                valueStatus="attention"
                subTextStatus="attention"
                copyable
              />
              <ItemInformationField
                label="Label"
                value="Value"
                subText="Sub Text"
                valueStatus="information"
                copyable
                divider={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Label Top — компактный вариант</RowLabel>
            <div className="max-w-72 rounded-lg border border-[#DEDEDE]">
              <ItemInformationField
                type="label-top"
                label="Сумма"
                value="19 009,51 ₽"
                copyable
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Large Value — для Factoid</RowLabel>
            <div className="max-w-72 rounded-lg border border-[#DEDEDE]">
              <ItemInformationField
                type="large-value"
                label="Сумма кредита"
                value="5 000 000 ₽"
                subText="Пример по умолчанию"
                copyable
                divider={false}
              />
            </div>
          </div>

        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Read-only поле, не интерактивное (в отличие от Item) — Copy иконка
          копирует значение в буфер обмена и показывает Toast Message.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ItemInformationFieldDemo }
