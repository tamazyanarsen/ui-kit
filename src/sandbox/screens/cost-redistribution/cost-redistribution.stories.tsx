import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { CostRedistributionScreen } from "./screen"

const meta = {
  title: "Песочница/Перераспределение ССР",
  component: CostRedistributionScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof CostRedistributionScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
