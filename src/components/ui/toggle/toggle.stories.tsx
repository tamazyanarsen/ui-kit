import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  sizeArgTypeOf,
  stateArgTypeOf,
  toggleArgType,
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
  showText?: boolean
  showErrorText?: boolean
  showComment?: boolean
}

/* Панель повторяет «Свойства компонента» `ELK / toggle` (компонент-сет
   2606:28161, таблица 1242:99673): Size / State / Checked / Error /
   Show Text / Show Text Error / Show Comment — ровно те же имена и значения,
   что видит дизайнер в правой панели Figma при настройке инстанса. */
const meta = {
  title: "Компоненты/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  argTypes: {
    // В Figma размер и форма — одно свойство Size с двумя значениями;
    // в коде это `viewport` + <ViewportScope>, «auto» в панели Figma нет.
    viewport: sizeArgTypeOf({
      desktop: "L / Desktop",
      mobile: "M / Mobile",
    }),
    // Disabled в Figma — значение оси State, отдельного контрола у него нет.
    state: stateArgTypeOf(["default", "hover", "disabled"]),
    disabled: { table: { disable: true } },
    checked: { control: "boolean", name: "Checked" },
    error: { control: "boolean", name: "Error" },
    showText: toggleArgType("Show Text"),
    showErrorText: toggleArgType("Show Text Error"),
    showComment: toggleArgType("Show Comment"),
    label: { control: "text", table: { category: "Контент" } },
    errorText: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    checked: false,
    error: false,
    showText: true,
    showErrorText: true,
    showComment: true,
    label: "Согласен с условиями договора",
    errorText: "Text about error here",
    comment: "Договор комплексного банковского обслуживания",
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
  showText,
  showErrorText,
  showComment,
  comment,
  label,
  ...props
}: PlaygroundArgs) {
  const [internal, setInternal] = useState(false)
  return (
    <ViewportScope viewport={viewport}>
      <PseudoBox state={state}>
        <Toggle
          {...props}
          label={showText ? label : undefined}
          // Дизайн-чек 3/3 №7: комментарий и ошибка выводятся вместе,
          // включение ошибки комментарий не гасит (макет 1242:99741).
          comment={showComment ? comment : undefined}
          error={error ? (showErrorText ? errorText || true : true) : undefined}
          disabled={state === "disabled"}
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
