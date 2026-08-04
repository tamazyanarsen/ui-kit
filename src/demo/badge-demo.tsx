import { Badge } from "@/components/ui/badge"
import type { BadgeColor } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const COLORS: BadgeColor[] = [
  "red",
  "contra-red",
  "dark-grey",
  "light-grey",
  "black",
]

function BadgeDemo() {
  return (
    <AccordionItem value="badge">
      <AccordionTrigger>Badge</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Counter — 1 / 10 / 99+</RowLabel>
          <div className="flex items-center gap-3">
            <Badge type="counter" value={1} />
            <Badge type="counter" value={10} />
            <Badge type="counter" value={150} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Counter — цвета (Default / Disabled)</RowLabel>
          <div className="grid grid-cols-5 gap-6">
            {COLORS.map((color) => (
              <div key={color} className="flex flex-col items-center gap-3">
                <Badge type="counter" value={0} color={color} />
                <Badge type="counter" value={0} color={color} disabled />
                <span className="text-center text-p3 text-muted-foreground">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Point — цвета (Default / Disabled)</RowLabel>
          <div className="grid grid-cols-5 gap-6">
            {COLORS.map((color) => (
              <div key={color} className="flex flex-col items-center gap-3">
                <Badge type="point" color={color} />
                <Badge type="point" color={color} disabled />
                <span className="text-center text-p3 text-muted-foreground">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Red vs Contra-Red — обводка видна на цветной поверхности
          </RowLabel>
          <div className="flex items-center gap-6 rounded-lg bg-[var(--badge-red-bg)] p-4">
            <Badge type="counter" value={3} color="red" />
            <Badge type="counter" value={3} color="contra-red" />
            <Badge type="point" color="red" />
            <Badge type="point" color="contra-red" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Использование — оверлей на Button</RowLabel>
          <div className="flex items-center gap-6">
            <div className="relative inline-flex">
              <Button variant="primary">Button</Button>
              <Badge
                type="counter"
                value={5}
                className="absolute -top-1.5 -right-1.5"
              />
            </div>
            <div className="relative inline-flex">
              <Button variant="primary">Button</Button>
              <Badge
                type="counter"
                value={150}
                className="absolute -top-1.5 -right-1.5"
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-p3 text-muted-foreground">
          <code>type="counter"</code> форматирует <code>value</code>: 1–99
          без изменений, 100 и более — «99+». <code>type="point"</code> —
          просто залитый круг без текста, того же размера. Оверлей на
          кнопке — не режим самого Badge: контейнер получает{" "}
          <code>relative</code>, а Badge — <code>absolute</code> с нужным
          смещением, как в примере выше. <code>contra-red</code> — это Red с
          белой обводкой (для использования на цветных/красных
          поверхностях), а не отдельный цвет заливки. При{" "}
          <code>disabled</code> все цвета сводятся к одному приглушённому
          серому — кроме light-grey, который просто становится на тон
          светлее (он и так самый бледный вариант).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { BadgeDemo }
