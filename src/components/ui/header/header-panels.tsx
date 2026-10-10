import * as React from "react"

import { Settings } from "@/icons"
import { Button } from "@/components/ui/button"
import {
  CreateMenu,
  HeaderMenu,
  MobileHeaderMenu,
  toggleFavourite,
  type CreateMenuItem,
  type HeaderMenuGroup,
  type MenuBannerProps,
} from "@/components/ui/header-menu"

import { MenuOverlay } from "./menu-overlay"

// Две раскрывающиеся панели шапки — «Меню» и «Создать» — вместе с правилом
// «переход закрывает панель».
//
// Вынесены из нижнего ряда (`HeaderPinnedRow`), когда у шапки появилась
// мобильная форма: там нижнего ряда нет, кнопки стоят в верхней полосе, а
// панели те же самые и раскрываются под ней. Различается только наполнение
// панели «Меню»: на десктопе — колонки карточек (`HeaderMenu`), на телефоне —
// вкладки «Избранное / Все разделы» (`MobileHeaderMenu`).

type HeaderPanel = "menu" | "create" | null

interface HeaderPanelsProps {
  mobile: boolean
  openPanel: HeaderPanel
  onOpenPanelChange: (panel: HeaderPanel) => void
  menuTriggerRef: React.RefObject<HTMLButtonElement | null>
  createTriggerRef: React.RefObject<HTMLButtonElement | null>
  menuGroups: HeaderMenuGroup[]
  menuBanners: MenuBannerProps[]
  createItems: CreateMenuItem[]
  favourites: string[]
  onFavouritesChange?: (favourites: string[]) => void
  favouritesEnabled: boolean
  activeSection?: string
  onFavouritesSettingsOpen: () => void
  /** Карточка организации над вкладками мобильного меню. */
  mobileMenuHeader?: React.ReactNode
}

/**
 * Предел высоты панели — считает `MenuOverlay` (`--menu-overlay-panel`).
 * Запасное значение нужно только до первого замера.
 */
const PANEL_HEIGHT = "var(--menu-overlay-panel, calc(100vh - 14rem))"

function HeaderPanels({
  mobile,
  openPanel,
  onOpenPanelChange,
  menuTriggerRef,
  createTriggerRef,
  menuGroups,
  menuBanners,
  createItems,
  favourites,
  onFavouritesChange,
  favouritesEnabled,
  activeSection,
  onFavouritesSettingsOpen,
  mobileMenuHeader,
}: HeaderPanelsProps) {
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
  // Кнопка баннера внутри меню тоже уводит на другую страницу.
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
  // Звезда работает сразу, без «Сохранить»: подсказка пустого избранного
  // так и говорит — «нажмите ☆ справа, чтобы добавить его сюда». Новый
  // раздел встаёт в конец ряда.
  const onFavouriteToggle =
    onFavouritesChange &&
    ((value: string) => onFavouritesChange(toggleFavourite(favourites, value)))

  return (
    <>
      {/* ⚠️ Панели рисуются ВСЕГДА, а раскрытость передаётся пропом.
          Дизайн-чек от 13.09, замечание 17: у панели появился уход, а
          анимировать уход у снятого из разметки узла нечем — решение о
          снятии принимает сам `MenuOverlay`, отодвигая его на длительность
          анимации. */}
      <MenuOverlay
        open={openPanel === "menu"}
        onClose={close}
        returnFocusRef={menuTriggerRef}
        footer={
          // На телефоне кнопка настройки стоит внутри самого меню, в
          // закреплённой нижней панели (`Button Menu` макета).
          !mobile &&
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
        {mobile ? (
          <MobileHeaderMenu
            groups={closingGroups}
            favourites={favourites}
            activeLink={activeSection}
            onFavouriteToggle={onFavouriteToggle}
            showFavourites={favouritesEnabled}
            header={mobileMenuHeader}
            onFavouritesSettingsOpen={onFavouritesSettingsOpen}
            // Мобильное меню занимает экран целиком, до нижней кромки.
            height={PANEL_HEIGHT}
          />
        ) : (
          <HeaderMenu
            groups={closingGroups}
            banners={closingBanners}
            favourites={favourites}
            activeLink={activeSection}
            onFavouriteToggle={onFavouriteToggle}
            showFavourites={favouritesEnabled}
            // «Оверлей занимает всё доступное место по высоте, кроме кнопки
            // настройки избранного и её марджинов. И внутри оверлея
            // появляется своя прокрутка» — дизайн-чек от 08.09, замечание 1.
            // Величина зависит и от того, сколько шапки осталось на экране,
            // и от высоты кнопки, поэтому её меряет сам оверлей.
            maxHeight={PANEL_HEIGHT}
          />
        )}
      </MenuOverlay>

      <MenuOverlay
        open={openPanel === "create"}
        onClose={close}
        returnFocusRef={createTriggerRef}
      >
        {/* Аудит 14: предел высоты тот же, что у меню навигации, — иначе в
            низком окне нижние плитки обрезались и были недостижимы. */}
        <CreateMenu items={closingCreateItems} maxHeight={PANEL_HEIGHT} />
      </MenuOverlay>
    </>
  )
}

export { HeaderPanels }
export type { HeaderPanel, HeaderPanelsProps }
