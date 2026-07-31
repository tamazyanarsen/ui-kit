import type { Meta, StoryObj } from "@storybook/react-vite"

import { ResendCode } from "./resend-code"

const meta = {
  title: "Template/Otp/ResendCode",
  component: ResendCode,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ResendCode>

export default meta
type Story = StoryObj<typeof meta>

export const Counting: Story = {
  args: { seconds: 60 },
}

export const ReadyToResend: Story = {
  name: "Ready (0s left)",
  args: { seconds: 0 },
}
