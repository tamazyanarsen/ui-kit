import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "./checkbox"

const meta = {
  title: "Interaction/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  args: { label: "Согласен с условиями" },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

function Controlled() {
  const [checked, setChecked] = useState(false)
  return <Checkbox label="Согласен с условиями" checked={checked} onCheckedChange={setChecked} />
}

export const Default: Story = {
  render: () => <Controlled />,
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
