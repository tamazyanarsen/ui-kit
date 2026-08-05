import type { Meta, StoryObj } from "@storybook/react-vite"

import { AccordionCard } from "./accordion-card"

const meta = {
  title: "Content/Accordion/Card",
  component: AccordionCard,
  parameters: { layout: "padded" },
  // `subtitle` is `React.ReactNode` (to match `title`'s type) but every
  // usage across this file's own stories is a plain string — without this,
  // the broad ReactNode type makes Storybook fall back to a generic
  // "Set object" JSON-editor placeholder once a story (NoSubtitle) leaves
  // it unset, instead of a plain text control.
  argTypes: {
    subtitle: { control: "text" },
  },
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
