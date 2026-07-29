import type { Meta, StoryObj } from "@storybook/react-vite"

import { OtpConfirmCard } from "./confirm-card"

const meta = {
  title: "UI/Otp/OtpConfirmCard",
  component: OtpConfirmCard,
  parameters: { layout: "centered" },
  args: { phone: "+7 900 000-00-00" },
} satisfies Meta<typeof OtpConfirmCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: "Неверный код, попробуйте снова", defaultValue: "1234" },
}

export const Closable: Story = {
  args: { onClose: () => alert("close") },
}
