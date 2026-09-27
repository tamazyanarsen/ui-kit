import * as React from "react"

import { cn } from "@/lib/utils"
import { EmployeeMenuNav } from "@/components/ui/employee-menu"
import { FavouritesSettings } from "@/components/ui/header-menu"

import type { ClientHeaderType, HeaderProps, HeaderType } from "./header-props"
import { LogoutModal } from "./logout-modal"
import type { HeaderNavItem } from "./nav-row"
import { HeaderPinnedRow } from "./pinned-row"
import type { HeaderDocumentMenuItem } from "./top-row-menus"
import {
  ClientActions,
  EmployeeActions,
  Logo,
  SignOutPhone,
  TopRow,
  TopRowDivider,
} from "./top-row"
import { useHeaderLayout } from "./use-header-layout"

// Header — «Шапка»: верхняя навигационная полоса приложения. По двум
// собственным таблицам свойств макета это не один плоский список вариантов,
// а две независимые оси: `type` (Client, Employee, Sign Out) выбирает всю
// раскладку, а `clientHeaderType` (Client, Client Without An Account,
// Client is Blocked) — подсостояние только для Client, которое урезает то,
// сколько от клиентской раскладки рисуется. У заблокированного клиента
// пропадают и ряд навигации, и кнопки действий, и группа значков (остаются
// только логотип и переключатель организаций), а у клиента без счёта
// сохраняется урезанная навигация, но пропадает кнопка «Создать» — в
// соответствии с примечанием макета «Меню клиента без расчётных счетов».
//
// ⚠️ У шапки СОТРУДНИКА бургера нет. Дизайн-чек от 13.09, замечание 7: «В
// шапке кабинета сотрудника удалить бургер-меню. У сотрудника не будет
// полноценного меню из шапки, у них в качестве меню выступает главный экран,
// который уже реализован в данном ките» (`EmployeeMenu`). Вместе с кнопкой
// ушли и пропы `showMenu` / `sidebarOpen` / `onSidebarOpenChange`: других
// потребителей у них не было, а оставленные «на будущее» они снова позвали
// бы `Sidebar` в шапку.
//
// Сам компонент — только верхняя полоса и модалки: правила раскладки живут в
// `useHeaderLayout`, нижний ряд с панелями — в `HeaderPinnedRow`, а пропы —
// в `header-props.ts`. Раньше всё это было одной функцией на 266 строк.
function Header(props: HeaderProps) {
  const {
    type = "client",
    clientHeaderType = "client",
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
    onLogout,
    phoneNumber,
    pinned = false,
    className,
  } = props

  const {
    isBlocked,
    showNavRow,
    showCreate,
    favouritesEnabled,
    favouriteLinks,
    resolvedNavItems,
    employeeFavourites,
    pinnedRow,
    pinnedRoot,
    rootRef,
    navRowRef,
    openPanel,
    setOpenPanel,
    logoutOpen,
    setLogoutOpen,
    favouritesSettingsOpen,
    setFavouritesSettingsOpen,
  } = useHeaderLayout(props)

  return (
    <div
      ref={rootRef}
      data-slot="header"
      data-type={type}
      data-client-type={type === "client" ? clientHeaderType : undefined}
      data-pinned={pinned || undefined}
      className={cn(
        // ⚠️ `display: contents`, когда липнет только нижний ряд.
        //
        // `position: sticky` ограничен коробкой СВОЕГО РОДИТЕЛЯ: пока
        // нижний ряд лежал внутри обычного блока шапки, он уезжал вместе с
        // ним, едва блок высотой 128px уходил за верх экрана (замерено:
        // при scrollY=600 ряд стоял на −536, то есть не липнул вовсе).
        // `contents` убирает коробку корня, и рядом становится родителем
        // сама страница — ряд липнет на всю её высоту.
        //
        // Из-за этого фон переезжает на сами полосы: у корня его больше
        // негде рисовать.
        pinnedRow
          ? "contents"
          : "relative flex w-full flex-col bg-[var(--header-bg)]",
        pinnedRoot && "sticky top-0 z-40",
        className
      )}
    >
      <TopRow className={employeeFavourites ? "gap-6" : undefined}>
        <Logo />

        {employeeFavourites ? (
          <>
            <TopRowDivider />
            <EmployeeMenuNav
              links={favouriteLinks}
              activeLink={activeSection}
              showHint={favouritesEnabled}
            />
          </>
        ) : (
          <div className="min-w-0 flex-1" />
        )}

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
            showDivider={employeeFavourites}
          />
        )}

        {type === "sign-out" && phoneNumber && (
          <SignOutPhone phoneNumber={phoneNumber} />
        )}
      </TopRow>

      {showNavRow && (
        <HeaderPinnedRow
          rowRef={navRowRef as React.RefObject<HTMLDivElement>}
          pinned={pinnedRow}
          navItems={resolvedNavItems}
          activeSection={activeSection}
          showCreate={showCreate}
          favouritesEnabled={favouritesEnabled}
          openPanel={openPanel}
          onOpenPanelChange={setOpenPanel}
          menuGroups={menuGroups}
          menuBanners={menuBanners}
          createItems={createItems}
          favourites={favourites}
          onFavouritesChange={onFavouritesChange}
          onFavouritesSettingsOpen={() => setFavouritesSettingsOpen(true)}
        />
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
