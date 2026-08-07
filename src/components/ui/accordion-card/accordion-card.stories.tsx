import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { AccordionCard } from "./accordion-card"

type AccordionCardProps = ComponentProps<typeof AccordionCard>

const meta = {
  title: "Content/Accordion/Accordion",
  component: AccordionCard,
  parameters: { layout: "padded" },
  // `subtitle` is `React.ReactNode` (to match `title`'s type) but every
  // usage is a plain string — without this, the broad ReactNode type makes
  // Storybook fall back to a generic "Set object" JSON-editor placeholder
  // once it's left unset, instead of a plain text control.
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    children: { control: "text" },
    defaultOpen: { control: "boolean" },
    blocked: { control: "boolean" },
  },
  args: {
    title: "Заголовок карточки",
    subtitle: "Подзаголовок с пояснением",
    children: "Раскрытое содержимое карточки.",
    defaultOpen: false,
    blocked: false,
  },
} satisfies Meta<AccordionCardProps>

export default meta
type Story = StoryObj<AccordionCardProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<AccordionCardProps>
      stretch
      cellClassName="min-w-[360px]"
      baseProps={{ title: "Title", children: "Раскрытое содержимое карточки." }}
      columns={[
        { label: "С подзаголовком", props: { subtitle: "Subtitle" } },
        { label: "Без подзаголовка", props: {} },
      ]}
      rows={[
        { label: "Свёрнута", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Раскрыта", props: { defaultOpen: true } },
        // `blocked` pins the card open and removes the toggle affordance.
        { label: "Blocked", props: { blocked: true, defaultOpen: true } },
      ]}
      render={(props) => <AccordionCard {...props} />}
    />
  ),
}
