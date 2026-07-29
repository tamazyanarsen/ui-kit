import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tooltip } from "./tooltip"
import { Button } from "@/components/ui/button"

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  args: { content: "Подсказка с пояснением", children: <Button variant="secondary-grey">Наведите курсор</Button> },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary-grey">Наведите курсор</Button>
    </Tooltip>
  ),
}

export const Directions: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-16">
      {(["top-center", "down-center", "left", "right"] as const).map((direction) => (
        <Tooltip key={direction} content={direction} direction={direction}>
          <Button variant="secondary-grey">{direction}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}
