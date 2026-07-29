import type { Meta, StoryObj } from "@storybook/react-vite"

import { SelectionButton } from "./selection-button"

const meta = {
  title: "UI/SelectionButton",
  component: SelectionButton,
  parameters: { layout: "centered" },
  args: {
    items: [
      { text: "Редактировать" },
      { text: "Дублировать", description: "Создать копию" },
      { text: "Удалить" },
    ],
  },
} satisfies Meta<typeof SelectionButton>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: { size: "lg" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const TopLeftDirection: Story = {
  args: { direction: "top-left" },
}

export const CustomTrigger: Story = {
  args: {
    trigger: <button type="button">Открыть меню</button>,
  },
}
