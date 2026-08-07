import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, StorySection, StoryShowcase } from "@/stories/matrix"

import {
  NotificationItem,
  NotificationPanel,
  type NotificationItemProps,
  type NotificationPanelProps,
} from "./notification"

const ITEMS = [
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
]

const meta = {
  title: "Status/Message/Notification",
  component: NotificationPanel,
  parameters: { layout: "centered" },
  // title/primaryButtonLabel/secondaryButtonLabel are typed React.ReactNode
  // but every usage is a plain string — pin a text control so Storybook
  // doesn't fall back to its "Set object" JSON-editor placeholder when one
  // is left unset (same fix as tooltip/hint.tsx's `title`).
  argTypes: {
    title: { control: "text" },
    primaryButtonLabel: { control: "text" },
    secondaryButtonLabel: { control: "text" },
    showDivider: { control: "boolean" },
    showScrollBar: { control: "boolean" },
    maxHeight: { control: "number" },
    items: { control: "object" },
  },
  args: {
    items: ITEMS,
    primaryButtonLabel: "Прочитать все",
    secondaryButtonLabel: "Настройки",
  },
} satisfies Meta<NotificationPanelProps>

export default meta
type Story = StoryObj<NotificationPanelProps>

export const Playground: Story = {}

/* The panel is a container; the real variant grid belongs to the row
   (NotificationItem), so the matrix covers the row and the panel's own
   arrangements are shown underneath. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<NotificationItemProps>
        stretch
        cellClassName="min-w-[320px]"
        baseProps={{ title: "Title", timestamp: "10:00" }}
        columns={[
          { label: "Непрочитанное", props: { viewed: false } },
          { label: "Прочитанное", props: { viewed: true } },
        ]}
        rows={[
          { label: "Только заголовок", props: {} },
          { label: "С описанием", props: { description: "Description" } },
          {
            label: "С суммой и статусом",
            props: { sum: "12 500 ₽", status: "Перевод на карту •• 4482" },
          },
          {
            label: "С кнопкой",
            props: { description: "Description", buttonLabel: "Подписать" },
          },
          {
            label: "Hover (кликабельное)",
            props: { onClick: () => {} },
            pseudo: "hover",
          },
        ]}
        render={(props) => <NotificationItem {...props} />}
      />

      <StoryShowcase className="bg-transparent p-0">
        <StorySection title="Панель" description="Список уведомлений с кнопками.">
          <NotificationPanel
            items={ITEMS}
            primaryButtonLabel="Прочитать все"
            secondaryButtonLabel="Настройки"
          />
        </StorySection>
        <StorySection title="Пустая панель">
          <NotificationPanel items={[]} />
        </StorySection>
      </StoryShowcase>
    </div>
  ),
}
