import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Filter, type FilterProps } from "./filter"
import type { FilterType } from "./filter-trigger"

/* Дизайн-чек «Сторибук Ч.2» от 10.09.2026:

   Замечание 5 — «Нужно разделить компоненты filter и chips на разные,
   компонент chips уже есть, необходимо перенести эти свойства к нему».
   Контрола «Вид вызова» (table-filter / chips) больше нет: у фильтра один
   элемент вызова — пилюля `ELK / filter-table`, а коробка chips-filter со
   своими White/Grey целиком живёт в истории `Chips` (там это свойство `Type`
   компонент-сета `ELK / chips, filter`). Вместе с коробкой из фильтра ушли
   `background` и слот иконки — они были только у неё.

   Замечание 6 — набор контролов:

     Size     Desktop, Mobile
     State    Default, Hover, Active, Disabled
     Type     Text, Select, Counter
     Checked  True, False

   `Type` в самом макете — два независимых булевых свойства `Select` и
   `Counter` компонент-сета `ELK / filter-table` (нода 1303:99241); вместе
   они не встречаются ни в одном символе, поэтому сведены в один список.
   `Checked` — это «в фильтре выбрано значение», то есть в коде `defaultValue`,
   а не отдельный проп: тёмная пилюля с крестиком получается сама. */
const TYPE_LABELS: Record<FilterType, string> = {
  text: "Text",
  select: "Select",
  counter: "Counter",
}

const CHECKED_VALUE = "Оплачен"

type PlaygroundArgs = FilterProps & {
  state?: PlaygroundState
  viewport?: Viewport
  checked?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Filter",
  component: Filter,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    state: stateArgTypeOf(["default", "hover", "active", "disabled"]),
    type: optionsArgType("Type", TYPE_LABELS),
    checked: toggleArgType(
      "Checked",
      "В фильтре выбрано значение: пилюля темнеет и показывает его вместо подписи, шеврон меняется на крестик"
    ),
    label: { control: "text", ...CONTENT },
    placeholder: { control: "text", ...CONTENT },
    count: {
      control: { type: "number", min: 0, max: 99 },
      if: { arg: "type", eq: "counter" },
      ...CONTENT,
    },
    // Раскрытый попап показывает отдельная история — здесь контрол только
    // мешал бы: `layout: "padded"` не всегда даёт ему место.
    open: { table: { disable: true } },
    disabled: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    type: "select" as FilterType,
    checked: false,
    label: "Статус",
    placeholder: "Введите значение",
    count: 3,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, checked, ...args }) => (
    <PseudoBox state={state} viewport={viewport}>
      {/* `key` — иначе смена `Checked` не доезжает: `defaultValue` читается
          один раз при монтировании (см. общее правило про default*-пропы). */}
      <Filter
        key={String(checked)}
        {...args}
        defaultValue={checked ? CHECKED_VALUE : null}
        disabled={state === "disabled"}
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<FilterProps>
      responsive
      baseProps={{ label: "Статус" }}
      columnGroups={[
        {
          label: "Type",
          columns: [
            { label: "Text", props: { type: "text" as const } },
            { label: "Select", props: { type: "select" as const } },
            { label: "Counter", props: { type: "counter" as const, count: 3 } },
          ],
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Active", props: {}, pseudo: "active" },
        // Дизайн-чек №19/№20: `Checked=True` — выбранное значение, тёмная
        // пилюля с крестиком (ноды 1303:99257 и 1303:99311).
        { label: "Checked", props: { defaultValue: CHECKED_VALUE } },
        {
          label: "Checked + Hover",
          props: { defaultValue: CHECKED_VALUE },
          pseudo: "hover",
        },
        { label: "Disabled", props: { disabled: true } },
        {
          label: "Disabled\n+ Checked",
          props: { disabled: true, defaultValue: CHECKED_VALUE },
        },
      ]}
      render={(props) => <Filter {...props} />}
    />
  ),
}

/* The popup is portalled, so it can't sit inside the matrix — every open
   cell would overlay the next. */
export const Opened: Story = {
  name: "Раскрытый фильтр",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="h-96">
      <Filter label="Статус" open />
    </div>
  ),
}
