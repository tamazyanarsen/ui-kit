import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function CheckboxDemo() {
  const [childA, setChildA] = React.useState(true)
  const [childB, setChildB] = React.useState(false)
  const indeterminate = childA !== childB

  return (
    <AccordionItem value="checkbox">
      <AccordionTrigger>Checkbox</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <RowLabel>Default</RowLabel>
            <Checkbox label="Option Text" comment="Comment" />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Checked</RowLabel>
            <Checkbox label="Option Text" comment="Comment" defaultChecked />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Partial (indeterminate)</RowLabel>
            <Checkbox label="Option Text" comment="Comment" indeterminate />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Disabled</RowLabel>
            <Checkbox label="Option Text" comment="Comment" disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Checked + Disabled</RowLabel>
            <Checkbox
              label="Option Text"
              comment="Comment"
              defaultChecked
              disabled
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Partial + Disabled</RowLabel>
            <Checkbox
              label="Option Text"
              comment="Comment"
              indeterminate
              disabled
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Error</RowLabel>
            <Checkbox
              label="Option Text"
              error="Text about error here"
              defaultChecked
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Error, без текста</RowLabel>
            <Checkbox error="Есть ошибка" />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Без текста</RowLabel>
            <Checkbox />
          </div>
          <div className="flex flex-col gap-1.5">
            <RowLabel>Без Comment</RowLabel>
            <Checkbox label="Option Text" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1.5">
          <RowLabel>Partial — состояние родителя от дочерних</RowLabel>
          <div className="space-y-2 pl-1">
            <Checkbox
              label="Выбрать всё"
              checked={childA && childB}
              indeterminate={indeterminate}
              onCheckedChange={(checked) => {
                setChildA(checked)
                setChildB(checked)
              }}
            />
            <div className="flex flex-col gap-2 pl-10">
              <Checkbox
                label="Дочерний А"
                checked={childA}
                onCheckedChange={setChildA}
              />
              <Checkbox
                label="Дочерний Б"
                checked={childB}
                onCheckedChange={setChildB}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Бокс 24×24, hover-рамка тёмная (#252628), checked+hover заливка
          светлее primary hover (#2FCEEF). `error` заменяет `comment` (не
          складывается с ним) — как у Input. `indeterminate` — состояние
          Partial, применяется когда часть дочерних чекбоксов включена.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { CheckboxDemo }
