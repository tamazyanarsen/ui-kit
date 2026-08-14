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
  {
    title: "Требуется подпись",
    description: "Документ ожидает вашей подписи",
    timestamp: "Вчера",
  },
]

/* Дизайн-чек №17: количество уведомлений выбирается списком, а не правкой
   JSON-массива. Ноль — отдельный проверяемый случай (пустая панель). */
const ITEM_COUNTS = [0, 1, 2, 3] as const
type ItemCount = (typeof ITEM_COUNTS)[number]

/* Переключатели видимости кнопок живут в истории, а не в компоненте: сами
   пропсы — это подписи, а не флаги (дизайн-чек №27). */
type PlaygroundArgs = NotificationPanelProps & {
  showPrimaryButton?: boolean
  showSecondaryButton?: boolean
  itemsCount?: ItemCount
}

const meta = {
  title: "Компоненты/Notification",
  component: NotificationPanel,
  parameters: { layout: "centered" },
  // title/primaryButtonLabel/secondaryButtonLabel are typed React.ReactNode
  // but every usage is a plain string — pin a text control so Storybook
  // doesn't fall back to its "Set object" JSON-editor placeholder when one
  // is left unset (same fix as tooltip/hint.tsx's `title`).
  argTypes: {
    title: { control: "text" },
    // Дизайн-чек №27: кнопки включаются булевыми переключателями.
    showPrimaryButton: { name: "Основная кнопка", control: "boolean" },
    primaryButtonLabel: { control: "text" },
    showSecondaryButton: { name: "Дополнительная кнопка", control: "boolean" },
    secondaryButtonLabel: { control: "text" },
    showDivider: { control: "boolean" },
    showScrollBar: { control: "boolean" },
    maxHeight: { control: "number" },
    // Дизайн-чек №17: количество уведомлений — списком. Ноль нужен, чтобы
    // проверить пустую панель.
    itemsCount: {
      name: "Количество уведомлений",
      control: "select",
      options: ITEM_COUNTS,
    },
    items: { table: { disable: true } },
  },
  args: {
    items: ITEMS,
    itemsCount: ITEMS.length as ItemCount,
    showPrimaryButton: true,
    primaryButtonLabel: "Прочитать все",
    showSecondaryButton: true,
    secondaryButtonLabel: "Настройки",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    showPrimaryButton,
    primaryButtonLabel,
    showSecondaryButton,
    secondaryButtonLabel,
    itemsCount,
    ...args
  }) => (
    <NotificationPanel
      {...args}
      items={ITEMS.slice(0, itemsCount ?? ITEMS.length)}
      primaryButtonLabel={showPrimaryButton ? primaryButtonLabel : undefined}
      secondaryButtonLabel={showSecondaryButton ? secondaryButtonLabel : undefined}
    />
  ),
}

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
