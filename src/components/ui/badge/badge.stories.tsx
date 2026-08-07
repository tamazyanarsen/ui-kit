import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Badge, type BadgeProps } from "./badge"
import type { BadgeColor } from "./variants"

const COLORS: BadgeColor[] = [
  "red",
  "contra-red",
  "dark-grey",
  "light-grey",
  "black",
]

const meta = {
  title: "Status/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    type: { control: "inline-radio", options: ["counter", "point"] },
    color: { control: "select", options: COLORS },
    value: { control: { type: "number", min: 0, max: 999 } },
    disabled: { control: "boolean" },
  },
  args: { type: "counter", color: "red", value: 3, disabled: false },
} satisfies Meta<BadgeProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

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
