import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Calendar } from "./calendar"

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function SingleDateCalendar() {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <Calendar mode="single" value={value} onChange={setValue} />
}

export const Single: Story = {
  render: () => <SingleDateCalendar />,
}

function RangeCalendar() {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return <Calendar mode="range" rangeValue={range} onRangeChange={setRange} />
}

export const Range: Story = {
  render: () => <RangeCalendar />,
}

export const MonthPicker: Story = {
  args: { mode: "month" },
}

export const YearPicker: Story = {
  args: { mode: "year" },
}

export const NoFooter: Story = {
  args: { mode: "single", footer: false },
}

export const MobileSheet: Story = {
  args: { mode: "single", layout: "sheet", title: "Выберите дату" },
  parameters: { layout: "fullscreen" },
}
