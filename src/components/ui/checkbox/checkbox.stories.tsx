import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Checkbox, type CheckboxProps } from "./checkbox"

/* Two stories per component, matching the Figma page:
   - Playground — every property of the component as a control, mirroring the
     "Current variant" panel of `ELK / checkbox`.
   - Matrix — the full State × Type table the spec sheet draws.

   `size` (Large/Desktop vs Medium/Mobile in Figma) is not a prop here: the
   component switches on the `md:` breakpoint, so it follows the viewport
   toolbar rather than a control. */

type PlaygroundArgs = CheckboxProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  argTypes: {
    // `label`/`comment`/`error` are all `React.ReactNode` but every usage
    // here is a plain string — without this, leaving one unset falls back to
    // a generic "Set object" JSON editor.
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    indeterminate: false,
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// Checkbox is controlled, so the Playground owns its own `checked` state to
// stay clickable — but the `checked` control still overrides it when set, so
// the arg isn't decorative.
function Controlled({
  state,
  checked,
  ...props
}: CheckboxProps & { state?: PlaygroundState }) {
  const [internal, setInternal] = useState(false)
  return (
    <PseudoBox state={state}>
      <Checkbox
        {...props}
        checked={checked ?? internal}
        onCheckedChange={setInternal}
      />
    </PseudoBox>
  )
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

/* Дизайн-чек №18: третья история — «Interactive».

   «Сейчас проблема в том, что, например, для компонента Это чекбокс, нельзя
   проверить зависимости. К примеру, нет списка с вложенными чекбоксами, в
   котором можно было бы включить частично элементы из списка и увидеть, что
   верхний уровень чекбокса превращается в смешанный, как раз таки со значком
   минуса. Такую проверку произвести нельзя».

   Матрица показывает состояния по отдельности, Playground — один экземпляр.
   Ни там, ни там нельзя проверить связь «дети → родитель». Здесь можно:
   родитель считается из детей и сам ими управляет. */
const CHILDREN = [
  "Паспорт РФ",
  "СНИЛС",
  "ИНН",
  "Выписка ЕГРЮЛ",
]

function NestedCheckboxes() {
  const [checked, setChecked] = useState<boolean[]>([false, true, false, false])

  const checkedCount = checked.filter(Boolean).length
  const allChecked = checkedCount === checked.length
  // Родитель «смешанный», пока выбрана часть детей — тот самый минус.
  const indeterminate = checkedCount > 0 && !allChecked

  return (
    <div className="flex w-100 flex-col gap-4">
      <Checkbox
        label="Все документы"
        comment={
          checkedCount === 0
            ? "Ничего не выбрано"
            : `Выбрано: ${checkedCount} из ${checked.length}`
        }
        checked={allChecked || indeterminate}
        indeterminate={indeterminate}
        // Клик по родителю: пока выбрано не всё — выбираем всё, и только из
        // состояния «выбрано всё» снимаем. Поэтому смотрим на `allChecked`,
        // а не на `next`: из смешанного состояния Base UI присылает `false`,
        // и по нему родитель бы очищал список вместо того, чтобы дозаполнить.
        onCheckedChange={() => setChecked(checked.map(() => !allChecked))}
      />
      <div className="flex flex-col gap-4 pl-10">
        {CHILDREN.map((label, index) => (
          <Checkbox
            key={label}
            label={label}
            checked={checked[index]}
            onCheckedChange={(next) =>
              setChecked(checked.map((v, i) => (i === index ? next : v)))
            }
          />
        ))}
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: "Interactive",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => <NestedCheckboxes />,
}

/* Cell shape: `on` is the row's checked-ness and `partial` the column's
   representation of it, so the Default/Hover/Disabled rows stay empty in
   both columns exactly as the spec sheet draws them (passing
   `indeterminate` directly would put a dash in every Partial cell). */
type Cell = Omit<CheckboxProps, "checked" | "indeterminate"> & {
  on?: boolean
  partial?: boolean
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<Cell>
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ label: "Option Text", comment: "Comment" }}
      columns={[
        { label: "Checked", props: {} },
        { label: "Partial", props: { partial: true } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Checked\nPressed", props: { on: true }, pseudo: "active" },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Checked\nHover", props: { on: true }, pseudo: "hover" },
        { label: "Disabled", props: { disabled: true } },
        { label: "Checked\nDisabled", props: { on: true, disabled: true } },
        { label: "Error", props: { error: "Text about error here" } },
      ]}
      render={({ on, partial, ...props }) => (
        <Checkbox
          {...props}
          checked={Boolean(on)}
          indeterminate={Boolean(on && partial)}
          onCheckedChange={() => {}}
        />
      )}
    />
  ),
}
