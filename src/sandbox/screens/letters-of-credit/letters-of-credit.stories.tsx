import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { LettersOfCreditScreen } from "./screen"

const meta = {
  title: "Песочница/Реестр заявок на аккредитив",
  component: LettersOfCreditScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof LettersOfCreditScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
