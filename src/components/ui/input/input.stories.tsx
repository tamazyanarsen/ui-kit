import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search } from "@/icons"

import {
  PseudoBox,
  iconArgType,
  StatesMatrix,
  stateArgType,
  viewportArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Input, type InputProps } from "./input"
import type { MaskName } from "./mask"

type PlaygroundArgs = InputProps & {
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Input",
  component: Input,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "sm"] },
    // `iconLeft`/`trailingIcon` — готовые JSX-узлы, значением из контрола
    // их не набрать. В Figma это instance swap, поэтому контрол даёт весь
    // набор кита, а не пару заготовленных вариантов (см. iconArgType).
    iconLeft: iconArgType("Иконка слева от значения"),
    trailingIcon: iconArgType("Иконка справа, перед крестиком очистки"),
    // `label`/`comment`/`error` are `React.ReactNode` but every usage is a
    // plain string — without this, leaving one unset falls back to a
    // generic "Set object" JSON editor.
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    lockedHint: { control: "text" },
    placeholder: { control: "text" },
    locked: { control: "boolean" },
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["text", "password", "number"] },
    // `mask` is a plain string union (`MaskName`, imported from ./mask) —
    // react-docgen can't resolve an imported type alias into an enum, so
    // it falls back to the same generic "Set object" editor. Pin the real
    // option list explicitly instead, same fix as Badge's `color`.
    mask: {
      control: "select",
      options: [
        "phone",
        "date",
        "passport",
        "foreign-passport",
        "card",
        "account",
        "inn",
        "kpp",
        "kbk",
        "amount",
        "time",
      ] satisfies MaskName[],
    },
    state: stateArgType,
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в
    // панели истории, а не изменением размера вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    label: "Label",
    placeholder: "Placeholder",
    size: "lg",
    locked: false,
    clearable: false,
    loading: false,
    disabled: false,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-80">
      <Input {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<InputProps>
      stretch
      cellClassName="min-w-72"
      responsive
      baseProps={{ label: "Label", placeholder: "Placeholder" }}
      columns={[
        { label: "L (default)", props: { size: "lg" } },
        { label: "S", props: { size: "sm" } },
        {
          label: "L + иконки",
          props: {
            size: "lg",
            iconLeft: <Search />,
            clearable: true,
            defaultValue: "Value",
          },
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Filled", props: { defaultValue: "Value" } },
        {
          label: "Comment",
          props: { defaultValue: "Value", comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: "Value", error: "Text about error here" },
        },
        { label: "Loading", props: { loading: true } },
        {
          label: "Locked",
          props: { locked: true, defaultValue: "Value", lockedHint: "Поле недоступно" },
        },
        { label: "Disabled", props: { disabled: true, defaultValue: "Value" } },
      ]}
      render={(props) => <Input {...props} />}
    />
  ),
}

/* Masks are behaviour rather than a state, so they get their own canvas
   instead of a matrix row — each of these is typeable. */
export const Masks: Story = {
  name: "Маски ввода",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-4">
      {(
        [
          ["phone", "Телефон"],
          ["date", "Дата"],
          ["time", "Время (ЧЧ:ММ)"],
          ["passport", "Паспорт РФ"],
          ["foreign-passport", "Загранпаспорт"],
          ["card", "Номер карты"],
          ["account", "Счёт"],
          ["inn", "ИНН"],
          ["kpp", "КПП"],
          ["kbk", "КБК"],
          ["amount", "Сумма"],
        ] satisfies [MaskName, string][]
      ).map(([mask, label]) => (
        <Input key={mask} mask={mask} label={label} />
      ))}
    </div>
  ),
}
