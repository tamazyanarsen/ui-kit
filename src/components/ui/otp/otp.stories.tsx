import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix, StorySection, StoryShowcase, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { OtpConfirmCard } from "./confirm-card"
import { OtpInput } from "./input"
import { ResendCode } from "./resend-code"

type OtpConfirmCardProps = ComponentProps<typeof OtpConfirmCard>
type OtpInputProps = ComponentProps<typeof OtpInput>
type ResendCodeProps = ComponentProps<typeof ResendCode>

type PlaygroundArgs = OtpConfirmCardProps & { viewport?: Viewport }

// Дизайн-чек №4 №1: в Figma это один компонент `ELK / otp-code`, а
// `Input Code` и «отправить повторно» — его элементы (секция Elements на
// канвасе 1357:132865). Поэтому в Storybook тоже один раздел «OTP code»:
// Playground/Варианты использования показывают сам компонент, а элементы
// вынесены отдельными матрицами внутри этого же раздела.
const meta = {
  title: "Компоненты/OTP code",
  component: OtpConfirmCard,
  parameters: { layout: "centered" },
  // The card is a dialog (Figma composes it from ELK / Modal), so the
  // Playground opens it outright instead of relying on a trigger click.
  args: {
    phone: "+7 900 000-00-00",
    defaultOpen: true,
    length: 6,
    resendSeconds: 60,
    title: "Подтвердите контактные данные",
    viewport: "auto" as Viewport,
  },
  // title/subtitle/error are typed React.ReactNode but every usage is a
  // plain string — pin text controls so leaving one unset doesn't fall back
  // to Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    error: { control: "text" },
    phone: { control: "text" },
    length: { control: { type: "number", min: 4, max: 8 } },
    resendSeconds: { control: "number" },
    defaultOpen: { control: "boolean" },
    defaultValue: { control: "text" },
    // `trigger` takes a JSX element instance — no JSON value can build one,
    // so map a friendly choice to a real element (same technique as
    // Button's `icon`). "None" leaves the card opened by `defaultOpen`.
    trigger: {
      control: { type: "select", labels: { none: "None (открыта сразу)", button: "Кнопка" } },
      options: ["none", "button"],
      mapping: {
        none: undefined,
        button: <button type="button">Подтвердить контакты</button>,
      },
    },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
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

/* The card is a real modal dialog (portal + backdrop + focus trap), so only
   one can be open at a time — the variants are separate triggers rather than
   matrix cells. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="С триггером"
        description="Обычный сценарий: карточка открывается по действию пользователя."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          trigger={<button type="button">Подтвердить контакты</button>}
        />
      </StorySection>
      <StorySection
        title="С ошибкой"
        description="Код введён неверно — под полем появляется текст ошибки."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          defaultValue="1234"
          error="Неверный код, попробуйте снова"
          trigger={<button type="button">Открыть с ошибкой</button>}
        />
      </StorySection>
      <StorySection
        title="Код из 4 знаков"
        description="Длина кода задаётся пропом `length`."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          length={4}
          trigger={<button type="button">Открыть</button>}
        />
      </StorySection>
    </StoryShowcase>
  ),
}

/* Элемент Input Code — Figma рисует его отдельной таблицей состояний
   (Input Code Desktop/Mobile, 11490:14320 / 11490:23533). */
export const InputCodeMatrix: Story = {
  name: "Элемент «Input Code»",
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

/* Элемент «отправить повторно» — счётчик и активная ссылка после нуля. */
export const ResendCodeMatrix: Story = {
  name: "Элемент «Resend Code»",
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
