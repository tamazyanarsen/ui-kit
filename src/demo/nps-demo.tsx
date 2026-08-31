import { useState } from "react"

import { Nps } from "@/components/ui/nps"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function NpsDemo() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <AccordionItem value="nps">
      <AccordionTrigger>NPS — обратная связь</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <RowLabel>Пустое состояние → оценка → отправка</RowLabel>
            <Nps
              submitted={submitted}
              onSubmit={() => setSubmitted(true)}
              onClose={() => setSubmitted(false)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Без Description и Chips</RowLabel>
            <Nps
              defaultValue={4}
              showDescription={false}
              showChips="none"
            />
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          1–5 звёзд: Очень плохо / Плохо / Нормально / Хорошо / Отлично.
          Чипсы — один и тот же фиксированный набор вне зависимости от
          оценки (сверено со спеком — все свотчи 1–4 звезды показывают
          одинаковый список). После отправки — состояние «Спасибо за
          оценку»; по спеку окно закрывается автоматически через 2000мс —
          в демо это управляется извне через <code>onSubmit</code>/
          <code>onClose</code>, сам компонент таймер не запускает.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { NpsDemo }
