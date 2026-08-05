import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { DatePicker } from "./date-picker"
import type { DatePickerProps } from "./date-picker"
import type { CalendarMode } from "@/components/ui/calendar"
import type { InputSize } from "@/components/ui/input"

const meta = {
  title: "Interaction/Calendar/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  argTypes: {
    // `mode`/`size` are plain string unions imported from other modules
    // (`CalendarMode`, `InputSize`) — react-docgen can't resolve an
    // imported type alias into an enum here (Calendar's own `mode`, defined
    // in the same file as its component, resolves to a select
    // automatically; DatePicker's re-imported `mode` doesn't), so both
    // fall back to a generic "Set object" JSON editor. Pin the real option
    // lists explicitly instead, same fix as Badge's `color`.
    mode: { control: "select", options: ["single", "range", "month", "year"] satisfies CalendarMode[] },
    size: { control: "select", options: ["sm", "lg"] satisfies InputSize[] },
    // `label`/`comment`/`error` are `React.ReactNode` but every usage here
    // is a plain string — without this, leaving one unset falls back to
    // the same generic "Set object" editor.
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    // `value`/`rangeValue`/`monthValue`/`yearValue` are all owned by each
    // story's own local-state wrapper (typed away via `Omit<DatePickerProps,
    // ...>` on the wrapper's own params) — never meant to be driven by the
    // Controls panel. Same landmine verified live on Calendar's own
    // matching props (setting one via the JSON editor crashes the story,
    // since it produces a plain object instead of a real Date instance) —
    // `control: false` removes the footgun instead of just prettying up a
    // control that was never safe to touch.
    value: { control: false },
    rangeValue: { control: false },
    monthValue: { control: false },
    yearValue: { control: false },
  },
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
