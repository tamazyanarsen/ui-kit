import type { Meta, StoryObj } from "@storybook/react-vite"

import { Banner } from "./banner"
import type { BannerColor, BannerSize } from "./variants"

const meta = {
  title: "Content/Banner",
  component: Banner,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "select", options: ["desktop", "compact", "mobile"] satisfies BannerSize[] },
    color: { control: "select", options: ["black", "pink", "green", "blue"] satisfies BannerColor[] },
  },
  args: {
    title: "Оформите вклад с доходностью 20%",
    description: "Ставка действует при открытии вклада онлайн до конца месяца.",
    ctaLabel: "Открыть вклад",
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: { size: "desktop" },
}

export const Compact: Story = {
  args: { size: "compact" },
}

export const Mobile: Story = {
  args: { size: "mobile" },
  parameters: { layout: "centered" },
}

// `bullet` + array `description` only render through `BannerDescription`
// (desktop/mobile) — the `compact` layout prints `description` as a plain
// <p>, so an array there collapses into unseparated, un-bulleted text.
// "desktop" is the size that actually demonstrates what these two args do.
export const WithBulletList: Story = {
  args: {
    size: "desktop",
    description: ["Первое преимущество", "Второе преимущество"],
    bullet: true,
  },
}

export const ColorVariants: Story = {
  // Zero-arg render maps a hardcoded color array — the inherited `color`
  // select control is dead here.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["black", "pink", "green", "blue"] as BannerColor[]).map((color) => (
        <Banner
          key={color}
          size="compact"
          color={color}
          title="Оформите вклад с доходностью 20%"
          image={false}
        />
      ))}
    </div>
  ),
}
