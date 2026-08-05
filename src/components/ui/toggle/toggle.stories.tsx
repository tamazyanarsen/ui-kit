import { useState } from "react"
import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Toggle } from "./toggle"

const meta = {
  title: "Interaction/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  args: { label: "Уведомления" },
  // label/comment/error are typed React.ReactNode but every story here only
  // ever puts a plain string in them — pin text controls so a story that
  // leaves one unset (e.g. `WithoutLabel`'s `label: undefined`) doesn't fall
  // back to Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: ComponentProps<typeof Toggle>) {
  const [checked, setChecked] = useState(args.checked ?? true)
  return <Toggle {...args} checked={checked} onCheckedChange={setChecked} />
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
}

export const WithoutLabel: Story = {
  args: { label: undefined, "aria-label": "Уведомления" },
}

export const WithCommentAndError: Story = {
  args: { comment: "Дополнительное пояснение", error: "Ошибка сохранения настройки" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
}
