import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, sizeArgType } from "@/stories/matrix"
import { PROMOS, PromoArt } from "@/stories/new-components-fixtures"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { PromoBanner } from "@/components/ui/banner"

import { PromoCarousel, type PromoCarouselProps } from "./promo-carousel"

/**
 * Promo Carousel — карусель баннеров витрины предложений (Правки UI-Kit от
 * 25.10, пункт «Карусель баннеров в мобильном виде» и правило каркаса
 * «Механики свайпов»): зацикленная лента `useLoopTrack` на нативной
 * прокрутке со scroll-snap.
 *
 * Desktop: два баннера в кадре, зазор 24, стрелки при наведении, без точек.
 * Mobile: один баннер, зазор 16, свайп, точки снизу (12 от баннера).
 */
type PlaygroundArgs = PromoCarouselProps & {
  viewport?: Viewport
  count?: number
}

const meta = {
  title: "Компоненты/Promo Carousel",
  component: PromoCarousel,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    count: {
      control: { type: "range", min: 1, max: PROMOS.length },
      description: "Число баннеров",
    },
    desktopPerView: { control: { type: "range", min: 1, max: 3 } },
    "aria-label": { control: "text" },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "mobile" as Viewport,
    count: 4,
    desktopPerView: 2,
    "aria-label": "Предложения",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// Функция, а не компонент: карусель считает слайды по своим детям, и
// `<Banners/>` был бы для неё одним слайдом.
function banners(count = PROMOS.length) {
  return PROMOS.slice(0, count).map((promo) => (
    <PromoBanner
      key={promo.title}
      title={promo.title}
      description={promo.description}
      actionLabel={promo.actionLabel}
      color={promo.color}
      image={<PromoArt tone={promo.tone} />}
    />
  ))
}

export const Playground: Story = {
  render: ({ viewport, count, ...args }) => (
    <ViewportScope viewport={viewport}>
      <div className={viewport === "mobile" ? "w-[343px]" : "w-full max-w-[880px]"}>
        <PromoCarousel {...args}>
          {banners(count)}
        </PromoCarousel>
      </div>
    </ViewportScope>
  ),
}

export const Examples: Story = {
  name: "Examples (Desktop / Mobile, число баннеров)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection title="Desktop — 4 баннера" description="Два в кадре, стрелки при наведении">
        <ViewportScope viewport="desktop">
          <div className="w-[880px]">
            <PromoCarousel>
              {banners()}
            </PromoCarousel>
          </div>
        </ViewportScope>
      </StorySection>
      <StorySection
        title="Mobile — 4 баннера"
        description="Один в кадре, свайп по кругу, точки; у 4-го длинный текст — высота та же 144"
      >
        <ViewportScope viewport="mobile">
          <div className="w-[343px]">
            <PromoCarousel>
              {banners()}
            </PromoCarousel>
          </div>
        </ViewportScope>
      </StorySection>
      <StorySection title="Desktop — 2 баннера" description="Листать нечего: без копий, стрелок и точек">
        <ViewportScope viewport="desktop">
          <div className="w-[880px]">
            <PromoCarousel>
              {banners(2)}
            </PromoCarousel>
          </div>
        </ViewportScope>
      </StorySection>
      <StorySection title="Mobile — 1 баннер" description="Без копий, свайпа и точек">
        <ViewportScope viewport="mobile">
          <div className="w-[343px]">
            <PromoCarousel>
              {banners(1)}
            </PromoCarousel>
          </div>
        </ViewportScope>
      </StorySection>
    </StoryShowcase>
  ),
}
