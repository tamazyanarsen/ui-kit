import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Banner, type BannerProps } from "./banner"
import type { BannerColor, BannerSize } from "./variants"

const SIZES: BannerSize[] = ["desktop", "compact", "mobile"]
const COLORS: BannerColor[] = ["black", "pink", "green", "blue"]

const meta = {
  title: "Content/Banner",
  component: Banner,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    color: { control: "inline-radio", options: COLORS },
    title: { control: "text" },
    description: { control: "text" },
    ctaLabel: { control: "text" },
    bullet: { control: "boolean" },
    image: { control: "boolean" },
    // `image` only reserves the slot; imageSrc fills it (the component draws
    // its own placeholder when the src is empty).
    imageSrc: { control: "text" },
    imageAlt: { control: "text" },
  },
  args: {
    size: "desktop",
    color: "black",
    title: "Оформите вклад с доходностью 20%",
    description: "Ставка действует при открытии вклада онлайн до конца месяца.",
    ctaLabel: "Открыть вклад",
    bullet: false,
    image: true,
    imageAlt: "",
  },
} satisfies Meta<BannerProps>

export default meta
type Story = StoryObj<BannerProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<BannerProps>
        stretch
        cellClassName="min-w-[420px]"
        baseProps={{
          title: "Оформите вклад с доходностью 20%",
          ctaLabel: "Открыть вклад",
        }}
        columnGroups={[
          {
            label: "Color",
            columns: COLORS.map((color) => ({ label: color, props: { color } })),
          },
        ]}
        rows={SIZES.map((size) => ({
          label: `Size: ${size}`,
          props: { size, image: false },
        }))}
        render={(props) => <Banner {...props} />}
      />
      <StatesMatrix<BannerProps>
        stretch
        cellClassName="min-w-[420px]"
        baseProps={{
          title: "Оформите вклад с доходностью 20%",
          ctaLabel: "Открыть вклад",
        }}
        columns={[
          { label: "С картинкой", props: { image: true } },
          { label: "Без картинки", props: { image: false } },
        ]}
        rows={[
          {
            label: "Текстовое описание",
            props: {
              size: "desktop",
              description: "Ставка действует при открытии вклада онлайн.",
            },
          },
          {
            // `bullet` + array `description` only render through
            // `BannerDescription` (desktop/mobile) — the `compact` layout
            // prints `description` as a plain <p>, so an array there
            // collapses into unseparated, un-bulleted text.
            label: "Список с маркерами\n(только desktop / mobile)",
            props: {
              size: "desktop",
              description: ["Первое преимущество", "Второе преимущество"],
              bullet: true,
            },
          },
        ]}
        render={(props) => <Banner {...props} />}
      />
    </div>
  ),
}
