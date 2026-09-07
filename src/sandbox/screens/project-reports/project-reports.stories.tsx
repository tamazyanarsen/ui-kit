import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { ProjectReportsScreen } from "./screen"

const meta = {
  title: "Песочница/Отчёты по проектам",
  component: ProjectReportsScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof ProjectReportsScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
