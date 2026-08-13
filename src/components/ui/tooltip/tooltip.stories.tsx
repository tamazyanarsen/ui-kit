import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Tooltip, type TooltipProps } from "./tooltip"
import type { TooltipDirection } from "./variants"
import { Button } from "@/components/ui/button"

const DIRECTIONS: TooltipDirection[] = [
  "top-left",
  "top-center",
  "top-right",
  "down-left",
  "down-center",
  "down-right",
  "left",
  "right",
]

const meta = {
  title: "Компоненты/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  argTypes: {
    content: { control: "text" },
    direction: { control: "select", options: DIRECTIONS },
    disabled: { control: "boolean" },
    // `children` is a React.ReactElement (the trigger) — no JSON value can
    // represent it; Storybook falls back to a raw editable tree of the
    // element's internals, which looks like a working control but isn't.
    // Map a friendly choice between two real trigger elements instead of
    // disabling the control (same technique as Button's `icon`).
    children: {
      control: {
        type: "select",
        labels: { grey: "Button (Grey)", primary: "Button (Primary)" },
      },
      options: ["grey", "primary"],
      mapping: {
        grey: <Button variant="secondary-grey">Наведите курсор</Button>,
        primary: <Button variant="primary">Наведите курсор</Button>,
      },
    },
  },
  args: {
    content: "Подсказка с пояснением",
    direction: "top-center",
    disabled: false,
    children: <Button variant="secondary-grey">Наведите курсор</Button>,
  },
} satisfies Meta<TooltipProps>

export default meta
type Story = StoryObj<TooltipProps>

export const Playground: Story = {}

/* Tooltips are portalled popups that only appear on hover, so a matrix would
   show empty cells — the directions are laid out as a spaced grid of live
   triggers instead. */
export const Examples: Story = {
  name: "Направления",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="8 направлений"
        description="Наведите курсор на кнопку, чтобы увидеть подсказку."
      >
        <div className="grid grid-cols-4 gap-x-16 gap-y-24 py-16">
          {DIRECTIONS.map((direction) => (
            <Tooltip key={direction} content={direction} direction={direction}>
              <Button variant="secondary-grey">{direction}</Button>
            </Tooltip>
          ))}
        </div>
      </StorySection>
      <StorySection
        title="Отключённая подсказка"
        description="`disabled` подавляет всплытие, триггер остаётся обычной кнопкой."
      >
        <Tooltip content="Не появится" disabled>
          <Button variant="secondary-grey">Без подсказки</Button>
        </Tooltip>
      </StorySection>
    </StoryShowcase>
  ),
}
