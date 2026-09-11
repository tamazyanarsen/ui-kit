import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgTypeOf,
  toggleArgType,
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
    // Панель по осям компонент-сета 1303:99241: State / Checked / Counter
    // (плюс Select, которого у этого мастера в коде нет — см. выше).
    state: stateArgTypeOf(["default", "hover", "active", "disabled"]),
    disabled: { table: { disable: true } },
    selected: { control: "boolean", name: "Checked" },
    showCounter: toggleArgType(
      "Counter",
      "Плашка со счётчиком. По умолчанию выключена — в продукте выбранный чип называет выбранное текстом подписи"
    ),
    showClose: {
      control: "boolean",
      name: "Крестик",
      description:
        "Снятие выбора крестиком. Есть только у выбранного чипа: у подсказки NPS выбор снимается правкой текста, а не крестом",
      if: { arg: "selected", truthy: true },
    },
    children: { control: "text", table: { category: "Контент" } },
    count: {
      control: { type: "number", min: 0, max: 99 },
      name: "Значение счётчика",
      if: { arg: "showCounter", truthy: true },
      table: { category: "Контент" },
    },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок осей компонент-сета. */
  args: {
    state: "default" as PlaygroundState,
    selected: false,
    showCounter: true,
    showClose: true,
    children: "Оплачен",
    count: 12,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state}>
      <FilterTable {...args} disabled={state === "disabled"} />
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
