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
    // Mirrors Figma's own "Current variant" panel for ELK / button (Size /
    // State / Type / Style dropdowns) as closely as Storybook's mechanisms
    // allow, so a designer can compare against Figma control-for-control:
    // - Size/Type map 1:1 onto the real `size`/`variant` props below.
    // - Style (Text / Icon Left / Icon Right / Icon Only) is `icon` +
    //   `iconPosition` together — `icon` can't be a plain select on its own
    //   (its real type is a component reference, which no control widget
    //   can represent), so it uses `mapping` to translate a friendly
    //   "None"/"Download" label to the actual component reference/`undefined`
    //   behind the scenes. `iconPosition` is a real string union already,
    //   so it's just a plain select — no mapping needed.
    // - State (Default / Hover / Active / Disabled / Loading): `disabled`/
    //   `isLoading` are real props and already work as checkboxes below;
    //   Hover/Active are CSS pseudo-classes, not props, so they aren't
    //   representable as an arg at all — use the "storybook-addon-pseudo-
    //   states" toolbar (added in .storybook/main.ts) to force them instead,
    //   the standard way to preview pseudo-classes without real mouse input.
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: ["sm", "default", "lg"] },
    icon: {
      control: { type: "select", labels: { none: "None", download: "Download (пример)" } },
      options: ["none", "download"],
      mapping: { none: undefined, download: Download },
    },
    iconPosition: { control: "select", options: ["left", "right", "only"] },
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
// with the canvas itself under 768px (Sizes above is the same markup at
// desktop width).
//
// The viewport is pinned through `globals`, not the old
// `parameters.viewport.defaultViewport` — that form stopped being honoured
// in Storybook 9+, so this story silently rendered at the desktop width
// (measured: 980px canvas, buttons 32/48/56 instead of 32/40/48).
export const SizesMobile: Story = {
  name: "Sizes — Mobile (< 768px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
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
