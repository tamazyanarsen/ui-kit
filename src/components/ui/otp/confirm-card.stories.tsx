import type { Meta, StoryObj } from "@storybook/react-vite"

import { OtpConfirmCard } from "./confirm-card"

const meta = {
  title: "Template/Otp/OtpConfirmCard",
  component: OtpConfirmCard,
  parameters: { layout: "centered" },
  // The card is a dialog (Figma composes it from ELK / Modal), so stories
  // open it outright instead of relying on a trigger click.
  args: { phone: "+7 900 000-00-00", defaultOpen: true },
  // title/subtitle/error are typed React.ReactNode but every story here only
  // ever puts a plain string in them — pin text controls so a story that
  // leaves one unset doesn't fall back to Storybook's "Set object"
  // JSON-editor placeholder.
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta<typeof OtpConfirmCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: "Неверный код, попробуйте снова", defaultValue: "1234" },
}

export const WithTrigger: Story = {
  args: {
    defaultOpen: false,
    trigger: <button type="button">Подтвердить контакты</button>,
  },
}
