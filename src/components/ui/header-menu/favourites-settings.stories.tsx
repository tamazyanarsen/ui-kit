import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { MENU_FAVOURITES, MENU_GROUPS } from "@/stories/menu-fixtures"
import { Button } from "@/components/ui/button"

import { FavouritesSettings } from "./favourites-settings"

/* Модалка управляется извне (в шапке её открывает кнопка «Настроить
   избранное»), поэтому в историях ей нужна обёртка с собственным
   состоянием — и с показом того, что получилось после «Сохранить». */
type PlaygroundArgs = {
  viewport?: Viewport
  favouriteCount: number
  groupCount: number
  openByDefault: boolean
}

function FavouritesSettingsDemo({
  favouriteCount = MENU_FAVOURITES.length,
  groupCount = MENU_GROUPS.length,
  openByDefault = true,
}: Partial<PlaygroundArgs>) {
  const [favourites, setFavourites] = useState(MENU_FAVOURITES.slice(0, favouriteCount))
  const [open, setOpen] = useState(openByDefault)
  const groups = MENU_GROUPS.slice(0, groupCount)

  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <Button variant="secondary-grey" size="sm" onClick={() => setOpen(true)}>
        Настроить избранное
      </Button>
      <p className="text-p2-medium text-[var(--header-meta-fg)]">
        Избранное после сохранения: {favourites.join(", ") || "пусто"}
      </p>
      <FavouritesSettings
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        favourites={favourites}
        onSave={setFavourites}
      />
    </div>
  )
}

const meta = {
  // Дизайн-чек №3 №11: «соединить компоненты в папку меню». Туда входят
  // Настройка избранного, Раскрытое меню навигации, Раскрытое меню
  // создания и Header — все четыре части одного навигационного узла.
  title: "Компоненты/Меню/Настройка избранного",
  component: FavouritesSettingsDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    favouriteCount: {
      control: { type: "range", min: 0, max: MENU_FAVOURITES.length, step: 1 },
      description: "Сколько разделов в группе «Добавлено»",
    },
    groupCount: {
      control: { type: "range", min: 1, max: MENU_GROUPS.length, step: 1 },
      description: "Сколько групп меню участвует — из них собираются оба списка",
    },
    openByDefault: { control: "boolean", description: "Модалка открыта сразу" },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    favouriteCount: MENU_FAVOURITES.length,
    groupCount: MENU_GROUPS.length,
    openByDefault: true,
    viewport: "auto" as Viewport,
  },
  // Дизайн-чек №3 №19: контрол `viewport` из панели истории форсирует
  // десктопную/мобильную форму, не трогая размер вьюпорта. Обёртка общая
  // для всех историй файла — в матрицах она не мешает: там форму задаёт
  // сама матрица (`responsive`), а этот скоуп остаётся в «auto».
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
    <StoryShowcase className="p-0">
      <StorySection
        title="Добавлено несколько разделов"
        description="Две группы: «Добавлено» с заполненными звёздами и ручкой перетаскивания, «Остальные разделы» — контурные звёзды по алфавиту."
      >
        <FavouritesSettingsDemo favouriteCount={6} openByDefault={false} />
      </StorySection>

      <StorySection
        title="Добавлено множество разделов"
        description="Когда добавлено всё, второй группы нет вовсе."
      >
        <FavouritesSettingsDemo groupCount={2} favouriteCount={8} openByDefault={false} />
      </StorySection>

      <StorySection
        title="Пусто"
        description="Ни одного избранного раздела — вариант «Настройка избранного — пусто»."
      >
        <FavouritesSettingsDemo favouriteCount={0} openByDefault={false} />
      </StorySection>
    </StoryShowcase>
  ),
}
