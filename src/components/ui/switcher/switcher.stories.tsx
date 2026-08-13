import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Switcher, type SwitcherProps } from "./switcher"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "done", label: "Завершённые", badge: 3 },
]

const meta = {
  title: "Компоненты/Cell Switcher",
  component: Switcher,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "md"] },
    activeVariant: { control: "inline-radio", options: ["surface", "black"] },
    greyBackground: { control: "boolean" },
    showMore: { control: "boolean" },
    disabled: { control: "boolean" },
    items: { control: "object" },
    defaultValue: { control: "select", options: ITEMS.map((i) => i.value) },
  },
  args: {
    items: ITEMS,
    size: "lg",
    activeVariant: "surface",
    greyBackground: true,
    showMore: false,
    disabled: false,
    defaultValue: "all",
  },
} satisfies Meta<SwitcherProps>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: SwitcherProps) {
  const [value, setValue] = useState(
    args.value ?? args.defaultValue ?? args.items[0]?.value
  )
  return <Switcher {...args} value={value} onValueChange={setValue} />
}

export const Playground: Story = {
  // Remount when the pinned value changes so the `defaultValue` control
  // actually moves the (otherwise internally-owned) selection.
  render: (args) => <Controlled key={args.defaultValue} {...args} />,
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<SwitcherProps>
      stretch
      baseProps={{ items: ITEMS, value: "all" }}
      columnGroups={[
        {
          label: "Grey background",
          columns: [
            { label: "Active: surface", props: { activeVariant: "surface" } },
            { label: "Active: black", props: { activeVariant: "black" } },
          ],
        },
        {
          label: "White background",
          columns: [
            {
              label: "Active: surface",
              props: { greyBackground: false, activeVariant: "surface" },
            },
            {
              label: "Active: black",
              props: { greyBackground: false, activeVariant: "black" },
            },
          ],
        },
      ]}
      rows={[
        { label: "Large", props: { size: "lg" } },
        { label: "Medium", props: { size: "md" } },
        { label: "Hover", props: { size: "lg" }, pseudo: "hover" },
        { label: "Disabled", props: { size: "lg", disabled: true } },
      ]}
      render={(props) => <Switcher {...props} />}
    />
  ),
}
