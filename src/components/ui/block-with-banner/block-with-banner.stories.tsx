import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, ViewportMatrix, sizeArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { BlockWithBanner, type BlockWithBannerProps } from "./block-with-banner"

/**
 * Block With Banner — белый блок с инлайн-баннером, подложенным под него
 * (Правки UI-Kit от 25.10, пункт «Инлайн-баннер под блоком»).
 *
 * Desktop: заход 32, поля 32, видимая часть 96, кнопка справа.
 * Mobile: заход 16, поля 16, кнопка под текстом через 8.
 * Без баннера — подложки нет.
 */
type PlaygroundArgs = Omit<BlockWithBannerProps, "children"> & {
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Block With Banner",
  component: BlockWithBanner,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    banner: { control: "text", description: "Текст баннера; пусто — без баннера и подложки" },
    actionLabel: { control: "text" },
    href: { control: "text" },
    external: { control: "boolean", description: "Переход наружу: значок ExternalLink" },
    onAction: { table: { disable: true } },
    blockClassName: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    banner: "Подключите накопительный счёт — доход на остаток каждый день",
    actionLabel: "Подключить",
    href: "",
    external: false,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function BlockBody() {
  return (
    <div className="flex h-60 flex-col gap-2 p-4 desktop:p-8">
      <p className="text-h3-adaptive">Мои сбережения</p>
      <p className="text-p1-medium-adaptive text-[var(--grey-284)]">Содержимое блока</p>
    </div>
  )
}

export const Playground: Story = {
  render: ({ viewport, href, ...args }) => (
    <div className="bg-[var(--page-bg)] p-6">
      <ViewportScope viewport={viewport}>
        <div className={viewport === "mobile" ? "w-[343px]" : "w-[640px]"}>
          <BlockWithBanner {...args} href={href || undefined}>
            <BlockBody />
          </BlockWithBanner>
        </div>
      </ViewportScope>
    </div>
  ),
}

export const Examples: Story = {
  name: "Examples (Desktop / Mobile, без баннера)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection title="С баннером">
        <ViewportMatrix>
          {(viewport) => (
            <div className={viewport === "mobile" ? "w-[343px]" : "w-[640px]"}>
              <BlockWithBanner
                banner="Подключите накопительный счёт — доход на остаток каждый день"
                actionLabel="Подключить"
              >
                <BlockBody />
              </BlockWithBanner>
            </div>
          )}
        </ViewportMatrix>
      </StorySection>
      <StorySection title="Переход наружу" description="Ссылка в новой вкладке, значок ExternalLink справа">
        <ViewportScope viewport="desktop">
          <div className="w-[640px]">
            <BlockWithBanner banner="Узнайте больше о НСО" actionLabel="На сайт" href="https://example.com" external>
              <BlockBody />
            </BlockWithBanner>
          </div>
        </ViewportScope>
      </StorySection>
      <StorySection title="Без баннера" description="Подложки нет — белый блок на всю высоту">
        <ViewportScope viewport="desktop">
          <div className="w-[640px]">
            <BlockWithBanner>
              <BlockBody />
            </BlockWithBanner>
          </div>
        </ViewportScope>
      </StorySection>
    </StoryShowcase>
  ),
}
