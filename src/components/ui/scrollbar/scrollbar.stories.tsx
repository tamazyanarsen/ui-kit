import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Scrollbar } from "./scrollbar"
import { Checkbox } from "@/components/ui/checkbox"

type ScrollbarProps = ComponentProps<typeof Scrollbar>

const meta = {
  title: "Компоненты/Scrollbar",
  component: Scrollbar,
  parameters: { layout: "padded" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
  },
  args: { orientation: "vertical" },
} satisfies Meta<ScrollbarProps>

export default meta
type Story = StoryObj<ScrollbarProps>

export const Playground: Story = {
  render: (args) =>
    args.orientation === "horizontal" ? (
      <Scrollbar {...args} className="w-80 rounded-2xl border bg-white p-4">
        <div className="flex w-[900px] gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-16 w-32 shrink-0 rounded-lg bg-[var(--filter-grey-bg)]"
            />
          ))}
        </div>
      </Scrollbar>
    ) : (
      <Scrollbar
        {...args}
        className="h-52 w-56 rounded-2xl border bg-white py-2 pr-2 pl-4"
      >
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <Checkbox label={`Label ${i + 1}`} />
            </li>
          ))}
        </ul>
      </Scrollbar>
    ),
}

/* The thumb only exists while the content overflows, and it has to be
   scrolled to be seen — so both orientations are shown as live, scrollable
   panes rather than static matrix cells. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Вертикальный"
        description="Полоса появляется при переполнении по высоте."
      >
        <Scrollbar
          orientation="vertical"
          className="h-52 w-56 rounded-2xl border bg-white py-2 pr-2 pl-4"
        >
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <Checkbox label={`Label ${i + 1}`} />
              </li>
            ))}
          </ul>
        </Scrollbar>
      </StorySection>

      <StorySection
        title="Горизонтальный"
        description="То же самое по ширине."
      >
        <Scrollbar
          orientation="horizontal"
          className="w-80 rounded-2xl border bg-white p-4"
        >
          <div className="flex w-[900px] gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-16 w-32 shrink-0 rounded-lg bg-[var(--filter-grey-bg)]"
              />
            ))}
          </div>
        </Scrollbar>
      </StorySection>
    </StoryShowcase>
  ),
}
