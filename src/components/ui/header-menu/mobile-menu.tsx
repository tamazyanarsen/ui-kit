import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu"
import { Scrollbar } from "@/components/ui/scrollbar"
import { TabHeadings } from "@/components/ui/tab-headings"

import { compactGroups } from "./compact-list"
import { resolveFavouriteLinks } from "./favourites"
import { PageLink, type HeaderMenuGroup } from "./header-menu-parts"

// MobileHeaderMenu — раскрытое меню навигации в мобильной шапке.
//
// Макет — пример `Меню / Избранное` (70467:11707) в разделе «Использование в
// макете» компонента Tab Headings: под шапкой 56px белая панель во всю
// высоту экрана, внутри (поля 16 по бокам, 8 сверху, интервал 24) —
// карточка организации, заголовки-вкладки «Избранное / Все разделы»,
// список ссылок со звёздами; внизу закреплена панель `Button Menu` с
// кнопкой «Как настроить избранное» и маской-градиентом.
//
// Карточек-групп и колонок десктопного меню здесь нет: на 360 они не
// помещаются, а макет показывает плоский список строк 14/20 с интервалом 16.
// Содержимого вкладки «Все разделы» в макете нет — разделы идут теми же
// строками, сгруппированными под заголовками групп (подпись группы та же,
// что в карточке десктопного меню).

interface MobileHeaderMenuProps {
  groups?: HeaderMenuGroup[]
  favourites?: string[]
  onFavouriteToggle?: (value: string) => void
  activeLink?: string
  /**
   * Избранное включено: вкладка «Избранное», звёзды и кнопка «Как настроить
   * избранное». Без него остаётся один заголовок «Все разделы» — по
   * описанию Tab Headings, «единственный, в активном состоянии без
   * возможности клика».
   */
  showFavourites?: boolean
  /** Блок над заголовками — в шапке это карточка организации. */
  header?: React.ReactNode
  /** Кнопка «Как настроить избранное» в нижней панели. */
  onFavouritesSettingsOpen?: () => void
  /** Высота панели — до низа экрана; считает `MenuOverlay`. */
  height?: number | string
  className?: string
}

type MobileMenuTab = "favourites" | "all"

function MobileHeaderMenu({
  groups: rawGroups = [],
  favourites = [],
  onFavouriteToggle,
  activeLink,
  showFavourites = true,
  header,
  onFavouritesSettingsOpen,
  height,
  className,
}: MobileHeaderMenuProps) {
  const groups = compactGroups(rawGroups) ?? []
  const [tab, setTab] = React.useState<MobileMenuTab>(
    showFavourites ? "favourites" : "all"
  )
  const activeTab: MobileMenuTab = showFavourites ? tab : "all"
  const favouriteLinks = resolveFavouriteLinks(groups, favourites)
  const showSettings = showFavourites && Boolean(onFavouritesSettingsOpen)

  const link = (item: HeaderMenuGroup["links"][number]) => (
    <PageLink
      key={item.value}
      link={item}
      mobile
      favourite={favourites.includes(item.value)}
      showStar={showFavourites}
      active={item.value === activeLink}
      onFavouriteToggle={onFavouriteToggle}
    />
  )

  return (
    <div
      data-slot="header-mobile-menu"
      className={cn("flex w-full flex-col bg-[var(--header-bg)]", className)}
      style={{ height }}
    >
      {/* Окно прокрутки — колонка, а содержимое растягивается на её высоту:
          пока разделов мало, панель с кнопкой стоит у нижней кромки экрана,
          как в макете, а не сразу под списком. */}
      <Scrollbar className="relative flex min-h-0 w-full flex-1 flex-col">
        <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-2 pb-6">
          {header}

          <TabHeadings
            items={
              showFavourites
                ? [
                    { value: "favourites", label: "Избранное" },
                    { value: "all", label: "Все разделы" },
                  ]
                : [{ value: "all", label: "Все разделы" }]
            }
            value={activeTab}
            onValueChange={(value) => setTab(value as MobileMenuTab)}
          />

          <div
            role="tabpanel"
            data-slot="header-mobile-menu-panel"
            className="flex w-full flex-col gap-4"
          >
            {activeTab === "favourites" ? (
              favouriteLinks.length > 0 ? (
                favouriteLinks.map(link)
              ) : (
                <p className="text-p2-medium text-[var(--header-meta-fg)]">
                  Здесь пока пусто — отметьте раздел звездой на вкладке «Все
                  разделы», чтобы он появился в избранном.
                </p>
              )
            ) : (
              groups.map((group) => (
                <section
                  key={group.value}
                  data-slot="header-mobile-menu-group"
                  className="flex w-full flex-col gap-4 not-first:pt-4"
                >
                  <p className="flex items-start gap-2 text-p2-medium text-[var(--header-menu-group-fg)]">
                    {group.icon && (
                      <span className="flex shrink-0 pt-0.5 [&_svg]:size-4">
                        {group.icon}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                      {group.title}
                    </span>
                  </p>
                  {group.links.map(link)}
                </section>
              ))
            )}
          </div>
        </div>

        {showSettings && (
          // Панель кнопок — общий `Button Menu` кита (в макете это именно
          // его инстанс, 70467:11747), липнущий к низу окна прокрутки
          // меню, а не страницы: страница под раскрытым меню заперта.
          <ButtonMenu pinned={false} className="sticky bottom-0 z-10">
            <Button variant="secondary-grey" onClick={onFavouritesSettingsOpen}>
              Как настроить избранное
            </Button>
          </ButtonMenu>
        )}
      </Scrollbar>
    </div>
  )
}

export { MobileHeaderMenu }
export type { MobileHeaderMenuProps }
