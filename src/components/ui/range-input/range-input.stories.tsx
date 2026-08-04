import { useState } from "react"
import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { RangeInput } from "./range-input"

const meta = {
  title: "Interaction/RangeInput",
  component: RangeInput,
  parameters: { layout: "padded" },
  args: { label: "Сумма", min: 0, max: 100, step: 1 },
} satisfies Meta<typeof RangeInput>

export default meta
type Story = StoryObj<typeof meta>

function Controlled({
  label,
  min,
  max,
  step,
}: {
  label?: React.ReactNode
  min?: number
  max?: number
  step?: number
}) {
  const [value, setValue] = useState(50)
  return (
    <RangeInput
      label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={(v) => setValue(v as number)}
    />
  )
}

export const Default: Story = {
  render: (args) => (
    <Controlled label={args.label} min={args.min} max={args.max} step={args.step} />
  ),
}

export const WithScaleLabels: Story = {
  args: { defaultValue: 50, scaleLabels: ["0", "100"] },
}

export const WithError: Story = {
  args: { defaultValue: 50, error: "Значение вне допустимого диапазона" },
}

export const Disabled: Story = {
  args: { defaultValue: 50, disabled: true },
}
