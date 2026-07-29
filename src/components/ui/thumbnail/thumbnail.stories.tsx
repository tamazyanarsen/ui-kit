import type { Meta, StoryObj } from "@storybook/react-vite"

import { Thumbnail } from "./thumbnail"
import type { PaymentSystem } from "./variants"

const meta = {
  title: "UI/Thumbnail",
  component: Thumbnail,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Thumbnail>

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {
  args: { type: "card", paymentSystem: "mir" },
}

export const Sticker: Story = {
  args: { type: "sticker", paymentSystem: "visa" },
}

export const SbpCard: Story = {
  args: { type: "sbp-card", last4: "1234" },
}

export const IconStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Thumbnail type="check" />
      <Thumbnail type="question" />
      <Thumbnail type="clock" />
      <Thumbnail type="alert" />
      <Thumbnail type="alert-red" />
    </div>
  ),
}

export const Picture: Story = {
  args: { type: "picture" },
}

export const AllPaymentSystems: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["mir", "mastercard", "unionpay", "visa"] as PaymentSystem[]).map((system) => (
        <Thumbnail key={system} type="card" paymentSystem={system} />
      ))}
    </div>
  ),
}

export const WithBadge: Story = {
  args: { type: "card", count: 3 },
}

export const SmallSize: Story = {
  args: { type: "card", size: "m" },
}

export const Disabled: Story = {
  args: { type: "card", disabled: true },
}
