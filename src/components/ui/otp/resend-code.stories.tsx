import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { ResendCode } from "./resend-code"

type ResendCodeProps = ComponentProps<typeof ResendCode>

const meta = {
  title: "Компоненты/OTP Resend Code",
  component: ResendCode,
  parameters: { layout: "padded" },
  argTypes: { seconds: { control: { type: "number", min: 0, max: 300 } } },
  args: { seconds: 60 },
} satisfies Meta<ResendCodeProps>

export default meta
type Story = StoryObj<ResendCodeProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ResendCodeProps>
      columns={[{ label: "Resend Code" }]}
      rows={[
        { label: "Отсчёт (60 с)", props: { seconds: 60 } },
        { label: "Отсчёт (5 с)", props: { seconds: 5 } },
        // At 0 the counter turns into an active "отправить ещё раз" link.
        { label: "Готово (0 с)", props: { seconds: 0 } },
        { label: "Готово · Hover", props: { seconds: 0 }, pseudo: "hover" },
      ]}
      render={(props) => <ResendCode {...props} />}
    />
  ),
}
