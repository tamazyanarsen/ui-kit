import type { Meta, StoryObj } from "@storybook/react-vite"

import { Chips } from "./chips"

const meta = {
  title: "Interaction/Chips",
  component: Chips,
  parameters: { layout: "centered" },
  // `subtitle` is `React.ReactNode` but every usage is a plain string —
  // without this, leaving it unset (every story but WithSubtitle) falls
  // back to a generic "Set object" JSON editor.
  argTypes: {
    subtitle: { control: "text" },
  },
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
