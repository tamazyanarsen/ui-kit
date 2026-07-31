import type { Meta, StoryObj } from "@storybook/react-vite"

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
