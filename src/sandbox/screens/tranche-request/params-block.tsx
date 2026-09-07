import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { ItemInformationField } from "@/components/ui/item-information-field"
import { RangeInput } from "@/components/ui/range-input"

import {
  SandboxBlock,
  SandboxCompositionBar,
  SandboxFieldRow,
  SandboxSection,
  integer,
  money,
} from "../../shell"

import { ISSUE_DATE, MAX_LAST } from "./data"

// Блок «Параметры транша» экрана D1.
//
// Состояние осталось на экране, а не переехало сюда: срок и сумму читает
// ещё и сводка справа, а два источника правды разошлись бы молча — в форме
// одно число, в сводке другое. Поэтому блок управляемый целиком.

interface TrancheParamsBlockProps {
  term: number
  onTermChange: (term: number) => void
  returnDate: Date
  kit: boolean
  onKitChange: (kit: boolean) => void
  declineLast: boolean
  onDeclineLastChange: (declineLast: boolean) => void
  /** Максимальная сумма транша с учётом отказа от последнего. */
  limit: number
  amount: string
  onAmountChange: (amount: string) => void
  tooMuch: boolean
}

function TrancheParamsBlock({
  term,
  onTermChange,
  returnDate,
  kit,
  onKitChange,
  declineLast,
  onDeclineLastChange,
  limit,
  amount,
  onAmountChange,
  tooMuch,
}: TrancheParamsBlockProps) {
  return (
    <SandboxBlock>
      <SandboxSection title="Параметры транша">
        <SandboxFieldRow>
          <Input
            label="Признак транша"
            value="Первый"
            locked
            lockedHint="Признак определяется автоматически по договору подряда"
            readOnly
          />
          <DatePicker label="Дата выдачи" value={ISSUE_DATE} />
        </SandboxFieldRow>

        <SandboxFieldRow>
          <RangeInput
            label="Срок, дней"
            min={1}
            max={57}
            value={term}
            onValueChange={(next) => onTermChange(next as number)}
            scaleLabels={["1", "57"]}
          />
          <DatePicker
            label="Дата возврата"
            value={returnDate}
            disabled
            comment="В выходные/праздники дата возврата переносится на следующий рабочий день"
          />
        </SandboxFieldRow>

        <div className="flex flex-col gap-4">
          <Checkbox
            checked={kit}
            onCheckedChange={(next) => onKitChange(next === true)}
            label="Для строительства используется домокомплект"
            comment="Применяется комплект строительных конструкций заводского изготовления"
          />
          <Checkbox
            checked={declineLast}
            onCheckedChange={(next) => onDeclineLastChange(next === true)}
            label="Отказаться от получения последнего транша финансирования по договору подряда"
            comment="Подтверждаю добровольный отказ от получения последнего транша"
          />
        </div>

        <Divider />

        <ItemInformationField
          type="label-top"
          label="Максимальная сумма первого транша"
          value={money(limit)}
          valueInfo="Лимит считается по договору подряда и уже учитывает отказ от последнего транша"
        />

        <SandboxCompositionBar
          segments={[
            { label: `Первый транш до ${integer(limit)} ₽`, value: limit },
            {
              label: `Последний транш до ${integer(MAX_LAST)} ₽`,
              value: declineLast ? 0 : MAX_LAST,
            },
          ]}
        />

        <div className="w-[calc(50%-12px)]">
          <Input
            label="Сумма транша"
            mask="amount"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            clearable
            onClear={() => onAmountChange("")}
            comment={`Не более ${integer(limit)} ₽`}
            error={tooMuch ? `Не более ${integer(limit)} ₽` : undefined}
          />
        </div>
      </SandboxSection>
    </SandboxBlock>
  )
}

export { TrancheParamsBlock }
export type { TrancheParamsBlockProps }
