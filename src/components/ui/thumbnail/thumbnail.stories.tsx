import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  type PlaygroundState,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { ICON_NAMES } from "@/components/ui/icon"

import { Thumbnail, type ThumbnailProps } from "./thumbnail"
import type { PaymentSystem, ThumbnailType } from "./variants"

/* Дизайн-чек №3 №4: «Некорректные нейминги в матрице thumbnail. Это не
   more, это вариант с иконкой. Матрицу взять из figma».

   Свойства мастера `ELK / thumbnail` (687:29204): Size (`L / Desktop`,
   `M / Desktop`, `L-M / Mobile`), State (Default / Disabled) и Type из
   девяти значений — Icon, Card, Sticker, SBP Card, SBP Card Account,
   Image, Check (Green), Attention (Yellow), Alert (Red). Порядок и имена
   колонок ниже взяты оттуда; счётчик и точка — это вложенный
   `ELK / badge` (свойство Show Badge), поэтому они остались строками. */
const CARD_TYPES: ThumbnailType[] = [
  "icon",
  "card",
  "sticker",
  "sbp-card",
  "sbp-card-account",
  "picture",
]
const ICON_TYPES: ThumbnailType[] = [
  "check",
  "question",
  "clock",
  "alert",
  "alert-red",
]

const TYPE_LABEL: Partial<Record<ThumbnailType, string>> = {
  icon: "Icon",
  card: "Card",
  sticker: "Sticker",
  "sbp-card": "SBP Card",
  "sbp-card-account": "SBP Card Account",
  picture: "Image",
  check: "Check (Green)",
  question: "Question",
  clock: "Clock",
  alert: "Attention (Yellow)",
  "alert-red": "Alert (Red)",
}

/* `Size` в Figma — одно свойство с тремя значениями: размер и форма там не
   разъезжаются, в коде это пара `size` + <ViewportScope>. */
const SIZE_LABELS = {
  "l-desktop": "L / Desktop",
  "m-desktop": "M / Desktop",
  "l-mobile": "L-M / Mobile",
} as const
type FigmaSize = keyof typeof SIZE_LABELS

const SIZE_PROPS: Record<FigmaSize, { size: "l" | "m"; viewport: Viewport }> = {
  "l-desktop": { size: "l", viewport: "desktop" },
  "m-desktop": { size: "m", viewport: "desktop" },
  "l-mobile": { size: "l", viewport: "mobile" },
}

/* Значения `Type` — ровно девять из мастера, в его же порядке. Два
   последних значения кита пары в сете не имеют (они есть на канвасе
   отдельными кадрами «Thumbnail Question» / «Thumbnail Clock»), поэтому
   помечены точкой — так же, как «лишние» значения у Button. */
const TYPE_LABELS: Record<ThumbnailType, string> = {
  icon: "Icon",
  card: "Card",
  sticker: "Sticker",
  "sbp-card": "SBP Card",
  "sbp-card-account": "SBP Card Account",
  picture: "Image",
  check: "Check (Green)",
  alert: "Attention (Yellow)",
  "alert-red": "Alert (Red)",
  question: "· Question",
  clock: "· Clock",
}

type PlaygroundArgs = Omit<ThumbnailProps, "size"> & {
  viewport?: Viewport
  figmaSize?: FigmaSize
  state?: PlaygroundState
}
const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mir-white", "mastercard", "visa"]

const meta = {
  title: "Компоненты/Thumbnail",
  component: Thumbnail,
  parameters: { layout: "centered" },
  /* Панель повторяет «Свойства компонента» `ELK / thumbnail` (компонент-сет
     687:29204, таблица 7203:102402): Size / State / Type — плюс вложенные
     инстансы `Payment System (ELK)` и `ELK / badge` своими категориями. */
  argTypes: {
    figmaSize: optionsArgType<FigmaSize>("Size", SIZE_LABELS, "inline-radio"),
    state: stateArgTypeOf(["default", "disabled"]),
    type: optionsArgType<ThumbnailType>("Type", TYPE_LABELS),
    paymentSystem: {
      name: "Payment System",
      control: "select",
      options: PAYMENT_SYSTEMS,
      table: { category: "Payment System (ELK)" },
    },
    count: {
      control: { type: "number", min: 0, max: 99 },
      table: { category: "ELK / badge" },
    },
    showDot: { name: "Point", control: "boolean", table: { category: "ELK / badge" } },
    // Instance swap внутри плитки `Type=Icon`.
    icon: {
      control: "select",
      options: ICON_NAMES,
      description: "Глиф для типа Icon (в Figma — instance swap)",
      table: { category: "Контент" },
    },
    last4: { control: "text", table: { category: "Контент" } },
    src: { control: "text", table: { category: "Контент" } },
    alt: { control: "text", table: { category: "Контент" } },
    // Значение оси State — отдельного контрола у него нет.
    disabled: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    figmaSize: "l-desktop" as FigmaSize,
    state: "default" as PlaygroundState,
    type: "card",
    paymentSystem: "mir",
    showDot: false,
    icon: "ellipsis",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ figmaSize = "l-desktop", state, ...args }) => {
    const { size, viewport } = SIZE_PROPS[figmaSize]
    return (
      <ViewportScope viewport={viewport}>
        <Thumbnail {...args} size={size} disabled={state === "disabled"} />
      </ViewportScope>
    )
  },
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ThumbnailProps>
        responsive
        baseProps={{ paymentSystem: "mir", last4: "1234" }}
        columnGroups={[
          {
            label: "Type",
            columns: CARD_TYPES.map((type) => ({
              label: TYPE_LABEL[type] ?? type,
              props: { type },
            })),
          },
        ]}
        rows={[
          { label: "L (default)", props: { size: "l" } },
          { label: "M", props: { size: "m" } },
          { label: "Со счётчиком", props: { count: 3 } },
          { label: "С точкой", props: { showDot: true } },
          // Disabled is a flat opacity-50 over the whole tile, not a
          // background swap.
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Thumbnail {...props} />}
      />
      <StatesMatrix<ThumbnailProps>
        columnGroups={[
          {
            label: "Type — статусы",
            columns: ICON_TYPES.map((type) => ({
              label: TYPE_LABEL[type] ?? type,
              props: { type },
            })),
          },
        ]}
        rows={[
          { label: "L (default)", props: { size: "l" } },
          { label: "M", props: { size: "m" } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Thumbnail {...props} />}
      />
      <StatesMatrix<ThumbnailProps>
        baseProps={{ type: "card" }}
        columnGroups={[
          {
            label: "Payment systems",
            columns: PAYMENT_SYSTEMS.map((paymentSystem) => ({
              label: paymentSystem,
              props: { paymentSystem },
            })),
          },
        ]}
        rows={[
          { label: "L (default)", props: { size: "l" } },
          { label: "M", props: { size: "m" } },
        ]}
        render={(props) => <Thumbnail {...props} />}
      />
    </div>
  ),
}
