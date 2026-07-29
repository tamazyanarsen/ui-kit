import type { Meta, StoryObj } from "@storybook/react-vite"

import { ProgressBar } from "./progress-bar"

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  args: { title: "Шаг 2 из 4" },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Step: Story = {
  args: { variant: "step", totalSteps: 4, currentStep: 2 },
}

export const TimelineGreen: Story = {
  args: { variant: "timeline", value: 30, title: "Заполнено 30%" },
}

export const TimelineAmber: Story = {
  args: { variant: "timeline", value: 70, title: "Заполнено 70%" },
}

export const TimelineRed: Story = {
  args: { variant: "timeline", value: 100, title: "Заполнено 100%" },
}

export const WithSubtitleAndDescription: Story = {
  args: {
    variant: "timeline",
    value: 50,
    subtitle: "Осталось 5 дней",
    description: "50 000 / 100 000 ₽",
    status: "attention",
  },
}
