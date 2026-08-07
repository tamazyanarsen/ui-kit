import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Toggle, type ToggleProps } from "./toggle"

type PlaygroundArgs = ToggleProps & { state?: PlaygroundState }

const meta = {
  title: "Interaction/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled({ state, checked, ...props }: PlaygroundArgs) {
  const [internal, setInternal] = useState(false)
  return (
    <PseudoBox state={state}>
      <Toggle
        {...props}
        checked={checked ?? internal}
        onCheckedChange={setInternal}
      />
    </PseudoBox>
  )
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ToggleProps>
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ label: "Option Text", comment: "Comment" }}
      columns={[
        { label: "Off", props: { checked: false } },
        { label: "On", props: { checked: true } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Disabled", props: { disabled: true } },
        { label: "Error", props: { error: "Text about error here" } },
      ]}
      render={(props) => <Toggle {...props} onCheckedChange={() => {}} />}
    />
  ),
}
