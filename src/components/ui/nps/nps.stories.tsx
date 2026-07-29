import type { Meta, StoryObj } from "@storybook/react-vite"

import { Nps } from "./nps"

const meta = {
  title: "UI/Nps",
  component: Nps,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Nps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const RatingPicked: Story = {
  args: { defaultValue: 4 },
}

export const NoChips: Story = {
  args: { defaultValue: 3, showChips: false },
}

export const NoDescriptionPrompt: Story = {
  args: { defaultValue: 3, showDescription: false },
}

export const Submitted: Story = {
  args: { submitted: true },
}
