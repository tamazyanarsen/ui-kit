import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Radio } from "./radio"
import { RadioGroup } from "./root"

const meta = {
  title: "Interaction/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  args: { value: "a" },
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
