import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  viewportArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Toggle, type ToggleProps } from "./toggle"

type PlaygroundArgs = Omit<ToggleProps, "error"> & {
  state?: PlaygroundState
  viewport?: Viewport
  // Дизайн-чек 3/3 №6: состояние ошибки, её текст и комментарий
  // переключаются отдельными тоглами, а не наличием текста в поле ввода.
  error?: boolean
  errorText?: string
  showErrorText?: boolean
  showComment?: boolean
}

const meta = {
  title: "Компоненты/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean", name: "Error" },
    showErrorText: { control: "boolean", name: "Show Error Text" },
    errorText: { control: "text", name: "Текст ошибки" },
    showComment: { control: "boolean", name: "Show Comment" },
    comment: { control: "text", name: "Текст комментария" },
    state: stateArgType,
    // Дизайн-чек №3 №7: «Некорректные пропсы (не соответствуют фигме).
    // Например, нет возможности настроить mobile». В Figma у компонента
    // есть свойство Size=Desktop/Mobile (666:9029), поэтому в панели
    // истории оно тоже должно быть — а не переключением вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    showComment: true,
    checked: false,
    disabled: false,
    error: false,
    errorText: "Text about error here",
    showErrorText: true,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled({
  state,
  viewport,
  checked,
  error,
  errorText,
  showErrorText,
  showComment,
  comment,
  ...props
}: PlaygroundArgs) {
  const [internal, setInternal] = useState(false)
  return (
    <ViewportScope viewport={viewport}>
      <PseudoBox state={state}>
        <Toggle
          {...props}
          // Дизайн-чек 3/3 №7: комментарий и ошибка выводятся вместе,
          // включение ошибки комментарий не гасит (макет 1242:99741).
          comment={showComment ? comment : undefined}
          error={error ? (showErrorText ? errorText || true : true) : undefined}
          checked={checked ?? internal}
          onCheckedChange={setInternal}
        />
      </PseudoBox>
    </ViewportScope>
  )
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

/* Дизайн-чек №18: третья история — «Interactive». Здесь проверяется
   зависимость, которой нет ни в Playground, ни в матрице: главный
   переключатель гасит и блокирует зависимые. */
const CHANNELS = [
  { key: "push", label: "Push-уведомления" },
  { key: "email", label: "Письма на почту" },
  { key: "sms", label: "SMS" },
]

function DependentToggles() {
  const [enabled, setEnabled] = useState(true)
  const [channels, setChannels] = useState<Record<string, boolean>>({
    push: true,
    email: false,
    sms: true,
  })

  return (
    <div className="flex w-100 flex-col gap-6">
      <Toggle
        label="Уведомления"
        comment={enabled ? "Включены" : "Выключены — каналы недоступны"}
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <div className="flex flex-col gap-4 pl-4">
        {CHANNELS.map((channel) => (
          <Toggle
            key={channel.key}
            label={channel.label}
            // Зависимые переключатели гаснут вместе с главным и блокируются.
            checked={enabled && channels[channel.key]}
            disabled={!enabled}
            onCheckedChange={(next) =>
              setChannels({ ...channels, [channel.key]: next })
            }
          />
        ))}
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: "Interactive",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => <DependentToggles />,
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    // Дизайн-чек №3 №8/№18: десктоп и мобайл стоят рядом в одной матрице,
    // а не прячутся за переключением вьюпорта и не выносятся в отдельную
    // историю — за это отвечает `responsive`.
    <StatesMatrix<ToggleProps>
      responsive
      baseProps={{ label: "Option Text", comment: "Comment" }}
      columns={[
        { label: "Off", props: { checked: false } },
        { label: "On", props: { checked: true } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Disabled", props: { disabled: true } },
        { label: "Error", props: { error: "Text about error here" } },
      ]}
      render={(props) => <Toggle {...props} onCheckedChange={() => {}} />}
    />
  ),
}
