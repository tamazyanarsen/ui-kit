import { useState } from "react"
import type { ComponentProps } from "react"
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
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  args: { items: ITEMS },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: ComponentProps<typeof Tabs>) {
  const [value, setValue] = useState(args.value ?? args.items[0]?.value)
  return <Tabs {...args} value={value} onValueChange={setValue} />
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
}

// v1.2.0 of the master dropped the Large/Medium level property for a
// responsive Desktop/Mobile pair — the bar is 44px with 32px gaps and 16/24
// labels here, 40/24/14/20 on the mobile story below.
export const Mobile: Story = {
  name: "Mobile (< 768px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: (args) => <Controlled {...args} />,
}
