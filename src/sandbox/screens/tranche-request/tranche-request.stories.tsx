import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { TrancheRequestScreen } from "./screen"

const meta = {
  title: "Песочница/Подача заявки на транш",
  component: TrancheRequestScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof TrancheRequestScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
