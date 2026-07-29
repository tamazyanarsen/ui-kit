import { useRef } from "react"

import { UpButton } from "@/components/ui/up-button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function UpButtonDemo() {
  const scrollContainer = useRef<HTMLDivElement>(null)

  return (
    <AccordionItem value="up-button">
      <AccordionTrigger>Up Button</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Прокрутите вниз — кнопка появится в правом нижнем углу</RowLabel>
          <div className="relative">
            <div
              ref={scrollContainer}
              className="h-64 overflow-y-auto rounded-lg border border-[#DEDEDE] p-4"
            >
              <div className="space-y-4 text-sm text-muted-foreground">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i}>Строка контента №{i + 1}</p>
                ))}
              </div>
            </div>
            <UpButton
              scrollContainer={scrollContainer}
              threshold={200}
              className="absolute right-4 bottom-4"
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Up Button — анатомия аналогична Button (Icon, Small): 32px круглая
          secondary-white кнопка с шевроном вверх. Появляется после прокрутки
          экрана (в реальном использовании — фиксирована к окну, здесь для
          демо привязана к контейнеру через <code>scrollContainer</code>) и
          скрывается через проп <code>hidden</code>, когда поверх появляется
          всплывающий элемент.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { UpButtonDemo }
