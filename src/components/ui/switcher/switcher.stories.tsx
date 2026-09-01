import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"


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
  { value: "sent", label: "Отправленные" },
  { value: "rejected", label: "Отклонённые" },
  { value: "signed", label: "Подписанные" },
]

/* Свойство `Volume` вложенного `Cell Switcher Value` — от 2 до 8 ячеек
   (дизайн-чек Storybook (Аня Багрова) №22). Раньше список обрывался на
   пяти, и верхние значения макета проверить было нечем. */
const ITEM_COUNTS = [2, 3, 4, 5, 6, 7, 8] as const
type ItemCount = (typeof ITEM_COUNTS)[number]

const ITEMS = ITEM_POOL.slice(0, 3)

/* `Type` — свойство компонент-сета `Content Switcher (ELK)`: Icon,
   Text Badge, Text Status. */
const SWITCHER_TYPES = ["Text", "Text Badge", "Text Status", "Icon"] as const
type SwitcherType = (typeof SWITCHER_TYPES)[number]

type PlaygroundArgs = SwitcherProps & {
  itemsCount?: ItemCount
  figmaType?: SwitcherType
}

const CELL_VALUE = { table: { category: "Cell Switcher Value" } }
const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Cell Switcher",
  component: Switcher,
  parameters: { layout: "padded" },
  argTypes: {
    /* Дизайн-чек Storybook (Аня Багрова) №22: панель приведена к «Свойствам
       компонента» — Size, Grey Background и вложенный `Cell Switcher Value`
       со своими Volume и Show More.

       `Size` здесь — не ViewportScope: у компонента нет `desktop:`-классов,
       формы задаёт собственный проп `size` (Large/Medium), который тот же
       лист макета подписывает Desktop/Mobile. */
    size: optionsArgType(
      "Size",
      { lg: "Desktop", md: "Mobile" },
      "inline-radio"
    ),
    greyBackground: toggleArgType("Grey Background"),
    itemsCount: {
      ...optionsArgType<ItemCount>(
        "Volume",
        Object.fromEntries(ITEM_COUNTS.map((n) => [n, String(n)])) as Record<
          ItemCount,
          string
        >
      ),
      ...CELL_VALUE,
    },
    showMore: {
      ...toggleArgType(
        "Show More",
        "Ячейки, которые не помещаются в строку, сворачиваются в «…». Видно на больших значениях Volume — на двух-трёх ячейках сворачивать нечего"
      ),
      ...CELL_VALUE,
    },
    activeVariant: {
      name: "Active Black",
      control: "inline-radio",
      options: ["surface", "black"],
      ...CONTENT,
    },
    disabled: { control: "boolean", ...CONTENT },
    items: { table: { disable: true } },
    figmaType: {
      name: "Type",
      control: "inline-radio",
      options: SWITCHER_TYPES,
      description: "Оформление вкладки: текст, со счётчиком, со статусом или с иконкой",
      ...CONTENT,
    },
    defaultValue: {
      control: "select",
      options: ITEM_POOL.map((i) => i.value),
      ...CONTENT,
    },
    value: { table: { disable: true } },
  },
  args: {
    items: ITEMS,
    itemsCount: 5,
    figmaType: "Text",
    size: "lg",
    activeVariant: "surface",
    greyBackground: true,
    showMore: true,
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
      status: figmaType === "Text Status" ? true : undefined,
      icon: figmaType === "Icon" ? "file-text" : undefined,
    }))
    // Выбранное значение могло «выпасть» из укороченного списка.
    const defaultValue = items.some((i) => i.value === args.defaultValue)
      ? args.defaultValue
      : items[0]?.value
    return (
      // Дизайн-чек Storybook (Аня Багрова) №21: «не работает настройка
      // Show More». Сворачивание в «…» включается переполнением строки, а на
      // голом холсте `layout: padded` три вкладки помещались всегда — по
      // контролу ничего не происходило. Теперь ряд стоит в контейнере
      // фиксированной ширины, и на больших Volume «…» действительно
      // появляется, а выключенный Show More показывает все ячейки.
      <div className="w-[560px] max-w-full">
        <Controlled
          key={`${defaultValue}-${itemsCount}`}
          {...args}
          className="flex w-full"
          items={items}
          defaultValue={defaultValue}
        />
      </div>
    )
  },
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<SwitcherProps>
      responsive
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
