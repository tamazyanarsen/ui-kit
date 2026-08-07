import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Checkbox, type CheckboxProps } from "./checkbox"

/* Two stories per component, matching the Figma page:
   - Playground — every property of the component as a control, mirroring the
     "Current variant" panel of `ELK / checkbox`.
   - Matrix — the full State × Type table the spec sheet draws.

   `size` (Large/Desktop vs Medium/Mobile in Figma) is not a prop here: the
   component switches on the `md:` breakpoint, so it follows the viewport
   toolbar rather than a control. */

type PlaygroundArgs = CheckboxProps & { state?: PlaygroundState }

const meta = {
  title: "Interaction/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  argTypes: {
    // `label`/`comment`/`error` are all `React.ReactNode` but every usage
    // here is a plain string — without this, leaving one unset falls back to
    // a generic "Set object" JSON editor.
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    indeterminate: false,
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// Checkbox is controlled, so the Playground owns its own `checked` state to
// stay clickable — but the `checked` control still overrides it when set, so
// the arg isn't decorative.
function Controlled({
  state,
  checked,
  ...props
}: CheckboxProps & { state?: PlaygroundState }) {
  const [internal, setInternal] = useState(false)
  return (
    <PseudoBox state={state}>
      <Checkbox
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

/* Cell shape: `on` is the row's checked-ness and `partial` the column's
   representation of it, so the Default/Hover/Disabled rows stay empty in
   both columns exactly as the spec sheet draws them (passing
   `indeterminate` directly would put a dash in every Partial cell). */
type Cell = Omit<CheckboxProps, "checked" | "indeterminate"> & {
  on?: boolean
  partial?: boolean
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<Cell>
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ label: "Option Text", comment: "Comment" }}
      columns={[
        { label: "Checked", props: {} },
        { label: "Partial", props: { partial: true } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Checked\nPressed", props: { on: true }, pseudo: "active" },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Checked\nHover", props: { on: true }, pseudo: "hover" },
        { label: "Disabled", props: { disabled: true } },
        { label: "Checked\nDisabled", props: { on: true, disabled: true } },
        { label: "Error", props: { error: "Text about error here" } },
      ]}
      render={({ on, partial, ...props }) => (
        <Checkbox
          {...props}
          checked={Boolean(on)}
          indeterminate={Boolean(on && partial)}
          onCheckedChange={() => {}}
        />
      )}
    />
  ),
}
