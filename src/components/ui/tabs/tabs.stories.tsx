import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Tabs, type TabsProps } from "./tabs"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые", disabled: true },
  { value: "errors", label: "Ошибки", status: true },
  { value: "inbox", label: "Входящие", badge: 3 },
]

const meta = {
  title: "Компоненты/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  argTypes: {
    items: { control: "object" },
    showMore: { control: "boolean" },
    defaultValue: { control: "select", options: ITEMS.map((i) => i.value) },
  },
  args: { items: ITEMS, showMore: false, defaultValue: "all" },
} satisfies Meta<TabsProps>

export default meta
type Story = StoryObj<TabsProps>

function Controlled(args: TabsProps) {
  const [value, setValue] = useState(
    args.value ?? args.defaultValue ?? args.items[0]?.value
  )
  return <Tabs {...args} value={value} onValueChange={setValue} />
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
    <StatesMatrix<TabsProps>
      stretch
      cellClassName="min-w-[420px]"
      // v1.2.0 of the master dropped the Large/Medium level property for a
      // responsive Desktop/Mobile pair (44px bar / 32px gaps / 16-24 labels
      // vs 40/24/14-20), so size is a viewport concern — see the Mobile
      // story below.
      rowHeader="Desktop / Mobile — это медиазапрос md:, размера как пропа больше нет (v1.2.0 мастера)."
      columns={[{ label: "Tabs" }]}
      rows={[
        {
          label: "Выбрана первая",
          props: { items: ITEMS, value: "all" },
        },
        {
          label: "Выбрана третья",
          props: { items: ITEMS, value: "errors" },
        },
        {
          label: "Hover",
          props: { items: ITEMS, value: "all" },
          pseudo: "hover",
        },
        {
          label: "Только текст",
          props: {
            items: [
              { value: "a", label: "Все" },
              { value: "b", label: "Открытые" },
            ],
            value: "a",
          },
        },
        {
          label: "Со счётчиком\nи статусом",
          props: {
            items: [
              { value: "a", label: "Входящие", badge: 3 },
              { value: "b", label: "Ошибки", status: true },
            ],
            value: "a",
          },
        },
        {
          label: "С disabled",
          props: {
            items: [
              { value: "a", label: "Все" },
              { value: "b", label: "Закрытые", disabled: true },
            ],
            value: "a",
          },
        },
        {
          // Overflowing tabs collapse into a trailing "ещё" menu.
          label: "Переполнение\n(«ещё»)",
          props: {
            items: Array.from({ length: 10 }, (_, i) => ({
              value: `t${i}`,
              label: `Вкладка ${i + 1}`,
            })),
            value: "t0",
            showMore: true,
          },
        },
      ]}
      render={(props) => <Tabs {...props} />}
    />
  ),
}

export const Mobile: Story = {
  name: "Mobile (< 768px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { controls: { disable: true } },
  render: () => <Controlled items={ITEMS} />,
}
