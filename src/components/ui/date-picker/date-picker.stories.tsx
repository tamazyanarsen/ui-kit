import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { DatePicker } from "./date-picker"
import type { DatePickerProps } from "./date-picker"

const meta = {
  title: "Interaction/Calendar/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

// `value`/`onChange` are fixed by this demo's own local state — every
// other control (label, comment, error, disabled, footer, size, …) is
// still forwarded, so the Controls panel isn't just decorative here (same
// pattern as Checkbox's `Controlled` wrapper).
function ControlledSingle(props: Omit<DatePickerProps, "mode" | "value" | "onChange">) {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <DatePicker mode="single" value={value} onChange={setValue} {...props} />
}

export const Single: Story = {
  render: (args) => <ControlledSingle {...args} />,
}

function ControlledRange(props: Omit<DatePickerProps, "mode" | "rangeValue" | "onRangeChange">) {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} {...props} />
}

export const Range: Story = {
  render: (args) => <ControlledRange {...args} />,
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
