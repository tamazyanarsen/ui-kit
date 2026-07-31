import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search } from "lucide-react"

import { Input } from "./input"

const meta = {
  title: "Interaction/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: { label: "Имя" },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: { size: "lg" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const WithComment: Story = {
  args: { comment: "Как указано в паспорте" },
}

export const WithError: Story = {
  args: { error: "Обязательное поле" },
}

export const WithLeadingIcon: Story = {
  args: { label: undefined, placeholder: "Поиск", iconLeft: <Search /> },
}

export const Password: Story = {
  args: { label: "Пароль", type: "password" },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Locked: Story = {
  args: { locked: true, defaultValue: "Только чтение" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Недоступно" },
}

export const MaskedAmount: Story = {
  args: { label: "Сумма", mask: "amount" },
}

export const MaskedDate: Story = {
  args: { label: "Дата", mask: "date" },
}
