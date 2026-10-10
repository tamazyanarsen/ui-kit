import * as React from "react"

import { Menu, Plus, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type {
  CreateMenuItem,
  HeaderMenuGroup,
  MenuBannerProps,
} from "@/components/ui/header-menu"

import { HeaderPanels, type HeaderPanel } from "./header-panels"
import { NotificationMenu, type NotificationMenuItem } from "./notification-menu"
import { ProfileMenu, type ProfileMenuOrganization } from "./profile-menu"
import { Logo, MessagesButton } from "./top-row"
import { useOrganization } from "./use-organization"

// Мобильная форма шапки — `ELK / header`, `Size=Mobile` (70467:6340 …
// 70467:6353, версия 1.4.0, релиз 70.37).
//
// Одна полоса 56px вместо двух по 64: поля 16 по бокам, 16 сверху и 8 снизу,
// логотип 95×32 слева; справа (интервал 24) — колокольчик и конверт
// плитками 32×32 (интервал 12) и две круглые кнопки 32×32 (интервал 8):
// «Создать» (Blue 223, плюс) и «Меню» (Dark Blue 1412, бургер). «При
// нажатии на кнопку меню иконка меняется на Cross» — пример «Открытое меню
// в мобильной версии». Нижнего ряда с избранным нет: избранное живёт во
// вкладке мобильного меню, а переключатель организаций — карточкой над
// вкладками (`Меню / Избранное`, 70467:11707). Кошелька («Документы») и
// плитки профиля в полосе нет.
//
// По типам: `Client Is Blocked` и `Sign Out` — только логотип (телефона
// поддержки у мобильного Sign Out в макете нет); у `Client Without Account`
// нет «Создать», как и на десктопе. У `Employee` мобильного варианта нет
// («Нет варианта» в сете) — шапка сотрудника остаётся десктопной, см.
// `Header`.
//
// Подложка белая, линии снизу нет: у символа `Size=Mobile` обводки нет, а
// во всех примерах использования полоса стоит на белом (`White 101`).

interface MobileHeaderProps {
  rootRef: React.Ref<HTMLDivElement>
  /** Кнопки, уведомления и меню. Выключено у Client Is Blocked и Sign Out. */
  showActions: boolean
  showCreate: boolean
  pinned: boolean
  openPanel: HeaderPanel
  onOpenPanelChange: (panel: HeaderPanel) => void
  favouritesEnabled: boolean
  messageCount: number
  onMessagesClick?: () => void
  notificationItems: NotificationMenuItem[]
  organizations: ProfileMenuOrganization[]
  organizationId?: string
  onOrganizationChange?: (id: string) => void
  contactPerson?: React.ReactNode
  showOrgSettings: boolean
  onOrgSettingsClick?: () => void
  onLogoutClick: () => void
  menuGroups: HeaderMenuGroup[]
  menuBanners: MenuBannerProps[]
  createItems: CreateMenuItem[]
  favourites: string[]
  onFavouritesChange?: (favourites: string[]) => void
  activeSection?: string
  onFavouritesSettingsOpen: () => void
  className?: string
  /** Атрибуты корня от `Header` (`data-type` и т. п.). */
  rootProps?: Record<`data-${string}`, string | boolean | undefined>
  /** Модалки шапки (выход, настройка избранного) — общие с десктопом. */
  children?: React.ReactNode
}

/** Плитка 32×32 (поле 4 вокруг глифа 24) вместо десктопных 56×64. */
const MOBILE_ICON_TILE = "h-8 w-8"

function MobileHeader({
  rootRef,
  showActions,
  showCreate,
  pinned,
  openPanel,
  onOpenPanelChange,
  favouritesEnabled,
  messageCount,
  onMessagesClick,
  notificationItems,
  organizations,
  organizationId,
  onOrganizationChange,
  contactPerson,
  showOrgSettings,
  onOrgSettingsClick,
  onLogoutClick,
  menuGroups,
  menuBanners,
  createItems,
  favourites,
  onFavouritesChange,
  activeSection,
  onFavouritesSettingsOpen,
  className,
  rootProps,
  children,
}: MobileHeaderProps) {
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null)
  const createTriggerRef = React.useRef<HTMLButtonElement>(null)
  const { activeOrganizationId, changeOrganization } = useOrganization(
    organizations,
    organizationId,
    onOrganizationChange
  )
  const menuOpen = openPanel === "menu"
  const createOpen = openPanel === "create"

  return (
    <div
      {...rootProps}
      ref={rootRef}
      data-slot="header"
      data-size="mobile"
      className={cn(
        "relative flex w-full flex-col bg-[var(--header-bg)]",
        // Полоса одна — закрепляется вся шапка (у десктопа липнет только
        // нижний ряд, но его здесь нет).
        pinned && "sticky top-0 z-40",
        className
      )}
    >
      <div
        data-slot="header-mobile-row"
        className="flex w-full items-center justify-between gap-4 px-4 pt-4 pb-2"
      >
        <Logo />

        {showActions && (
          <div className="flex shrink-0 items-center gap-6">
            <div className="flex items-center gap-3">
              <NotificationMenu
                items={notificationItems}
                // Только непрочитанные — то же правило, что у плитки на
                // десктопе (`countUnread` в top-row.tsx).
                unreadCount={notificationItems.filter((item) => !item.viewed).length}
                className={MOBILE_ICON_TILE}
              />
              <MessagesButton
                count={messageCount}
                onClick={onMessagesClick}
                className={MOBILE_ICON_TILE}
              />
            </div>
            <div className="flex items-center gap-2">
              {showCreate && (
                <Button
                  ref={createTriggerRef}
                  variant="primary"
                  size="sm"
                  iconPosition="only"
                  icon={createOpen ? X : Plus}
                  aria-label="Создать"
                  aria-expanded={createOpen}
                  onClick={() => onOpenPanelChange(createOpen ? null : "create")}
                />
              )}
              <Button
                ref={menuTriggerRef}
                variant="secondary-black"
                size="sm"
                iconPosition="only"
                icon={menuOpen ? X : Menu}
                aria-label="Меню"
                aria-expanded={menuOpen}
                onClick={() => onOpenPanelChange(menuOpen ? null : "menu")}
              />
            </div>
          </div>
        )}
      </div>

      {showActions && (
        <HeaderPanels
          mobile
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
          mobileMenuHeader={
            organizations.length > 0 && (
              <ProfileMenu
                trigger="card"
                organizations={organizations}
                value={activeOrganizationId ?? ""}
                onValueChange={changeOrganization}
                contactPerson={contactPerson}
                showSetting={showOrgSettings}
                showLogout
                onSettingsClick={onOrgSettingsClick}
                onLogoutClick={onLogoutClick}
              />
            )
          }
        />
      )}

      {children}
    </div>
  )
}

export { MobileHeader }
