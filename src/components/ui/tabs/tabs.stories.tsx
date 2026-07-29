import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tabs } from "./tabs"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые", disabled: true },
  { value: "errors", label: "Ошибки", status: true },
  { value: "inbox", label: "Входящие", badge: 3 },
]

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  args: { items: ITEMS },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Controlled() {
  const [value, setValue] = useState("all")
  return <Tabs items={ITEMS} value={value} onValueChange={setValue} />
}

export const Large: Story = {
  render: () => <Controlled />,
}

export const Medium: Story = {
  args: { size: "md" },
}
