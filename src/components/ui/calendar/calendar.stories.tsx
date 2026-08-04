import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Calendar } from "./calendar"

const meta = {
  title: "Interaction/Calendar/Calendar",
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

function DisabledDatesCalendar() {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return (
    <Calendar
      mode="single"
      value={value}
      onChange={setValue}
      disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  )
}

export const DisabledDates: Story = {
  name: "With disabled days (weekends)",
  render: () => <DisabledDatesCalendar />,
}

// Design-check #13: the sheet layout already supports every mode (see
// CalendarMobile) — only the Single variant had a story. Adding the rest
// (Range/Month/Year) so all four mobile variants from
// ui/calendar/calendar@2x-1.png are actually demoed in Storybook.
export const MobileSheet: Story = {
  args: { mode: "single", layout: "sheet", title: "Выберите дату" },
  parameters: { layout: "fullscreen" },
}

function MobileRangeCalendar() {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return (
    <Calendar
      mode="range"
      layout="sheet"
      title="Выберите даты"
      rangeValue={range}
      onRangeChange={setRange}
    />
  )
}

export const MobileSheetRange: Story = {
  name: "Mobile Sheet — Range",
  render: () => <MobileRangeCalendar />,
  parameters: { layout: "fullscreen" },
}

export const MobileSheetMonth: Story = {
  name: "Mobile Sheet — Month",
  args: { mode: "month", layout: "sheet", title: "Выберите месяц" },
  parameters: { layout: "fullscreen" },
}

export const MobileSheetYear: Story = {
  name: "Mobile Sheet — Year",
  args: { mode: "year", layout: "sheet", title: "Выберите год" },
  parameters: { layout: "fullscreen" },
}
