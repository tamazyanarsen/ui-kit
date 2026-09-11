import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StorySection,
  StoryShowcase,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

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
const COLORS: BannerColor[] = ["black", "pink", "green", "blue"]

type PlaygroundArgs = BannerProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Banner",
  component: Banner,
  parameters: { layout: "padded" },
  /* `size` в мастере (694:121318) — одно свойство с тремя значениями, и
     мобильное среди них: отдельной оси Desktop/Mobile у баннера нет,
     поэтому контрол `viewport` не нужен — форму задаёт сам размер. */
  argTypes: {
    size: optionsArgType<BannerSize>(
      "size",
      {
        desktop: "desktop big",
        compact: "desktop small",
        mobile: "mobile",
      },
      "inline-radio"
    ),
    color: {
      control: "inline-radio",
      options: COLORS,
      description:
        "В макете это не свойство варианта, а отдельные секции «Colored banner» / «Black banner»",
    },
    image: toggleArgType(
      "Show Image",
      "В десктопной версии изображение есть всегда, в мобильной может отсутствовать"
    ),
    bullet: toggleArgType("Bullet", "Описание списком с маркерами"),
    title: { control: "text", table: { category: "Контент" } },
    description: { control: "text", table: { category: "Контент" } },
    imageSrc: { control: "text", table: { category: "Контент" } },
    imageAlt: { control: "text", table: { category: "Контент" } },
    ctaLabel: {
      control: "text",
      description: "Пустая подпись — кнопки нет",
      table: { category: "Контент" },
    },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook. */
  args: {
    size: "desktop",
    color: "black",
    image: true,
    bullet: false,
    title: "Заголовок баннера",
    description: "Короткое пояснение под заголовком",
    ctaLabel: "Подробнее",
  },
  // Обёртка осталась для историй, которые всё же выставляют `viewport`
  // явно (например, мобильные примеры): скоуп форсирует форму, не трогая
  // размер вьюпорта.
  decorators: [
    (Story, context) => (
      <ViewportScope viewport={(context.args as { viewport?: Viewport }).viewport}>
        <Story />
      </ViewportScope>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

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
