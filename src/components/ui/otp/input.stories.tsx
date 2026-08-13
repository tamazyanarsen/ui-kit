import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { OtpInput } from "./input"

type OtpInputProps = ComponentProps<typeof OtpInput>

const meta = {
  title: "Компоненты/OTP Input",
  component: OtpInput,
  parameters: { layout: "padded" },
  // `error` is typed React.ReactNode but every usage is a plain string — pin
  // a text control so leaving it unset doesn't fall back to Storybook's
  // "Set object" JSON-editor placeholder. `placeholder` is a genuine native
  // `string` prop (inherited via `React.ComponentProps<"input">`), but
  // docgen's extraction across that `extends`/`Omit` chain loses the
  // primitive type and falls back to the same placeholder — pin it too.
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { length: 6, disabled: false },
} satisfies Meta<OtpInputProps>

export default meta
type Story = StoryObj<OtpInputProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<OtpInputProps>
      stretch
      cellClassName="min-w-[280px]"
      columns={[
        { label: "6 знаков", props: { length: 6 } },
        { label: "4 знака", props: { length: 4 } },
      ]}
      rows={[
        { label: "Пустой", props: {} },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Заполнен", props: { defaultValue: "123456" } },
        {
          label: "Error",
          props: { defaultValue: "1234", error: "Неверный код" },
        },
        { label: "Disabled", props: { defaultValue: "1234", disabled: true } },
      ]}
      render={(props) => <OtpInput {...props} />}
    />
  ),
}
