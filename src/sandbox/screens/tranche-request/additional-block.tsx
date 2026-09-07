import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"

import { SandboxBlock, SandboxSection } from "../../shell"

// Блок «Дополнительная информация» экрана D1.
//
// В отличие от «Параметров транша», состояние живёт ЗДЕСЬ: эти три галочки
// никто снаружи не читает — ни сводка, ни лимит, ни проверка формы. Поднимать
// их на экран значило бы держать в нём состояние ради состояния.

function TrancheAdditionalBlock() {
  const [lease, setLease] = useState(false)
  const [insurance, setInsurance] = useState(false)
  const [mortgage, setMortgage] = useState(false)

  return (
    <SandboxBlock>
      <SandboxSection title="Дополнительная информация">
        <div className="flex flex-col gap-4">
          <Checkbox
            checked={lease}
            onCheckedChange={(next) => setLease(next === true)}
            label="Земельный участок находится в аренде"
            comment="Подтверждаю, что земельный участок, используемый в рамках проекта, предоставлен на правах аренды. Право собственности у заявителя отсутствует"
          />
          <Checkbox
            checked={insurance}
            onCheckedChange={(next) => setInsurance(next === true)}
            label="Заключён договор страхования СМР"
            comment="Подтверждаю, что заключён договор и имеется страхование строительно-монтажных работ"
          />
          <Checkbox
            checked={mortgage}
            onCheckedChange={(next) => setMortgage(next === true)}
            label="У заказчика есть ипотека в Банке ДОМ.РФ"
          />
        </div>
      </SandboxSection>
    </SandboxBlock>
  )
}

export { TrancheAdditionalBlock }
