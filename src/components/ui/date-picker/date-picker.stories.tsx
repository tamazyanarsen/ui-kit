import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { DatePicker } from "./date-picker"

const meta = {
  title: "Interaction/Calendar/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

function ControlledSingle() {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <DatePicker value={value} onChange={setValue} />
}

export const Single: Story = {
  render: () => <ControlledSingle />,
}

function ControlledRange() {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />
}

export const Range: Story = {
  render: () => <ControlledRange />,
}

export const MonthMode: Story = {
  args: { mode: "month" },
}

export const YearMode: Story = {
  args: { mode: "year" },
}

export const WithError: Story = {
  args: { error: "Обязательное поле" },
}

export const Disabled: Story = {
  args: { disabled: true },
}
