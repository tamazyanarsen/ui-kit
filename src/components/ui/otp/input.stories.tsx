import type { Meta, StoryObj } from "@storybook/react-vite"

import { OtpInput } from "./input"

const meta = {
  title: "Template/Otp/OtpInput",
  component: OtpInput,
  parameters: { layout: "padded" },
  // `error` is typed React.ReactNode but every story here only ever puts a
  // plain string in it — pin a text control so a story that leaves it unset
  // doesn't fall back to Storybook's "Set object" JSON-editor placeholder.
  // `placeholder` is a genuine native `string` prop (inherited via
  // `React.ComponentProps<"input">`), but docgen's extraction across that
  // `extends`/`Omit` chain loses the primitive type and falls back to the
  // same "Set object" placeholder — pin it too.
  argTypes: {
    error: { control: "text" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof OtpInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FourDigits: Story = {
  args: { length: 4 },
}

export const WithError: Story = {
  args: { error: "Неверный код" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "1234" },
}
