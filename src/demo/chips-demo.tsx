import { Chips } from "@/components/ui/chips"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function ChipsDemo() {
  return (
    <AccordionItem value="chips">
      <AccordionTrigger>Chips</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Без Subtitle</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Chips>Chips</Chips>
            <Chips count={3}>Chips</Chips>
            <Chips closable onRemove={() => {}}>
              Chips
            </Chips>
            <Chips disabled>Chips</Chips>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>С Subtitle</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Chips subtitle="Subtitle">Chips</Chips>
            <Chips subtitle="Subtitle" count={12}>
              Chips
            </Chips>
            <Chips subtitle="Subtitle" closable onRemove={() => {}}>
              Chips
            </Chips>
            <Chips subtitle="Subtitle" disabled>
              Chips
            </Chips>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Длинный текст — обрезается с max-width 256px</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Chips subtitle="Категория">
              Очень длинное значение чипса, которое не помещается
            </Chips>
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Chips — некликабельный компонент для отображения значения (с
          опциональным заголовком, счётчиком или кнопкой удаления). В
          отличие от Filter, у Chips нет White/Grey вариантов фона и нет
          выпадающего списка.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ChipsDemo }
