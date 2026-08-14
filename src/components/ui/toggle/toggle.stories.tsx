import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Toggle, type ToggleProps } from "./toggle"

type PlaygroundArgs = ToggleProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled({ state, checked, ...props }: PlaygroundArgs) {
  const [internal, setInternal] = useState(false)
  return (
    <PseudoBox state={state}>
      <Toggle
        {...props}
        checked={checked ?? internal}
        onCheckedChange={setInternal}
      />
    </PseudoBox>
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
    <StatesMatrix<ToggleProps>
      rowHeader={RESPONSIVE_NOTE}
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
