import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Item } from "./item"

const meta = {
  title: "Content/Item/Item",
  component: Item,
  parameters: { layout: "padded" },
  args: { text: "Тип операции", value: "Перевод между счетами" },
  argTypes: { thumbnail: { control: false } },
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
