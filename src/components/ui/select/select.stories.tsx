import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
]

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
      <SelectTrigger size={size} label="Фрукт" error={error} comment={comment} onClear={() => setValue(null)}>
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

const meta = {
  title: "UI/Select",
  component: ClearableFruitSelect,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ClearableFruitSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: { size: "lg" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Preselected: Story = {
  args: { defaultValue: "banana" },
}

export const WithComment: Story = {
  args: { comment: "Выберите один вариант" },
}

export const WithError: Story = {
  args: { error: "Обязательное поле" },
}

export const ReadOnly: Story = {
  render: () => (
    <Select items={FRUIT_OPTIONS} defaultValue="banana" readOnly>
      <SelectTrigger label="Фрукт">
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
  ),
}
