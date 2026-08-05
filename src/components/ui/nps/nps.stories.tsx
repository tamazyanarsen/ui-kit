import type { Meta, StoryObj } from "@storybook/react-vite"

import { Nps } from "./nps"

const meta = {
  title: "Template/Feedback",
  component: Nps,
  parameters: { layout: "centered" },
  // `title` is typed React.ReactNode but every real usage (including its own
  // runtime default above) is a plain string — pin a text control so an
  // unset value doesn't fall back to Storybook's "Set object" placeholder.
  // `value`/`defaultValue` are typed `number | null` — the `| null` union
  // confuses Storybook's type inference into the same "Set object"
  // JSON-editor placeholder, even though every real usage is a plain 1–5
  // rating number.
  argTypes: {
    title: { control: "text" },
    value: { control: "number" },
    defaultValue: { control: "number" },
  },
} satisfies Meta<typeof Nps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const RatingPicked: Story = {
  args: { defaultValue: 4 },
}

export const NoChips: Story = {
  args: { defaultValue: 3, showChips: false },
}

export const NoDescriptionPrompt: Story = {
  args: { defaultValue: 3, showDescription: false },
}

export const Submitted: Story = {
  args: { submitted: true },
}
