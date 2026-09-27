import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

import { Radio } from "./radio"

// Группирует пункты Radio — по макету «включение одной означает отключение
// другой» (выбор одного снимает выбор с остальных). Рисует <div>, а
// раскладку оставляет вызывающему коду через className (по умолчанию —
// вертикальная стопка).
//
// Второй проход: зазор стоял 12px (gap-3), а документационный кадр «Use» и
// для Radio, и для Checkbox говорит об этом прямо: «Вертикальный отступ
// между радиокнопками составляет 24 px, для мобильной версии 24 px», то
// есть 24px на обоих брейкпоинтах.
//
// Заполнить группу можно двумя способами. Передача `items` объявляет всю
// группу в одном месте, и именно это делает *групповое* поведение (выбор по
// одному за раз, перемещение фокуса стрелками, пропуск выключенных опций)
// проверяемым как единое целое, а не как кучка отдельных радиокнопок.
// Передача детей сохраняет исходную композиционную форму для раскладок,
// которые списком пунктов не выразить.

interface RadioGroupItem {
  value: string
  label?: React.ReactNode
  comment?: React.ReactNode
  disabled?: boolean
}

interface RadioGroupProps
  extends Omit<RadioGroupPrimitive.Props, "children"> {
  items?: RadioGroupItem[]
  children?: React.ReactNode
}

function RadioGroup({ className, items, children, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {items
        ? items.map((item) => (
            <Radio
              key={item.value}
              value={item.value}
              label={item.label}
              comment={item.comment}
              disabled={item.disabled}
            />
          ))
        : children}
    </RadioGroupPrimitive>
  )
}

export { RadioGroup }
export type { RadioGroupProps, RadioGroupItem }
