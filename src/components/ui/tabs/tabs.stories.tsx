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

/* Дизайн-чек №17: количество вкладок переключается списком, а не правкой
   JSON-массива в контролах. Пул подобран так, чтобы по мере роста включались
   и вспомогательные признаки вкладки (disabled, статус, счётчик). */
const TAB_COUNTS = [1, 2, 3, 4, 5] as const
type TabCount = (typeof TAB_COUNTS)[number]

type PlaygroundArgs = TabsProps & { itemsCount?: TabCount }

const meta = {
  title: "Компоненты/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  argTypes: {
    itemsCount: {
      name: "Количество вкладок",
      control: "select",
      options: TAB_COUNTS,
    },
    items: { table: { disable: true } },
    showMore: { control: "boolean" },
    defaultValue: { control: "select", options: ITEMS.map((i) => i.value) },
  },
  args: { items: ITEMS, itemsCount: 5, showMore: false, defaultValue: "all" },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled(args: TabsProps) {
  const [value, setValue] = useState(
    args.value ?? args.defaultValue ?? args.items[0]?.value
  )
  return <Tabs {...args} value={value} onValueChange={setValue} />
}

export const Playground: Story = {
  // Remount when the pinned value or the tab count changes so the
  // `defaultValue` control actually moves the (otherwise internally-owned)
  // selection.
  render: ({ itemsCount = 5, ...args }) => {
    const items = ITEMS.slice(0, itemsCount)
    const defaultValue = items.some((i) => i.value === args.defaultValue)
      ? args.defaultValue
      : items[0]?.value
    return (
      <Controlled
        key={`${defaultValue}-${itemsCount}`}
        {...args}
        items={items}
        defaultValue={defaultValue}
      />
    )
  },
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
