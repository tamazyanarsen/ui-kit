import { DatePicker } from "@/components/ui/date-picker"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function DatePickerDemo() {
  return (
    <AccordionItem value="date-picker">
      <AccordionTrigger>Date Picker — Calendar + Input</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <RowLabel>Single — ручной ввод + выбор в календаре</RowLabel>
            <DatePicker mode="single" containerClassName="max-w-xs" />
          </div>
          <div className="space-y-2">
            <RowLabel>Range — два месяца, footer Сбросить/Применить</RowLabel>
            <DatePicker mode="range" containerClassName="max-w-xs" />
          </div>
          <div className="space-y-2">
            <RowLabel>Month</RowLabel>
            <DatePicker mode="month" containerClassName="max-w-xs" />
          </div>
          <div className="space-y-2">
            <RowLabel>Year</RowLabel>
            <DatePicker mode="year" containerClassName="max-w-xs" />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <RowLabel>Размер S / Disabled</RowLabel>
          <div className="flex flex-wrap items-start gap-4">
            <DatePicker mode="single" size="sm" containerClassName="max-w-xs" />
            <DatePicker mode="single" disabled containerClassName="max-w-xs" />
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Клик или фокус на поле открывает календарь (отступ 8px, как в
          спеке). Клик по дню/месяцу/году только выделяет его — поле
          обновляется (и календарь закрывается) только по кнопке
          «Применить», во всех режимах, включая <code>single</code>;
          «Сбросить» очищает выбор и оставляет дропдаун открытым. В <code>single</code> дополнительно
          доступен ручной ввод через <code>mask="date"</code>,
          синхронизированный с календарём в обе стороны; в{" "}
          <code>range</code>/<code>month</code>/<code>year</code> поле
          только отображает результат. При повторном открытии календарь
          показывает ранее выбранную дату как Active — он размонтируется при
          закрытии, так что при следующем открытии заново читает текущее
          значение.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { DatePickerDemo }
