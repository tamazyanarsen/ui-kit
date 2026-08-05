import type { Meta, StoryObj } from "@storybook/react-vite"

import { SelectionButton } from "./selection-button"

const meta = {
  title: "Content/ChoosingCards",
  component: SelectionButton,
  parameters: { layout: "centered" },
  args: {
    items: [
      { text: "Редактировать" },
      { text: "Дублировать", description: "Создать копию" },
      { text: "Удалить" },
    ],
  },
  // `trigger` takes a JSX element instance — map a friendly "Default
  // (⋯)"/"Custom Button" choice to the real element/`undefined` instead
  // of disabling the control (same technique as Button's `icon`); "Custom
  // Button" reuses the same element the `CustomTrigger` story below sets
  // as a fixed arg, so both stay in sync.
  argTypes: {
    trigger: {
      control: { type: "select", labels: { default: "Default (⋯)", custom: "Custom Button" } },
      options: ["default", "custom"],
      mapping: { default: undefined, custom: <button type="button">Открыть меню</button> },
    },
  },
} satisfies Meta<typeof SelectionButton>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: { size: "lg" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const TopLeftDirection: Story = {
  args: { direction: "top-left" },
}

export const CustomTrigger: Story = {
  args: {
    trigger: <button type="button">Открыть меню</button>,
  },
}
