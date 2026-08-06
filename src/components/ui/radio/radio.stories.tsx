import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Radio } from "./radio"
import { RadioGroup } from "./root"

const meta = {
  title: "Interaction/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  args: { value: "a" },
  // label/comment/error are typed React.ReactNode but every story here only
  // ever puts a plain string in them — pin text controls so a story that
  // leaves one unset doesn't fall back to Storybook's "Set object"
  // JSON-editor placeholder.
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

function Group() {
  const [value, setValue] = useState("a")
  return (
    <RadioGroup value={value} onValueChange={(v) => setValue(v as string)}>
      <Radio value="a" label="Вариант A" />
      <Radio value="b" label="Вариант B" />
      <Radio value="c" label="Вариант C" comment="Дополнительное пояснение" />
    </RadioGroup>
  )
}

export const Default: Story = {
  // Zero-arg render hardcodes a 3-option RadioGroup — the inherited
  // value/label/comment/error controls (built for a single Radio) have
  // nothing to drive here.
  parameters: { controls: { disable: true } },
  render: () => <Group />,
}

export const Disabled: Story = {
  args: { value: "a", label: "Недоступный вариант", disabled: true },
}

export const WithError: Story = {
  args: {
    value: "a",
    label: "Вариант с ошибкой",
    error: "Необходимо выбрать другой вариант",
    comment: "Это пояснение будет скрыто",
  },
}
