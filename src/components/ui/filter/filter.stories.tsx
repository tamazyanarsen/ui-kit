import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleHelp } from "@/icons"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Filter, type FilterProps } from "./filter"

type PlaygroundArgs = FilterProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Filter",
  component: Filter,
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    background: { control: "inline-radio", options: ["white", "grey"] },
    count: { control: { type: "number", min: 0, max: 99 } },
    chip: { control: "boolean" },
    disabled: { control: "boolean" },
    // Forces the popup open — the Playground is `layout: "padded"` so it has
    // room to render below the trigger.
    open: { control: "boolean" },
    // `icon` takes a JSX element instance (same shape as Input's
    // iconLeft/trailingIcon) — map a friendly choice to the real element
    // instead of disabling the control (matches `src/demo/filter-demo.tsx`'s
    // own `<CircleHelp />` usage as the representative icon).
    icon: {
      control: { type: "select", labels: { none: "None", circleHelp: "Circle Help" } },
      options: ["none", "circleHelp"],
      mapping: { none: undefined, circleHelp: <CircleHelp aria-hidden="true" /> },
    },
    // `value`/`defaultValue` are `string | null` but every usage is a plain
    // string — without this, the union falls back to a generic "Set object"
    // JSON editor whenever a story leaves one unset.
    value: { control: "text" },
    defaultValue: { control: "text" },
    state: stateArgType,
  },
  args: {
    label: "Статус",
    background: "white",
    chip: false,
    disabled: false,
    open: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state}>
      <Filter {...args} />
    </PseudoBox>
  ),
}

/* `chip` renders `ELK / filter-table` in *both* of its Checked states: the
   grey pill with a chevron while empty, the dark pill with a close cross
   once a value is applied — hence a dedicated column pair. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<FilterProps>
      baseProps={{ label: "Статус" }}
      columnGroups={[
        {
          label: "Dropdown",
          columns: [
            { label: "White", props: { background: "white" } },
            { label: "Grey", props: { background: "grey" } },
          ],
        },
        {
          label: "Chip (filter-table)",
          columns: [{ label: "Chip", props: { chip: true } }],
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Со счётчиком", props: { count: 3 } },
        // Дизайн-чек №19/№20: `State=Active` — выбранное значение плюс
        // брендовая обводка `border-2` (ноды 54887:29390 / 54887:29400).
        {
          label: "Выбрано (Active,\nбрендовая обводка)",
          props: { defaultValue: "Оплачен" },
        },
        {
          label: "Выбрано + Hover",
          props: { defaultValue: "Оплачен" },
          pseudo: "hover",
        },
        { label: "С иконкой", props: { icon: <CircleHelp aria-hidden="true" /> } },
        { label: "Disabled", props: { disabled: true } },
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
