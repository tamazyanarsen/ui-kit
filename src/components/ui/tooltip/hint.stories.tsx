import type { Meta, StoryObj } from "@storybook/react-vite"

import { Hint } from "./hint"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Content/Hint",
  component: Hint,
  parameters: { layout: "centered" },
  args: {
    content: "Развёрнутый текст подсказки, который поясняет назначение элемента.",
    children: <Button variant="secondary-grey">Открыть подсказку</Button>,
  },
} satisfies Meta<typeof Hint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Hint {...args}>
      <Button variant="secondary-grey">Открыть подсказку</Button>
    </Hint>
  ),
}

export const WithTitle: Story = {
  render: (args) => (
    <Hint {...args} title="Заголовок подсказки">
      <Button variant="secondary-grey">Открыть подсказку</Button>
    </Hint>
  ),
}

export const NoCloseButton: Story = {
  render: (args) => (
    <Hint {...args} showCross={false}>
      <Button variant="secondary-grey">Открыть подсказку</Button>
    </Hint>
  ),
}
