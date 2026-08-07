import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Thumbnail, type ThumbnailProps } from "./thumbnail"
import type { PaymentSystem, ThumbnailType } from "./variants"

const CARD_TYPES: ThumbnailType[] = [
  "card",
  "sticker",
  "sbp-card",
  "sbp-card-account",
  "picture",
  "more",
]
const ICON_TYPES: ThumbnailType[] = [
  "check",
  "question",
  "clock",
  "alert",
  "alert-red",
]
const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "unionpay", "visa"]

const meta = {
  title: "Status/Thumbnail",
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
  },
  args: {
    type: "card",
    size: "l",
    paymentSystem: "mir",
    showDot: false,
    disabled: false,
  },
} satisfies Meta<ThumbnailProps>

export default meta
type Story = StoryObj<ThumbnailProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ThumbnailProps>
        baseProps={{ paymentSystem: "mir", last4: "1234" }}
        columnGroups={[
          {
            label: "Card types",
            columns: CARD_TYPES.map((type) => ({ label: type, props: { type } })),
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
            label: "Icon statuses",
            columns: ICON_TYPES.map((type) => ({ label: type, props: { type } })),
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
