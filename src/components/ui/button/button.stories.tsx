import type { Meta, StoryObj } from "@storybook/react-vite"
import { Download } from "@/icons"

import { Button, type ButtonProps } from "./button"

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "primary",
  "secondary-black",
  "secondary-grey",
  "secondary-white",
  "secondary-outline",
  "destructive",
  "secondary-logo-black",
  "secondary-logo-border-white",
  "secondary-logo-white",
  "secondary-logo-grey",
]

const meta = {
  title: "Interaction/Button/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: ["sm", "default", "lg"] },
    // `icon` takes a component reference — Storybook's auto-inferred
    // control for a function-typed prop is a "Set object" JSON editor,
    // which can't represent a component and so never does anything.
    // `iconPosition` only matters once an icon is set, which the disabled
    // `icon` control makes impossible from the Controls panel — both were
    // dead controls on every story that doesn't hardcode `icon` in its own
    // args (i.e. every story except WithIcon/IconOnly, where it's fixed).
    icon: { control: false },
    iconPosition: { control: false },
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

// Design-check #9: sizes are already mobile-first responsive per
// ui/button/button.png's own redline sheet (default/lg switch height+padding
// at the `md:` breakpoint — 40->48px and 48->56px, matching that sheet's
// M/L Mobile vs M/L Desktop rows almost to the pixel). `md:` is a viewport
// media query, not a container one, so this story only reads as "mobile"
// with the canvas itself under 768px — set via Storybook's own viewport
// toolbar (Sizes above is the same markup at desktop width).
export const SizesMobile: Story = {
  name: "Sizes — Mobile (< 768px)",
  parameters: { viewport: { defaultViewport: "mobile1" } },
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
