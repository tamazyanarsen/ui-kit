import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  type PlaygroundState,
} from "@/stories/matrix"

import { Badge, type BadgeProps } from "./badge"
import type { BadgeColor } from "./variants"

const COLORS: BadgeColor[] = [
  "red",
  "contra-red",
  "dark-grey",
  "light-grey",
  "black",
]

/* Дизайн-чек Storybook (Аня Багрова) №8: панель контролов приведена к
   «Свойствам компонента» `ELK / badge` — State (Default / Disabled),
   Type (Counter / Point), Color (Red / Black / Contra-Red / Dark-Grey /
   Light-Grey). Порядок значений Color тоже из макета. */
const COLOR_LABELS: Record<BadgeColor, string> = {
  red: "Red",
  black: "Black",
  "contra-red": "Contra-Red",
  "dark-grey": "Dark-Grey",
  "light-grey": "Light-Grey",
}

// State в макете — список из двух значений, в коде — булев `disabled`.
type PlaygroundArgs = BadgeProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    state: stateArgTypeOf(["default", "disabled"]),
    type: optionsArgType(
      "Type",
      { counter: "Counter", point: "Point" },
      "inline-radio"
    ),
    color: optionsArgType("Color", COLOR_LABELS),
    value: {
      control: { type: "number", min: 0, max: 999 },
      table: { category: "Контент" },
    },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    state: "default" as PlaygroundState,
    type: "counter",
    color: "red",
    value: 3,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <Badge {...args} disabled={state === "disabled"} />
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<BadgeProps>
      columns={COLORS.map((color) => ({ label: color, props: { color } }))}
      rows={[
        { label: "Counter", props: { type: "counter", value: 3 } },
        // Values above 99 clamp to "99+" per the spec.
        { label: "Counter 99+", props: { type: "counter", value: 143 } },
        { label: "Point", props: { type: "point" } },
        {
          label: "Disabled",
          props: { type: "counter", value: 3, disabled: true },
        },
      ]}
      render={(props) => <Badge {...props} />}
    />
  ),
}
