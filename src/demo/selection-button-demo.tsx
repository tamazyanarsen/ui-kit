import { ChevronDown } from "@/icons"

import { Button } from "@/components/ui/button"
import { SelectionButton } from "@/components/ui/selection-button"
import type { SelectionButtonDirection } from "@/components/ui/selection-button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const ITEMS = [
  { text: "Text", description: "Description" },
  { text: "Text", description: "Description" },
]

const DIRECTIONS: SelectionButtonDirection[] = [
  "top-right",
  "top-left",
  "down-right",
  "down-left",
]

function SelectionButtonDemo() {
  return (
    <AccordionItem value="selection-button">
      <AccordionTrigger>Selection Button</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Size — L / S</RowLabel>
          <div className="flex items-start gap-16 pb-32">
            <SelectionButton items={ITEMS} size="lg" direction="down-right" />
            <SelectionButton items={ITEMS} size="sm" direction="down-right" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Direction — 4 позиции открытия</RowLabel>
          <div className="grid grid-cols-2 gap-16 pb-40 sm:grid-cols-4">
            {DIRECTIONS.map((direction) => (
              <div key={direction} className="flex flex-col items-center gap-3">
                <SelectionButton items={ITEMS} direction={direction} />
                <span className="text-p3-regular text-muted-foreground">
                  {direction}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Показ дропдауна — Show Dropdown</RowLabel>
          <div className="flex items-center gap-4">
            <SelectionButton items={ITEMS} showDropdown />
            <SelectionButton items={ITEMS} showDropdown={false} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Использование в макете — свой триггер</RowLabel>
          <div className="flex items-center gap-3 pb-40">
            <SelectionButton
              items={ITEMS}
              direction="down-right"
              trigger={
                <Button
                  variant="secondary-grey"
                  size="default"
                  icon={ChevronDown}
                  iconPosition="right"
                >
                  Другие действия
                </Button>
              }
            />
            <SelectionButton
              items={ITEMS}
              direction="down-right"
              trigger={
                <Button
                  variant="primary"
                  size="default"
                  icon={ChevronDown}
                  iconPosition="right"
                >
                  Принять решение
                </Button>
              }
            />
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Кнопка и список настраиваются независимо: по умолчанию триггер —
          иконка-многоточие (<code>secondary-white</code>, размер L/S = 56 /
          32px), но можно передать любую кнопку через{" "}
          <code>trigger</code> (например с текстом и шевроном, как в примере
          выше). <code>direction</code> — угол, из которого разворачивается
          список относительно кнопки; выбирается исходя из места на экране.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { SelectionButtonDemo }
