import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"
import type { TagColor } from "@/components/ui/tag"
import { StatesMatrix } from "@/stories/matrix"

import { Card, type CardProps } from "./card"

/* Дизайн-чек №17: количество пунктов меню «ещё» выбирается списком, а не
   правкой JSON-массива. Ноль — отдельный проверяемый случай: кнопка «ещё»
   при пустом списке не рисуется вовсе. */
const MENU_ITEM_POOL = [
  { text: "Открыть карточку" },
  { text: "Удалить карту" },
  { text: "Переименовать" },
]

const MENU_ITEM_COUNTS = [0, 1, 2, 3] as const
type MenuItemCount = (typeof MENU_ITEM_COUNTS)[number]

type PlaygroundArgs = CardProps & { menuItemsCount?: MenuItemCount }

const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "unionpay", "visa"]

const meta = {
  title: "Компоненты/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    titleSuffix: { control: "text" },
    subtitle: { control: "text" },
    value: { control: "text" },
    // `tag` is `React.ReactNode` but every usage is a plain string —
    // without this, leaving it unset falls back to a generic "Set object"
    // JSON editor.
    tag: { control: "text" },
    // `tagColor`/`paymentSystem` are plain string unions imported from other
    // modules (`TagColor`, `PaymentSystem`) — react-docgen can't resolve an
    // imported type alias into an enum, so both fall back to the same
    // generic "Set object" editor. Pin the real option lists explicitly
    // instead, same fix as Badge's `color`.
    tagColor: {
      control: "select",
      options: [
        "green",
        "orange",
        "red",
        "blue",
        "grey",
        "black",
        "white",
        "grey-info",
      ] satisfies TagColor[],
    },
    paymentSystem: { control: "select", options: PAYMENT_SYSTEMS },
    // `thumbnailNumber` is `React.ReactNode` but only ever demoed as a plain
    // string (see the CardThumbnail's own "last 4 digits" usage).
    // Дизайн-чек №15: окончание номера карты — обязательная часть
    // пиктограммы, поэтому в Playground оно задано по умолчанию.
    thumbnailNumber: { control: "text" },
    showThumbnail: { control: "boolean" },
    // Дизайн-чек №17: количество пунктов меню — списком. Ноль прячет
    // кнопку «ещё» целиком, что тоже надо уметь проверить.
    menuItemsCount: {
      name: "Пунктов в меню «ещё»",
      control: "select",
      options: MENU_ITEM_COUNTS,
    },
    menuItems: { table: { disable: true } },
  },
  args: {
    title: "Основная карта",
    titleSuffix: "1135",
    subtitle: "**** 4482",
    value: "12 500 ₽",
    showThumbnail: true,
    thumbnailNumber: '4482',
    tag: "Новая",
    tagColor: "green",
    paymentSystem: "mir",
    menuItems: MENU_ITEM_POOL.slice(0, 2),
    menuItemsCount: 2,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ menuItemsCount = 2, ...args }) => (
    <Card {...args} menuItems={MENU_ITEM_POOL.slice(0, menuItemsCount)} />
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<CardProps>
        stretch
        cellClassName="min-w-[300px]"
        baseProps={{
          title: "Основная карта",
          titleSuffix: "1135",
          subtitle: "**** 4482",
          value: "12 500 ₽",
        }}
        columns={[
          { label: "С миниатюрой", props: {} },
          { label: "Без миниатюры", props: { showThumbnail: false } },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: { onClick: () => {} }, pseudo: "hover" },
          { label: "С тегом", props: { tag: "Новая" } },
          {
            label: "С красным тегом",
            props: { tag: "Требует внимания", tagColor: "red" },
          },
          {
            label: "С меню",
            props: {
              menuItems: [{ text: "Открыть карточку" }, { text: "Удалить карту" }],
            },
          },
        ]}
        render={(props) => <Card {...props} />}
      />
      <StatesMatrix<CardProps>
        stretch
        cellClassName="min-w-[300px]"
        baseProps={{
          title: "Основная карта",
          subtitle: "**** 4482",
          value: "12 500 ₽",
        }}
        columnGroups={[
          {
            label: "Платёжные системы",
            columns: PAYMENT_SYSTEMS.map((paymentSystem) => ({
              label: paymentSystem,
              props: { paymentSystem },
            })),
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <Card {...props} />}
      />
    </div>
  ),
}
