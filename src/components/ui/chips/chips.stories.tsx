import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  iconArgType,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Chips, type ChipsProps, type ChipsType } from "./chips"

/* Панель «Свойства компонента» компонент-сета «ELK / chips, filter»
   (таблица 54887:28874):

     Size        Desktop, Mobile
     State       Default, Hover, Active, Active (Hover), Disabled
     Type        Filter (White), Filter Subtitle (White), Filter (Grey),
                 Filter Subtitle (Grey), Chips
     Show Count  True, False
     Show Icon   True, False
     Show Select True, False

   Дизайн-чек Storybook (Аня Багрова) №23. С прошлого прохода в панели не
   было `Type` и `Show Select`: в коде жило только `Type=Chips`, а белый и
   серый вид считались чужими. Теперь все пять значений — один контрол и
   один компонент: в макете это одна коробка, отличаются заливка, строка
   подписи и шеврон (подробности — в шапке chips.tsx).

   Имена значений взяты из имён символов сета (`Filter Subtitle …`), а не из
   таблицы свойств: там то же свойство подписано `Filter Headline`, но
   символы называются Subtitle, и рисуются именно они.

   `Filter` остаётся отдельным компонентом: он про поведение (поповер,
   выбранное значение, сброс), а не про вид пилюли. */
const TYPE_LABELS: Record<ChipsType, string> = {
  "filter-white": "Filter (White)",
  "filter-subtitle-white": "Filter Subtitle (White)",
  "filter-grey": "Filter (Grey)",
  "filter-subtitle-grey": "Filter Subtitle (Grey)",
  chips: "Chips",
}

const TYPES = Object.keys(TYPE_LABELS) as ChipsType[]

// Hover и нажатие нельзя выставить пропом, поэтому их даёт `state` через
// PseudoBox; Active — это `selected`, Disabled — `disabled`.
type PlaygroundArgs = ChipsProps & {
  state?: PlaygroundState
  viewport?: Viewport
  showCount?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Chips",
  component: Chips,
  parameters: { layout: "centered" },
  argTypes: {
    viewport: sizeArgType,
    // «Active (Hover)» из макета — это selected + псевдокласс hover, то
    // есть пара контролов State + «Выбрана», а не отдельное значение списка.
    state: stateArgTypeOf(["default", "hover", "active", "disabled"]),
    type: optionsArgType("Type", TYPE_LABELS),
    showCount: toggleArgType("Show Count"),
    icon: {
      ...iconArgType("Вспомогательная иконка справа от значения"),
      name: "Show Icon",
    },
    showSelect: toggleArgType(
      "Show Select",
      "Шеврон вызова Dropdown. В макете есть только у типов Filter: с чипсы значение снимается крестиком"
    ),
    // Дизайн-чек №19: состояние «выбрана» (State=Active в макете).
    selected: { name: "Выбрана", control: "boolean" },
    closable: { name: "Крестик", control: "boolean" },
    children: { control: "text", ...CONTENT },
    subtitle: { control: "text", ...CONTENT },
    count: { control: { type: "number", min: 0, max: 99 }, ...CONTENT },
    disabled: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    type: "chips" as ChipsType,
    showCount: true,
    showSelect: false,
    selected: false,
    closable: false,
    children: "Значение",
    subtitle: "Подпись",
    count: 5,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, showCount, count, ...args }) => (
    <PseudoBox state={state} viewport={viewport}>
      <Chips
        {...args}
        count={showCount ? count : undefined}
        disabled={state === "disabled"}
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Ось Type × ось State — ровно так разложен и сам компонент-сет. */}
      <StatesMatrix<ChipsProps>
        responsive
        baseProps={{ children: "Значение", subtitle: "Подпись" }}
        columnGroups={[
          {
            label: "Type",
            columns: TYPES.map((type) => ({
              label: TYPE_LABELS[type],
              props: { type, showSelect: type !== "chips" },
            })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Active", props: { selected: true } },
          {
            label: "Active (Hover)",
            props: { selected: true },
            pseudo: "hover",
          },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Chips {...props} />}
      />

      {/* Состав строки — на `Type=Chips`, где сет рисует её целиком. */}
      <StatesMatrix<ChipsProps>
        responsive
        baseProps={{ children: "Значение" }}
        columns={[
          { label: "Текст", props: {} },
          { label: "+ подпись", props: { subtitle: "Подпись" } },
          { label: "+ счётчик", props: { count: 5 } },
          { label: "+ крестик", props: { closable: true } },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Pressed", props: {}, pseudo: "active" },
          // Дизайн-чек №19: «не хватает состояния выбранной чипсы».
          { label: "Выбрана (Active)", props: { selected: true } },
          {
            label: "Выбрана + Hover",
            props: { selected: true },
            pseudo: "hover",
          },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Chips {...props} onRemove={() => {}} />}
      />
    </div>
  ),
}
