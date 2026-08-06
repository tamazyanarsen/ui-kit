import type { Meta, StoryObj } from "@storybook/react-vite"

import { ItemInformationField } from "./item-information-field"
import type { FieldStatus } from "./item-information-field"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"

const meta = {
  title: "Content/Item/InformationField",
  component: ItemInformationField,
  parameters: { layout: "padded" },
  argTypes: {
    // `subText`/`labelInfo`/`valueInfo` are `React.ReactNode` but every
    // usage is a plain string — without this, leaving one unset falls
    // back to a generic "Set object" JSON editor.
    subText: { control: "text" },
    labelInfo: { control: "text" },
    valueInfo: { control: "text" },
    // `subTextStatus` is `Exclude<FieldStatus, "information">` — react-docgen
    // can't resolve a computed utility type into an enum the way it does
    // the plain `FieldStatus` alias (`valueStatus` already gets a select
    // automatically), so it falls back to the same generic "Set object"
    // editor. Pin the real (narrower) option list explicitly instead.
    subTextStatus: {
      control: "select",
      options: ["default", "success", "error", "attention"] satisfies Exclude<FieldStatus, "information">[],
    },
  },
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

export const LabelLine: Story = {
  args: { type: "label-line" },
}

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
  // Zero-arg render hardcodes 4 separate rows — every inherited control
  // (label/value/subText/valueStatus/...) is dead here.
  parameters: { controls: { disable: true } },
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
