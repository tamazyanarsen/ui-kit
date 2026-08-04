import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronsUpDown as ArrowRightLeft } from "@/icons"

import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Informer } from "@/components/ui/informer"
import { ToastProvider, Toaster, useToast } from "@/components/ui/toast-message"

// Sandbox — a realistic mini business widget assembled from several
// ui-kit components together, not a single component's own states. This one
// is a "перевод между своими счетами" (transfer between own accounts) card:
// two account Selects, a masked amount Input, a fee-free Informer hint and
// a submit Button that reports success through the kit's own toast queue.

const ACCOUNTS = [
  { value: "acc-1", label: "Дебетовая · 4482", balance: "128 400 ₽" },
  { value: "acc-2", label: "Накопительная · 1135", balance: "540 900 ₽" },
  { value: "acc-3", label: "Валютная · 7723", balance: "$2 150" },
]

function TransferWidget() {
  const toast = useToast()
  const [from, setFrom] = useState<string | null>("acc-1")
  const [to, setTo] = useState<string | null>("acc-2")
  const [amount, setAmount] = useState("")

  const fromAccount = ACCOUNTS.find((a) => a.value === from)
  const canSubmit = Boolean(from && to && from !== to && amount)

  function handleSubmit() {
    if (!canSubmit) return
    toast.add({
      type: "checked",
      title: "Перевод выполнен",
      description: `${amount} ₽ переведено между счетами`,
    })
    setAmount("")
  }

  return (
    <div className="flex w-96 flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-foreground/10">
      <div className="flex items-center gap-2">
        <ArrowRightLeft aria-hidden="true" className="size-5 text-[#252628]" />
        <h2 className="text-base font-medium text-[#252628]">Перевод между своими счетами</h2>
      </div>

      <Select items={ACCOUNTS} value={from} onValueChange={setFrom}>
        <SelectTrigger label="Со счёта">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {ACCOUNTS.map((account) => (
            <SelectItem key={account.value} value={account.value}>
              {account.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {fromAccount && (
        <p className="-mt-2 text-xs text-[#999999]">Доступно: {fromAccount.balance}</p>
      )}

      <Select items={ACCOUNTS} value={to} onValueChange={setTo}>
        <SelectTrigger label="На счёт">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {ACCOUNTS.filter((account) => account.value !== from).map((account) => (
            <SelectItem key={account.value} value={account.value}>
              {account.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        label="Сумма"
        mask="amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <Informer
        icon="information"
        title="Без комиссии"
        description="Переводы между своими счетами всегда бесплатны"
        showCross={false}
        className="min-w-0"
      />

      <Button type="button" variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
        Перевести
      </Button>
    </div>
  )
}

const meta = {
  title: "Sandbox/Перевод между счетами",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof TransferWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TransferWidget />,
}
