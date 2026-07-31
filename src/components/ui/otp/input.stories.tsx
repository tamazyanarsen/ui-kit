import type { Meta, StoryObj } from "@storybook/react-vite"

import { OtpInput } from "./input"

const meta = {
  title: "Template/Otp/OtpInput",
  component: OtpInput,
  parameters: { layout: "padded" },
} satisfies Meta<typeof OtpInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FourDigits: Story = {
  args: { length: 4 },
}

export const WithError: Story = {
  args: { error: "Неверный код" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "1234" },
}
