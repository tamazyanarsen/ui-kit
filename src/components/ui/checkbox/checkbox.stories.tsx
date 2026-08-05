import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox, type CheckboxProps } from "./checkbox"

const meta = {
  title: "Interaction/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  // `label`/`comment`/`error` are all `React.ReactNode` but every usage
  // across this file is a plain string — without this, leaving one unset
  // (as WithoutLabel/Default/Indeterminate/Disabled all do for one or more
  // of them) falls back to a generic "Set object" JSON editor.
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
  },
  args: { label: "Согласен с условиями" },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// Checkbox is a controlled component, so this demo owns its own `checked`
// state to stay interactive in the canvas — but every other arg (label,
// comment, error, indeterminate, disabled, …) is still forwarded, so the
// Controls panel isn't just decorative for the Default story.
function Controlled(props: Omit<CheckboxProps, "checked" | "onCheckedChange">) {
  const [checked, setChecked] = useState(false)
  return <Checkbox {...props} checked={checked} onCheckedChange={setChecked} />
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
}

export const WithoutLabel: Story = {
  args: { label: undefined, "aria-label": "Выбрать строку" },
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
}

export const WithComment: Story = {
  args: { comment: "Необязательное пояснение" },
}

export const WithError: Story = {
  args: { error: "Необходимо согласие", comment: "Это пояснение будет скрыто" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
}
