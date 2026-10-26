import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, sizeArgType } from "@/stories/matrix"
import { PROMOS, PromoArt } from "@/stories/new-components-fixtures"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { PromoBanner, type PromoBannerColor, type PromoBannerProps } from "./promo-banner"

/**
 * Promo Banner — баннер витрины предложений, листается PromoCarousel
 * (Правки UI-Kit от 25.10, пункт «Карусель баннеров в мобильном виде»).
 *
 * Mobile: поля 16, заголовок одна строка с многоточием, описание две строки
 * с многоточием (место всегда 32), до кнопки 24, высота 144, картинка в
 * правом нижнем углу.
 */
const COLORS: PromoBannerColor[] = ["blue", "lavender", "mint", "grey"]

type PlaygroundArgs = PromoBannerProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Promo Banner",
  component: PromoBanner,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    color: { control: "inline-radio", options: COLORS },
    title: { control: "text" },
    description: { control: "text" },
    actionLabel: { control: "text" },
    actionVariant: {
      control: "select",
      options: ["secondary-black", "primary", "secondary-white"],
    },
    image: {
      description: "Картинка в правом нижнем углу (узел); растр — imageSrc",
      control: { type: "inline-radio", labels: { art: "Иллюстрация", none: "Нет" } },
      options: ["art", "none"],
      mapping: { art: <PromoArt />, none: undefined },
    },
    imageSrc: { control: "text" },
    imageAlt: { control: "text" },
    onAction: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "mobile" as Viewport,
    color: "blue",
    title: PROMOS[0].title,
    description: PROMOS[0].description,
    actionLabel: "Подробнее",
    actionVariant: "secondary-black",
    image: "art" as unknown as React.ReactNode,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <ViewportScope viewport={viewport}>
      <div className={viewport === "mobile" ? "w-[343px]" : "w-[428px]"}>
        <PromoBanner {...args} />
      </div>
    </ViewportScope>
  ),
}

export const Matrix: Story = {
  name: "Matrix (цвета, длинный текст)",
  parameters: { controls: { disable: true } },
  render: () => (
    <StatesMatrix<PromoBannerProps>
      responsive
      stretch
      baseProps={{ actionLabel: "Подробнее", className: "w-[343px] desktop:w-[428px]" }}
      columns={COLORS.map((color, i) => ({
        label: color,
        props: { color, image: <PromoArt tone={PROMOS[i].tone} /> },
      }))}
      rows={[
        { label: "Короткий текст", props: { title: PROMOS[1].title, description: PROMOS[1].description } },
        { label: "Длинный текст", props: { title: PROMOS[3].title, description: PROMOS[3].description } },
        { label: "Без описания", props: { title: PROMOS[2].title } },
      ]}
      render={(props) => <PromoBanner {...props} />}
    />
  ),
}
