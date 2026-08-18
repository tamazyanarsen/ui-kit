import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { OtpInput } from "./input"

type OtpInputProps = ComponentProps<typeof OtpInput>

type PlaygroundArgs = OtpInputProps & { viewport?: Viewport }

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
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: { length: 6, disabled: false, viewport: "auto" as Viewport },
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
    <StatesMatrix<OtpInputProps>
      responsive
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
