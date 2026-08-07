import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Hint, type HintProps } from "./hint"
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
  title: "Content/Tooltip & Hint/Hint",
  component: Hint,
  parameters: { layout: "centered" },
  argTypes: {
    // `children` is a React.ReactElement (the trigger) — no JSON value can
    // represent it; Storybook falls back to a raw editable tree of the
    // element's internals ($$typeof/type/props/_owner/_store), which looks
    // like a working control but can't meaningfully be edited. Map a
    // friendly choice between two real trigger elements instead (same
    // technique as Button's `icon`).
    children: {
      control: {
        type: "select",
        labels: { grey: "Button (Grey)", primary: "Button (Primary)" },
      },
      options: ["grey", "primary"],
      mapping: {
        grey: <Button variant="secondary-grey">Открыть подсказку</Button>,
        primary: <Button variant="primary">Открыть подсказку</Button>,
      },
    },
    // `title`/`content` are typed `React.ReactNode` (broad, to allow markup
    // in principle) but are always plain strings in practice — with no arg
    // set, Storybook's auto-inferred control for the broad type falls back
    // to a "Set object" placeholder instead of a text box.
    title: { control: "text" },
    content: { control: "text" },
    direction: { control: "select", options: DIRECTIONS },
    showCross: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
  args: {
    content:
      "Развёрнутый текст подсказки, который поясняет назначение элемента.",
    direction: "top-center",
    showCross: true,
    children: <Button variant="secondary-grey">Открыть подсказку</Button>,
  },
} satisfies Meta<HintProps>

export default meta
type Story = StoryObj<HintProps>

export const Playground: Story = {}

/* Hint is a click-opened, portalled popup, so its variants are laid out as
   live triggers rather than a grid of static cells. Below `md` it becomes a
   Modal bottom sheet with a "Понятно" button (per the master's
   Direction=Mobile symbol) — switch the viewport to see that form. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="8 направлений"
        description="Нажмите на кнопку, чтобы раскрыть подсказку."
      >
        <div className="grid grid-cols-4 gap-x-16 gap-y-24 py-16">
          {DIRECTIONS.map((direction) => (
            <Hint key={direction} content={direction} direction={direction}>
              <Button variant="secondary-grey">{direction}</Button>
            </Hint>
          ))}
        </div>
      </StorySection>

      <StorySection title="Состав подсказки">
        <div className="flex gap-8">
          <Hint content="Текст подсказки без заголовка.">
            <Button variant="secondary-grey">Без заголовка</Button>
          </Hint>
          <Hint title="Заголовок подсказки" content="Текст подсказки.">
            <Button variant="secondary-grey">С заголовком</Button>
          </Hint>
          <Hint content="Текст подсказки." showCross={false}>
            <Button variant="secondary-grey">Без крестика</Button>
          </Hint>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}

export const Mobile: Story = {
  name: "Mobile (< 768px — Bottom Sheet)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { controls: { disable: true } },
  render: () => (
    <Hint
      title="Заголовок подсказки"
      content="На мобильном подсказка раскрывается как Bottom Sheet с кнопкой «Понятно»."
    >
      <Button variant="secondary-grey">Открыть подсказку</Button>
    </Hint>
  ),
}
