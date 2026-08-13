import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { CountButton, type CountButtonProps } from "./count-button"

type PlaygroundArgs = CountButtonProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Count Button",
  component: CountButton,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    count: { control: { type: "number", min: 0, max: 999 } },
    countColor: {
      control: "select",
      options: ["red", "contra-red", "dark-grey", "light-grey", "black"],
    },
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary-black",
        "secondary-grey",
        "secondary-white",
        "secondary-outline",
      ],
    },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    children: "Уведомления",
    count: 3,
    variant: "secondary-grey",
    size: "default",
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state}>
      <CountButton {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<CountButtonProps>
      baseProps={{ children: "Уведомления", count: 3 }}
      columns={[
        { label: "secondary-grey", props: { variant: "secondary-grey" } },
        { label: "primary", props: { variant: "primary" } },
        { label: "secondary-outline", props: { variant: "secondary-outline" } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Счётчик 99+", props: { count: 250 } },
        // `ELK / count button`'s own master carries the red badge, but Table
        // Top's "Ещё фильтры" instance overrides it to the dark one.
        { label: "Тёмный счётчик\n(Table Top)", props: { countColor: "black" } },
        { label: "S", props: { size: "sm" } },
        { label: "L", props: { size: "lg" } },
        { label: "Disabled", props: { disabled: true } },
      ]}
      render={(props) => <CountButton {...props} />}
    />
  ),
}
