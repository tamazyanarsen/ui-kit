import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Radio, type RadioProps } from "./radio"
import { RadioGroup } from "./root"

type PlaygroundArgs = RadioProps & { state?: PlaygroundState }

const meta = {
  title: "Interaction/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    value: "a",
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// A Radio only means anything inside a RadioGroup (it's the group that owns
// the selected value), so the Playground wraps a single one in its own
// group and keeps it clickable.
function Controlled({ state, ...props }: PlaygroundArgs) {
  const [value, setValue] = useState<unknown>(null)
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <PseudoBox state={state}>
        <Radio {...props} />
      </PseudoBox>
    </RadioGroup>
  )
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

type Cell = Omit<RadioProps, "value"> & { on?: boolean }

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<Cell>
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ label: "Option Text", comment: "Comment" }}
      columns={[{ label: "Radio" }]}
      rows={[
        { label: "Default", props: {} },
        { label: "Checked\nPressed", props: { on: true }, pseudo: "active" },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Checked\nHover", props: { on: true }, pseudo: "hover" },
        { label: "Disabled", props: { disabled: true } },
        { label: "Checked\nDisabled", props: { on: true, disabled: true } },
        { label: "Error", props: { error: "Text about error here" } },
      ]}
      /* Each cell is its own single-item group so the checked/unchecked
         rows can coexist — one shared group would allow only one. */
      render={({ on, ...props }) => (
        <RadioGroup value={on ? "a" : null}>
          <Radio {...props} value="a" />
        </RadioGroup>
      )}
    />
  ),
}
