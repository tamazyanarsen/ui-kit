import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
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

type PlaygroundArgs = ThumbnailProps & { viewport?: Viewport }
const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "unionpay", "visa"]

const meta = {
  title: "Компоненты/Thumbnail",
  component: Thumbnail,
  parameters: { layout: "centered" },
  argTypes: {
    type: { control: "select", options: [...CARD_TYPES, ...ICON_TYPES] },
    size: { control: "inline-radio", options: ["l", "m"] },
    paymentSystem: { control: "select", options: PAYMENT_SYSTEMS },
    last4: { control: "text" },
    count: { control: { type: "number", min: 0, max: 99 } },
    showDot: { control: "boolean" },
    disabled: { control: "boolean" },
    src: { control: "text" },
    alt: { control: "text" },
    // Instance swap внутри плитки `Type=Icon`.
    icon: {
      control: "select",
      options: ICON_NAMES,
      description: "Глиф для типа Icon (в Figma — instance swap)",
    },
    // Size=L / Desktop против L-M / Mobile — контрол, а не ширина окна.
    viewport: viewportArgType,
  },
  args: {
    type: "card",
    size: "l",
    paymentSystem: "mir",
    showDot: false,
    disabled: false,
    icon: "ellipsis",
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <ViewportScope viewport={viewport}>
      <Thumbnail {...args} />
    </ViewportScope>
  ),
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
