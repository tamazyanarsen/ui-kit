import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Switcher, type SwitcherProps } from "./switcher"

/* Дизайн-чек №17: «подобными свойствами нельзя управлять с помощью
   стандартных переключений… невозможно проверить вариации компонента без
   знания кода. Нужно заменить на человекопонятный элемент, например
   выпадающий список, в котором можно будет переключать количество вкладок
   в данном свитчере».

   Раньше `items` был JSON-редактором («items: [ 0: {…} 2 keys … ]») — чтобы
   увидеть свитчер с двумя или пятью вкладками, надо было руками править
   массив. Теперь количество выбирается списком, а сам `items` из контролов
   убран: он собирается из этого пула. Пул на пять — верхняя граница, при
   которой вкладки ещё помещаются в строку. */
const ITEM_POOL = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "done", label: "Завершённые", badge: 3 },
  { value: "draft", label: "Черновики" },
  { value: "archive", label: "Архив" },
]

const ITEM_COUNTS = [1, 2, 3, 4, 5] as const
type ItemCount = (typeof ITEM_COUNTS)[number]

const ITEMS = ITEM_POOL.slice(0, 3)

/* `Type` — свойство компонент-сета `Content Switcher (ELK)`: Icon,
   Text Badge, Text Status. У `SwitcherItem` есть только `badge`, поэтому в
   контроле два поддерживаемых значения; Icon и Text Status — пробел
   компонента, а не истории, и глухие пункты списка вводили бы в
   заблуждение. */
const SWITCHER_TYPES = ["Text", "Text Badge"] as const
type SwitcherType = (typeof SWITCHER_TYPES)[number]

type PlaygroundArgs = SwitcherProps & {
  itemsCount?: ItemCount
  figmaType?: SwitcherType
}

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
    itemsCount: {
      name: "Количество вкладок",
      control: "select",
      options: ITEM_COUNTS,
    },
    items: { table: { disable: true } },
    figmaType: {
      name: "Type",
      control: "inline-radio",
      options: SWITCHER_TYPES,
      description:
        "Оформление вкладки. Icon и Text Status из макета компонентом пока не поддержаны",
    },
    defaultValue: {
      control: "select",
      options: ITEM_POOL.map((i) => i.value),
    },
  },
  args: {
    items: ITEMS,
    itemsCount: 3,
    figmaType: "Text",
    size: "lg",
    activeVariant: "surface",
    greyBackground: true,
    showMore: false,
    disabled: false,
    defaultValue: "all",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled(args: SwitcherProps) {
  const [value, setValue] = useState(
    args.value ?? args.defaultValue ?? args.items[0]?.value
  )
  return <Switcher {...args} value={value} onValueChange={setValue} />
}

export const Playground: Story = {
  // Remount when the pinned value or the tab count changes so the
  // `defaultValue` control actually moves the (otherwise internally-owned)
  // selection.
  render: ({ itemsCount = 3, figmaType = "Text", ...args }) => {
    const items = ITEM_POOL.slice(0, itemsCount).map((item) => ({
      ...item,
      badge: figmaType === "Text Badge" ? (item.badge ?? 3) : undefined,
    }))
    // Выбранное значение могло «выпасть» из укороченного списка.
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
        // Дизайн-чек №17: количество вкладок — тоже вариация компонента, а
        // не деталь данных, поэтому крайние случаи показаны в матрице.
        { label: "1 вкладка", props: { items: ITEM_POOL.slice(0, 1) } },
        { label: "2 вкладки", props: { items: ITEM_POOL.slice(0, 2) } },
        { label: "5 вкладок", props: { items: ITEM_POOL } },
      ]}
      render={(props) => <Switcher {...props} />}
    />
  ),
}
