import type { Meta, StoryObj } from "@storybook/react-vite"

import { UpButton } from "./up-button"

const meta = {
  title: "UI/UpButton",
  component: UpButton,
  parameters: { layout: "padded" },
  // threshold=-1 keeps it visible immediately in the story canvas — real
  // usage only shows it once the page has scrolled past the threshold.
  args: { threshold: -1 },
} satisfies Meta<typeof UpButton>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {
  render: (args) => (
    <div className="relative h-40 w-full">
      <UpButton {...args} className="absolute right-6 bottom-6" />
    </div>
  ),
}

export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div className="relative h-40 w-full">
      <UpButton {...args} className="absolute right-6 bottom-6" />
      <p className="text-sm text-muted-foreground">
        Скрыта через проп `hidden` (например, пока открыт модальный диалог).
      </p>
    </div>
  ),
}
