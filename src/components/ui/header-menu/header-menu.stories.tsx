import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Settings } from "@/icons"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import { MENU_BANNERS, MENU_FAVOURITES, MENU_GROUPS } from "@/stories/menu-fixtures"
import { Button } from "@/components/ui/button"

import { HeaderMenu } from "./header-menu"
import type { HeaderMenuProps } from "./header-menu"

/* Панель раскрывается под шапкой на затемнении, поэтому в историях она
   стоит на том же фоне, что и в макете (Menu Overlay, нода 70303:58313) —
   на белом фоне Storybook её нижние скругления попросту не читались бы. */
function MenuStage({ children }: { children: React.ReactNode }) {
  return <div className="w-full bg-[var(--modal-backdrop)]/70 pb-8">{children}</div>
}

/* Дизайн-чек №17: вместо JSON-редакторов `groups`/`banners` — счётчики,
   которые режут один и тот же демо-набор, а «избранное» живёт в состоянии
   истории, иначе звёзды не переключались бы. */
type PlaygroundArgs = Omit<
  HeaderMenuProps,
  "groups" | "banners" | "favourites" | "onFavouriteToggle" | "maxHeight" | "className"
> & {
  groupCount: number
  bannerCount: number
  maxHeight: number
}

function HeaderMenuDemo({
  groupCount = MENU_GROUPS.length,
  bannerCount = MENU_BANNERS.length,
  maxHeight = 0,
  ...props
}: Partial<PlaygroundArgs>) {
  const [favourites, setFavourites] = useState(MENU_FAVOURITES)
  return (
    <MenuStage>
      <HeaderMenu
        {...props}
        groups={MENU_GROUPS.slice(0, groupCount)}
        banners={MENU_BANNERS.slice(0, bannerCount)}
        favourites={favourites}
        onFavouriteToggle={(value) =>
          setFavourites((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
          )
        }
        maxHeight={maxHeight > 0 ? maxHeight : undefined}
      />
    </MenuStage>
  )
}

const meta = {
  title: "Компоненты/Раскрытое меню навигации",
  component: HeaderMenuDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: [2, 3, 4],
      description: "Ширина 1920 — четыре колонки, 1280 — три",
    },
    showFavourites: {
      control: "boolean",
      description: "Показывать звёзды «в избранное»",
    },
    groupCount: {
      control: { type: "range", min: 1, max: MENU_GROUPS.length, step: 1 },
      description: "Сколько групп разделов показать",
    },
    bannerCount: {
      control: { type: "range", min: 0, max: MENU_BANNERS.length, step: 1 },
      description: "Баннеров больше одного — появляется переключатель точками",
    },
    maxHeight: {
      control: { type: "range", min: 0, max: 900, step: 20 },
      description: "Максимальная высота панели; 0 — без ограничения и без скролла",
    },
  },
  args: {
    groupCount: MENU_GROUPS.length,
    bannerCount: MENU_BANNERS.length,
    columns: 4,
    showFavourites: true,
    maxHeight: 0,
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
        title="1920 — четыре колонки"
        description="Баннер занимает верх последней колонки; звезда «в избранное» проявляется по наведению на строку."
      >
        <HeaderMenuDemo columns={4} />
      </StorySection>

      <StorySection
        title="1280 — три колонки"
        description="Группы и баннер перестраиваются в три колонки."
      >
        <HeaderMenuDemo columns={3} bannerCount={1} />
      </StorySection>

      <StorySection
        title="Без избранного"
        description="Если избранное не подключено, звёзды не показываются вовсе."
      >
        <MenuStage>
          <HeaderMenu groups={MENU_GROUPS.slice(0, 4)} columns={2} showFavourites={false} />
        </MenuStage>
      </StorySection>

      <StorySection
        title="Собственный скролл панели"
        description="Когда групп больше, чем помещается по высоте, у панели появляется свой ELK / scrollbar."
      >
        <HeaderMenuDemo columns={4} maxHeight={420} />
      </StorySection>

      <StorySection
        title="С кнопкой «Настроить избранное»"
        description="В макете кнопка стоит по центру на затемнении, на 32px ниже панели."
      >
        <MenuStage>
          <HeaderMenu
            groups={MENU_GROUPS.slice(0, 6)}
            columns={3}
            favourites={MENU_FAVOURITES}
          />
          <div className="flex justify-center pt-8">
            <Button variant="secondary-white" size="sm" icon={Settings}>
              Настроить избранное
            </Button>
          </div>
        </MenuStage>
      </StorySection>
    </StoryShowcase>
  ),
}
