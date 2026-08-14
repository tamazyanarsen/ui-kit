import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Banner, type BannerProps } from "./banner"
import type { BannerColor, BannerSize } from "./variants"

/**
 * Banner — «Баннер» с канваса Banner, Slider (694:120035). Истории у него не
 * было вовсе, хотя это компонент-сет со своей матрицей:
 *
 *   size  desktop big | desktop small | mobile
 *   цвет  чёрный | розовый | зелёный | синий (в макете это отдельные
 *         секции «Colored banner» / «Black banner», а не свойство варианта)
 *
 * В коде размеры называются desktop / compact / mobile — «desktop big» и
 * «desktop small» соответственно.
 */
const SIZES: BannerSize[] = ["desktop", "compact", "mobile"]
const COLORS: BannerColor[] = ["black", "pink", "green", "blue"]

const meta = {
  title: "Компоненты/Banner",
  component: Banner,
  parameters: { layout: "padded" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: SIZES,
      description: "desktop = «desktop big», compact = «desktop small»",
    },
    color: { control: "inline-radio", options: COLORS },
    title: { control: "text" },
    description: { control: "text" },
    bullet: { control: "boolean", description: "Описание списком с маркерами" },
    image: {
      control: "boolean",
      description:
        "В десктопной версии изображение есть всегда, в мобильной может отсутствовать",
    },
    imageSrc: { control: "text" },
    imageAlt: { control: "text" },
    ctaLabel: { control: "text", description: "Пустая подпись — кнопки нет" },
  },
  args: {
    size: "desktop",
    color: "black",
    title: "Заголовок баннера",
    description: "Короткое пояснение под заголовком",
    bullet: false,
    image: true,
    ctaLabel: "Подробнее",
  },
} satisfies Meta<BannerProps>

export default meta
type Story = StoryObj<BannerProps>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Цвета"
        description="Четыре заливки: чёрная и три цветные. Градиенты сняты с экспорта макета, а не подобраны."
      >
        <div className="flex w-full flex-col gap-4">
          {COLORS.map((color) => (
            <Banner
              key={color}
              size="compact"
              color={color}
              title="Заголовок баннера"
              description="Короткое пояснение под заголовком"
              ctaLabel="Подробнее"
            />
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Размеры"
        description="desktop big — высокий баннер с иллюстрацией, desktop small — полоса на всю ширину, mobile — вертикальная карточка."
      >
        <div className="flex w-full flex-col gap-4">
          <Banner
            size="desktop"
            color="blue"
            title="Заголовок баннера"
            description="Короткое пояснение под заголовком"
            ctaLabel="Подробнее"
          />
          <Banner
            size="compact"
            color="green"
            title="Заголовок баннера"
            ctaLabel="Подробнее"
          />
          <div className="w-82">
            <Banner
              size="mobile"
              color="pink"
              title="Заголовок баннера"
              description="Короткое пояснение под заголовком"
              ctaLabel="Подробнее"
            />
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Описание списком"
        description="`bullet` превращает описание в список с маркерами."
      >
        <Banner
          size="desktop"
          color="black"
          title="Заголовок баннера"
          bullet
          description={["Первое преимущество", "Второе преимущество", "Третье"]}
          ctaLabel="Подробнее"
        />
      </StorySection>

      <StorySection
        title="Без изображения и без кнопки"
        description="В мобильной версии изображение может отсутствовать; пустая подпись убирает кнопку."
      >
        <div className="w-82">
          <Banner
            size="mobile"
            color="blue"
            title="Заголовок баннера"
            description="Короткое пояснение под заголовком"
            image={false}
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
