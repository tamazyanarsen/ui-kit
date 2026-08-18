import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

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

/* `Type` — свойство компонент-сета `Tabs (ELK)`: Badge, Status, Icon.
   Раньше оно жило только в пуле — счётчик и статус появлялись сами собой на
   четвёртой и пятой вкладке, а выбрать оформление было нельзя. */
const TAB_TYPES = ["Text", "Badge", "Status", "Icon"] as const
type TabType = (typeof TAB_TYPES)[number]

function decorate(items: typeof ITEMS, type: TabType) {
  return items.map((item) => ({
    ...item,
    badge: type === "Badge" ? (item.badge ?? 3) : undefined,
    status: type === "Status" ? true : undefined,
    icon: type === "Icon" ? "file-text" : undefined,
  }))
}

type PlaygroundArgs = TabsProps & {
  itemsCount?: TabCount
  figmaType?: TabType
  viewport?: Viewport
}

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
    figmaType: {
      name: "Type",
      control: "inline-radio",
      options: TAB_TYPES,
      description: "Оформление вкладки: только текст, со счётчиком или со статусом",
    },
    showMore: { control: "boolean" },
    defaultValue: { control: "select", options: ITEMS.map((i) => i.value) },
    // v1.2.0 мастера убрала свойство размера в пользу пары Desktop/Mobile —
    // теперь она выбирается контролом (дизайн-чек №3 №19), а не вьюпортом.
    viewport: viewportArgType,
  },
  args: {
    items: ITEMS,
    itemsCount: 5,
    figmaType: "Text",
    showMore: false,
    defaultValue: "all",
    viewport: "auto",
  },
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
  render: ({ itemsCount = 5, figmaType = "Text", viewport, ...args }) => {
    const items = decorate(ITEMS.slice(0, itemsCount), figmaType)
    const defaultValue = items.some((i) => i.value === args.defaultValue)
      ? args.defaultValue
      : items[0]?.value
    return (
      <ViewportScope viewport={viewport}>
        <Controlled
          key={`${defaultValue}-${itemsCount}`}
          {...args}
          items={items}
          defaultValue={defaultValue}
        />
      </ViewportScope>
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
      // vs 40/24/14-20). Обе формы рисуются рядом — дизайн-чек №3 №18.
      responsive
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
