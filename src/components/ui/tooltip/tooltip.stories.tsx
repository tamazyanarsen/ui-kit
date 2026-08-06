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
    // element's internals, which looks like a working control but isn't.
    // Map a friendly choice between two real trigger elements instead of
    // disabling the control (same technique as Button's `icon`).
    children: {
      control: { type: "select", labels: { grey: "Button (Grey)", primary: "Button (Primary)" } },
      options: ["grey", "primary"],
      mapping: {
        grey: <Button variant="secondary-grey">Наведите курсор</Button>,
        primary: <Button variant="primary">Наведите курсор</Button>,
      },
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Directions: Story = {
  // Fixed 4-instance showcase — `direction` is hardcoded per-tooltip below,
  // not read from args, so every meta-level control (direction, content,
  // children...) would sit in the panel doing nothing if left enabled.
  parameters: { controls: { disable: true } },
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
