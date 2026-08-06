import type { Meta, StoryObj } from "@storybook/react-vite"

import { Shimmer } from "./shimmer"

const meta = {
  title: "Pattern/Shimmer",
  component: Shimmer,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Shimmer>

export default meta
type Story = StoryObj<typeof meta>

export const TextLines: Story = {
  // Zero-arg render hardcodes shape/sizing per block — the inherited
  // `shape` select control (docgen-resolved from the string-literal union)
  // would sit in the panel doing nothing.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Shimmer className="h-6 w-2/3" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-5/6" />
      <Shimmer className="h-3 w-1/3" />
    </div>
  ),
}

export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Shimmer shape="square" className="size-12" />
      <Shimmer shape="circle" className="size-12" />
      <Shimmer shape="square" className="h-10 w-28" />
    </div>
  ),
}

export const OfferCard: Story = {
  name: "Composite card skeleton",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-sm flex-col gap-3 rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-5 w-16" />
      </div>
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-3/4" />
      <div className="flex items-center gap-3">
        <Shimmer shape="circle" className="size-8" />
        <Shimmer className="h-3 w-24" />
      </div>
    </div>
  ),
}
