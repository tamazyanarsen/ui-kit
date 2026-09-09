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
    // Дизайн-чек от 08.09, замечание 25: «Блок нужно закреплять».
    <SandboxBlock sticky>
      <SandboxSection title={PRODUCT.title} gap={16}>
        <div className="flex flex-col text-p2-medium text-[var(--grey-284)]">
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
        {/* Дизайн-чек от 08.09, замечание 23: «Лишний левый отступ.
            Скорректировать в блоке». Здесь стоял `pl-8` — попытка показать,
            что «Ставка» и «Срок» уточняют сумму. Ряды блока выравниваются по
            одному левому краю, и отступ ломал именно это. */}
        <div className="flex flex-col gap-4">
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

      <p className="text-p1-medium text-[var(--grey-284)]">
        * Точная ставка будет определена по итогам рассмотрения заявки на
        стороне Банка ДОМ.РФ
      </p>
    </SandboxBlock>
  )
}

export { CreditProductSummary, PRODUCT }
