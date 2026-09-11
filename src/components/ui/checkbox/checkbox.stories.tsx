import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Checkbox, type CheckboxProps } from "./checkbox"

/* Two stories per component, matching the Figma page:
   - Playground — every property of the component as a control, mirroring the
     "Current variant" panel of `ELK / checkbox`.
   - Matrix — the full State × Type table the spec sheet draws.

   Панель Playground собрана по «Свойствам компонента» `ELK / checkbox`
   (компонент-сет 600:8876, таблица 1242:100003): Size / State / Checked /
   Partial / Error / Show Text / Show Comment. `size` (Desktop/Mobile в
   Figma) — это `viewport` + <ViewportScope>: дизайн-чек №3 №19, «пропс на
   мобайл должен быть в панели стори». */

type PlaygroundArgs = Omit<CheckboxProps, "error"> & {
  state?: PlaygroundState
  viewport?: Viewport
  error?: boolean
  errorText?: string
  showText?: boolean
  showComment?: boolean
}

const meta = {
  title: "Компоненты/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  argTypes: {
    viewport: sizeArgType,
    // Disabled в Figma — значение оси State, отдельного контрола у него нет.
    state: stateArgTypeOf(["default", "hover", "disabled"]),
    disabled: { table: { disable: true } },
    checked: { control: "boolean", name: "Checked" },
    indeterminate: { control: "boolean", name: "Partial" },
    error: { control: "boolean", name: "Error" },
    showText: toggleArgType("Show Text"),
    showComment: toggleArgType("Show Comment"),
    // `label`/`comment`/`error` are all `React.ReactNode` but every usage
    // here is a plain string — without this, leaving one unset falls back to
    // a generic "Set object" JSON editor.
    label: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    errorText: { control: "text", table: { category: "Контент" } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    checked: false,
    indeterminate: false,
    error: false,
    showText: true,
    showComment: true,
    label: "Согласен с условиями договора",
    comment: "Договор комплексного банковского обслуживания",
    errorText: "Text about error here",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// Checkbox is controlled, so the Playground owns its own `checked` state to
// stay clickable — but the `checked` control still overrides it when set, so
// the arg isn't decorative.
function Controlled({
  state,
  viewport,
  checked,
  label,
  comment,
  error,
  errorText,
  showText,
  showComment,
  ...props
}: PlaygroundArgs) {
  const [internal, setInternal] = useState(false)
  return (
    <PseudoBox state={state} viewport={viewport}>
      <Checkbox
        {...props}
        label={showText ? label : undefined}
        comment={showComment ? comment : undefined}
        error={error ? errorText : undefined}
        disabled={state === "disabled"}
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
      responsive
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
