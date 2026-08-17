import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { FilterTable, type FilterTableProps } from "./filter-table"

/**
 * FilterTable — «ELK / filter-table» с канваса Filter, Chips (666:15).
 * Истории у него не было, хотя это отдельный компонент-сет со своей
 * матрицей:
 *
 *   State    Default | Hover | Active | Disabled
 *   Checked  False (серая подсказка) | True (тёмный выбранный фильтр)
 *   Counter  False | True
 *   Select   False | True — шеврон справа
 *
 * `Select` в контролах нет: шеврон рисует не сам filter-table, а Filter в
 * режиме `chip`, который его оборачивает.
 *
 * ⚠️ `Counter` рисуется только вместе с `showCounter`, и **по умолчанию он
 * выключен** — отступление от кита. Вариант сета с плашкой существует, но в
 * продукте выбранный чип называет выбранное («Действующий», «Статус: 3»)
 * обычным текстом подписи: по шаблону фон вокруг цифры тот же, что и у чипа.
 */
type PlaygroundArgs = FilterTableProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Filter Table",
  component: FilterTable,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    selected: { control: "boolean", name: "Checked" },
    showCounter: {
      control: "boolean",
      name: "Counter",
      description:
        "Плашка со счётчиком. По умолчанию выключена — в продукте выбранный чип называет выбранное текстом подписи",
    },
    count: {
      control: { type: "number", min: 0, max: 99 },
      name: "Counter: значение",
      if: { arg: "showCounter", truthy: true },
    },
    disabled: { control: "boolean", name: "State: Disabled" },
    state: stateArgType,
  },
  args: {
    children: "Оплачен",
    selected: false,
    showCounter: true,
    count: 12,
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state}>
      <FilterTable {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<FilterTableProps>
      baseProps={{ children: "Оплачен" }}
      columns={[
        { label: "Checked=False", props: {} },
        { label: "Checked=True", props: { selected: true } },
        { label: "+ Counter", props: { showCounter: true, count: 12 } },
        {
          label: "Checked + Counter",
          props: { selected: true, showCounter: true, count: 12 },
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Active", props: {}, pseudo: "active" },
        { label: "Disabled", props: { disabled: true } },
      ]}
      render={(props) => <FilterTable {...props} />}
    />
  ),
}
