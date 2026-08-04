import type { Meta, StoryObj } from "@storybook/react-vite"

import { UpButton } from "./up-button"

const meta = {
  title: "Interaction/Button/UpButton",
  component: UpButton,
  parameters: { layout: "padded" },
  // threshold=-1 keeps it visible immediately in the story canvas — real
  // usage only shows it once the page has scrolled past the threshold.
  args: { threshold: -1 },
  argTypes: {
    // scrollContainer is a React.RefObject<HTMLElement> — no JSON value can
    // produce a real DOM ref, so Storybook's control can only ever build a
    // plain {} that silently falls back to `window` (same non-representable
    // class as Button's icon/iconPosition, already fixed there).
    scrollContainer: { control: false },
  },
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
