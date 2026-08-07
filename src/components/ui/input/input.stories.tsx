import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search } from "@/icons"

import { Input } from "./input"
import type { MaskName } from "./mask"

const meta = {
  title: "Interaction/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: { label: "Имя" },
  argTypes: {
    // `iconLeft`/`trailingIcon` take a JSX element instance, not a plain
    // value — no control widget can build a `<Search />` from scratch, so
    // (same as Button's `icon`) map a friendly "None"/"Search" choice to
    // the real element behind the scenes instead of disabling the control.
    iconLeft: {
      control: { type: "select", labels: { none: "None", search: "Search" } },
      options: ["none", "search"],
      mapping: { none: undefined, search: <Search /> },
    },
    trailingIcon: {
      control: { type: "select", labels: { none: "None", search: "Search" } },
      options: ["none", "search"],
      mapping: { none: undefined, search: <Search /> },
    },
    // `label`/`comment`/`error` are `React.ReactNode` but every usage is a
    // plain string — without this, leaving one unset falls back to a
    // generic "Set object" JSON editor.
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    // `mask` is a plain string union (`MaskName`, imported from ./mask) —
    // react-docgen can't resolve an imported type alias into an enum, so
    // it falls back to the same generic "Set object" editor. Pin the real
    // option list explicitly instead, same fix as Badge's `color`.
    mask: {
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
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: { size: "lg" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const WithComment: Story = {
  args: { comment: "Как указано в паспорте" },
}

export const WithError: Story = {
  args: { error: "Обязательное поле" },
}

export const WithLeadingIcon: Story = {
  args: { label: undefined, placeholder: "Поиск", iconLeft: <Search /> },
}

export const Password: Story = {
  args: { label: "Пароль", type: "password" },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Locked: Story = {
  args: { locked: true, defaultValue: "Только чтение" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Недоступно" },
}

export const MaskedAmount: Story = {
  args: { label: "Сумма", mask: "amount" },
}

export const MaskedDate: Story = {
  args: { label: "Дата", mask: "date" },
}

// ЧЧ:ММ — the separator is inserted for you, and the two halves are range
// masks, so 25 or :70 can't be typed in the first place.
export const MaskedTime: Story = {
  args: { label: "Время", mask: "time" },
}
