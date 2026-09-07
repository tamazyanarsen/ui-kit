import { Divider } from "@/components/ui/divider"
import { ItemInformationField } from "@/components/ui/item-information-field"

import { SandboxBlock, SandboxSection, date, money } from "../../shell"

// Правая колонка экрана D1 — сводка «Первый транш».
//
// Отдельным модулем не ради красоты: сводка ЧИТАЕТ то же состояние, что и
// форма слева (сумма, срок, дата возврата), и держать её в одном файле с
// формой значило бы перевалить файл за лимит проекта в 300 строк. Своего
// состояния у неё нет — всё приходит пропами, поэтому «форма посчитала одно,
// сводка показала другое» здесь невозможно by design.

interface TrancheSummaryProps {
  contractLabel?: string
  agreementLabel?: string
  /** Сумма транша к показу — уже обрезанная лимитом. */
  amount: number
  term: number
  returnDate: Date
}

function TrancheSummary({
  contractLabel,
  agreementLabel,
  amount,
  term,
  returnDate,
}: TrancheSummaryProps) {
  return (
    <SandboxBlock>
      <div className="flex flex-col gap-6">
        <SandboxSection gap={8} title="Первый транш">
          <div className="flex flex-col text-p2-regular text-[var(--grey-284)]">
            <span>По договору подряда {agreementLabel}</span>
            <span>Кредитный договор: {contractLabel}</span>
          </div>
        </SandboxSection>

        <Divider />

        <div className="flex flex-col gap-4">
          <ItemInformationField
            type="large-value"
            label="Сумма транша"
            value={money(amount)}
          />
          <ItemInformationField
            type="label-top"
            label="Срок, дней"
            value={String(term)}
          />
          <ItemInformationField
            type="label-top"
            label="Дата возврата"
            value={date(returnDate)}
          />
        </div>
      </div>
    </SandboxBlock>
  )
}

export { TrancheSummary }
export type { TrancheSummaryProps }
