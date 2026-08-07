import type { Meta, StoryObj } from "@storybook/react-vite"

import { CountButton } from "./count-button"

const meta = {
  title: "Interaction/Button/CountButton",
  component: CountButton,
  parameters: { layout: "centered" },
  args: { children: "Уведомления", count: 3, variant: "secondary-grey" },
} satisfies Meta<typeof CountButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CountOverflow: Story = {
  args: { count: 250 },
}

export const PrimaryVariant: Story = {
  args: { variant: "primary" },
}

// `ELK / count button`'s own master carries the red badge, but Table Top's
// "Ещё фильтры" instance overrides it to the dark one — hence `countColor`.
export const DarkCounter: Story = {
  name: "Dark counter (Table Top)",
  args: { children: "Ещё фильтры", count: 2, countColor: "black" },
}
