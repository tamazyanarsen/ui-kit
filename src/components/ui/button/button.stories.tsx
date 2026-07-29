import type { Meta, StoryObj } from "@storybook/react-vite"
import { Download } from "lucide-react"

import { Button, type ButtonProps } from "./button"

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "primary",
  "secondary-black",
  "secondary-grey",
  "secondary-white",
  "secondary-outline",
  "destructive",
]

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
  args: { children: "Button" },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-white p-4">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { icon: Download, iconPosition: "left", children: "Скачать" },
}

export const IconOnly: Story = {
  args: { icon: Download, iconPosition: "only", "aria-label": "Скачать" },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
