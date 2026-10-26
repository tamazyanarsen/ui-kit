import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import { ViewportScope } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { FavouritesHelpSheet } from "./favourites-help-sheet"

/* Штора открывается из мобильного меню шапки (кнопка «Как настроить
   избранное» и звёзды разделов). Здесь — отдельно, в мобильной форме: у неё
   нет десктопного вида, на десктопе кнопка открывает «Настройку избранного». */
type PlaygroundArgs = {
  openByDefault: boolean
  shareUrl: string
}

function FavouritesHelpSheetDemo({
  openByDefault = true,
  shareUrl = "https://corp.domrfbank.ru",
}: Partial<PlaygroundArgs>) {
  const [open, setOpen] = useState(openByDefault)
  return (
    <ViewportScope viewport="mobile">
      <div className="p-8">
        <Button variant="secondary-grey" size="sm" onClick={() => setOpen(true)}>
          Как настроить избранное
        </Button>
        <FavouritesHelpSheet open={open} onOpenChange={setOpen} shareUrl={shareUrl} />
      </div>
    </ViewportScope>
  )
}

const meta = {
  title: "Компоненты/Меню/Подсказка «Настройте избранное с компьютера»",
  component: FavouritesHelpSheetDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    openByDefault: { control: "boolean", description: "Штора открыта сразу" },
    shareUrl: {
      control: "text",
      description: "Ссылка, которой делится «Поделиться ссылкой» (navigator.share)",
    },
  },
  args: {
    openByDefault: true,
    shareUrl: "https://corp.domrfbank.ru",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase className="p-0">
      <StorySection
        title="Мобильное меню шапки"
        description="Два шага строками, серый информер и «Поделиться ссылкой». На телефоне без navigator.share кнопка ничего не делает."
      >
        <FavouritesHelpSheetDemo openByDefault={false} />
      </StorySection>
    </StoryShowcase>
  ),
}
