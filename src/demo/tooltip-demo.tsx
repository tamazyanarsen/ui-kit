import { Info } from "@/icons"

import { Tooltip, Hint } from "@/components/ui/tooltip"
import type { TooltipDirection } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const DIRECTIONS: TooltipDirection[] = [
  "left",
  "right",
  "top-center",
  "top-left",
  "top-right",
  "down-center",
  "down-left",
  "down-right",
]

function TooltipDemo() {
  return (
    <AccordionItem value="tooltip">
      <AccordionTrigger>Tooltip &amp; Hint</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Tooltip — направления (наведите на точку)</RowLabel>
          <div className="grid grid-cols-4 gap-16 px-16 py-10">
            {DIRECTIONS.map((direction) => (
              <div key={direction} className="flex flex-col items-center gap-3">
                <Tooltip content="Your Text Goes Here" direction={direction}>
                  <span className="size-3 rounded-full bg-[var(--btn-secondary-black-bg)]" />
                </Tooltip>
                <span className="text-p3-regular text-muted-foreground">{direction}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Hint — клик по иконке «i», закрывается по X / клику вне</RowLabel>
          <div className="flex items-center gap-3">
            <Hint
              title="Title"
              content="Your Text Goes Here"
              direction="down-center"
            >
              <Button
                variant="secondary-grey"
                size="sm"
                icon={Info}
                iconPosition="only"
                aria-label="Подробнее"
              />
            </Hint>
            <span className="text-p2-regular text-muted-foreground">
              Show Title + Show Cross включены
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Hint content="Your Text Goes Here" showCross={false} direction="down-center">
              <Button
                variant="secondary-grey"
                size="sm"
                icon={Info}
                iconPosition="only"
                aria-label="Подробнее"
              />
            </Hint>
            <span className="text-p2-regular text-muted-foreground">
              Без Title, без крестика (закрывается только кликом вне)
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Использование — подсказка на поле, условия по клику</RowLabel>
          <div className="flex flex-wrap items-end gap-6">
            <Tooltip content="Введите номер счёта без пробелов" direction="down-center">
              <div className="w-56">
                <Input label="Номер счёта" />
              </div>
            </Tooltip>
            <Hint
              title="Условия бесплатного обслуживания"
              content={
                <ul className="list-disc space-y-1 pl-4">
                  <li>0,2 % к ставке для приобретения недвижимости от 20 млн ₸</li>
                  <li>2 % для научных работников</li>
                  <li>2 % выплата с зарплатного счета Банка Дом.РФ</li>
                </ul>
              }
              direction="top-center"
            >
              <Button variant="secondary-outline" size="sm">
                Условия
              </Button>
            </Hint>
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Tooltip открывается через 400мс после наведения (без задержки на
          закрытие) и не имеет Title/крестика — только текст, максимум 256px
          шириной. Hint открывается по клику, закрывается по X или клику вне
          компонента, несёт больше контента (опциональные Title/крестик),
          максимум 592px. Мобильный Bottom Sheet из спеки — это не режим
          этого компонента, а существующий <code>Modal</code> (он уже
          рендерится как bottom sheet на мобильном / диалог на десктопе) —
          на этот брейкпоинт контент Hint нужно переносить в него, а не
          дублировать здесь.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TooltipDemo }
