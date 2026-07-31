import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tag } from "./tag"
import type { TagColor } from "./variants"

const STATUS_COLORS: TagColor[] = ["green", "orange", "red", "blue", "grey"]
const SIGN_COLORS: TagColor[] = ["black", "white", "grey-info"]

const meta = {
  title: "Status/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  args: { children: "Example Text" },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { size: "s" },
}

export const WithIcon: Story = {
  args: { showIcon: true },
}

export const StatusColors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {STATUS_COLORS.map((color) => (
        <Tag key={color} color={color}>
          {color}
        </Tag>
      ))}
    </div>
  ),
}

export const SecondaryVariant: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {STATUS_COLORS.map((color) => (
        <Tag key={color} color={color} variant="secondary">
          {color}
        </Tag>
      ))}
    </div>
  ),
}

export const SignColors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {SIGN_COLORS.map((color) => (
        <Tag key={color} color={color}>
          {color}
        </Tag>
      ))}
    </div>
  ),
}
