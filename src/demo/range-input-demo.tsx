import * as React from "react"

import { RangeInput } from "@/components/ui/range-input"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function RangeInputDemo() {
  const [amount, setAmount] = React.useState(400000)

  return (
    <AccordionItem value="range-input">
      <AccordionTrigger>Range Input</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <RowLabel>Default</RowLabel>
            <RangeInput label="Label" defaultValue={30} comment="Comment" />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Disabled</RowLabel>
            <RangeInput
              label="Label"
              defaultValue={30}
              comment="Comment"
              disabled
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Error</RowLabel>
            <RangeInput
              label="Label"
              defaultValue={70}
              error="Text about error here"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Со шкалой (Show Indicator)</RowLabel>
            <RangeInput
              label="Label"
              defaultValue={30}
              scaleLabels={["0", "100"]}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1.5">
          <RowLabel>Одобренные условия</RowLabel>
          <RangeInput
            label="Сумма к получению"
            min={100000}
            max={1000000}
            step={10000}
            value={amount}
            onValueChange={setAmount}
            format={{ style: "currency", currency: "RUB", maximumFractionDigits: 0 }}
            comment="Введённая сумма к получению округляется до 10 000 ₽"
            scaleLabels={["100 000 ₽", "1 000 000 ₽"]}
          />
        </div>

        <p className="mt-4 text-p3 text-muted-foreground">
          Однопозиционный слайдер поверх Input-подобного бокса: Label + Value
          сверху, трек снизу. В отличие от Checkbox/Radio/Toggle, error не
          красит рамку бокса (она как у Input остаётся нейтральной) — только
          трек/ползунок и подпись под боксом.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { RangeInputDemo }
