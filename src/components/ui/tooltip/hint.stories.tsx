import type { Meta, StoryObj } from "@storybook/react-vite"

import { Hint } from "./hint"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Content/Hint",
  component: Hint,
  parameters: { layout: "centered" },
  args: {
    content: "Развёрнутый текст подсказки, который поясняет назначение элемента.",
    children: <Button variant="secondary-grey">Открыть подсказку</Button>,
  },
  argTypes: {
    // `children` is a React.ReactElement (the trigger) — no JSON value can
    // represent it; Storybook falls back to a raw editable tree of the
    // element's internals ($$typeof/type/props/_owner/_store), which looks
    // like a working control but can't meaningfully be edited. Map a
    // friendly choice between two real trigger elements instead of
    // disabling the control (same technique as Button's `icon`).
    children: {
      control: { type: "select", labels: { grey: "Button (Grey)", primary: "Button (Primary)" } },
      options: ["grey", "primary"],
      mapping: {
        grey: <Button variant="secondary-grey">Открыть подсказку</Button>,
        primary: <Button variant="primary">Открыть подсказку</Button>,
      },
    },
    // `title` is typed `React.ReactNode` (broad, to allow markup in
    // principle) but is always used as a plain string in practice (see
    // `WithTitle` below) — with no arg set on `Default`, Storybook's
    // auto-inferred control for the broad type falls back to a "Set
    // object" placeholder instead of a text box. Pin it to a real text
    // control since a string is genuinely all this prop ever holds here.
    title: { control: "text" },
  },
} satisfies Meta<typeof Hint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTitle: Story = {
  args: { title: "Заголовок подсказки" },
}

export const NoCloseButton: Story = {
  args: { showCross: false },
}
