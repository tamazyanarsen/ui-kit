import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

import {
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  type PlaygroundState,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { ICON_NAMES } from "@/components/ui/icon"

import { Thumbnail, type ThumbnailProps } from "./thumbnail"
import type {
  PaymentSystem,
  ThumbnailBackground,
  ThumbnailType,
} from "./variants"

/* Свойства мастера `ELK / thumbnail` (релиз 69.36): Size (`L / Desktop`,
   `M / Desktop`, `L / Mobile`, `M / Mobile`), State (Default / Disabled),
   Type из десяти значений — Grey Icon, White Icon, Black Icon, Card,
   Sticker, Image, Logo, Check (Green), Attention (Yellow), Alert (Red) — и
   Show Badge. Три «Icon» — это один тип кита `icon` с осью `background`
   (серый, белый, чёрный), поэтому в панели они выбираются одним списком, а
   `render` раскладывает его на два пропса.

   Card и Sticker в мастере — миниатюра карты 48×34, а не плитка 48×48: те
   типы, что остались от прежнего мастера (SBP Card, SBP Card Account, Clock,
   жёлтый Alert-«!»), в нём не нарисованы и помечены точкой — так же, как
   «лишние» значения у Button. Attention (Yellow) в мастере — глиф «?»
   (`icon / question`), то есть тип `question`. */
type PlayType =
  | "icon-grey"
  | "icon-white"
  | "icon-black"
  | Exclude<ThumbnailType, "icon">

const PLAY_TYPE_LABELS: Record<PlayType, string> = {
  "icon-grey": "Grey Icon",
  "icon-white": "White Icon",
  "icon-black": "Black Icon",
  card: "Card",
  sticker: "Sticker",
  picture: "Image",
  logo: "Logo",
  check: "Check (Green)",
  question: "Attention (Yellow)",
  "alert-red": "Alert (Red)",
  alert: "· Alert (Yellow)",
  clock: "· Clock",
  "sbp-card": "· SBP Card",
  "sbp-card-account": "· SBP Card Account",
}

const LEGACY_TYPES = [
  "alert",
  "clock",
  "sbp-card",
  "sbp-card-account",
] as const satisfies readonly PlayType[]

function resolveType(type: PlayType): {
  type: ThumbnailType
  background?: ThumbnailBackground
} {
  if (type === "icon-grey") return { type: "icon", background: "grey" }
  if (type === "icon-white") return { type: "icon", background: "white" }
  if (type === "icon-black") return { type: "icon", background: "black" }
  return { type }
}

/* `Size` в Figma — одно свойство с четырьмя значениями: размер и форма там не
   разъезжаются, в коде это пара `size` + <ViewportScope>. На мобиле L и M
   совпадают (40), но в мастере это два символа. */
const SIZE_LABELS = {
  "l-desktop": "L / Desktop",
  "m-desktop": "M / Desktop",
  "l-mobile": "L / Mobile",
  "m-mobile": "M / Mobile",
} as const
type FigmaSize = keyof typeof SIZE_LABELS

const SIZE_PROPS: Record<FigmaSize, { size: "l" | "m"; viewport: Viewport }> = {
  "l-desktop": { size: "l", viewport: "desktop" },
  "m-desktop": { size: "m", viewport: "desktop" },
  "l-mobile": { size: "l", viewport: "mobile" },
  "m-mobile": { size: "m", viewport: "mobile" },
}

type PlaygroundArgs = Omit<ThumbnailProps, "size" | "type" | "background"> & {
  type: PlayType
  figmaSize?: FigmaSize
  state?: PlaygroundState
  showBadge?: boolean
}
const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mir-white", "mastercard", "visa"]

const meta = {
  title: "Компоненты/Thumbnail",
  // Панель собрана из свойств Figma (`type` здесь — PlayType), поэтому
  // компонент приведён к типу пропсов истории.
  component: Thumbnail as unknown as React.ComponentType<PlaygroundArgs>,
  parameters: { layout: "centered" },
  /* Панель повторяет «Свойства компонента» `ELK / thumbnail`: Size /
     State / Type / Show Badge — плюс вложенные инстансы `Payment System
     (ELK)` и `ELK / badge` своими категориями. */
  argTypes: {
    figmaSize: optionsArgType<FigmaSize>("Size", SIZE_LABELS, "inline-radio"),
    state: stateArgTypeOf(["default", "disabled"]),
    type: optionsArgType<PlayType>("Type", PLAY_TYPE_LABELS),
    showBadge: {
      name: "Show Badge",
      control: "boolean",
      description: "Вложенный ELK / badge: счётчик (если задан) или точка",
    },
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
      description: "Глиф для типов Icon (в Figma — instance swap)",
      table: { category: "Контент" },
    },
    last4: { control: "text", table: { category: "Контент" } },
    src: { control: "text", table: { category: "Контент" } },
    alt: { control: "text", table: { category: "Контент" } },
    // Фон квадрата выбирается самим `Type` (Grey / White / Black Icon).
    logo: { table: { disable: true } },
    // Значение оси State — отдельного контрола у него нет.
    disabled: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    figmaSize: "l-desktop" as FigmaSize,
    state: "default" as PlaygroundState,
    type: "icon-grey" as PlayType,
    showBadge: true,
    paymentSystem: "mastercard",
    showDot: true,
    icon: "ellipsis",
    last4: "2545",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ figmaSize = "l-desktop", state, type, showBadge, showDot, count, ...args }) => {
    const { size, viewport } = SIZE_PROPS[figmaSize]
    return (
      <ViewportScope viewport={viewport}>
        <Thumbnail
          {...args}
          {...resolveType(type)}
          size={size}
          disabled={state === "disabled"}
          showDot={showBadge && showDot && count === undefined}
          count={showBadge ? count : undefined}
        />
      </ViewportScope>
    )
  },
}

const typeColumns = (types: readonly PlayType[]) =>
  types.map((type) => ({
    label: PLAY_TYPE_LABELS[type],
    props: resolveType(type) as Partial<ThumbnailProps>,
  }))

const SIZE_ROWS = [
  { label: "L (default)", props: { size: "l" } },
  { label: "M", props: { size: "m" } },
  { label: "Со счётчиком", props: { count: 3 } },
  { label: "С точкой", props: { showDot: true } },
  // Выключенное состояние — плоский opacity-50 на всей плитке, а не подмена
  // фона.
  { label: "Disabled", props: { disabled: true } },
] satisfies { label: string; props: Partial<ThumbnailProps> }[]

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ThumbnailProps>
        responsive
        baseProps={{ paymentSystem: "mastercard", last4: "2545" }}
        columnGroups={[
          {
            label: "Type",
            columns: typeColumns([
              "icon-grey",
              "icon-white",
              "icon-black",
              "card",
              "sticker",
              "picture",
              "logo",
            ]),
          },
        ]}
        rows={SIZE_ROWS}
        render={(props) => <Thumbnail {...props} />}
      />
      <StatesMatrix<ThumbnailProps>
        columnGroups={[
          {
            label: "Type — статусы",
            columns: typeColumns(["check", "question", "alert-red"]),
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
        baseProps={{ paymentSystem: "mir", last4: "1234" }}
        columnGroups={[
          {
            label: "Значения кита, которых нет в мастере",
            columns: typeColumns(LEGACY_TYPES),
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
        baseProps={{ type: "card", last4: "2545" }}
        columnGroups={[
          {
            label: "Payment systems (Card)",
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
