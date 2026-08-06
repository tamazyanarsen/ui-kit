import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"

import { BankCard } from "./bank-card"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"
import { SKIN_LABELS, type BankCardSkin } from "./variants"

const SKINS = Object.keys(SKIN_LABELS) as BankCardSkin[]

const meta = {
  title: "Content/BankCard",
  component: BankCard,
  parameters: { layout: "centered" },
  argTypes: {
    // `paymentSystem` is a plain string union (`PaymentSystem`, imported
    // from thumbnail/variants) but react-docgen can't resolve an imported
    // type alias into an enum, so it falls back to a generic "Set object"
    // JSON editor — pin the real option list explicitly instead, same
    // fix as Badge's `color`.
    paymentSystem: {
      control: "select",
      options: ["mir", "mastercard", "unionpay", "visa"] satisfies PaymentSystem[],
    },
    // `balance` is `React.ReactNode` but every usage (including the
    // component's own default) is a plain string — without this, leaving
    // it unset falls back to the same generic "Set object" JSON editor.
    balance: { control: "text" },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof BankCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { skin: "mono" },
}

export const AllSkins: Story = {
  // Zero-arg render maps SKINS — the inherited `skin` control is dead here.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {SKINS.map((skin) => (
        <div key={skin} className="flex flex-col items-start gap-2">
          <BankCard skin={skin} />
          <span className="max-w-[332px] text-p3-regular text-muted-foreground">{SKIN_LABELS[skin]}</span>
        </div>
      ))}
    </div>
  ),
}

export const PaymentSystems: Story = {
  // Zero-arg render hardcodes skin/paymentSystem per card — every
  // inherited control is dead here.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(["mir", "mastercard", "visa", "unionpay"] as PaymentSystem[]).map((system) => (
        <BankCard key={system} skin="black-classic" paymentSystem={system} />
      ))}
    </div>
  ),
}

export const WithoutRequisitesLink: Story = {
  args: { skin: "mono", showRequisites: false },
}

export const WithoutBalance: Story = {
  args: { skin: "mono", showBalance: false },
}

export const WithoutCardNumber: Story = {
  args: { skin: "mono", showCardNumber: false },
}

export const WithoutPaymentSystem: Story = {
  args: { skin: "mono", showPaymentSystem: false, showCardNumber: false },
}
