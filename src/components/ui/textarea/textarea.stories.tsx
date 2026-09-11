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

import { Textarea, type TextareaProps } from "./textarea"

/* Панель повторяет «Свойства компонента» `ELK / text-area` (компонент-сет
   137:2618, таблица 1246:205583): Size / State / Type / Add /
   Show Error Text / Scrollbar. */
const TYPE_LABELS = {
  empty: "Empty",
  filled: "Filled",
  locked: "Locked",
} as const
type FigmaType = keyof typeof TYPE_LABELS

const ADD_LABELS = {
  none: "None",
  error: "Error",
  comment: "Comment",
} as const
type FigmaAdd = keyof typeof ADD_LABELS

type PlaygroundArgs = Omit<TextareaProps, "error"> & {
  state?: PlaygroundState
  viewport?: Viewport
  figmaType?: FigmaType
  add?: FigmaAdd
  errorText?: string
  showErrorText?: boolean
  scrollbar?: boolean
}

const meta = {
  title: "Компоненты/Text Area",
  component: Textarea,
  parameters: { layout: "padded" },
  argTypes: {
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в
    // панели истории, а не изменением размера вьюпорта.
    viewport: sizeArgType,
    // Disabled в Figma — значение оси State, Hover/Focused — псевдоклассы.
    state: stateArgTypeOf(["default", "hover", "focus", "disabled"], {
      focus: "Focused",
    }),
    figmaType: optionsArgType<FigmaType>("Type", TYPE_LABELS, "inline-radio"),
    add: optionsArgType<FigmaAdd>("Add", ADD_LABELS, "inline-radio"),
    showErrorText: toggleArgType("Show Error Text"),
    // В Figma `Scrollbar` — отдельное свойство, потому что полоса нарисована
    // вложенным инстансом. В коде она появляется сама, когда текст не влез,
    // поэтому контрол подставляет заведомо длинное значение.
    scrollbar: toggleArgType(
      "Scrollbar",
      "Заполнить поле текстом, который не помещается, — чтобы показать полосу прокрутки"
    ),
    // Дизайн-чек 3/3 №19: тогл иконки «i» в строке комментария. В панели
    // Figma его нет — иконка там нарисована слоем внутри строки Comment.
    showCommentIcon: { control: "boolean", name: "Show Comment Icon" },
    label: { control: "text", table: { category: "Контент" } },
    placeholder: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    errorText: { control: "text", table: { category: "Контент" } },
    lockedHint: { control: "text", table: { category: "Контент" } },
    commentHint: { control: "text", table: { category: "Контент" } },
    // Дизайн-чек №3 №3: «Разбивка по числу строк в компоненте не нужна и не
    // должна быть предусмотрена, компонент имеет нужные размеры в фигме».
    // `rows` остаётся нативным атрибутом textarea, но контролом его больше
    // не выставляем: высоту задаёт мастер (98px Mobile / 112px Desktop).
    rows: { table: { disable: true } },
    // Значения осей Type и State — отдельных контролов у них нет.
    locked: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    figmaType: "empty" as FigmaType,
    add: "none" as FigmaAdd,
    showErrorText: true,
    scrollbar: false,
    showCommentIcon: false,
    label: "Label",
    placeholder: "Placeholder",
    comment: "Comment",
    errorText: "Text about error here",
    lockedHint: "Поле заполняется автоматически и не редактируется",
    commentHint: "Дополнительная информация по полю",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

/* Дизайн-чек 3/3 №18: у Lock Input в спеке (52140:162555) написано «всегда
   заполнено» — пустое заблокированное поле состояния не показывает. Поэтому
   при Type=Locked в Playground подставляется текст; `key` заставляет поле
   перемонтироваться, иначе неуправляемая textarea сохранила бы старое
   значение при переключении контрола. */
const LOCKED_VALUE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"

const OVERFLOW_VALUE = [LOCKED_VALUE, LOCKED_VALUE, LOCKED_VALUE].join(" ")

export const Playground: Story = {
  render: ({
    state,
    viewport,
    figmaType = "empty",
    add = "none",
    errorText,
    showErrorText,
    scrollbar,
    comment,
    ...args
  }) => {
    const value = scrollbar
      ? OVERFLOW_VALUE
      : figmaType === "empty"
        ? undefined
        : LOCKED_VALUE
    return (
      <PseudoBox state={state} viewport={viewport} className="w-96">
        <Textarea
          key={`${figmaType}-${scrollbar}`}
          {...args}
          defaultValue={value}
          locked={figmaType === "locked"}
          disabled={state === "disabled"}
          comment={add === "comment" ? comment : undefined}
          error={
            add === "error"
              ? showErrorText
                ? errorText || true
                : true
              : undefined
          }
        />
      </PseudoBox>
    )
  },
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
