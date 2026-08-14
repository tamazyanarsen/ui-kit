import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import { Chips, type ChipsProps } from "./chips"

const meta = {
  title: "Компоненты/Chips",
  component: Chips,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    subtitle: { control: "text" },
    count: { control: { type: "number", min: 0, max: 99 } },
    closable: { control: "boolean" },
    // Дизайн-чек №19: состояние «выбрана» (State=Active в макете).
    selected: { name: "Выбрана", control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Значение",
    subtitle: "",
    closable: false,
    selected: false,
    disabled: false,
  },
} satisfies Meta<ChipsProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ChipsProps>
      rowHeader={RESPONSIVE_NOTE}
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
