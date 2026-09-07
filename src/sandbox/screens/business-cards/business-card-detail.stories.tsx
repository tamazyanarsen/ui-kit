import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { BusinessCardDetail } from "./detail"

const meta = {
  title: "Песочница/Деталка бизнес-карты",
  component: BusinessCardDetail,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof BusinessCardDetail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
