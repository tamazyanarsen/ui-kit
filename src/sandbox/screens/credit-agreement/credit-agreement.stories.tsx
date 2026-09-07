import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { CreditAgreementScreen } from "./screen"

const meta = {
  title: "Песочница/Кредитный договор",
  component: CreditAgreementScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof CreditAgreementScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
