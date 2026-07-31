import type { Meta, StoryObj } from "@storybook/react-vite"

import { ItemInformationField } from "./item-information-field"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"

const meta = {
  title: "Content/Item/InformationField",
  component: ItemInformationField,
  parameters: { layout: "padded" },
  args: { label: "ИНН", value: "7710140123" },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ItemInformationField>

export default meta
type Story = StoryObj<typeof meta>

export const LabelLeft: Story = {}

export const LabelTop: Story = {
  args: { type: "label-top" },
}

export const LargeValue: Story = {
  args: { type: "large-value", label: "Баланс", value: "1 250 000 ₽" },
}

export const WithSubText: Story = {
  args: { subText: "Обновлено сегодня в 10:00" },
}

export const StatusColors: Story = {
  render: () => (
    <div className="flex flex-col">
      <ItemInformationField label="Статус" value="Успешно" valueStatus="success" />
      <ItemInformationField label="Статус" value="Ошибка" valueStatus="error" />
      <ItemInformationField label="Статус" value="Внимание" valueStatus="attention" />
      <ItemInformationField label="Статус" value="Информация" valueStatus="information" />
    </div>
  ),
}

export const Copyable: Story = {
  args: { copyable: true },
}

export const WithInfoIcons: Story = {
  args: {
    labelInfo: "Идентификационный номер налогоплательщика",
    valueInfo: "Проверено сегодня",
  },
}
