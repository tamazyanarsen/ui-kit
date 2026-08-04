import { useState } from "react"

import { Tabs } from "@/components/ui/tabs"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const BASIC_ITEMS = [
  { value: "all", label: "Все" },
  { value: "in-progress", label: "В обработке" },
  { value: "done", label: "Выполнено" },
  { value: "canceled", label: "Отменено" },
]

const ELEMENT_ITEMS = [
  { value: "badge", label: "Tab", badge: 3 },
  { value: "status", label: "Tab", status: true },
  { value: "plain", label: "Tab" },
  { value: "disabled", label: "Tab", disabled: true },
]

const OVERFLOW_ITEMS = Array.from({ length: 10 }, (_, i) => ({
  value: `tab-${i + 1}`,
  label: `Вкладка ${i + 1}`,
}))

function TabsDemo() {
  const [large, setLarge] = useState("all")
  const [medium, setMedium] = useState("all")
  const [elements, setElements] = useState("plain")
  const [overflow, setOverflow] = useState("tab-1")

  return (
    <AccordionItem value="tabs">
      <AccordionTrigger>Tabs</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Large — вкладка 1-го уровня</RowLabel>
          <Tabs items={BASIC_ITEMS} size="lg" value={large} onValueChange={setLarge} />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Medium — вкладка 2-го уровня</RowLabel>
          <Tabs items={BASIC_ITEMS} size="md" value={medium} onValueChange={setMedium} />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Badge / Status / Disabled</RowLabel>
          <Tabs
            items={ELEMENT_ITEMS}
            size="lg"
            value={elements}
            onValueChange={setElements}
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Show More — узкий контейнер, лишние вкладки уходят в дропдаун по
            «...»
          </RowLabel>
          <div className="max-w-sm rounded-lg border border-[#DEDEDE] p-4">
            <Tabs
              items={OVERFLOW_ITEMS}
              size="lg"
              value={overflow}
              onValueChange={setOverflow}
            />
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Large используется как вкладка 1-го уровня, Medium — 2-го. Активная
          вкладка получает жирный текст и тёмное подчёркивание; при наведении
          на неактивную появляется тонкое серое подчёркивание. Количество
          вкладок — от 2 до 12; если не помещаются, лишние скрываются за «...»
          и открываются в Dropdown по клику.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TabsDemo }
