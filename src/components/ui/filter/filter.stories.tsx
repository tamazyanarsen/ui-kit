import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleHelp } from "@/icons"

import { Filter } from "./filter"

const meta = {
  title: "Interaction/Filter",
  component: Filter,
  parameters: { layout: "padded" },
  args: { label: "Статус" },
  argTypes: {
    // `icon` takes a JSX element instance (same shape as Input's
    // iconLeft/trailingIcon) — map a friendly choice to the real element
    // instead of disabling the control (matches `src/demo/filter-demo.tsx`'s
    // own `<CircleHelp />` usage as the representative icon).
    icon: {
      control: { type: "select", labels: { none: "None", circleHelp: "Circle Help" } },
      options: ["none", "circleHelp"],
      mapping: { none: undefined, circleHelp: <CircleHelp aria-hidden="true" /> },
    },
    // `value`/`defaultValue` are `string | null` but every usage is a
    // plain string — without this, the union falls back to a generic
    // "Set object" JSON editor whenever a story leaves one unset.
    value: { control: "text" },
    defaultValue: { control: "text" },
  },
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
  // ChipHarness hardcodes label/value locally — every inherited control
  // (background/count/icon/value/defaultValue) is dead here.
  parameters: { controls: { disable: true } },
  render: () => <ChipHarness />,
}

export const Disabled: Story = {
  args: { disabled: true },
}
