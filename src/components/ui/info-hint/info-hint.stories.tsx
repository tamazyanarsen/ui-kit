import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Info } from "@/icons"
import { cn } from "@/lib/utils"

import { StorySection, StoryShowcase, optionsArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { ItemInformationField } from "@/components/ui/item-information-field"

import { InfoHint, type InfoHintProps } from "./info-hint"

/* InfoHint — значок «Информация» (i) с подсказкой (Правки UI-Kit от 25.10):
   на десктопе тултип по наведению, в мобильном виде нажатие открывает штору
   с текстом без кнопок. Своего сета в Figma у него нет — это поведение
   значков `icon / information` в Information Field, шапке Block Widget и
   строке Item. */

type PlaygroundArgs = Omit<InfoHintProps, "children" | "title"> & {
  viewport: Exclude<Viewport, "auto">
  title?: string
}

// Триггер получает от Tooltip/Modal ref и обработчики — поэтому forwardRef
// и проброс пропсов, как у настоящей кнопки.
const IconButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  function IconButton({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Информация"
        {...props}
        className={cn(
          "flex size-4 shrink-0 cursor-help items-center justify-center text-[var(--ifield-icon-fg)] outline-none focus-visible:focus-ring",
          className
        )}
      >
        <Info aria-hidden="true" className="size-4" />
      </button>
    )
  }
)

/** Значок в своей форме (Desktop/Mobile) — компонент витрины для Controls. */
function InfoHintDemo({ viewport, title, ...args }: PlaygroundArgs) {
  return (
    <ViewportScope viewport={viewport}>
      <InfoHint {...args} title={title || undefined}>
        <IconButton />
      </InfoHint>
    </ViewportScope>
  )
}

const meta = {
  title: "Компоненты/Info Hint",
  component: InfoHintDemo,
  parameters: { layout: "centered" },
  argTypes: {
    viewport: optionsArgType<"desktop" | "mobile">(
      "Вид",
      { desktop: "Desktop", mobile: "Mobile" },
      "inline-radio"
    ),
    content: { control: "text", table: { category: "Контент" } },
    title: {
      name: "Заголовок шторы (мобайл)",
      description: "Пусто — «Информация»",
      control: "text",
      table: { category: "Контент" },
    },
    direction: optionsArgType("Direction (десктоп)", {
      "down-center": "Над значком",
      "top-center": "Под значком",
      left: "Left",
      right: "Right",
    }),
  },
  args: {
    viewport: "mobile",
    content: "Ставка меняется вслед за ключевой ставкой ЦБ РФ",
    title: "",
    direction: "down-center",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: (args) => <InfoHintDemo {...args} />,
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="В Information Field"
        description="Нажатие на «i» в мобильном виде — штора «Информация» (или особый заголовок), на десктопе — тултип."
      >
        <div className="grid gap-8 desktop:grid-cols-2">
          {(["mobile", "desktop"] as const).map((viewport) => (
            <ViewportScope key={viewport} viewport={viewport}>
              <div className="flex flex-col gap-2">
                <span className="text-p3-medium">{viewport}</span>
                <ItemInformationField
                  label="Ставка"
                  value="12,5%"
                  labelInfo="Годовая процентная ставка"
                  valueInfo="Ставка меняется вслед за ключевой ставкой ЦБ РФ"
                  valueInfoTitle="Плавающая ставка"
                />
              </div>
            </ViewportScope>
          ))}
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
