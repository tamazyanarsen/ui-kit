import * as React from "react"

import { Settings } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CreateMenu,
  FavouritesSettings,
  HeaderMenu,
  resolveFavouriteLinks,
  toggleFavourite,
  type CreateMenuItem,
  type HeaderMenuGroup,
  type MenuBannerProps,
} from "@/components/ui/header-menu"

import { LogoutModal } from "./logout-modal"
import { MenuOverlay } from "./menu-overlay"
import { NavRow, type HeaderNavItem } from "./nav-row"
import type { NotificationMenuItem } from "./notification-menu"
import type { ProfileMenuOrganization } from "./profile-menu"
import type { HeaderDocumentMenuItem } from "./top-row-menus"
import {
  ClientActions,
  EmployeeActions,
  Logo,
  SidebarToggle,
  SignOutPhone,
  TopRow,
} from "./top-row"

// Header — "Шапка": the app's top nav bar. Per the spec's own two property
// tables, this is two independent axes rather than one flat variant list:
// `type` (Client/Employee/Sign Out) picks the whole layout, and
// `clientHeaderType` (Client/Client Without An Account/Client is Blocked)
// is a Client-only sub-state that trims how much of the Client layout
// renders — a blocked client loses the nav row, action buttons and the
// icon cluster entirely (just logo + org switcher), an account-less client
// keeps a reduced nav but loses the "Создать" button, matching the spec's
// own "Меню клиента без расчётных счетов" callout. `showMenu` is the
// hamburger that pairs with a separate Sidebar component for Employee
// layouts (Show Menu: True/False in the spec) — it toggles the paired
// Sidebar's own open state, so this component only renders the icon and
// reports the click, it doesn't own a Sidebar itself.
//
// Избранное — один список, а не два. Пункты нижнего ряда и звёзды в
// раскрытом меню — это одно и то же состояние: как только передан
// `menuGroups`, ряд СЧИТАЕТСЯ из `favourites` (в порядке избранного), а не
// берётся из `navItems`. Так задокументировано в MENU DOCS: вариант
// `Size=None` подсказывает «нажмите ☆ справа, чтобы добавить его сюда»,
// комментарий «Начально закреплённые наборы» перечисляет три стартовых
// набора избранного, а «Настройка избранного» делит все разделы на
// «Добавлено» и «Остальные разделы». `navItems` остаётся только для
// шапки без раскрытого меню.
//
// Части шапки лежат рядом: верхняя полоса — `top-row.tsx`, нижний ряд с
// навигацией — `nav-row.tsx`, раскрывающиеся панели — `menu-overlay.tsx`.

type HeaderType = "client" | "employee" | "sign-out"
type ClientHeaderType = "client" | "client-without-account" | "client-is-blocked"

interface HeaderProps {
  type?: HeaderType
  clientHeaderType?: ClientHeaderType
  /**
   * Пункты нижнего ряда напрямую — только для шапки без раскрытого меню.
   * Если передан `menuGroups`, ряд считается из `favourites`, а этот проп
   * игнорируется (см. комментарий об избранном выше).
   */
  navItems?: HeaderNavItem[]
  /** Группы разделов в панели, которая раскрывается по кнопке «Меню». */
  menuGroups?: HeaderMenuGroup[]
  menuBanners?: MenuBannerProps[]
  /**
   * Избранные разделы — значения ссылок из `menuGroups`, в том порядке, в
   * котором они стоят в нижнем ряду.
   */
  favourites?: string[]
  /**
   * Вызывается и при щелчке по звезде в раскрытом меню, и при сохранении
   * «Настройки избранного». Пока он не передан, звёзды и кнопка
   * «Настроить избранное» не показываются: менять состояние было бы некуда.
   */
  onFavouritesChange?: (favourites: string[]) => void
  /** Значение текущего раздела — подсвечивается в ряду и в меню. */
  activeSection?: string
  /** Плитки в панели, которая раскрывается по кнопке «Создать». */
  createItems?: CreateMenuItem[]
  documentMenuItems?: HeaderDocumentMenuItem[]
  messageCount?: number
  onMessagesClick?: () => void
  notificationItems?: NotificationMenuItem[]
  organizations?: ProfileMenuOrganization[]
  organizationId?: string
  onOrganizationChange?: (id: string) => void
  contactPerson?: React.ReactNode
  showOrgSettings?: boolean
  onOrgSettingsClick?: () => void
  employeeName?: React.ReactNode
  showMenu?: boolean
  sidebarOpen?: boolean
  onSidebarOpenChange?: (open: boolean) => void
  onLogout?: () => void
  phoneNumber?: React.ReactNode
  className?: string
}

function Header({
  type = "client",
  clientHeaderType = "client",
  navItems = [],
  menuGroups = [],
  menuBanners = [],
  favourites = [],
  onFavouritesChange,
  activeSection,
  createItems = [],
  documentMenuItems = [],
  messageCount = 0,
  onMessagesClick,
  notificationItems = [],
  organizations = [],
  organizationId,
  onOrganizationChange,
  contactPerson,
  showOrgSettings = true,
  onOrgSettingsClick,
  employeeName,
  showMenu = false,
  sidebarOpen = false,
  onSidebarOpenChange,
  onLogout,
  phoneNumber,
  className,
}: HeaderProps) {
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [favouritesSettingsOpen, setFavouritesSettingsOpen] =
    React.useState(false)
  // Раскрыта всегда не больше одной панели: в макете кнопка второй панели
  // в этот момент стоит в обычном состоянии, а не в состоянии «закрыть».
  const [openPanel, setOpenPanel] = React.useState<"menu" | "create" | null>(
    null
  )

  const isBlocked = type === "client" && clientHeaderType === "client-is-blocked"
  const showNavRow = type === "client" && !isBlocked
  const showCreate = type === "client" && clientHeaderType === "client"
  const favouritesEnabled = Boolean(onFavouritesChange)

  // Нижний ряд — это избранное, когда есть из чего его считать. Раньше
  // `navItems` и `favourites` были двумя независимыми списками, поэтому
  // звезда в раскрытом меню ничего не меняла в шапке.
  const resolvedNavItems: HeaderNavItem[] = React.useMemo(() => {
    if (menuGroups.length === 0) return navItems
    return resolveFavouriteLinks(menuGroups, favourites).map((link) => ({
      value: link.value,
      label: link.label,
      onClick: link.onClick,
    }))
  }, [menuGroups, favourites, navItems])

  React.useEffect(() => {
    if (!showNavRow) setOpenPanel(null)
  }, [showNavRow])

  return (
    <div
      data-slot="header"
      data-type={type}
      data-client-type={type === "client" ? clientHeaderType : undefined}
      className={cn(
        "relative flex w-full flex-col bg-[var(--header-bg)]",
        className
      )}
    >
      <TopRow>
        {type === "employee" && showMenu && (
          <SidebarToggle open={sidebarOpen} onOpenChange={onSidebarOpenChange} />
        )}

        <Logo />

        <div className="min-w-0 flex-1" />

        {type === "client" && (
          <ClientActions
            showIcons={!isBlocked}
            messageCount={messageCount}
            onMessagesClick={onMessagesClick}
            notificationItems={notificationItems}
            documentMenuItems={documentMenuItems}
            organizations={organizations}
            organizationId={organizationId}
            onOrganizationChange={onOrganizationChange}
            contactPerson={contactPerson}
            showOrgSettings={showOrgSettings}
            onOrgSettingsClick={onOrgSettingsClick}
            onLogoutClick={() => setLogoutOpen(true)}
          />
        )}

        {type === "employee" && (
          <EmployeeActions
            notificationItems={notificationItems}
            employeeName={employeeName}
            onSettingsClick={onOrgSettingsClick}
            onLogoutClick={() => setLogoutOpen(true)}
          />
        )}

        {type === "sign-out" && phoneNumber && (
          <SignOutPhone phoneNumber={phoneNumber} />
        )}
      </TopRow>

      {showNavRow && (
        <NavRow
          items={resolvedNavItems}
          activeSection={activeSection}
          menuOpen={openPanel === "menu"}
          onMenuOpenChange={(open) => setOpenPanel(open ? "menu" : null)}
          createOpen={openPanel === "create"}
          onCreateOpenChange={(open) => setOpenPanel(open ? "create" : null)}
          showCreate={showCreate}
          favouritesEnabled={favouritesEnabled}
        />
      )}

      {openPanel === "menu" && (
        <MenuOverlay
          onClose={() => setOpenPanel(null)}
          footer={
            favouritesEnabled && (
              <Button
                variant="secondary-white"
                size="sm"
                icon={Settings}
                onClick={() => setFavouritesSettingsOpen(true)}
              >
                Настроить избранное
              </Button>
            )
          }
        >
          <HeaderMenu
            groups={menuGroups}
            banners={menuBanners}
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
            // Панель ниже кнопки «Настроить избранное» не уезжает: 128px
            // шапки + 32px отступа + 32px кнопки + 32px снизу = 14rem.
            maxHeight="calc(100vh - 14rem)"
          />
        </MenuOverlay>
      )}

      {openPanel === "create" && (
        <MenuOverlay onClose={() => setOpenPanel(null)}>
          <CreateMenu items={createItems} />
        </MenuOverlay>
      )}

      {onFavouritesChange && (
        <FavouritesSettings
          open={favouritesSettingsOpen}
          onOpenChange={setFavouritesSettingsOpen}
          groups={menuGroups}
          favourites={favourites}
          onSave={onFavouritesChange}
        />
      )}

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => onLogout?.()}
      />
    </div>
  )
}

export { Header }
export type {
  ClientHeaderType,
  HeaderDocumentMenuItem,
  HeaderNavItem,
  HeaderProps,
  HeaderType,
}
