import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { DatePicker } from "./date-picker"
import type { DatePickerProps } from "./date-picker"
import type { CalendarMode } from "@/components/ui/calendar"
import type { InputSize } from "@/components/ui/input"

/* Ось `State` есть в макете (`ELK / select`, на котором стоит поле: State = Default | Hover | Disabled | Active), а hover пропом не
   выставить — его даёт общий контрол `state`. */
type PlaygroundArgs = DatePickerProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Date Picker",
  component: DatePicker,
  parameters: { layout: "centered" },
  argTypes: {
    state: stateArgType,
    // `mode`/`size` are plain string unions imported from other modules
    // (`CalendarMode`, `InputSize`) — react-docgen can't resolve an imported
    // type alias into an enum here, so both fall back to a generic
    // "Set object" JSON editor. Pin the real option lists explicitly
    // instead, same fix as Badge's `color`.
    mode: {
      control: "inline-radio",
      options: ["single", "range", "month", "year"] satisfies CalendarMode[],
    },
    size: { control: "inline-radio", options: ["lg", "sm"] satisfies InputSize[] },
    // `label`/`comment`/`error` are `React.ReactNode` but every usage is a
    // plain string — without this, leaving one unset falls back to the same
    // generic "Set object" editor.
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    // The popup's "Сбросить / Применить" row.
    footer: { control: "boolean" },
    // `value`/`rangeValue`/`monthValue`/`yearValue` are owned by each
    // story's own local-state wrapper — never meant to be driven by the
    // Controls panel. Same landmine verified live on Calendar's matching
    // props (setting one via the JSON editor crashes the story, since it
    // produces a plain object instead of a real Date instance).
    value: { control: false },
    rangeValue: { control: false },
    monthValue: { control: false },
    yearValue: { control: false },
  },
  args: {
    state: "default" as PlaygroundState,
    mode: "single",
    size: "lg",
    label: "Дата",
    disabled: false,
    footer: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// `value`/`onChange` are fixed by this demo's own local state — every other
// control (label, comment, error, disabled, size, …) is still forwarded.
function ControlledSingle(props: Omit<DatePickerProps, "value" | "onChange">) {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <DatePicker value={value} onChange={setValue} {...props} />
}

function ControlledRange(
  props: Omit<DatePickerProps, "rangeValue" | "onRangeChange">
) {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return (
    <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} {...props} />
  )
}

function Demo(props: DatePickerProps) {
  return props.mode === "range" ? (
    <ControlledRange {...props} />
  ) : (
    <ControlledSingle {...props} />
  )
}

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <div className="w-80">
      <PseudoBox state={state} className="w-full">
        <Demo {...args} />
      </PseudoBox>
    </div>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<DatePickerProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ label: "Label" }}
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
          { label: "L (default)", props: { size: "lg" } },
          { label: "S", props: { size: "sm" } },
        ]}
        render={(props) => <Demo {...props} />}
      />
      <StatesMatrix<DatePickerProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ label: "Label", mode: "single" }}
        columns={[
          { label: "L (default)", props: { size: "lg" } },
          { label: "S", props: { size: "sm" } },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Focus", props: {}, pseudo: "focus-within" },
          { label: "Comment", props: { comment: "Comment" } },
          { label: "Error", props: { error: "Text about error here" } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Demo {...props} />}
      />
    </div>
  ),
}
