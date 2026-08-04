import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

// Groups Radio items — "включение одной означает отключение другой" per the
// spec (selecting one deselects the rest). Renders a <div>; layout is left
// to the consumer via className (defaults to a vertical stack).
//
// Round-2 audit: gap was 12px (gap-3) — the "Use" documentation frame for
// both Radio and Checkbox states this explicitly: "Вертикальный отступ
// между радиокнопками составляет 24 px, для мобильной версии 24 px" (24px
// vertical gap, same at both breakpoints).
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}

export { RadioGroup }
