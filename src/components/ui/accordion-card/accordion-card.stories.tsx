import type { Meta, StoryObj } from "@storybook/react-vite"

import { AccordionCard } from "./accordion-card"

const meta = {
  title: "Content/Accordion/Card",
  component: AccordionCard,
  parameters: { layout: "padded" },
  args: {
    title: "Заголовок карточки",
    subtitle: "Подзаголовок с пояснением",
    children: "Раскрытое содержимое карточки.",
  },
} satisfies Meta<typeof AccordionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  args: { defaultOpen: true },
}

export const NoSubtitle: Story = {
  args: { subtitle: undefined },
}

export const Blocked: Story = {
  args: { blocked: true, defaultOpen: true },
}
