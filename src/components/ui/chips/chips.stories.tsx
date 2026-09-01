import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  iconArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Chips, type ChipsProps } from "./chips"

/* Панель «Свойства компонента» компонент-сета «ELK / chips, filter»
   (таблица 54887:28874):

     Size        Desktop, Mobile
     State       Default, Hover, Active, Active (Hover), Disabled
     Type        Filter (White), Filter Headline (White), Filter (Grey),
                 Filter Headline (Grey), Chips
     Show Count  True, False
     Show Icon   True, False
     Show Select True, False

   Дизайн-чек Storybook (Аня Багрова) №23 просит привести панель контролов к
   этому списку. Двух свойств здесь нет, и обоих — по делу:

   • «Type» — в коде сет разложен на два компонента, и Chips это ровно
     значение Type=Chips. Четыре значения «Filter …» — компонент Filter со
     свойством «Фон» (white / grey); об этом отдельно рассказывает история
     «Белая / серая и обводка — см. Filter» ниже.
   • «Show Select» — шеврон вызова Dropdown, он есть только у типов Filter:
     у чипсы выпадающего списка нет, значение с неё снимается крестиком
     (контрол «Крестик»).
*/

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
    showCount: toggleArgType("Show Count"),
    icon: {
      ...iconArgType("Вспомогательная иконка слева от значения"),
      name: "Show Icon",
    },
    // Дизайн-чек №19: состояние «выбрана» (State=Active в макете).
    selected: { name: "Выбрана", control: "boolean" },
    closable: { name: "Крестик", control: "boolean" },
    children: { control: "text", ...CONTENT },
    subtitle: { control: "text", ...CONTENT },
    count: { control: { type: "number", min: 0, max: 99 }, ...CONTENT },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
    onRemove: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    showCount: true,
    selected: false,
    closable: false,
    children: "Значение",
    subtitle: "",
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
  ),
}

/* Дизайн-чек №20 просит показать чипсу «в состоянии белый или серый цвет» и
   «в выбранном состоянии, когда у неё брендовая обводка». В Figma это один
   компонент-сет с Chips — «ELK / chips, filter» (нода 54887:29179), — но
   белый/серый и обводка живут на типах `Filter (White)` / `Filter (Grey)`,
   а не на `Type=Chips`: у последнего Default это grey-109, а Hover, Active и
   Active (Hover) — одинаковый grey-114 без рамки.

   Поэтому здесь стоит ссылка, а сама матрица белый/серый × выбрано лежит в
   истории Filter — иначе, ища эти состояния под именем «Chips», их можно не
   найти вовсе. */
export const WhiteGreyNote: Story = {
  name: "Белая / серая и обводка — см. Filter",
  parameters: { layout: "centered", controls: { disable: true } },
  render: () => (
    <p className="max-w-125 text-p1-regular text-[#252628]">
      Белый и серый варианты, а также выбранное состояние с брендовой обводкой
      относятся к типам <b>Filter (White)</b> и <b>Filter (Grey)</b> того же
      компонент-сета Figma «ELK / chips, filter». В сборке они лежат в
      компоненте <b>Filter</b> — свойство «Фон» (белый / серый) и состояние с
      выбранным значением.
    </p>
  ),
}
