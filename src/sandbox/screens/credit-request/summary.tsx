import { Divider } from "@/components/ui/divider"
import { ItemInformationField } from "@/components/ui/item-information-field"

import { SandboxBlock, SandboxSection, integer } from "../../shell"

// Правый блок «Кредит „ИЖС – подряд“» — один и тот же на обоих шагах заявки.
//
// Вынесен в отдельный модуль именно поэтому: шаги — разные страницы каталога
// («переход через контрол даёт ложное ощущение взаимосвязи экранов, хотя
// логика между ними не провязана»), но сводка продукта у них общая, и две
// её копии разъехались бы при первой же правке ставки.

const PRODUCT = {
  title: "Кредит «ИЖС – подряд»",
  amount: 250_000_000,
  rate: "от 7%",
  term: "24 мес",
}

function CreditProductSummary() {
  return (
    <SandboxBlock>
      <SandboxSection title={PRODUCT.title} gap={16}>
        <div className="flex flex-col text-p2-regular text-[var(--grey-284)]">
          <span>Срок транша до 365 дней</span>
          <span>Погашение процентов в конце срока транша</span>
        </div>
      </SandboxSection>

      <div className="flex flex-col gap-4">
        <ItemInformationField
          type="large-value"
          label="Сумма"
          value={`${integer(PRODUCT.amount)} ₽`}
        />
        {/* Отступ 32 слева — так сгруппированы «Ставка» и «Срок» в эталоне:
            они уточняют сумму, а не стоят с ней в одном ряду. */}
        <div className="flex flex-col gap-4 pl-8">
          <ItemInformationField
            type="label-top"
            label="Ставка*"
            value={PRODUCT.rate}
          />
          <ItemInformationField
            type="label-top"
            label="Срок"
            value={PRODUCT.term}
          />
        </div>
      </div>

      <Divider />

      <p className="text-p3-regular text-[var(--grey-284)]">
        * Точная ставка будет определена по итогам рассмотрения заявки на
        стороне Банка ДОМ.РФ
      </p>
    </SandboxBlock>
  )
}

export { CreditProductSummary, PRODUCT }
