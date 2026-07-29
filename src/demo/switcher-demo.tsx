import { useState } from "react"

import { Switcher } from "@/components/ui/switcher"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const BASIC_ITEMS = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
]

const BADGE_ITEMS = [
  { value: "inbox", label: "Tab", badge: 0 },
  { value: "other", label: "Tab" },
]

const DISABLED_ITEMS = [
  { value: "a", label: "Tab" },
  { value: "b", label: "Tab" },
]

const OVERFLOW_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Пункт ${i + 1}`,
}))

function SwitcherDemo() {
  const [grey, setGrey] = useState("day")
  const [white, setWhite] = useState("day")
  const [black, setBlack] = useState("day")
  const [badge, setBadge] = useState("inbox")
  const [overflow, setOverflow] = useState("item-1")

  return (
    <AccordionItem value="switcher">
      <AccordionTrigger>Switcher</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col items-start gap-2">
          <RowLabel>Grey Solid (Grey Background: True)</RowLabel>
          <Switcher items={BASIC_ITEMS} value={grey} onValueChange={setGrey} greyBackground />
        </div>

        <div className="mt-8 flex flex-col items-start gap-2">
          <RowLabel>White Solid (Grey Background: False)</RowLabel>
          <Switcher
            items={BASIC_ITEMS}
            value={white}
            onValueChange={setWhite}
            greyBackground={false}
          />
        </div>

        <div className="mt-8 flex flex-col items-start gap-2">
          <RowLabel>Active Black</RowLabel>
          <Switcher
            items={BASIC_ITEMS}
            value={black}
            onValueChange={setBlack}
            activeVariant="black"
          />
        </div>

        <div className="mt-8 flex flex-col items-start gap-2">
          <RowLabel>Badge / Disabled</RowLabel>
          <div className="flex flex-wrap items-center gap-4">
            <Switcher items={BADGE_ITEMS} value={badge} onValueChange={setBadge} />
            <Switcher items={DISABLED_ITEMS} defaultValue="a" disabled />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-2">
          <RowLabel>Medium — вкладка 2-го уровня</RowLabel>
          <Switcher items={BASIC_ITEMS} size="md" defaultValue="day" />
        </div>

        <div className="mt-8 flex flex-col items-start gap-2">
          <RowLabel>
            Show More — узкий контейнер, лишние пункты уходят в дропдаун по
            «...»
          </RowLabel>
          <div className="max-w-xs rounded-lg border border-[#DEDEDE] p-4">
            <Switcher
              items={OVERFLOW_ITEMS}
              value={overflow}
              onValueChange={setOverflow}
              className="w-full"
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Grey Solid / White Solid — переключение через{" "}
          <code>greyBackground</code>; White Solid добавляет рамку контейнера
          и активный сегмент становится светло-серым (а не белым), чтобы
          выделяться на белом фоне. <code>activeVariant="black"</code> —
          отдельный вариант с тёмным активным сегментом. Количество пунктов —
          от 2 до 12; при нехватке места лишние уходят за «...» в Dropdown.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { SwitcherDemo }
