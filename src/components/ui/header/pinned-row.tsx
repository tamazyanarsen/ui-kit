import * as React from "react"

import { Settings } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CreateMenu,
  HeaderMenu,
  toggleFavourite,
  type CreateMenuItem,
  type HeaderMenuGroup,
  type MenuBannerProps,
} from "@/components/ui/header-menu"

import { MenuOverlay } from "./menu-overlay"
import { NavRow, type HeaderNavItem } from "./nav-row"

// Нижний ряд шапки вместе с панелями «Меню» и «Создать».
//
// Обёртка нужна ровно затем, чтобы закрепление и раскрывающиеся панели
// считались от НИЖНЕГО РЯДА, а не от всей шапки: панель стоит `top-full`, и
// якорем ей обязан быть тот узел, который остаётся на экране.

interface HeaderPinnedRowProps {
  // Объявлено без `| null` — как у `AnchorContext` в autocomplete/root.tsx:
  // выводимый тип `useRef` различается между версиями @types/react (в
  // React 19 `RefObject<T>` включает `| null` в сам T, в React 18 — нет), и
  // один объявленный тип подходит обеим, а место передачи приводит ref к
  // нему.
  rowRef: React.RefObject<HTMLDivElement>
  pinned: boolean
  navItems: HeaderNavItem[]
  activeSection?: string
  showCreate: boolean
  favouritesEnabled: boolean
  openPanel: "menu" | "create" | null
  onOpenPanelChange: (panel: "menu" | "create" | null) => void
  menuGroups: HeaderMenuGroup[]
  menuBanners: MenuBannerProps[]
  createItems: CreateMenuItem[]
  favourites: string[]
  onFavouritesChange?: (favourites: string[]) => void
  onFavouritesSettingsOpen: () => void
}

function HeaderPinnedRow({
  rowRef,
  pinned,
  navItems,
  activeSection,
  showCreate,
  favouritesEnabled,
  openPanel,
  onOpenPanelChange,
  menuGroups,
  menuBanners,
  createItems,
  favourites,
  onFavouritesChange,
  onFavouritesSettingsOpen,
}: HeaderPinnedRowProps) {
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null)
  const createTriggerRef = React.useRef<HTMLButtonElement>(null)

  // Переход по ссылке или плитке закрывает панель. Без этого в SPA шапка
  // оставалась смонтированной, и панель с затемнением и запертой прокруткой
  // висела поверх уже открытой новой страницы: закрыть её снаружи нечем,
  // раскрытость — внутреннее состояние шапки. Обработчик потребителя
  // вызывается первым, как и раньше.
  const close = () => onOpenPanelChange(null)
  const closingGroups = menuGroups.map((group) => ({
    ...group,
    links: group.links.map((link) => ({
      ...link,
      onClick: () => {
        link.onClick?.()
        close()
      },
    })),
  }))
  const closingCreateItems = createItems.map((item) => ({
    ...item,
    onClick: () => {
      item.onClick?.()
      close()
    },
  }))
  // Те же правила для остальных входов, откуда уходят на другую страницу,
  // пока панель открыта: избранный раздел в ряду над затемнением (и в его
  // «Ещё») и кнопка баннера внутри меню. Раньше закрывали только ссылки
  // меню и плитки «Создать».
  const closingNavItems = navItems.map((item) => ({
    ...item,
    onClick: () => {
      item.onClick?.()
      close()
    },
  }))
  const closingBanners = menuBanners.map((banner) =>
    banner.onButtonClick
      ? {
          ...banner,
          onButtonClick: () => {
            banner.onButtonClick?.()
            close()
          },
        }
      : banner
  )

  return (
    <div
      ref={rowRef}
      data-slot="header-pinned-row"
      className={cn("relative bg-[var(--header-bg)]", pinned && "sticky top-0 z-40")}
    >
      <NavRow
        items={closingNavItems}
        activeSection={activeSection}
        menuOpen={openPanel === "menu"}
        onMenuOpenChange={(open) => onOpenPanelChange(open ? "menu" : null)}
        createOpen={openPanel === "create"}
        onCreateOpenChange={(open) => onOpenPanelChange(open ? "create" : null)}
        showCreate={showCreate}
        favouritesEnabled={favouritesEnabled}
        menuTriggerRef={menuTriggerRef}
        createTriggerRef={createTriggerRef}
      />

      {/* ⚠️ Панели рисуются ВСЕГДА, а раскрытость передаётся пропом.
          Дизайн-чек от 13.09, замечание 17: у панели появился уход («fade
          down»), а анимировать уход у снятого из разметки узла нечем —
          решение о снятии теперь принимает сам `MenuOverlay`, отодвигая его
          на длительность анимации. */}
      <MenuOverlay
        open={openPanel === "menu"}
        onClose={() => onOpenPanelChange(null)}
        returnFocusRef={menuTriggerRef}
        footer={
          favouritesEnabled && (
            <Button
              variant="secondary-white"
              size="sm"
              icon={Settings}
              onClick={onFavouritesSettingsOpen}
            >
              Настроить избранное
            </Button>
          )
        }
      >
        <HeaderMenu
          groups={closingGroups}
          banners={closingBanners}
          favourites={favourites}
          activeLink={activeSection}
          // Звезда работает сразу, без «Сохранить»: подсказка пустого
          // избранного так и говорит — «нажмите ☆ справа, чтобы добавить
          // его сюда». Новый раздел встаёт в конец ряда.
          onFavouriteToggle={
            onFavouritesChange &&
            ((value) => onFavouritesChange(toggleFavourite(favourites, value)))
          }
          showFavourites={favouritesEnabled}
          // «Оверлей занимает всё доступное место по высоте, кроме кнопки
          // настройки избранного и её марджинов. И внутри оверлея
          // появляется своя прокрутка» — дизайн-чек от 08.09, замечание 1.
          //
          // Величину считает сам оверлей (`--menu-overlay-panel`): она
          // зависит и от того, сколько шапки осталось на экране, и от
          // высоты кнопки. Прежняя константа «100vh − 14rem» держалась
          // на том, что шапка всегда 128, а это перестало быть правдой,
          // когда закрепляться стал только нижний ряд.
          maxHeight="var(--menu-overlay-panel, calc(100vh - 14rem))"
        />
      </MenuOverlay>

      <MenuOverlay
        open={openPanel === "create"}
        onClose={() => onOpenPanelChange(null)}
        returnFocusRef={createTriggerRef}
      >
        {/* Аудит 14: предел высоты тот же, что у меню навигации, — иначе в
            низком окне нижние плитки обрезались и были недостижимы. */}
        <CreateMenu
          items={closingCreateItems}
          maxHeight="var(--menu-overlay-panel, calc(100vh - 14rem))"
        />
      </MenuOverlay>
    </div>
  )
}

export { HeaderPinnedRow }
