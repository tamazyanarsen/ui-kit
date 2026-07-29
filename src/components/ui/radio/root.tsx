import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

// Groups Radio items — "включение одной означает отключение другой" per the
// spec (selecting one deselects the rest). Renders a <div>; layout is left
// to the consumer via className (defaults to a vertical stack).
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

export { RadioGroup }
