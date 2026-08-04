import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
]

// `SelectTrigger`'s clear (X) button only calls the `onClear` prop — Select
// has no built-in Clear primitive (unlike Combobox), so an uncontrolled
// `defaultValue` Select has nothing for `onClear` to reset. Demos that want
// a working clear button need actual controlled state.
function ClearableFruitSelect({
  size,
  error,
  comment,
  defaultValue = null,
}: {
  size?: "sm" | "lg"
  error?: string
  comment?: string
  defaultValue?: string | null
}) {
  const [value, setValue] = useState<string | null>(defaultValue)
  return (
    <Select items={FRUIT_OPTIONS} value={value} onValueChange={setValue}>
      <SelectTrigger
        size={size}
        label="Label"
        error={error}
        comment={comment}
        onClear={() => setValue(null)}
      >
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {FRUIT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SelectDemo() {
  return (
    <AccordionItem value="select-trigger">
      <AccordionTrigger>Select — Trigger (L / S)</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ClearableFruitSelect defaultValue={null} />

          <ClearableFruitSelect defaultValue="banana" />

          <Select items={FRUIT_OPTIONS} defaultValue="banana" readOnly>
            <SelectTrigger label="Label">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {FRUIT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select items={FRUIT_OPTIONS} defaultValue="banana" disabled>
            <SelectTrigger label="Label">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {FRUIT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ClearableFruitSelect comment="Comment" />

          <ClearableFruitSelect error="Text about error here" />

          <ClearableFruitSelect
            size="sm"
            error="Text about error here"
            defaultValue="banana"
          />

          <Select items={FRUIT_OPTIONS} defaultValue="banana">
            <SelectTrigger size="sm" label="Label" clearable={false}>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {FRUIT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mt-4 text-p3 text-muted-foreground">
          Шаг 1 из 3: только Trigger (тот же паттерн размеров/floating label,
          что у Input — L и S, без M). Dropdown-контейнер (поиск/кнопка/футер/3
          device-layout) и List item — следующими шагами.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { SelectDemo }
