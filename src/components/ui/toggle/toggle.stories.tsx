import { useState } from "react"
import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Toggle } from "./toggle"

const meta = {
  title: "Interaction/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  args: { label: "Уведомления" },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: ComponentProps<typeof Toggle>) {
  const [checked, setChecked] = useState(args.checked ?? true)
  return <Toggle {...args} checked={checked} onCheckedChange={setChecked} />
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
}

export const WithoutLabel: Story = {
  args: { label: undefined, "aria-label": "Уведомления" },
}

export const WithCommentAndError: Story = {
  args: { comment: "Дополнительное пояснение", error: "Ошибка сохранения настройки" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
}
