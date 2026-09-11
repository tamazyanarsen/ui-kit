import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Tabs, type TabsProps } from "./tabs"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые", disabled: true },
  { value: "errors", label: "Ошибки", status: true },
  { value: "inbox", label: "Входящие", badge: 3 },
  { value: "drafts", label: "Черновики" },
  { value: "sent", label: "Отправленные" },
  { value: "archive", label: "Архив" },
  { value: "trash", label: "Корзина" },
  { value: "spam", label: "Спам" },
  { value: "flagged", label: "Важные" },
  { value: "muted", label: "Отключённые" },
]

/* Дизайн-чек №17: количество вкладок переключается списком, а не правкой
   JSON-массива в контролах. Пул подобран так, чтобы по мере роста включались
   и вспомогательные признаки вкладки (disabled, статус, счётчик).

   В Figma это свойство `Volume` компонент-сета `ELK / tabs` (70240:42086)
   со значениями 2 — 12, поэтому и список здесь такой же. */
const TAB_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
type TabCount = (typeof TAB_COUNTS)[number]

const TAB_COUNT_LABELS = Object.fromEntries(
  TAB_COUNTS.map((count) => [count, String(count)])
) as Record<TabCount, string>

/* `Type` — свойство компонент-сета `Tabs (ELK)`: Text, Badge, Status.
   Раньше оно жило только в пуле — счётчик и статус появлялись сами собой на
   четвёртой и пятой вкладке, а выбрать оформление было нельзя.

   Дизайн-чек 3/3 №11: вариант «Icon» отсюда убран — «таба с иконкой быть не
   может, только с бейджем или статусом», а единственная вкладка без подписи —
   это таб «more» (контрол Show More ниже). */
const TAB_TYPES = ["Text", "Badge", "Status"] as const
type TabType = (typeof TAB_TYPES)[number]

function decorate(items: typeof ITEMS, type: TabType) {
  return items.map((item) => ({
    ...item,
    badge: type === "Badge" ? (item.badge ?? 3) : undefined,
    status: type === "Status" ? true : undefined,
  }))
}

type PlaygroundArgs = TabsProps & {
  itemsCount?: TabCount
  figmaType?: TabType
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  /* Панель повторяет «Свойства компонента» `ELK / tabs` (компонент-сет
     70240:42086, таблица 70240:41960): Size / Volume / Show More. Свойство
     `Type` — у вложенного сета `Tabs (ELK)` (70240:42346), поэтому оно
     здесь же, следом. */
  argTypes: {
    // v1.2.0 мастера убрала свойство размера в пользу пары Desktop/Mobile —
    // теперь она выбирается контролом (дизайн-чек №3 №19), а не вьюпортом.
    viewport: sizeArgType,
    itemsCount: optionsArgType<TabCount>("Volume", TAB_COUNT_LABELS),
    showMore: toggleArgType("Show More"),
    items: { table: { disable: true } },
    figmaType: {
      name: "Type",
      control: "inline-radio",
      options: TAB_TYPES,
      description: "Оформление вкладки: только текст, со счётчиком или со статусом",
    },
    // Дизайн-чек «Storybook 3», замечание 4: у ленты появился закреплённый
    // «средний» размер — тот, которым шапка таблицы пользуется на десктопе.
    size: {
      control: "inline-radio",
      options: ["auto", "medium"],
      description:
        "auto — размер по вьюпорту (Desktop/Mobile); medium — «мобильные» числа на любом экране (лента 40, зазор 24, подпись P2 Medium): так лента устроена внутри Table Top",
    },
    defaultValue: {
      control: "select",
      options: ITEMS.map((i) => i.value),
      table: { category: "Контент" },
    },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop",
    itemsCount: 5,
    showMore: false,
    figmaType: "Text",
    size: "auto",
    items: ITEMS,
    defaultValue: "all",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled(args: TabsProps) {
  const [value, setValue] = useState(
    args.value ?? args.defaultValue ?? args.items[0]?.value
  )
  return <Tabs {...args} value={value} onValueChange={setValue} />
}

export const Playground: Story = {
  // Remount when the pinned value or the tab count changes so the
  // `defaultValue` control actually moves the (otherwise internally-owned)
  // selection.
  render: ({ itemsCount = 5, figmaType = "Text", viewport, ...args }) => {
    const items = decorate(ITEMS.slice(0, itemsCount), figmaType)
    const defaultValue = items.some((i) => i.value === args.defaultValue)
      ? args.defaultValue
      : items[0]?.value
    return (
      <ViewportScope viewport={viewport}>
        <Controlled
          key={`${defaultValue}-${itemsCount}`}
          {...args}
          items={items}
          defaultValue={defaultValue}
        />
      </ViewportScope>
    )
  },
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<TabsProps>
      stretch
      cellClassName="min-w-[420px]"
      // v1.2.0 of the master dropped the Large/Medium level property for a
      // responsive Desktop/Mobile pair (44px bar / 32px gaps / 16-24 labels
      // vs 40/24/14-20). Обе формы рисуются рядом — дизайн-чек №3 №18.
      responsive
      columns={[{ label: "Tabs" }]}
      rows={[
        {
          label: "Выбрана первая",
          props: { items: ITEMS, value: "all" },
        },
        {
          label: "Выбрана третья",
          props: { items: ITEMS, value: "errors" },
        },
        {
          label: "Hover",
          props: { items: ITEMS, value: "all" },
          pseudo: "hover",
        },
        {
          label: "Только текст",
          props: {
            items: [
              { value: "a", label: "Все" },
              { value: "b", label: "Открытые" },
            ],
            value: "a",
          },
        },
        {
          label: "Со счётчиком\nи статусом",
          props: {
            items: [
              { value: "a", label: "Входящие", badge: 3 },
              { value: "b", label: "Ошибки", status: true },
            ],
            value: "a",
          },
        },
        {
          label: "С disabled",
          props: {
            items: [
              { value: "a", label: "Все" },
              { value: "b", label: "Закрытые", disabled: true },
            ],
            value: "a",
          },
        },
        {
          // Overflowing tabs collapse into a trailing "ещё" menu.
          label: "Переполнение\n(«ещё»)",
          props: {
            items: Array.from({ length: 10 }, (_, i) => ({
              value: `t${i}`,
              label: `Вкладка ${i + 1}`,
            })),
            value: "t0",
            showMore: true,
          },
        },
      ]}
      render={(props) => <Tabs {...props} />}
    />
  ),
}
