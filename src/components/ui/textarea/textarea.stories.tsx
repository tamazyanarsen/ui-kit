import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  viewportArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Textarea, type TextareaProps } from "./textarea"

type PlaygroundArgs = TextareaProps & {
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Text Area",
  component: Textarea,
  parameters: { layout: "padded" },
  // comment/error are typed React.ReactNode but every usage here is a plain
  // string — pin text controls so leaving one unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder. `rows` is a genuine
  // native `number` prop (inherited via `React.ComponentProps<"textarea">`),
  // but docgen loses the primitive type across that extends chain and falls
  // back to the same placeholder — pin it too.
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    // Дизайн-чек №3 №3: «Разбивка по числу строк в компоненте не нужна и не
    // должна быть предусмотрена, компонент имеет нужные размеры в фигме».
    // `rows` остаётся нативным атрибутом textarea, но контролом его больше
    // не выставляем: высоту задаёт мастер (98px Mobile / 112px Desktop).
    rows: { table: { disable: true } },
    locked: { control: "boolean", name: "Lock Input" },
    lockedHint: { control: "text", name: "Причина блокировки" },
    // Дизайн-чек 3/3 №19: тогл иконки «i» в строке комментария.
    showCommentIcon: { control: "boolean", name: "Show Comment Icon" },
    commentHint: { control: "text", name: "Текст по клику на «i»" },
    disabled: { control: "boolean" },
    state: stateArgType,
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в
    // панели истории, а не изменением размера вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    label: "Label",
    placeholder: "Placeholder",
    comment: "Comment",
    locked: false,
    lockedHint: "Поле заполняется автоматически и не редактируется",
    showCommentIcon: false,
    commentHint: "Дополнительная информация по полю",
    disabled: false,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

/* Дизайн-чек 3/3 №18: у Lock Input в спеке (52140:162555) написано «всегда
   заполнено» — пустое заблокированное поле состояния не показывает. Поэтому
   при включённом `locked` в Playground подставляется текст; `key` заставляет
   поле перемонтироваться, иначе неуправляемая textarea сохранила бы старое
   значение при переключении контрола. */
const LOCKED_VALUE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"

export const Playground: Story = {
  render: ({ state, viewport, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-96">
      <Textarea
        key={args.locked ? "locked" : "editable"}
        {...args}
        defaultValue={args.locked ? LOCKED_VALUE : undefined}
      />
    </PseudoBox>
  ),
}

/* Дизайн-чек №3 №3: «Матрица textarea не совпадает с figma. Нужна
   классическая разбивка desktop/mobile. Разбивка по числу строк в
   компоненте не нужна».

   Компонент-сет `ELK / text-area` (137:2618) варьируется по четырём осям:
   Size (Desktop / Mobile), State (Default / Hover / Focused / Disabled),
   Type (Empty / Filled / Locked) и Add (None / Comment / Error). Разложены
   они здесь ровно так же, как на листе: State — колонки, Type × Add —
   строки, Size — две матрицы рядом. */
const STATES: { label: string; props: Partial<TextareaProps>; pseudo?: "hover" | "focus-within" }[] = [
  { label: "Default", props: {} },
  { label: "Hover", props: {}, pseudo: "hover" },
  { label: "Focused", props: {}, pseudo: "focus-within" },
  { label: "Disabled", props: { disabled: true } },
]

const TYPES: { label: string; props: Partial<TextareaProps> }[] = [
  { label: "Empty", props: {} },
  { label: "Filled", props: { defaultValue: "Value" } },
  { label: "Locked", props: { locked: true, defaultValue: "Value" } },
]

const ADDS: { label: string; props: Partial<TextareaProps> }[] = [
  { label: "Add: None", props: {} },
  { label: "Add: Comment", props: { comment: "Comment" } },
  { label: "Add: Error", props: { error: "Text about error here" } },
]

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<TextareaProps>
      stretch
      cellClassName="min-w-80"
      responsive
      baseProps={{ label: "Label", placeholder: "Placeholder" }}
      columns={STATES.map(({ label, props, pseudo }) => ({ label, props, pseudo }))}
      rows={ADDS.flatMap((add) =>
        TYPES.map((type) => ({
          label: `${add.label}\n${type.label}`,
          props: { ...add.props, ...type.props },
        }))
      )}
      render={(props) => <Textarea {...props} />}
    />
  ),
}
