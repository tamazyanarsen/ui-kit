import type { Meta, StoryObj } from "@storybook/react-vite"

import { NotificationItem, NotificationPanel } from "./notification"

const meta = {
  title: "Status/Message/Notification",
  component: NotificationPanel,
  parameters: { layout: "centered" },
  // title/primaryButtonLabel/secondaryButtonLabel are typed React.ReactNode
  // but every story here (and NotificationItem's own usage) only ever puts a
  // plain string in them — pin a text control so Storybook doesn't fall back
  // to its "Set object" JSON-editor placeholder when a story leaves one
  // unset (same fix as tooltip/hint.tsx's `title`).
  argTypes: {
    title: { control: "text" },
    primaryButtonLabel: { control: "text" },
    secondaryButtonLabel: { control: "text" },
  },
} satisfies Meta<typeof NotificationPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Panel: Story = {
  args: {
    items: [
      {
        title: "Платёж выполнен",
        sum: "12 500 ₽",
        status: "Перевод на карту •• 4482",
        timestamp: "10:00",
      },
      {
        title: "Новая функция: автоплатежи",
        description: "Настройте регулярные платежи в один клик",
        viewed: true,
        timestamp: "Вчера",
      },
    ],
    primaryButtonLabel: "Прочитать все",
    secondaryButtonLabel: "Настройки",
  },
}

export const EmptyPanel: Story = {
  args: { items: [] },
}

export const UnreadItem: Story = {
  name: "NotificationItem — unread",
  args: { items: [] },
  render: () => <NotificationItem title="Новое сообщение" viewed={false} />,
}

export const ClickableItemWithButton: Story = {
  name: "NotificationItem — clickable with action button",
  args: { items: [] },
  render: () => (
    <NotificationItem
      title="Требуется подпись"
      description="Документ ожидает подписания"
      buttonLabel="Подписать"
      onClick={() => alert("open")}
      onButtonClick={() => alert("sign")}
    />
  ),
}
