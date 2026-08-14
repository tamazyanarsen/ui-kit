import * as React from "react"

import { RadioGroup, Radio } from "@/components/ui/radio"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function RadioDemo() {
  const [plan, setPlan] = React.useState("basic")

  return (
    <AccordionItem value="radio">
      <AccordionTrigger>Radio</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <RowLabel>Default</RowLabel>
            <RadioGroup>
              <Radio value="a" label="Option Text" comment="Comment" />
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Checked</RowLabel>
            <RadioGroup defaultValue="a">
              <Radio value="a" label="Option Text" comment="Comment" />
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Disabled</RowLabel>
            <RadioGroup disabled>
              <Radio value="a" label="Option Text" comment="Comment" />
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Checked + Disabled</RowLabel>
            <RadioGroup defaultValue="a" disabled>
              <Radio value="a" label="Option Text" comment="Comment" />
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Без текста</RowLabel>
            <RadioGroup>
              <Radio value="a" />
            </RadioGroup>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1.5">
          <RowLabel>Группа (одна опция из множества)</RowLabel>
          <RadioGroup value={plan} onValueChange={setPlan} className="pl-1">
            <Radio
              value="basic"
              label="Базовый"
              comment="Бесплатно, ограниченный функционал"
            />
            <Radio
              value="pro"
              label="Pro"
              comment="990 ₽ / мес, весь функционал"
            />
            <Radio
              value="enterprise"
              label="Enterprise"
              comment="По запросу, для команд от 50 человек"
            />
          </RadioGroup>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Бокс 24×24, та же палитра, что у Checkbox. Включение одной опции в
          группе автоматически отключает остальные (RadioGroup). Нет
          состояния Partial — в отличие от Checkbox, у одиночной радиокнопки
          нет смыслового «частично выбрано».
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { RadioDemo }
