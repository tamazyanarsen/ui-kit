import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, optionsArgType } from "@/stories/matrix"

import { TabHeadings, type TabHeadingsItem } from "./tab-headings"

/* Tab Headings — `ELK / tab-headings`, страница «.Title, Link, Bread Crumbs,
   Divider» (70467:11784). Таблица «Свойства компонента» макета: `Value`
   (сколько вкладок) и `State` вложенного `Title Tab (ELK)` — Default, Active,
   Disabled. В таблице у `Value` написано «2 — 12», но в компонент-сете
   варианты `Value=1…5`, а описание варианта прямо говорит «от 1 до 5
   вкладок» — контрол идёт по сету. */

const LABELS = ["Избранное", "Все разделы", "Счета", "Карты", "Кредиты"]

type PlaygroundArgs = {
  /** `Value` — сколько вкладок в ряду. */
  value: 1 | 2 | 3 | 4 | 5
  /** `State` вкладки, выбранной для показа состояния, — по сути, Disabled у второй. */
  disabledSecond: boolean
}

function makeItems(count: number, disabledSecond = false): TabHeadingsItem[] {
  return LABELS.slice(0, count).map((label, index) => ({
    value: `tab-${index + 1}`,
    label,
    disabled: disabledSecond && index === 1,
  }))
}

function TabHeadingsDemo({ value: count, disabledSecond }: PlaygroundArgs) {
  const [active, setActive] = useState("tab-1")
  return (
    <div className="w-[360px] bg-[var(--header-bg)] p-4">
      <TabHeadings
        items={makeItems(count, disabledSecond)}
        value={active}
        onValueChange={setActive}
      />
    </div>
  )
}

const meta = {
  title: "Компоненты/Tab Headings",
  component: TabHeadingsDemo,
  parameters: { layout: "padded" },
  argTypes: {
    value: {
      ...optionsArgType<1 | 2 | 3 | 4 | 5>(
        "Value",
        { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" },
        "inline-radio"
      ),
      description:
        "Сколько вкладок. Одна — заголовок «в активном состоянии без возможности клика»",
    },
    disabledSecond: {
      name: "State: Disabled",
      control: "boolean",
      description: "Вторая вкладка в состоянии Disabled (Grey 166, не выбирается)",
      if: { arg: "value", neq: 1 },
    },
  },
  args: { value: 2, disabledSecond: false },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

/* Матрица компонент-сета: строки — `Value=1…5`, как в макете; отдельная
   строка — три состояния `Title Tab (ELK)` подряд. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      <StatesMatrix<{ count: number }>
        rowHeader="Value"
        columns={[{ label: "Tab Headings" }]}
        rows={[5, 4, 3, 2, 1].map((count) => ({
          label: String(count),
          props: { count },
        }))}
        render={({ count }) => (
          <TabHeadings items={makeItems(count)} defaultValue="tab-1" />
        )}
      />
      <StatesMatrix<{ item: TabHeadingsItem; active: boolean }>
        rowHeader="Title Tab (ELK)"
        columns={[
          { label: "Default", props: { item: { value: "a", label: "Title Tab" }, active: false } },
          { label: "Active", props: { item: { value: "a", label: "Title Tab" }, active: true } },
          {
            label: "Disabled",
            props: { item: { value: "a", label: "Title Tab", disabled: true }, active: false },
          },
        ]}
        rows={[{ label: "State" }]}
        render={({ item, active }) => (
          // Одна вкладка в контексте ряда: выбранной делается служебная
          // соседняя, если показывается не-Active состояние.
          <TabHeadings
            items={active ? [item] : [{ value: "hidden", label: "" }, item]}
            value={active ? item.value : "hidden"}
            className="[&>[data-value=hidden]]:hidden"
          />
        )}
      />
    </div>
  ),
}
