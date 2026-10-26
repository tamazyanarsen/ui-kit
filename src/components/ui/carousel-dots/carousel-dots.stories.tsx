import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { PseudoBox, StatesMatrix, sizeArgType } from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"

import { CarouselDots, type CarouselDotsProps } from "./carousel-dots"

/**
 * Carousel Dots — точки карусели под листаемыми лентами (Правки UI-Kit от
 * 25.10, пункт «Постраничный список и точки карусели»). Своего мастера в ДС
 * ЕЛК пока нет — вид по образцу Pagination Dots (SB).
 *
 * Desktop: ячейка 16, круг 8. Mobile: ячейка 12, круг 6. Состояния — только
 * цветом: Grey 166 / наведение Grey 284 / текущая и нажатая Grey 1514.
 */
type PlaygroundArgs = Omit<CarouselDotsProps, "onSelect"> & {
  viewport?: Viewport
  interactive?: boolean
}

const meta = {
  title: "Компоненты/Carousel Dots",
  component: CarouselDots,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    count: { control: { type: "range", min: 1, max: 10 } },
    active: { control: { type: "number", min: 0, max: 9 } },
    interactive: {
      control: "boolean",
      description: "Нажатие на точку делает её текущей (onSelect)",
    },
    getDotLabel: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    count: 4,
    active: 0,
    interactive: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function InteractiveDots({ active, interactive, ...args }: PlaygroundArgs) {
  const [current, setCurrent] = React.useState(active)
  React.useEffect(() => setCurrent(active), [active])
  return (
    <CarouselDots
      {...args}
      active={current}
      onSelect={interactive ? setCurrent : undefined}
    />
  )
}

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <PseudoBox viewport={viewport}>
      <InteractiveDots {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { controls: { disable: true } },
  render: () => (
    <StatesMatrix<CarouselDotsProps>
      responsive
      baseProps={{ count: 4, active: 0, onSelect: () => {} }}
      columns={[
        { label: "Текущая 1", props: { active: 0 } },
        { label: "Текущая 3", props: { active: 2 } },
        { label: "2 страницы", props: { count: 2, active: 1 } },
        { label: "1 страница (пусто)", props: { count: 1 } },
      ]}
      rows={[
        { label: "Default" },
        { label: "Hover", pseudo: "hover" },
        { label: "Active", pseudo: "active" },
        { label: "Focus", pseudo: "focus-visible" },
      ]}
      render={(props) => <CarouselDots {...props} />}
    />
  ),
}
