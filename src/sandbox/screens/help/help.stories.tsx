import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { HelpScreen } from "./screen"

const meta = {
  title: "Песочница/Помощь",
  component: HelpScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof HelpScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
