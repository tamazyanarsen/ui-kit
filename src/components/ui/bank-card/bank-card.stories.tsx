import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"
import { StatesMatrix } from "@/stories/matrix"

import { BankCard, type BankCardProps } from "./bank-card"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"
import { SKIN_LABELS, type BankCardSkin } from "./variants"

const SKINS = Object.keys(SKIN_LABELS) as BankCardSkin[]
const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "visa", "unionpay"]

const meta = {
  title: "Content/Cards",
  component: BankCard,
  parameters: { layout: "centered" },
  argTypes: {
    skin: { control: "select", options: SKINS },
    // `paymentSystem` is a plain string union (`PaymentSystem`, imported
    // from thumbnail/variants) but react-docgen can't resolve an imported
    // type alias into an enum, so it falls back to a generic "Set object"
    // JSON editor — pin the real option list explicitly instead, same fix
    // as Badge's `color`.
    paymentSystem: { control: "select", options: PAYMENT_SYSTEMS },
    // `balance` is `React.ReactNode` but every usage (including the
    // component's own default) is a plain string — without this, leaving it
    // unset falls back to the same generic "Set object" JSON editor.
    balance: { control: "text" },
    cardNumber: { control: "text" },
    // Shown by the SBP/sticker skins instead of the full masked number.
    last4: { control: "text" },
    cardholderName: { control: "text" },
    expiry: { control: "text" },
    cvc: { control: "text" },
    showPaymentSystem: { control: "boolean" },
    showCardNumber: { control: "boolean" },
    showBalance: { control: "boolean" },
    showRequisites: { control: "boolean" },
  },
  args: {
    skin: "mono",
    last4: "4482",
    showPaymentSystem: true,
    showCardNumber: true,
    showBalance: true,
    showRequisites: true,
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<BankCardProps>

export default meta
type Story = StoryObj<BankCardProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Skins are the master's own variant axis — SKIN_LABELS carries the
          designer's own name for each. */}
      <StatesMatrix<BankCardProps>
        columnGroups={[
          {
            label: "Skin",
            columns: SKINS.map((skin) => ({
              label: SKIN_LABELS[skin],
              props: { skin },
            })),
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <BankCard {...props} />}
      />
      <StatesMatrix<BankCardProps>
        baseProps={{ skin: "black-classic" }}
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
        render={(props) => <BankCard {...props} />}
      />
      {/* Every block of the card is independently switchable. */}
      <StatesMatrix<BankCardProps>
        baseProps={{ skin: "mono" }}
        columnGroups={[
          {
            label: "Состав карточки",
            columns: [
              { label: "Всё", props: {} },
              { label: "Без реквизитов", props: { showRequisites: false } },
              { label: "Без баланса", props: { showBalance: false } },
              { label: "Без номера", props: { showCardNumber: false } },
              {
                label: "Без платёжной системы",
                props: { showPaymentSystem: false, showCardNumber: false },
              },
            ],
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <BankCard {...props} />}
      />
    </div>
  ),
}
