import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switcher } from "./switcher"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "done", label: "Завершённые", badge: 3 },
]

const meta = {
  title: "UI/Switcher",
  component: Switcher,
  parameters: { layout: "padded" },
  args: { items: ITEMS },
} satisfies Meta<typeof Switcher>

export default meta
type Story = StoryObj<typeof meta>

function Controlled() {
  const [value, setValue] = useState("all")
  return <Switcher items={ITEMS} value={value} onValueChange={setValue} />
}

export const Large: Story = {
  render: () => <Controlled />,
}

export const Medium: Story = {
  args: { size: "md" },
}

export const WhiteBackground: Story = {
  args: { greyBackground: false },
}

export const ActiveBlack: Story = {
  args: { activeVariant: "black" },
}

export const Disabled: Story = {
  args: { disabled: true },
}
