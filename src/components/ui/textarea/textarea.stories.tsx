import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "./textarea"

const meta = {
  title: "Interaction/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  args: { label: "Комментарий" },
  // comment/error are typed React.ReactNode but every story here only ever
  // puts a plain string in them — pin text controls so a story that leaves
  // one unset doesn't fall back to Storybook's "Set object" JSON-editor
  // placeholder. `rows` is a genuine native `number` prop (inherited via
  // `React.ComponentProps<"textarea">`), but docgen loses the primitive type
  // across that extends chain and falls back to the same placeholder — pin
  // it too.
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    rows: { control: "number" },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithComment: Story = {
  args: { comment: "Необязательное поле" },
}

export const WithError: Story = {
  args: { error: "Обязательное поле" },
}

export const Locked: Story = {
  args: { locked: true, defaultValue: "Только чтение" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Недоступно" },
}

export const MoreRows: Story = {
  args: { rows: 6 },
}
