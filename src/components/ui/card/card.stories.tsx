import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"

import { Card } from "./card"

const meta = {
  title: "Content/Card",
  component: Card,
  parameters: { layout: "padded" },
  args: {
    title: "Основная карта",
    titleSuffix: "1135",
    subtitle: "**** 4482",
    value: "12 500 ₽",
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTag: Story = {
  args: { tag: "Новая" },
}

export const WithTagColor: Story = {
  args: { tag: "Требует внимания", tagColor: "red" },
}

export const PaymentSystems: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["mastercard", "visa", "mir", "unionpay"] as PaymentSystem[]).map((system) => (
        <Card key={system} {...args} paymentSystem={system} />
      ))}
    </div>
  ),
}

export const NoThumbnail: Story = {
  args: { showThumbnail: false },
}

export const Clickable: Story = {
  args: { onClick: () => alert("Card clicked") },
}

export const WithMenu: Story = {
  args: {
    menuItems: [
      { text: "Открыть карточку" },
      { text: "Удалить карту", disabled: false },
    ],
  },
}
