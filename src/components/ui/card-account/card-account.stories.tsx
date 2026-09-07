import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"
import type { PaymentSystem } from "@/components/ui/thumbnail"

import { CardAccount, type CardAccountProps } from "./card-account"

const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "unionpay", "visa"]

const meta = {
  title: "Компоненты/Card Account",
  component: CardAccount,
  parameters: { layout: "centered" },
  argTypes: {
    paymentSystem: { control: "select", options: PAYMENT_SYSTEMS },
    // Дизайн-чек №15: окончание номера — то, чего на пиктограмме не хватало.
    number: { control: "text" },
  },
  args: {
    paymentSystem: "mir",
    number: "4482",
  },
} satisfies Meta<CardAccountProps>

export default meta
type Story = StoryObj<CardAccountProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<CardAccountProps>
      columns={PAYMENT_SYSTEMS.map((paymentSystem) => ({
        label: paymentSystem,
        props: { paymentSystem },
      }))}
      rows={[
        { label: "С окончанием номера", props: { number: "4482" } },
        { label: "Без номера", props: { number: undefined } },
      ]}
      render={(props) => <CardAccount {...props} />}
    />
  ),
}
