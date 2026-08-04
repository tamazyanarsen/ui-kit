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
