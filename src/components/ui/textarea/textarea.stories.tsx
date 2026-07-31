import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "./textarea"

const meta = {
  title: "Interaction/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  args: { label: "Комментарий" },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithComment: Story = {
  args: { comment: "Необязательное поле" },
}

export const WithError: Story = {
  args: { error: "Обязательное поле" },
}

export const Locked: Story = {
  args: { locked: true, defaultValue: "Только чтение" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Недоступно" },
}

export const MoreRows: Story = {
  args: { rows: 6 },
}
