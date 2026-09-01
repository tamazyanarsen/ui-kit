import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"
import type { TagColor } from "@/components/ui/tag"
import {
  PseudoBox,
  StatesMatrix,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"

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

/* Дизайн-чек Storybook (Аня Багрова) №18: панель приведена к «Свойствам
   компонента» `ELK / card` — State, Show Number Card, Show Tag, Show Value,
   Show User Name, Show Button. Все пять переключателей в коде — это наличие
   содержимого в слоте (об этом же говорит комментарий в card.tsx), поэтому
   аргументы синтетические, а `render` раскладывает их по пропам. */
type PlaygroundArgs = CardProps & {
  menuItemsCount?: MenuItemCount
  state?: PlaygroundState
  showNumberCard?: boolean
  showTag?: boolean
  showValue?: boolean
  showUserName?: boolean
  showButton?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "unionpay", "visa"]

const meta = {
  title: "Компоненты/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    state: stateArgTypeOf(["default", "hover"]),
    showNumberCard: toggleArgType("Show Number Card", "Номер после названия"),
    showTag: toggleArgType("Show Tag"),
    showValue: toggleArgType("Show Value", "Сумма справа в верхней строке"),
    showUserName: toggleArgType("Show User Name", "Вторая строка карточки"),
    showButton: toggleArgType("Show Button", "Кнопка «ещё» справа"),
    title: { control: "text", ...CONTENT },
    titleSuffix: { control: "text", ...CONTENT },
    subtitle: { control: "text", ...CONTENT },
    value: { control: "text", ...CONTENT },
    // `tag` is `React.ReactNode` but every usage is a plain string —
    // without this, leaving it unset falls back to a generic "Set object"
    // JSON editor.
    tag: { control: "text", ...CONTENT },
    // `tagColor`/`paymentSystem` are plain string unions imported from other
    // modules (`TagColor`, `PaymentSystem`) — react-docgen can't resolve an
    // imported type alias into an enum, so both fall back to the same
    // generic "Set object" editor. Pin the real option lists explicitly
    // instead, same fix as Badge's `color`.
    tagColor: {
      ...CONTENT,
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
    paymentSystem: { control: "select", options: PAYMENT_SYSTEMS, ...CONTENT },
    // `thumbnailNumber` is `React.ReactNode` but only ever demoed as a plain
    // string (see the CardThumbnail's own "last 4 digits" usage).
    // Дизайн-чек №15: окончание номера карты — обязательная часть
    // пиктограммы, поэтому в Playground оно задано по умолчанию.
    thumbnailNumber: { control: "text", ...CONTENT },
    showThumbnail: { name: "Пиктограмма", control: "boolean" },
    // Дизайн-чек №17: количество пунктов меню — списком. Ноль прячет
    // кнопку «ещё» целиком, что тоже надо уметь проверить.
    menuItemsCount: {
      name: "Пунктов в меню «ещё»",
      control: "select",
      options: MENU_ITEM_COUNTS,
      ...CONTENT,
    },
    menuItems: { table: { disable: true } },
  },
  args: {
    state: "default" as PlaygroundState,
    showNumberCard: true,
    showTag: true,
    showValue: true,
    showUserName: true,
    showButton: true,
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
  render: ({
    menuItemsCount = 2,
    state,
    showNumberCard,
    showTag,
    showValue,
    showUserName,
    showButton,
    titleSuffix,
    tag,
    value,
    subtitle,
    ...args
  }) => (
    <PseudoBox state={state} className="w-full">
      <Card
        {...args}
        titleSuffix={showNumberCard ? titleSuffix : undefined}
        tag={showTag ? tag : undefined}
        value={showValue ? value : undefined}
        subtitle={showUserName ? subtitle : undefined}
        menuItems={showButton ? MENU_ITEM_POOL.slice(0, menuItemsCount) : []}
        // State=Hover в макете есть только у кликабельной строки — заливка
        // приходит от `hover:` на ней, а без onClick её нет вовсе.
        onClick={() => {}}
      />
    </PseudoBox>
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
