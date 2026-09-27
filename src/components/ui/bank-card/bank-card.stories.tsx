import type { Meta, StoryObj } from "@storybook/react-vite"

import type { PaymentSystem } from "@/components/ui/thumbnail"
import {
  StatesMatrix,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"

import { BankCard, type BankCardProps } from "./bank-card"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"
import { SKIN_LABELS, type BankCardSkin } from "./variants"

const SKINS = Object.keys(SKIN_LABELS) as BankCardSkin[]
const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mir-white", "mastercard", "visa"]

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Cards",
  component: BankCard,
  parameters: { layout: "centered" },
  argTypes: {
    /* Дизайн-чек Storybook (Аня Багрова) №20: панель приведена к «Свойствам
       компонента» ` ELK / cards` — Size, Type, Style, Show Payment System,
       Show Card Number, Show Balance, Show Requisites. Подписи Style — из
       того же макета (SKIN_LABELS). */
    size: optionsArgType(
      "Size",
      { desktop: "Desktop", mobile: "Mobile" },
      "inline-radio"
    ),
    type: optionsArgType(
      "Type",
      { face: "Face", back: "Back" },
      "inline-radio"
    ),
    skin: optionsArgType("Style", SKIN_LABELS),
    // `paymentSystem` — обычное строковое объединение (`PaymentSystem`,
    // импортированное из thumbnail/variants), но react-docgen не умеет
    // разрешить импортированный псевдоним типа в перечисление и
    // откатывается на универсальный JSON-редактор «Set object». Вместо
    // этого список значений задан явно — та же правка, что и с `color` у
    // Badge.
    paymentSystem: { control: "select", options: PAYMENT_SYSTEMS, ...CONTENT },
    // `balance` объявлен как `React.ReactNode`, но везде (включая
    // собственное умолчание компонента) используется обычной строкой. Без
    // этого незаданное значение откатывается на тот же универсальный
    // JSON-редактор «Set object».
    balance: { control: "text", ...CONTENT },
    cardNumber: { control: "text", ...CONTENT },
    // Показывается обликами СБП и стикера вместо полного маскированного номера.
    last4: { control: "text", ...CONTENT },
    cardholderName: { control: "text", ...CONTENT },
    expiry: { control: "text", ...CONTENT },
    cvc: { control: "text", ...CONTENT },
    showPaymentSystem: toggleArgType("Show Payment System"),
    showCardNumber: toggleArgType("Show Card Number"),
    showBalance: toggleArgType("Show Balance"),
    showRequisites: toggleArgType("Show Requisites"),
  },
  args: {
    size: "desktop",
    type: "face",
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
      {/* Облики — собственная ось вариантов мастера; SKIN_LABELS несёт
          авторское имя каждого из них. */}
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
      {/* Дизайн-чек Storybook (Аня Багрова) №19: в макете у каждого скина
          два размера — Desktop 332×208 и Mobile 254×160. */}
      <StatesMatrix<BankCardProps>
        columnGroups={[
          {
            label: "Size",
            columns: [
              { label: "Desktop", props: { size: "desktop" } },
              { label: "Mobile", props: { size: "mobile" } },
            ],
          },
        ]}
        rows={[
          { label: "Face", props: { type: "face" } },
          { label: "Back", props: { type: "back" } },
        ]}
        render={(props) => <BankCard {...props} />}
      />
      {/* Каждый блок карты включается независимо. */}
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
