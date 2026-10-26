import * as React from "react"

import { cn } from "@/lib/utils"
import { inertProps } from "@/lib/inert"
import { Button } from "@/components/ui/button"
import { Scrollbar } from "@/components/ui/scrollbar"
import { TabHeadings } from "@/components/ui/tab-headings"

import { compactGroups } from "./compact-list"
import { resolveFavouriteLinks } from "./favourites"
import { FavouritesHelpSheet } from "./favourites-help-sheet"
import { PageLink, type HeaderMenuGroup } from "./header-menu-parts"
import { useTabPager } from "./use-tab-pager"

// MobileHeaderMenu — раскрытое меню навигации в мобильной шапке.
//
// Макет — пример `Меню / Избранное` (70467:11707) в разделе «Использование в
// макете» компонента Tab Headings: под шапкой белая панель во всю высоту
// экрана, сверху (поле 8) — строка организации во всю ширину, через 24
// заголовки-вкладки «Избранное / Все разделы» (H2 Mobile 22/30 через 16).
//
// Правки UI-Kit от 25.10 (поверх макета):
//   • вкладки — горизонтальная лента на нативной прокрутке с привязкой к
//     странице: свайп листает содержимое, заголовок и стрелки листают ленту
//     плавно; активна вкладка, занимающая больше половины; невидимая —
//     `inert` и `aria-hidden` (механика — в `use-tab-pager.ts`);
//   • «Все разделы» — серые карточки групп (Grey 106, скругление 16, поля 24,
//     между карточками 16; заголовок — значок 16 и название P1 Grey 868
//     через 8; до разделов 24, разделы через 16), под ними подсказка о
//     полной версии;
//   • избранное на телефоне не настраивается: кнопка «Как настроить
//     избранное» (только на «Избранном», гаснет по ходу листания 1 − 2t) и
//     звёзды разделов открывают штору «Настройте избранное с компьютера»;
//     звезда только показывает состояние;
//   • у разделов с `favouritable: false` звезды нет.

interface MobileHeaderMenuProps {
  groups?: HeaderMenuGroup[]
  favourites?: string[]
  /**
   * Переключение избранного. На телефоне звезда избранное НЕ переключает
   * (Правки UI-Kit от 25.10) — проп остаётся признаком того, что избранное
   * ведётся, и для совместимости.
   */
  onFavouriteToggle?: (value: string) => void
  activeLink?: string
  /**
   * Избранное включено: вкладка «Избранное», звёзды и кнопка «Как настроить
   * избранное». Без него остаётся один заголовок «Все разделы» — по
   * описанию Tab Headings, «единственный, в активном состоянии без
   * возможности клика».
   */
  showFavourites?: boolean
  /**
   * Блок над заголовками — в шапке это строка организации. Ставится во всю
   * ширину панели, без её полей: у мобильной строки `Item` поля свои.
   */
  header?: React.ReactNode
  /**
   * Прежний обработчик кнопки «Как настроить избранное». Теперь кнопка и
   * звёзды открывают штору-подсказку внутри меню; проп оставлен ради
   * совместимости и не вызывается.
   */
  onFavouritesSettingsOpen?: () => void
  /** Ссылка, которой делится штора-подсказка. По умолчанию — corp.domrfbank.ru. */
  shareUrl?: string
  /** Высота панели — до низа экрана; считает `MenuOverlay`. */
  height?: number | string
  className?: string
}

type MobileMenuTab = "favourites" | "all"

function MobileHeaderMenu({
  groups: rawGroups = [],
  favourites = [],
  activeLink,
  showFavourites = true,
  header,
  shareUrl,
  height,
  className,
}: MobileHeaderMenuProps) {
  const groups = compactGroups(rawGroups) ?? []
  const tabs: MobileMenuTab[] = showFavourites ? ["favourites", "all"] : ["all"]
  const pager = useTabPager(tabs.length)
  const activeTab = tabs[pager.active] ?? "all"
  const favouriteLinks = resolveFavouriteLinks(groups, favourites)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const openHelp = () => setHelpOpen(true)

  // Кнопка гаснет по ходу листания к «Всем разделам»: 1 − 2t.
  const settingsOpacity = Math.max(0, 1 - 2 * pager.progress)
  const settingsHidden = activeTab !== "favourites"

  const link = (item: HeaderMenuGroup["links"][number]) => (
    <PageLink
      key={item.value}
      link={item}
      mobile
      favourite={favourites.includes(item.value)}
      showStar={showFavourites}
      active={item.value === activeLink}
      onStarHint={openHelp}
    />
  )

  const pages: Record<MobileMenuTab, React.ReactNode> = {
    favourites:
      favouriteLinks.length > 0 ? (
        <div className="flex w-full flex-col gap-4">{favouriteLinks.map(link)}</div>
      ) : (
        <p className="text-p2-medium text-[var(--header-meta-fg)]">
          Здесь пока пусто — отметьте раздел звездой на вкладке «Все
          разделы», чтобы он появился в избранном.
        </p>
      ),
    all: (
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          {groups.map((group) => (
            <section
              key={group.value}
              data-slot="header-mobile-menu-group"
              className="flex w-full flex-col gap-6 rounded-[16px] bg-[var(--header-menu-group-bg)] p-6"
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
              <div className="flex w-full flex-col gap-4">{group.links.map(link)}</div>
            </section>
          ))}
        </div>
        <p
          data-slot="header-mobile-menu-hint"
          className="text-p2-medium text-[var(--header-meta-fg)]"
        >
          Откройте corp.domrfbank.ru с компьютера для просмотра всех разделов
        </p>
      </div>
    ),
  }

  return (
    <div
      data-slot="header-mobile-menu"
      className={cn("flex w-full flex-col bg-[var(--header-bg)]", className)}
      style={{ height }}
    >
      {/* Окно прокрутки — колонка, а содержимое растягивается на её высоту:
          пока разделов мало, кнопка стоит у нижней кромки экрана. */}
      <Scrollbar className="relative flex min-h-0 w-full flex-1 flex-col">
        <div className="flex w-full flex-1 flex-col gap-6 pt-2 pb-6">
          {header}

          <TabHeadings
            className="px-4"
            items={tabs.map((tab) => ({
              value: tab,
              label: tab === "favourites" ? "Избранное" : "Все разделы",
            }))}
            value={activeTab}
            onValueChange={(value) =>
              pager.goTo(Math.max(0, tabs.indexOf(value as MobileMenuTab)))
            }
          />

          {/* Лента вкладок: по странице на вкладку, поля 16 — у каждой
              страницы. Вертикальная прокрутка остаётся за меню. */}
          <div
            ref={pager.pagerRef}
            data-slot="header-mobile-menu-pager"
            onScroll={pager.onScroll}
            onPointerDown={pager.release}
            onTouchStart={pager.release}
            onWheel={pager.release}
            className="flex w-full snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ height: pager.height }}
          >
            {tabs.map((tab, index) => {
              const hidden = index !== pager.active
              return (
                <div
                  key={tab}
                  ref={(element) => {
                    pager.pageRefs.current[index] = element
                  }}
                  role="tabpanel"
                  aria-label={tab === "favourites" ? "Избранное" : "Все разделы"}
                  aria-hidden={hidden || undefined}
                  {...inertProps(hidden)}
                  data-slot="header-mobile-menu-panel"
                  data-tab={tab}
                  className="flex w-full shrink-0 snap-start [scroll-snap-stop:always] flex-col px-4"
                >
                  {pages[tab]}
                </div>
              )
            })}
          </div>
        </div>

        {showFavourites && (
          // Кнопка прижата к низу окна прокрутки меню (страница под меню
          // заперта). Только на «Избранном»: гаснет по ходу листания и на
          // «Всех разделах» не нажимается.
          <div
            data-slot="header-mobile-menu-settings"
            aria-hidden={settingsHidden || undefined}
            {...inertProps(settingsHidden)}
            className={cn(
              "sticky bottom-0 z-10 flex w-full bg-[var(--header-bg)] px-4 pt-2 pb-6",
              settingsHidden && "pointer-events-none"
            )}
            style={{ opacity: settingsHidden ? 0 : settingsOpacity }}
          >
            <Button
              variant="secondary-grey"
              size="lg"
              aria-haspopup="dialog"
              className="w-full"
              onClick={openHelp}
            >
              Как настроить избранное
            </Button>
          </div>
        )}
      </Scrollbar>

      <FavouritesHelpSheet
        open={helpOpen}
        onOpenChange={setHelpOpen}
        shareUrl={shareUrl}
      />
    </div>
  )
}

export { MobileHeaderMenu }
export type { MobileHeaderMenuProps }
