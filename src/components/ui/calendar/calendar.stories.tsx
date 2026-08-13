import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Calendar } from "./calendar"
import type { CalendarProps } from "./types"

const meta = {
  title: "Компоненты/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  // `defaultMonth`/`value`/`rangeValue`/`monthValue`/`yearValue` are all
  // Date-based and owned by each story's own local state wrapper — they're
  // never meant to be driven by the Controls panel. Worse than just an
  // unfriendly "Set object" JSON-editor placeholder: verified live that
  // setting a value crashes the story outright (`TypeError:
  // initial.getFullYear is not a function`, since the JSON editor produces a
  // plain object, not a real Date instance). `control: false` removes the
  // footgun instead of just prettying up a control that was never safe.
  argTypes: {
    mode: { control: "inline-radio", options: ["single", "range", "month", "year"] },
    layout: { control: "inline-radio", options: ["popover", "sheet"] },
    title: { control: "text" },
    footer: { control: "boolean" },
    // A predicate, not a value — no JSON control can express one, so map a
    // friendly choice to a real function (same technique as Button's `icon`).
    disabledDate: {
      control: { type: "select", labels: { none: "Нет", weekends: "Выходные" } },
      options: ["none", "weekends"],
      mapping: {
        none: undefined,
        weekends: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
      },
    },
    defaultMonth: { control: false },
    value: { control: false },
    rangeValue: { control: false },
    monthValue: { control: false },
    yearValue: { control: false },
  },
  args: { mode: "single", layout: "popover", footer: true, title: "Выберите дату" },
} satisfies Meta<CalendarProps>

export default meta
type Story = StoryObj<CalendarProps>

// `value`/`onChange` are fixed by this demo's own local state (a bare
// `Date | null`, incompatible with range/month/year's value shapes) — every
// other control (layout, title, footer, …) is still forwarded, so the
// Controls panel isn't just decorative (same pattern as Checkbox's
// `Controlled` wrapper).
function SingleDateCalendar(
  props: Omit<CalendarProps, "value" | "onChange">
) {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <Calendar value={value} onChange={setValue} {...props} />
}

function RangeCalendar(
  props: Omit<CalendarProps, "rangeValue" | "onRangeChange">
) {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return (
    <Calendar mode="range" rangeValue={range} onRangeChange={setRange} {...props} />
  )
}

export const Playground: Story = {
  render: (args) =>
    args.mode === "range" ? (
      <RangeCalendar {...args} />
    ) : (
      <SingleDateCalendar {...args} />
    ),
}

/* Figma's own axes are Mode (Single / Range / Month / Year) × Layout
   (popup on desktop, bottom sheet on mobile). */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<CalendarProps>
        columnGroups={[
          {
            label: "Mode",
            columns: [
              { label: "Single", props: { mode: "single" } },
              { label: "Range", props: { mode: "range" } },
              { label: "Month", props: { mode: "month" } },
              { label: "Year", props: { mode: "year" } },
            ],
          },
        ]}
        rows={[
          { label: "Popover (Desktop)", props: { layout: "popover" } },
          { label: "Без подвала", props: { layout: "popover", footer: false } },
          {
            // Weekends demonstrate `disabledDate`; the whole grid keeps
            // working, only those cells go inert.
            label: "Недоступные дни\n(выходные)",
            props: {
              layout: "popover",
              disabledDate: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
            },
          },
        ]}
        render={(props) =>
          props.mode === "range" ? (
            <RangeCalendar {...props} />
          ) : (
            <SingleDateCalendar {...props} />
          )
        }
      />
      <StatesMatrix<CalendarProps>
        baseProps={{ layout: "sheet" }}
        columnGroups={[
          {
            label: "Sheet (Mobile)",
            columns: [
              { label: "Single", props: { mode: "single", title: "Выберите дату" } },
              { label: "Range", props: { mode: "range", title: "Выберите даты" } },
              { label: "Month", props: { mode: "month", title: "Выберите месяц" } },
              { label: "Year", props: { mode: "year", title: "Выберите год" } },
            ],
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) =>
          props.mode === "range" ? (
            <RangeCalendar {...props} />
          ) : (
            <SingleDateCalendar {...props} />
          )
        }
      />
    </div>
  ),
}
