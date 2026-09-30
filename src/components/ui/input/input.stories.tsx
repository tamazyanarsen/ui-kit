import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search } from "@/icons"

import {
  PseudoBox,
  iconArgType,
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Input, type InputProps } from "./input"
import type { MaskName } from "./mask"

/* Панель повторяет «Свойства компонента» `ELK / input`: Size / State /
   Type / Add / Show Error Text / Mask.

   `Size` в Figma — одно свойство с четырьмя значениями: размер (L/S) и форма
   (Desktop/Mobile) там не разъезжаются, в коде это пара `size` +
   <ViewportScope>. `Type` (Empty / Filled / Locked) и `Add` (None / Comment /
   Error) в коде тоже собираются из нескольких пропов, поэтому контрол один,
   а раскладывает его `render`. */
const SIZE_LABELS = {
  "lg-desktop": "L / Desktop",
  "lg-mobile": "L / Mobile",
  "sm-desktop": "S / Desktop",
  "sm-mobile": "S / Mobile",
} as const
type FigmaSize = keyof typeof SIZE_LABELS

const TYPE_LABELS = {
  empty: "Empty",
  filled: "Filled",
  locked: "Locked",
} as const
type FigmaType = keyof typeof TYPE_LABELS

const ADD_LABELS = {
  none: "None",
  comment: "Comment",
  error: "Error",
} as const
type FigmaAdd = keyof typeof ADD_LABELS

type PlaygroundArgs = Omit<InputProps, "size" | "error"> & {
  state?: PlaygroundState
  viewport?: Viewport
  figmaSize?: FigmaSize
  figmaType?: FigmaType
  add?: FigmaAdd
  errorText?: string
  showErrorText?: boolean
}

const meta = {
  title: "Компоненты/Input",
  component: Input,
  parameters: { layout: "padded" },
  argTypes: {
    figmaSize: optionsArgType<FigmaSize>("Size", SIZE_LABELS),
    // Disabled в Figma — значение оси State, а Hover/Focused — псевдоклассы.
    state: stateArgTypeOf(["default", "hover", "focus", "disabled"], {
      focus: "Focused",
    }),
    figmaType: optionsArgType<FigmaType>("Type", TYPE_LABELS, "inline-radio"),
    add: optionsArgType<FigmaAdd>("Add", ADD_LABELS, "inline-radio"),
    showErrorText: toggleArgType("Show Error Text"),
    // Comment & Icon / Error Input & Icon: значок «i» в строке подписи. В
    // панели Figma его нет — он нарисован слоем внутри строки Comment/Error.
    showCommentIcon: { control: "boolean", name: "Show Comment Icon" },
    // `mask` — обычное строковое объединение (`MaskName`, импортированное
    // из ./mask), а react-docgen не умеет разрешить импортированный
    // псевдоним типа в перечисление и откатывается на тот же универсальный
    // редактор «Set object». Вместо этого список значений задан явно — та
    // же правка, что и с `color` у Badge.
    mask: {
      name: "Mask",
      control: "select",
      options: [
        "phone",
        "date",
        "passport",
        "foreign-passport",
        "card",
        "account",
        "inn",
        "kpp",
        "kbk",
        "amount",
        "time",
      ] satisfies MaskName[],
    },
    // Ниже — то, чего в панели Figma нет: у макета иконки и очистка живут
    // отдельными вложенными инстансами, а не свойствами компонент-сета.
    // `iconLeft`/`trailingIcon` — готовые JSX-узлы, значением из контрола
    // их не набрать. В Figma это instance swap, поэтому контрол даёт весь
    // набор кита, а не пару заготовленных вариантов (см. iconArgType).
    iconLeft: iconArgType("Иконка слева от значения"),
    trailingIcon: iconArgType("Иконка справа, перед крестиком очистки"),
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    type: { control: "select", options: ["text", "password", "number"] },
    // `label`, `comment` и `error` объявлены как `React.ReactNode`, но
    // везде используются обычными строками. Без этого незаданное значение
    // откатывается на универсальный JSON-редактор «Set object».
    label: { control: "text", table: { category: "Контент" } },
    placeholder: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    errorText: { control: "text", table: { category: "Контент" } },
    lockedHint: { control: "text", table: { category: "Контент" } },
    commentHint: { control: "text", table: { category: "Контент" } },
    // Значения осей Type и State — отдельных контролов у них нет.
    locked: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    figmaSize: "lg-desktop" as FigmaSize,
    state: "default" as PlaygroundState,
    figmaType: "empty" as FigmaType,
    add: "none" as FigmaAdd,
    showErrorText: true,
    showCommentIcon: false,
    clearable: false,
    loading: false,
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

const FILLED_VALUE = "Value"

export const Playground: Story = {
  render: ({
    state,
    figmaSize = "lg-desktop",
    figmaType = "empty",
    add = "none",
    errorText,
    showErrorText,
    comment,
    ...args
  }) => {
    const [size, viewport] = figmaSize.split("-") as [
      NonNullable<InputProps["size"]>,
      Viewport,
    ]
    return (
      <PseudoBox state={state} viewport={viewport} emulateFocus className="w-80">
        <Input
          // Поле неуправляемое: без `key` переключение Type не сбрасывает
          // уже набранное значение и «Empty» остаётся заполненным.
          key={figmaType}
          {...args}
          size={size}
          defaultValue={figmaType === "empty" ? undefined : FILLED_VALUE}
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

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<InputProps>
      stretch
      cellClassName="min-w-72"
      responsive
      baseProps={{ label: "Label", placeholder: "Placeholder" }}
      columns={[
        { label: "L (default)", props: { size: "lg" } },
        { label: "S", props: { size: "sm" } },
        {
          label: "L + иконки",
          props: {
            size: "lg",
            iconLeft: <Search />,
            clearable: true,
            defaultValue: "Value",
          },
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Focus", props: {}, pseudo: ["focus", "focus-within"] },
        { label: "Filled", props: { defaultValue: "Value" } },
        {
          label: "Comment",
          props: { defaultValue: "Value", comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: "Value", error: "Text about error here" },
        },
        {
          label: "Comment & Icon",
          props: { defaultValue: "Value", comment: "Comment", showCommentIcon: true },
        },
        {
          label: "Error Input & Icon",
          props: {
            defaultValue: "Value",
            error: "Text about error here",
            showCommentIcon: true,
          },
        },
        { label: "Loading", props: { loading: true } },
        {
          label: "Locked",
          props: { locked: true, defaultValue: "Value", lockedHint: "Поле недоступно" },
        },
        { label: "Disabled", props: { disabled: true, defaultValue: "Value" } },
      ]}
      render={(props) => <Input {...props} />}
    />
  ),
}

/* Маски — это поведение, а не состояние, поэтому им отведён свой холст, а
   не строка матрицы: в каждой из них можно печатать. */
export const Masks: Story = {
  name: "Маски ввода",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-4">
      {(
        [
          ["phone", "Телефон"],
          ["date", "Дата"],
          ["time", "Время (ЧЧ:ММ)"],
          ["passport", "Паспорт РФ"],
          ["foreign-passport", "Загранпаспорт"],
          ["card", "Номер карты"],
          ["account", "Счёт"],
          ["inn", "ИНН"],
          ["kpp", "КПП"],
          ["kbk", "КБК"],
          ["amount", "Сумма"],
        ] satisfies [MaskName, string][]
      ).map(([mask, label]) => (
        <Input key={mask} mask={mask} label={label} />
      ))}
    </div>
  ),
}
