import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Item } from "./item"

const meta = {
  title: "Content/Item/Item",
  component: Item,
  parameters: { layout: "padded" },
  args: { text: "Тип операции", value: "Перевод между счетами" },
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
    // (ValueOnly for text; every story but the one that sets each of the
    // others) falls back to a generic "Set object" JSON editor.
    text: { control: "text" },
    comment: { control: "text" },
    informationText: { control: "text" },
    rightText: { control: "text" },
  },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValueOnly: Story = {
  args: { text: undefined },
}

export const WithComment: Story = {
  args: { comment: "Ошибка при выполнении", commentColor: "red" },
}

export const WithThumbnail: Story = {
  args: { thumbnail: true },
}

// The spec's "Максимальное количество строк" rule: Value wraps to at most
// 3 lines and Comment to 5, both elided after that — not the single
// truncated line this used to render.
export const LongText: Story = {
  name: "Long text (line clamps)",
  // Narrow enough that the text actually reaches the 3rd/5th line and gets
  // elided — at full canvas width it would just wrap twice.
  decorators: [
    (Story) => (
      <div className="max-w-[360px]">
        <Story />
      </div>
    ),
  ],
  args: {
    value:
      "Пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов",
    comment:
      "Пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов",
    rightElement: "navigation",
  },
}

export const Navigation: Story = {
  args: { rightElement: "navigation", onClick: () => alert("navigate") },
}

export const RightText: Story = {
  args: { rightElement: "text", rightText: "+1,5%" },
}

export const Check: Story = {
  args: { rightElement: "check" },
}

function ToggleRow() {
  const [checked, setChecked] = useState(true)
  return (
    <Item
      value="Push-уведомления"
      rightElement="toggle"
      toggleChecked={checked}
      onToggleChange={setChecked}
    />
  )
}

export const Toggle: Story = {
  // ToggleRow hardcodes its own value/rightElement — every inherited
  // control is dead here.
  parameters: { controls: { disable: true } },
  render: () => <ToggleRow />,
}

function CheckboxRow() {
  const [checked, setChecked] = useState(false)
  return (
    <Item
      value="Выбрать строку"
      rightElement="checkbox"
      checkboxChecked={checked}
      onCheckboxChange={setChecked}
    />
  )
}

export const CheckboxRightElement: Story = {
  name: "Checkbox",
  // CheckboxRow hardcodes its own value/rightElement — every inherited
  // control is dead here.
  parameters: { controls: { disable: true } },
  render: () => <CheckboxRow />,
}

export const InformationTooltip: Story = {
  args: { rightElement: "information", informationText: "Дополнительная информация об операции" },
}

export const Disabled: Story = {
  args: { disabled: true, rightElement: "navigation" },
}

export const SubCategory: Story = {
  args: { subCategory: true },
}
