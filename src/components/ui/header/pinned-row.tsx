import * as React from "react"

import { cn } from "@/lib/utils"
import type {
  CreateMenuItem,
  HeaderMenuGroup,
  MenuBannerProps,
} from "@/components/ui/header-menu"

import { HeaderPanels } from "./header-panels"
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

  // Переход закрывает панель (подробности — в `HeaderPanels`). Здесь —
  // только избранный раздел в ряду над затемнением и в его «Ещё».
  const close = () => onOpenPanelChange(null)
  const closingNavItems = navItems.map((item) => ({
    ...item,
    onClick: () => {
      item.onClick?.()
      close()
    },
  }))

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

      <HeaderPanels
        mobile={false}
        openPanel={openPanel}
        onOpenPanelChange={onOpenPanelChange}
        menuTriggerRef={menuTriggerRef}
        createTriggerRef={createTriggerRef}
        menuGroups={menuGroups}
        menuBanners={menuBanners}
        createItems={createItems}
        favourites={favourites}
        onFavouritesChange={onFavouritesChange}
        favouritesEnabled={favouritesEnabled}
        activeSection={activeSection}
        onFavouritesSettingsOpen={onFavouritesSettingsOpen}
      />
    </div>
  )
}

export { HeaderPinnedRow }
