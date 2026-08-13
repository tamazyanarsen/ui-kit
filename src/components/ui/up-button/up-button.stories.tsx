import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { UpButton, type UpButtonProps } from "./up-button"

const meta = {
  title: "Компоненты/Up Button",
  component: UpButton,
  parameters: { layout: "padded" },
  argTypes: {
    threshold: { control: "number" },
    hidden: { control: "boolean" },
    // scrollContainer is a React.RefObject<HTMLElement> — no JSON value can
    // produce a real DOM ref, so Storybook's control can only ever build a
    // plain {} that silently falls back to `window` (same non-representable
    // class as Button's icon/iconPosition, already fixed there).
    scrollContainer: { control: false },
  },
  // threshold=-1 keeps it visible immediately in the story canvas — real
  // usage only shows it once the page has scrolled past the threshold.
  args: { threshold: -1, hidden: false },
} satisfies Meta<UpButtonProps>

export default meta
type Story = StoryObj<UpButtonProps>

export const Playground: Story = {
  render: (args) => (
    <div className="relative h-40 w-full">
      <UpButton {...args} className="absolute right-6 bottom-6" />
    </div>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<UpButtonProps>
      baseProps={{ threshold: -1 }}
      columns={[{ label: "Up Button" }]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Focus", props: {}, pseudo: "focus-visible" },
        // `hidden` is how a consumer suppresses it (e.g. while a modal is
        // open) — it fades out rather than unmounting.
        { label: "Hidden", props: { hidden: true } },
      ]}
      render={(props) => <UpButton {...props} className="relative" />}
    />
  ),
}
