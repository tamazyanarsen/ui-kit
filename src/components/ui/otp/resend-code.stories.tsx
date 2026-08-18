import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { ResendCode } from "./resend-code"

type ResendCodeProps = ComponentProps<typeof ResendCode>

type PlaygroundArgs = ResendCodeProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/OTP Resend Code",
  component: ResendCode,
  parameters: { layout: "padded" },
  argTypes: {
    seconds: { control: { type: "number", min: 0, max: 300 } },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: { seconds: 60, viewport: "auto" as Viewport },
  // Дизайн-чек №3 №19: контрол `viewport` из панели истории форсирует
  // десктопную/мобильную форму, не трогая размер вьюпорта. Обёртка общая
  // для всех историй файла — в матрицах она не мешает: там форму задаёт
  // сама матрица (`responsive`), а этот скоуп остаётся в «auto».
  decorators: [
    (Story, context) => (
      <ViewportScope viewport={(context.args as { viewport?: Viewport }).viewport}>
        <Story />
      </ViewportScope>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ResendCodeProps>
      responsive
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
