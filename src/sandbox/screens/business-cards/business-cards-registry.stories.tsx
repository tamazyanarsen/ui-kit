import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { BusinessCardsRegistry } from "./registry"

const meta = {
  title: "Песочница/Реестр бизнес-карт",
  component: BusinessCardsRegistry,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof BusinessCardsRegistry>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
