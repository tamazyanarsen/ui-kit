import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import { Chips, type ChipsProps } from "./chips"

const meta = {
  title: "Interaction/Chips",
  component: Chips,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    subtitle: { control: "text" },
    count: { control: { type: "number", min: 0, max: 99 } },
    closable: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Значение",
    subtitle: "",
    closable: false,
    disabled: false,
  },
} satisfies Meta<ChipsProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ChipsProps>
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ children: "Значение" }}
      columns={[
        { label: "Текст", props: {} },
        { label: "+ подпись", props: { subtitle: "Подпись" } },
        { label: "+ счётчик", props: { count: 5 } },
        { label: "+ крестик", props: { closable: true } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Disabled", props: { disabled: true } },
      ]}
      render={(props) => <Chips {...props} onRemove={() => {}} />}
    />
  ),
}
