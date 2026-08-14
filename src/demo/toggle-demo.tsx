import { Toggle } from "@/components/ui/toggle"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function ToggleDemo() {
  return (
    <AccordionItem value="toggle">
      <AccordionTrigger>Toggle</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <RowLabel>Default</RowLabel>
            <Toggle label="Option Text" comment="Comment" />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Checked</RowLabel>
            <Toggle label="Option Text" comment="Comment" defaultChecked />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Disabled</RowLabel>
            <Toggle label="Option Text" comment="Comment" disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Checked + Disabled</RowLabel>
            <Toggle
              label="Option Text"
              comment="Comment"
              defaultChecked
              disabled
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Error (Comment + error вместе)</RowLabel>
            <Toggle
              label="Option Text"
              comment="Comment"
              error="Text about error here"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Без текста</RowLabel>
            <Toggle />
          </div>
        </div>
        <p className="mt-4 text-p3-regular text-muted-foreground">
          Трек 48×24, ползунок 16×16 с отступом 4px. В отличие от
          Checkbox/Radio, у Toggle ошибка не красит сам трек — только текст;
          `comment` и `error` складываются (оба видны одновременно), а не
          заменяют друг друга.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ToggleDemo }
