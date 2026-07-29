import type { Meta, StoryObj } from "@storybook/react-vite"

import { CountButton } from "./count-button"

const meta = {
  title: "UI/CountButton",
  component: CountButton,
  parameters: { layout: "centered" },
  args: { children: "Уведомления", count: 3, variant: "secondary-grey" },
} satisfies Meta<typeof CountButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CountOverflow: Story = {
  args: { count: 250 },
}

export const PrimaryVariant: Story = {
  args: { variant: "primary" },
}
