import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import { Item, type ItemProps, type RightElementType } from "./item"

const RIGHT_ELEMENTS: RightElementType[] = [
  "none",
  "navigation",
  "information",
  "accordion",
  "check",
  "text",
  "toggle",
  "checkbox",
]

const meta = {
  title: "Компоненты/Item",
  component: Item,
  parameters: { layout: "padded" },
  // `thumbnail` holds a JSX element (or the sentinel `true`, which renders
  // the component's own built-in `DefaultThumbnail`) — map a friendly
  // "None"/"Default" choice to `undefined`/`true` instead of disabling
  // the control (same technique as Button's `icon`).
  argTypes: {
    thumbnail: {
      control: { type: "select", labels: { none: "None", default: "Default" } },
      options: ["none", "default"],
      mapping: { none: undefined, default: true },
    },
    // `text`/`comment`/`informationText`/`rightText` are all `React.ReactNode`
    // but every usage is a plain string — without this, leaving one unset
    // falls back to a generic "Set object" JSON editor.
    text: { control: "text" },
    value: { control: "text" },
    comment: { control: "text" },
    informationText: { control: "text" },
    rightText: { control: "text" },
    commentColor: { control: "inline-radio", options: ["grey", "red", "yellow"] },
    rightElement: { control: "select", options: RIGHT_ELEMENTS },
    subCategory: { control: "boolean" },
    divider: { control: "boolean" },
    disabled: { control: "boolean" },
    // Only meaningful for rightElement="toggle" / "checkbox". The Playground
    // keeps them clickable through its own state, but setting the control
    // pins the value (same pattern as Checkbox's `checked`).
    toggleChecked: { control: "boolean" },
    checkboxChecked: { control: "boolean" },
  },
  args: {
    text: "Тип операции",
    value: "Перевод между счетами",
    rightElement: "none",
    subCategory: false,
    disabled: false,
    comment: "Comment",
    commentColor: "grey",
    informationText: "Дополнительная информация об операции",
    rightText: "+1,5%",
    divider: true,
  },
} satisfies Meta<ItemProps>

export default meta
type Story = StoryObj<ItemProps>

export const Playground: Story = {
  render: (args) => <InteractiveItem {...args} />,
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
