import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  StorySection,
  StoryShowcase,
  optionsArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"

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
   пропсы — это подписи, а не флаги (дизайн-чек №27).

   Дизайн-чек Storybook 2 (от Notification до Loader) №1: панель приведена к
   «Свойствам компонента» `ELK / notification` (таблица 32216:16255):

     State                 Default, Hover, Pressed
     Type                  Not Viewed, Viewed
     Show Sum              True, False
     Show Status           True, False
     Show Description      True, False
     Show Button           True, False
     Show Divider          True, False
     Show Secondary Button True, False
     Show ScrollBar        True, False

   State и Type относятся к строке уведомления, остальное — к панели. */
type PlaygroundArgs = NotificationPanelProps & {
  state?: PlaygroundState
  viewed?: boolean
  showSum?: boolean
  showStatus?: boolean
  showDescription?: boolean
  showItemButton?: boolean
  showPrimaryButton?: boolean
  showSecondaryButton?: boolean
  itemsCount?: ItemCount
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Notification",
  component: NotificationPanel,
  parameters: { layout: "centered" },
  // title/primaryButtonLabel/secondaryButtonLabel are typed React.ReactNode
  // but every usage is a plain string — pin a text control so Storybook
  // doesn't fall back to its "Set object" JSON-editor placeholder when one
  // is left unset (same fix as tooltip/hint.tsx's `title`).
  argTypes: {
    state: stateArgTypeOf(["default", "hover", "pressed"]),
    viewed: optionsArgType(
      "Type",
      { false: "Not Viewed", true: "Viewed" },
      "inline-radio"
    ),
    showSum: toggleArgType("Show Sum"),
    showStatus: toggleArgType("Show Status"),
    showDescription: toggleArgType("Show Description"),
    showItemButton: toggleArgType("Show Button", "Кнопка внутри уведомления"),
    showDivider: toggleArgType("Show Divider"),
    // Дизайн-чек №27: кнопки включаются булевыми переключателями.
    showPrimaryButton: toggleArgType("Show Button (панель)", "Основная кнопка панели"),
    showSecondaryButton: toggleArgType("Show Secondary Button"),
    showScrollBar: toggleArgType("Show ScrollBar"),
    title: { control: "text", ...CONTENT },
    primaryButtonLabel: { control: "text", ...CONTENT },
    secondaryButtonLabel: { control: "text", ...CONTENT },
    maxHeight: { control: "number", ...CONTENT },
    // Дизайн-чек №17: количество уведомлений — списком. Ноль нужен, чтобы
    // проверить пустую панель.
    itemsCount: {
      name: "Количество уведомлений",
      control: "select",
      options: ITEM_COUNTS,
      ...CONTENT,
    },
    items: { table: { disable: true } },
  },
  args: {
    items: ITEMS,
    itemsCount: ITEMS.length as ItemCount,
    state: "default" as PlaygroundState,
    viewed: false,
    showSum: true,
    showStatus: true,
    showDescription: true,
    showItemButton: true,
    showDivider: true,
    showScrollBar: true,
    showPrimaryButton: true,
    showSecondaryButton: true,
    // Дизайн-чек Storybook 2 (от Notification до Loader) №7: «изменить
    // название кнопок по компоненту». В мастере (32216:16028) основная —
    // «В центр уведомлений», дополнительная — «Прочитать все (23)».
    primaryButtonLabel: "В центр уведомлений",
    secondaryButtonLabel: "Прочитать все (23)",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    state,
    viewed,
    showSum,
    showStatus,
    showDescription,
    showItemButton,
    showPrimaryButton,
    primaryButtonLabel,
    showSecondaryButton,
    secondaryButtonLabel,
    itemsCount,
    ...args
  }) => (
    // State и Type — свойства строки уведомления, поэтому переключатели
    // применяются к каждой строке списка, а псевдосостояние — ко всей панели.
    <PseudoBox state={state}>
      <NotificationPanel
        {...args}
        items={ITEMS.slice(0, itemsCount ?? ITEMS.length).map((item) => ({
          ...item,
          viewed,
          sum: showSum ? (item.sum ?? "5 000,00 ₽") : undefined,
          status: showStatus ? (item.status ?? "Status") : undefined,
          description: showDescription
            ? (item.description ?? "Description")
            : undefined,
          buttonLabel: showItemButton ? "Button" : undefined,
        }))}
        primaryButtonLabel={showPrimaryButton ? primaryButtonLabel : undefined}
        secondaryButtonLabel={
          showSecondaryButton ? secondaryButtonLabel : undefined
        }
      />
    </PseudoBox>
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
