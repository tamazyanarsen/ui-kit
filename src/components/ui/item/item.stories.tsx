import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import { Item, type ItemProps, type RightElementType } from "./item"

/* Дизайн-чек №33: «набор атрибутов компонента Item не соответствует
   таковому в Figma… необходимо привести атрибуты в Storybook в соответствие
   с тем, как это оформлено в Figma, чтобы можно было проверять компоненты».

   Компонент-сет «ELK / item» (нода 31845:82730) объявляет ровно пять
   свойств, и все они теперь есть в контролах под своими именами:

     State        = Default | Disabled            → `disabled`
     Type         = Value | Thumbneil             → `thumbnail`
     Сonclusion   = False | True                  → строка `text` над Value
     Sub Сategory = False | True                  → `subCategory`
     Text Color   = Grey | Red | Yellow           → `commentColor`

   Плюс два булевых слота самого мастера — `showComment` и
   `showRightElement` — и вложенный сет «Right Element (Desktop, ELK)»
   (нода 31845:85324) со своими семью значениями.

   Заодно исправлено имя: наш `accordion` — это Figma-шный `Select`
   (нода 31845:85333 рисует ровно `icon / arrow down chevron`), так что
   значение переименовано, чтобы список совпадал с макетом. `none` —
   единственное добавленное сверх Figma значение: в макете правый элемент
   выключается отдельным булевым слотом, а у нас это его же список. */
const RIGHT_ELEMENTS: RightElementType[] = [
  "none",
  "check",
  "text",
  "navigation",
  "information",
  "select",
  "checkbox",
  "toggle",
]

const FIGMA_TYPES = ["Value", "Thumbneil"] as const
type FigmaType = (typeof FIGMA_TYPES)[number]

type PlaygroundArgs = ItemProps & {
  figmaType?: FigmaType
  conclusion?: boolean
  showComment?: boolean
  showRightElement?: boolean
}

const meta = {
  title: "Компоненты/Item",
  component: Item,
  parameters: { layout: "padded" },
  // `thumbnail` holds a JSX element (or the sentinel `true`, which renders
  // the component's own built-in `DefaultThumbnail`) — map a friendly
  // "None"/"Default" choice to `undefined`/`true` instead of disabling
  // the control (same technique as Button's `icon`).
  argTypes: {
    // Type в Figma — это наличие тумбнейла: Value (без) / Thumbneil (с).
    figmaType: {
      name: "Type",
      description: "Свойство Type компонента ELK / item",
      control: "inline-radio",
      options: FIGMA_TYPES,
    },
    thumbnail: { table: { disable: true } },
    // Сonclusion=True добавляет строку Text над Value (P2 Medium над P1
    // Medium) — сверено на нодах 31845:82731 (True) и 31845:85106 (False).
    conclusion: {
      name: "Сonclusion",
      description: "Строка Text над значением",
      control: "boolean",
    },
    showComment: { name: "Comment", control: "boolean" },
    showRightElement: { name: "Right Element", control: "boolean" },
    // `text`/`comment`/`informationText`/`rightText` are all `React.ReactNode`
    // but every usage is a plain string — without this, leaving one unset
    // falls back to a generic "Set object" JSON editor.
    text: { control: "text" },
    value: { control: "text" },
    comment: { control: "text" },
    informationText: { control: "text" },
    rightText: { control: "text" },
    commentColor: {
      name: "Text Color",
      control: "inline-radio",
      options: ["grey", "red", "yellow"],
    },
    rightElement: {
      name: "Right Element / Type",
      control: "select",
      options: RIGHT_ELEMENTS,
    },
    subCategory: { name: "Sub Сategory", control: "boolean" },
    divider: { control: "boolean" },
    disabled: { name: "State: Disabled", control: "boolean" },
    // Only meaningful for rightElement="toggle" / "checkbox". The Playground
    // keeps them clickable through its own state, but setting the control
    // pins the value (same pattern as Checkbox's `checked`).
    toggleChecked: { control: "boolean" },
    checkboxChecked: { control: "boolean" },
  },
  args: {
    figmaType: "Value",
    conclusion: true,
    text: "Тип операции",
    value: "Перевод между счетами",
    rightElement: "navigation",
    showRightElement: true,
    subCategory: false,
    disabled: false,
    showComment: true,
    comment: "Comment",
    commentColor: "grey",
    informationText: "Дополнительная информация об операции",
    rightText: "+1,5%",
    divider: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    figmaType,
    conclusion,
    showComment,
    showRightElement,
    text,
    comment,
    rightElement,
    ...args
  }) => (
    <InteractiveItem
      {...args}
      thumbnail={figmaType === "Thumbneil" ? true : undefined}
      text={conclusion ? text : undefined}
      comment={showComment ? comment : undefined}
      rightElement={showRightElement ? rightElement : "none"}
    />
  ),
}

// Keeps the toggle/checkbox right-elements clickable, while still letting
// the `toggleChecked`/`checkboxChecked` controls pin a value when set.
function InteractiveItem({ toggleChecked, checkboxChecked, ...props }: ItemProps) {
  const [toggle, setToggle] = useState(true)
  const [checkbox, setCheckbox] = useState(false)
  return (
    <Item
      {...props}
      toggleChecked={toggleChecked ?? toggle}
      onToggleChange={setToggle}
      checkboxChecked={checkboxChecked ?? checkbox}
      onCheckboxChange={setCheckbox}
    />
  )
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Right Element is Figma's own variant axis. */}
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[280px]"
        rowHeader={RESPONSIVE_NOTE}
        baseProps={{
          text: "Title",
          value: "Value",
          informationText: "Дополнительная информация",
          rightText: "+1,5%",
        }}
        columnGroups={[
          {
            label: "Right Element",
            columns: RIGHT_ELEMENTS.map((rightElement) => ({
              label: rightElement,
              props: { rightElement },
            })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "С миниатюрой", props: { thumbnail: true } },
          { label: "Sub category", props: { subCategory: true } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <InteractiveItem {...props} />}
      />

      {/* Comment colour and the value-only form are independent of the
          right element. */}
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[320px]"
        baseProps={{ text: "Title", value: "Value" }}
        columns={[
          { label: "Comment: grey", props: { comment: "Comment", commentColor: "grey" } },
          { label: "Comment: red", props: { comment: "Comment", commentColor: "red" } },
          { label: "Comment: yellow", props: { comment: "Comment", commentColor: "yellow" } },
        ]}
        rows={[
          { label: "С заголовком", props: {} },
          // Value-only: the row collapses to a single line.
          { label: "Только значение", props: { text: undefined } },
          {
            // The spec's "Максимальное количество строк" rule: Value wraps
            // to at most 3 lines and Comment to 5, both elided after that.
            label: "Длинный текст\n(3 / 5 строк)",
            props: {
              value:
                "Пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов",
              comment:
                "Пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов",
            },
          },
        ]}
        render={(props) => <Item {...props} />}
      />
    </div>
  ),
}
