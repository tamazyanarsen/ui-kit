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
    // like a working control but can't meaningfully be edited (same class
    // as Button's icon/iconPosition, already fixed there).
    children: { control: false },
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
