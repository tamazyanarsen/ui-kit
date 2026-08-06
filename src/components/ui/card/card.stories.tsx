import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"
import type { TagColor } from "@/components/ui/tag"

import { Card } from "./card"

const meta = {
  title: "Content/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    // `tag` is `React.ReactNode` but every usage in this file is a plain
    // string — without this, leaving it unset falls back to a generic
    // "Set object" JSON editor.
    tag: { control: "text" },
    // `tagColor`/`paymentSystem` are plain string unions imported from
    // other modules (`TagColor`, `PaymentSystem`) — react-docgen can't
    // resolve an imported type alias into an enum, so both fall back to
    // the same generic "Set object" editor. Pin the real option lists
    // explicitly instead, same fix as Badge's `color`.
    tagColor: {
      control: "select",
      options: ["green", "orange", "red", "blue", "grey", "black", "white", "grey-info"] satisfies TagColor[],
    },
    paymentSystem: {
      control: "select",
      options: ["mir", "mastercard", "unionpay", "visa"] satisfies PaymentSystem[],
    },
    // `thumbnailNumber` is `React.ReactNode` but only ever demoed as a
    // plain string (see the CardThumbnail's own "last 4 digits" usage).
    thumbnailNumber: { control: "text" },
  },
  args: {
    title: "Основная карта",
    titleSuffix: "1135",
    subtitle: "**** 4482",
    value: "12 500 ₽",
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTag: Story = {
  args: { tag: "Новая" },
}

export const WithTagColor: Story = {
  args: { tag: "Требует внимания", tagColor: "red" },
}

export const PaymentSystems: Story = {
  // `paymentSystem` is fixed per mapped instance below, overriding
  // whatever the inherited control sets — every other control still works
  // (args is spread first), so only this one needs disabling.
  argTypes: { paymentSystem: { control: false } },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["mastercard", "visa", "mir", "unionpay"] as PaymentSystem[]).map((system) => (
        <Card key={system} {...args} paymentSystem={system} />
      ))}
    </div>
  ),
}

export const NoThumbnail: Story = {
  args: { showThumbnail: false },
}

export const Clickable: Story = {
  args: { onClick: () => alert("Card clicked") },
}

export const WithMenu: Story = {
  args: {
    menuItems: [
      { text: "Открыть карточку" },
      { text: "Удалить карту", disabled: false },
    ],
  },
}
