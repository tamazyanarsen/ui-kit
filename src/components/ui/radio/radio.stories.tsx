import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Radio, type RadioProps } from "./radio"
import { RadioGroup } from "./root"

type PlaygroundArgs = RadioProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    value: "a",
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// A Radio only means anything inside a RadioGroup (it's the group that owns
// the selected value), so the Playground wraps a single one in its own
// group and keeps it clickable.
function Controlled({ state, ...props }: PlaygroundArgs) {
  const [value, setValue] = useState<unknown>(null)
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <PseudoBox state={state}>
        <Radio {...props} />
      </PseudoBox>
    </RadioGroup>
  )
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

// Группа из нескольких радио — здесь проверяется собственно групповое
// поведение, которого не видно на одиночном Playground: выбор одной опции
// снимает выбор с остальных («включение одной означает отключение другой»
// из спеки), disabled-опция не выбирается и пропускается при переходе
// стрелками, а фокус внутри группы roving (Tab входит/выходит одним шагом).
// Текущее значение выведено под группой, чтобы переключение было видно.
function GroupDemo() {
  const [value, setValue] = useState<unknown>("card")

  return (
    <div className="flex flex-col gap-8">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        items={[
          {
            value: "card",
            label: "Списать с карты",
            comment: "MIR •• 4417",
          },
          {
            value: "account",
            label: "Списать со счёта",
            comment: "40817 810 0 9991 0004312",
          },
          {
            value: "sbp",
            label: "Через СБП",
            comment: "По номеру телефона",
          },
          {
            value: "credit",
            label: "В кредит",
            comment: "Недоступно для этой операции",
            disabled: true,
          },
        ]}
      />
      <p className="text-p2-medium">
        Выбрано: <b>{String(value)}</b>
      </p>
    </div>
  )
}

export const Group: Story = {
  name: "Группа (переключение)",
  parameters: { controls: { disable: true } },
  render: () => <GroupDemo />,
}

type Cell = Omit<RadioProps, "value"> & { on?: boolean }

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<Cell>
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ label: "Option Text", comment: "Comment" }}
      columns={[{ label: "Radio" }]}
      rows={[
        { label: "Default", props: {} },
        { label: "Checked\nPressed", props: { on: true }, pseudo: "active" },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Checked\nHover", props: { on: true }, pseudo: "hover" },
        { label: "Disabled", props: { disabled: true } },
        { label: "Checked\nDisabled", props: { on: true, disabled: true } },
        { label: "Error", props: { error: "Text about error here" } },
      ]}
      /* Each cell is its own single-item group so the checked/unchecked
         rows can coexist — one shared group would allow only one. */
      render={({ on, ...props }) => (
        <RadioGroup value={on ? "a" : null}>
          <Radio {...props} value="a" />
        </RadioGroup>
      )}
    />
  ),
}
