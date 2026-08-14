import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { AccordionCard } from "./accordion-card"

type AccordionCardProps = ComponentProps<typeof AccordionCard>

/* Ось `State` есть в макете (`ELK / accordion`: State = Default | Hover), а hover пропом не
   выставить — его даёт общий контрол `state`. */
type PlaygroundArgs = AccordionCardProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Accordion",
  component: AccordionCard,
  parameters: { layout: "padded" },
  // `subtitle` is `React.ReactNode` (to match `title`'s type) but every
  // usage is a plain string — without this, the broad ReactNode type makes
  // Storybook fall back to a generic "Set object" JSON-editor placeholder
  // once it's left unset, instead of a plain text control.
  argTypes: {
    state: stateArgType,
    title: { control: "text" },
    subtitle: { control: "text" },
    children: { control: "text" },
    defaultOpen: { control: "boolean" },
    blocked: { control: "boolean" },
  },
  args: {
    state: "default" as PlaygroundState,
    title: "Заголовок карточки",
    subtitle: "Подзаголовок с пояснением",
    children: "Раскрытое содержимое карточки.",
    defaultOpen: false,
    blocked: false,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state} className="w-full">
      <AccordionCard {...args} />
    </PseudoBox>
  ),
}

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
