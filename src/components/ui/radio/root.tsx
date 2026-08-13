import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

import { Radio } from "./radio"

// Groups Radio items — "включение одной означает отключение другой" per the
// spec (selecting one deselects the rest). Renders a <div>; layout is left
// to the consumer via className (defaults to a vertical stack).
//
// Round-2 audit: gap was 12px (gap-3) — the "Use" documentation frame for
// both Radio and Checkbox states this explicitly: "Вертикальный отступ
// между радиокнопками составляет 24 px, для мобильной версии 24 px" (24px
// vertical gap, same at both breakpoints).
//
// Two ways to fill it. Passing `items` declares the whole group in one place,
// which is what makes the *group* behaviour (one selection at a time,
// roving-focus arrow keys, disabled options skipped) testable as a unit
// rather than only as a pile of individual radios. Passing children keeps the
// original composition form for layouts the items list can't express.

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
