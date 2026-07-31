import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Filter } from "./filter"

const meta = {
  title: "Interaction/Filter",
  component: Filter,
  parameters: { layout: "padded" },
  args: { label: "Статус" },
} satisfies Meta<typeof Filter>

export default meta
type Story = StoryObj<typeof meta>

export const White: Story = {
  args: { background: "white" },
}

export const Grey: Story = {
  args: { background: "grey" },
}

export const WithCount: Story = {
  args: { count: 3 },
}

export const WithAppliedValue: Story = {
  args: { defaultValue: "Оплачен" },
}

function ChipHarness() {
  const [value, setValue] = useState<string | null>("Оплачен")
  return <Filter label="Статус" value={value} onValueChange={setValue} chip />
}

export const ChipVariant: Story = {
  name: "Chip (table filter bar)",
  render: () => <ChipHarness />,
}

export const Disabled: Story = {
  args: { disabled: true },
}
