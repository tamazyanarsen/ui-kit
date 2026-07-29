import type { Meta, StoryObj } from "@storybook/react-vite"

import { Chips } from "./chips"

const meta = {
  title: "UI/Chips",
  component: Chips,
  parameters: { layout: "centered" },
  args: { children: "Значение" },
} satisfies Meta<typeof Chips>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSubtitle: Story = {
  args: { subtitle: "Подпись" },
}

export const WithCount: Story = {
  args: { count: 5 },
}

export const Closable: Story = {
  args: { closable: true, onRemove: () => alert("removed") },
}

export const Disabled: Story = {
  args: { disabled: true, closable: true },
}
