import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { RangeInput, type RangeInputProps } from "./range-input"

const meta = {
  title: "Компоненты/Range Input",
  component: RangeInput,
  parameters: { layout: "padded" },
  // comment/error are typed React.ReactNode but every usage is a plain
  // string — pin text controls so leaving one unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder. (scaleLabels/format
  // are left alone: plain-data array/object, fine to edit as raw JSON.)
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    // Captions under the track (Figma's "Шкала"); an empty array hides them.
    scaleLabels: { control: "object" },
    // Intl.NumberFormat options for the value bubble, e.g. currency.
    format: { control: "object" },
  },
  args: {
    label: "Label",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    disabled: false,
    scaleLabels: ["0", "50", "100"],
    comment: "Comment",
  },
} satisfies Meta<RangeInputProps>

export default meta
type Story = StoryObj<RangeInputProps>

function Controlled({ defaultValue, ...props }: RangeInputProps) {
  const [value, setValue] = useState<number>(
    typeof defaultValue === "number" ? defaultValue : 50
  )
  return (
    <RangeInput
      {...props}
      value={value}
      onValueChange={(v) => setValue(v as number)}
    />
  )
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<RangeInputProps>
      stretch
      cellClassName="min-w-[320px]"
      baseProps={{ label: "Label", min: 0, max: 100, step: 1 }}
      columns={[
        { label: "Без шкалы", props: {} },
        { label: "Со шкалой", props: { scaleLabels: ["0", "50", "100"] } },
      ]}
      rows={[
        { label: "0 %", props: { defaultValue: 0 } },
        { label: "50 %", props: { defaultValue: 50 } },
        { label: "100 %", props: { defaultValue: 100 } },
        { label: "Hover", props: { defaultValue: 50 }, pseudo: "hover" },
        {
          label: "Comment",
          props: { defaultValue: 50, comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: 50, error: "Text about error here" },
        },
        { label: "Disabled", props: { defaultValue: 50, disabled: true } },
      ]}
      render={(props) => <Controlled {...props} />}
    />
  ),
}
