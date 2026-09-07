import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { PlacementCalculatorScreen } from "./screen"

const meta = {
  title: "Песочница/Калькулятор размещения средств",
  component: PlacementCalculatorScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof PlacementCalculatorScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
