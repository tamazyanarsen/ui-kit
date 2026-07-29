import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Radio } from "./radio"
import { RadioGroup } from "./root"

const meta = {
  title: "UI/Radio",
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

export const WithError: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <Radio value="a" label="Вариант A" error="Нужно выбрать другой вариант" />
      <Radio value="b" label="Вариант B" />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  args: { value: "a", label: "Недоступный вариант", disabled: true },
}
