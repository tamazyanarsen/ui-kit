import { CountButton } from "@/components/ui/count-button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function CountButtonDemo() {
  return (
    <AccordionItem value="count-button">
      <AccordionTrigger>Count Button</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>1–99 — без изменений / 100+ — «99+»</RowLabel>
          <div className="flex flex-wrap items-center gap-6">
            <CountButton count={1}>Button</CountButton>
            <CountButton count={42}>Button</CountButton>
            <CountButton count={150}>Button</CountButton>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Count Button — Button с прикреплённым в правый верхний угол
          счётчиком (переиспользует Badge, высота счётчика — 16px, как в
          спеке). Анатомия и состояния — те же, что у Button; в блоке с
          другими кнопками используется только одна кнопка с индикатором.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { CountButtonDemo }
