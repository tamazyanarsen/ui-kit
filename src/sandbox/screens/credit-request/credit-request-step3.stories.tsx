import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { CreditRequestStep3 } from "./step3"

const meta = {
  title: "Песочница/Подача заявки на кредит. Шаг 3",
  component: CreditRequestStep3,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof CreditRequestStep3>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
