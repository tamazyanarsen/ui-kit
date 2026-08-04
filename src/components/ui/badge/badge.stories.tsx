import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "./badge"
import type { BadgeColor } from "./variants"

const meta = {
  title: "Status/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    color: {
      control: "select",
      options: ["red", "contra-red", "dark-grey", "light-grey", "black"] satisfies BadgeColor[],
    },
  },
  args: { type: "counter", value: 3, color: "red" },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Counter: Story = {}

export const CounterOverflow: Story = {
  args: { value: 143 },
}

export const Point: Story = {
  args: { type: "point" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["red", "contra-red", "dark-grey", "light-grey", "black"] as BadgeColor[]).map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <Badge type="counter" value={3} color={color} />
          <span className="text-p3 text-muted-foreground">{color}</span>
        </div>
      ))}
    </div>
  ),
}
