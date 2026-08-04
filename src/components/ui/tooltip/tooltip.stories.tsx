import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tooltip } from "./tooltip"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Content/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  args: { content: "Подсказка с пояснением", children: <Button variant="secondary-grey">Наведите курсор</Button> },
  argTypes: {
    // `children` is a React.ReactElement (the trigger) — no JSON value can
    // represent it; Storybook falls back to a raw editable tree of the
    // element's internals, which looks like a working control but isn't
    // (same class as Button's icon/iconPosition, already fixed there).
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

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
