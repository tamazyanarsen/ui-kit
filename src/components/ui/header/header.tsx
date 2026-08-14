import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
  ChevronDown,
  CircleUser,
  LogOut,
  Mail,
  Menu,
  Plus,
  Settings,
  Star,
  Wallet,
  X,
} from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Divider } from "@/components/ui/divider"
import { Dropdown } from "@/components/ui/dropdown"
import {
  CreateMenu,
  HeaderMenu,
  type CreateMenuItem,
  type HeaderMenuGroup,
  type MenuBannerProps,
} from "@/components/ui/header-menu"
import { useOverflowCount } from "@/lib/use-overflow-count"

import { DomRfLogo } from "./dom-rf-logo"
import { LogoutModal } from "./logout-modal"
import { NotificationMenu, type NotificationMenuItem } from "./notification-menu"
import {
  ProfileMenu,
  type ProfileMenuOrganization,
} from "./profile-menu"

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
// Дизайн-чек №30 — «компонент собран из разрозненных элементов,
// используется некорректная иконка кнопки, также используется наряду с
// раскрывающимися списками нераскрывающиеся». Всё три пункта — про нижний
// ряд, и все три сняты по макету `Menu Header (ELK)` (нода 70303:48974):
//
//  1. Ряд собран не «на глаз», а по макету: группа кнопок (интервал 8) →
//     вертикальный `ELK / divider` во всю высоту минус 16px сверху и снизу
//     → пункты навигации, всё с интервалом 32 внутри контейнера шириной до
//     1800px. Обе полосы шапки — ровно 64px с рамкой снизу.
//  2. Кнопок в макете две и обе размера S: «Меню» (secondary-black,
//     `icon / classic burger`) и «Создать» (primary, `icon / plus`).
//     Раньше здесь стояла одна кнопка «Платёж» с иконкой CirclePlus —
//     это и есть «некорректная иконка кнопки».
//  3. У пункта навигации в макете нет собственного выпадающего списка:
//     раскрываются только «Меню», «Создать» и «Ещё». Поэтому у
//     `HeaderNavItem` больше нет поля `items` — вместо разнородных
//     дропдаунов есть одна панель `HeaderMenu` (см. ui/header-menu),
//     которая раскрывается по кнопке «Меню». Сами пункты нижнего ряда —
//     это избранные разделы: их отмечают звёздами в раскрытом меню, а
//     когда избранное пустое, вместо них стоит подсказка (вариант
//     `Size=None`, нода 70303:49022).
//
// Nav overflow reuses the exact "Ещё" mechanism already built for Tabs/
// Switcher (useOverflowCount): per the spec's own "Взаимодействие с
// элементом" note, items should move into "Ещё" one at a time as space
// runs out, not at fixed breakpoints. Макет подтверждает это отдельным
// вариантом `Size=With More`, где «Ещё» — единственный пункт с шевроном.
type HeaderType = "client" | "employee" | "sign-out"
type ClientHeaderType = "client" | "client-without-account" | "client-is-blocked"

interface HeaderNavItem {
  value: string
  label: React.ReactNode
  /** «Show Logotype» в макете — иконка 24px перед названием (например, СБП). */
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
}

interface HeaderDocumentMenuItem {
  value: string
  label: React.ReactNode
  onClick?: () => void
}

interface HeaderProps {
  type?: HeaderType
  clientHeaderType?: ClientHeaderType
  navItems?: HeaderNavItem[]
  /** Группы разделов в панели, которая раскрывается по кнопке «Меню». */
  menuGroups?: HeaderMenuGroup[]
  menuBanners?: MenuBannerProps[]
  favourites?: string[]
  onFavouriteToggle?: (value: string) => void
  onCustomiseFavourites?: () => void
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

const ELLIPSIS_RESERVED = 72

function NavItem({ item }: { item: HeaderNavItem }) {
  // `self-stretch`, not a vertical padding: Figma's `Menu Point Header (ELK)`
  // is the full 64px height of the row, so the whole band is the hit target
  // even though only the 24px label is inked.
  return (
    <button
      type="button"
      data-slot="header-nav-item"
      data-active={item.active || undefined}
      onClick={item.onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap outline-none transition-colors hover:text-[var(--header-hover-fg)]",
        item.active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
      )}
    >
      {item.icon}
      {item.label}
    </button>
  )
}

/**
 * Вариант `Size=None` у `Menu Header (ELK)` (нода 70303:49022) — подсказка
 * на месте пунктов навигации, когда избранное пустое. То есть пункты в
 * нижнем ряду — это и есть избранные разделы, которые пользователь
 * отмечает звёздами в раскрытом меню.
 */
function EmptyFavouritesHint() {
  return (
    <p
      data-slot="header-nav-empty-hint"
      className="flex min-w-0 flex-1 items-center gap-1 text-p1-medium whitespace-nowrap text-[var(--header-meta-fg)]"
    >
      Избранное — наведите курсор на элемент в меню и нажмите
      <span className="flex items-center pb-0.5">
        <Star aria-hidden="true" className="size-4 shrink-0" />
      </span>
      справа, чтобы добавить его сюда
    </p>
  )
}

function NavRow({
  items,
  menuOpen,
  onMenuOpenChange,
  createOpen,
  onCreateOpenChange,
  showCreate,
  favouritesEnabled,
}: {
  items: HeaderNavItem[]
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
  createOpen: boolean
  onCreateOpenChange: (open: boolean) => void
  showCreate: boolean
  favouritesEnabled: boolean
}) {
  // gap 32, а не 24: интервал между пунктами в `Menu Header (ELK)` — 32px.
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    items.length,
    ELLIPSIS_RESERVED,
    32
  )
  const visibleItems = items.slice(0, visibleCount)
  const hiddenItems = items.slice(visibleCount)

  return (
    <div
      data-slot="header-nav-row"
      // Both header rows are a fixed 64px with 40px side padding, and the
      // content is centred inside a 1800px-max box — measured off
      // `Menu Header (ELK)` (70303:48974).
      className="flex h-16 w-full shrink-0 justify-center border-b border-[var(--header-border)] px-10"
    >
      <div className="flex h-full min-w-0 max-w-[1800px] flex-1 items-center gap-8">
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary-black"
            size="sm"
            icon={menuOpen ? X : Menu}
            aria-expanded={menuOpen}
            onClick={() => onMenuOpenChange(!menuOpen)}
          >
            Меню
          </Button>
          {showCreate && (
            <Button
              variant="primary"
              size="sm"
              icon={createOpen ? X : Plus}
              aria-expanded={createOpen}
              onClick={() => onCreateOpenChange(!createOpen)}
            >
              Создать
            </Button>
          )}
        </div>

        {/* `Divider Holder` — 1px во всю высоту ряда минус 16px сверху и
            снизу, отдельным флекс-элементом, а не рамкой на соседе. Это
            именно общий `ELK / divider` кита, а не локальная линия:
            дизайн-чек №30 как раз про «собран из разрозненных элементов». */}
        <div className="flex h-16 shrink-0 items-center py-4">
          <Divider orientation="vertical" />
        </div>

        {/* Мерная зона — только сама навигация: кнопки и разделитель в
            замер не входят, иначе «Ещё» считал бы их место свободным. */}
        <div
          ref={containerRef}
          className="relative flex h-full min-w-0 flex-1 items-center gap-8"
        >
          {items.length === 0 && favouritesEnabled && <EmptyFavouritesHint />}

          {visibleItems.map((item) => (
            <NavItem key={item.value} item={item} />
          ))}

          {hiddenItems.length > 0 && (
            <MenuPrimitive.Root modal={false}>
              <MenuPrimitive.Trigger
                render={
                  <button
                    type="button"
                    className="group flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap text-[var(--header-fg)] outline-none transition-colors hover:text-[var(--header-hover-fg)]"
                  />
                }
              >
                Ещё
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
                />
              </MenuPrimitive.Trigger>
              <MenuPrimitive.Portal>
                <MenuPrimitive.Positioner side="bottom" align="start" sideOffset={8} className="isolate z-50">
                  <MenuPrimitive.Popup
                    data-slot="header-nav-overflow-content"
                    render={<Dropdown className="min-w-56 overflow-hidden bg-[var(--header-bg)]" />}
                  >
                    {hiddenItems.map((item) => (
                      <ButtonMenuOverflowItem key={item.value} text={item.label} onClick={item.onClick} />
                    ))}
                  </MenuPrimitive.Popup>
                </MenuPrimitive.Positioner>
              </MenuPrimitive.Portal>
            </MenuPrimitive.Root>
          )}

          {/* Off-screen measurement copy — see Switcher/Tabs' own comment on
              why this needs to exist as an always-rendered duplicate row. */}
          <div aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 flex gap-8">
            {items.map((item, index) => (
              <div
                key={item.value}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                className="flex shrink-0 items-center gap-1 text-p1-medium whitespace-nowrap"
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentMenu({ items }: { items: HeaderDocumentMenuItem[] }) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            aria-label="Документы"
            // `Wallet (ELK)` — плитка 88×64 (шире соседних 56, потому что
            // несёт иконку + шеврон).
            className="group flex h-16 w-22 shrink-0 cursor-pointer items-center justify-center gap-0.5 text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"
          />
        }
      >
        <Wallet size={24} aria-hidden="true" className="size-6" />
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
        />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="end" sideOffset={8} className="isolate z-50">
          <MenuPrimitive.Popup
            data-slot="header-document-menu-content"
            render={<Dropdown className="min-w-56 overflow-hidden bg-[var(--header-bg)]" />}
          >
            {items.map((item) => (
              <ButtonMenuOverflowItem key={item.value} text={item.label} onClick={item.onClick} />
            ))}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

function EmployeeUserMenu({
  name,
  onSettingsClick,
}: {
  name: React.ReactNode
  onSettingsClick?: () => void
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            className="group flex h-16 shrink-0 cursor-pointer items-center gap-4 px-4 text-[var(--header-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"
          />
        }
      >
        <span className="flex items-center gap-3">
          {/* `Profile Employee (ELK)` (нода 70303:48874) рисует человека в
              круге, а не кейс: кейс (`icon / company`) стоит в клиентской
              шапке, где подпись — организация, а здесь подпись — ФИО
              сотрудника банка. */}
          <CircleUser size={24} aria-hidden="true" className="size-6" />
          <span className="text-p1-medium">{name}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
        />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="end" sideOffset={8} className="isolate z-50">
          <MenuPrimitive.Popup
            data-slot="header-employee-menu-content"
            render={<Dropdown className="min-w-56 overflow-hidden bg-[var(--header-bg)]" />}
          >
            <MenuPrimitive.Item
              onClick={onSettingsClick}
              className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-p1-medium text-[var(--header-fg)] outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"
            >
              <Settings aria-hidden="true" className="size-6 shrink-0" />
              Профиль и настройки
            </MenuPrimitive.Item>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

function Logo() {
  return (
    <DomRfLogo
      data-slot="header-logo"
      role="img"
      aria-label="ДОМ.РФ Банк"
      className="h-8 w-auto shrink-0"
    />
  )
}

/**
 * Раскрытая панель под шапкой: затемнение на всю оставшуюся высоту экрана
 * плюс сама панель. В макете (Menu Overlay, нода 70303:58313) затемнение
 * лежит под панелью и по нему же кликом меню закрывается, а кнопка
 * «Настроить избранное» стоит по центру на 32px ниже панели.
 */
function MenuOverlay({
  children,
  footer,
  onClose,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      data-slot="header-menu-overlay"
      // Высота — «экран минус шапка»: в макете Menu Overlay ровно 952 при
      // экране 1080 и шапке 128 (64 + 64). Просто `h-screen` дал бы лишние
      // 128px прокрутки документа.
      className="absolute inset-x-0 top-full z-40 h-[calc(100vh-8rem)]"
    >
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        // Тот же `--modal-backdrop`/70, что и у модалки: пиксельная проба
        // макета даёт ровно это значение (см. комментарий в index.css).
        className="absolute inset-0 cursor-default bg-[var(--modal-backdrop)]/70"
      />
      <div className="relative">
        {children}
        {footer && <div className="flex justify-center pt-8">{footer}</div>}
      </div>
    </div>
  )
}

function Header({
  type = "client",
  clientHeaderType = "client",
  navItems = [],
  menuGroups = [],
  menuBanners = [],
  favourites = [],
  onFavouriteToggle,
  onCustomiseFavourites,
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
  // Раскрыта всегда не больше одной панели: в макете кнопка второй панели
  // в этот момент стоит в обычном состоянии, а не в состоянии «закрыть».
  const [openPanel, setOpenPanel] = React.useState<"menu" | "create" | null>(null)

  const isBlocked = type === "client" && clientHeaderType === "client-is-blocked"
  const showNavRow = type === "client" && !isBlocked
  const showCreate = type === "client" && clientHeaderType === "client"
  const showIconCluster = type === "client" && !isBlocked

  React.useEffect(() => {
    if (!showNavRow) setOpenPanel(null)
  }, [showNavRow])

  return (
    <div
      data-slot="header"
      data-type={type}
      data-client-type={type === "client" ? clientHeaderType : undefined}
      className={cn("relative flex w-full flex-col bg-[var(--header-bg)]", className)}
    >
      <div className="flex h-16 w-full shrink-0 justify-center border-b border-[var(--header-border)] px-10">
        <div className="flex min-w-0 max-w-[1800px] flex-1 items-center gap-3">
          {type === "employee" && showMenu && (
            <button
              type="button"
              aria-label={sidebarOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => onSidebarOpenChange?.(!sidebarOpen)}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--header-meta-fg)] outline-none transition-colors hover:bg-[var(--header-menu-toggle-hover-bg)]"
            >
              {sidebarOpen ? (
                <X size={24} aria-hidden="true" className="size-6" />
              ) : (
                <Menu aria-hidden="true" className="size-6" />
              )}
            </button>
          )}

          <Logo />

          <div className="min-w-0 flex-1" />

          {type === "client" && (
            <div className="flex shrink-0 items-center">
              {showIconCluster && (
                <>
                  <NotificationMenu items={notificationItems} unreadCount={notificationItems.length} />
                  <button
                    type="button"
                    aria-label="Сообщения"
                    onClick={onMessagesClick}
                    className="flex h-16 w-14 shrink-0 cursor-pointer items-center justify-center text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"
                  >
                    <span className="relative flex">
                      <Mail size={24} aria-hidden="true" className="size-6" />
                      {messageCount > 0 && (
                        <Badge
                          type="counter"
                          color="red"
                          value={messageCount}
                          className="absolute -top-1 -right-1"
                        />
                      )}
                    </span>
                  </button>
                  {documentMenuItems.length > 0 && <DocumentMenu items={documentMenuItems} />}
                </>
              )}

              {organizations.length > 0 && (
                <ProfileMenu
                  organizations={organizations}
                  value={organizationId ?? organizations[0].id}
                  onValueChange={onOrganizationChange}
                  contactPerson={contactPerson}
                  showSetting={showOrgSettings}
                  onSettingsClick={onOrgSettingsClick}
                  onLogoutClick={() => setLogoutOpen(true)}
                />
              )}
            </div>
          )}

          {type === "employee" && (
            <div className="flex shrink-0 items-center">
              <NotificationMenu items={notificationItems} unreadCount={notificationItems.length} />
              <EmployeeUserMenu name={employeeName} onSettingsClick={onOrgSettingsClick} />
              <button
                type="button"
                aria-label="Выйти"
                onClick={() => setLogoutOpen(true)}
                className="flex h-16 w-14 shrink-0 cursor-pointer items-center justify-center text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)]"
              >
                <LogOut aria-hidden="true" className="size-6" />
              </button>
            </div>
          )}

          {type === "sign-out" && phoneNumber && (
            <div className="flex shrink-0 flex-col items-end text-right">
              {/* get_design_context on "ELK / header, Type=Sign Out" (12635:44122):
                  label is P3 Medium (12/16), phone number is P1 Medium (16/24) —
                  not font-semibold, which resolves to Object Sans Heavy(800)
                  since there's no 600 cut. */}
              <span className="text-p3-medium text-[var(--header-meta-fg)]">Звонок по России</span>
              <span className="text-p1-medium text-[var(--header-fg)]">{phoneNumber}</span>
            </div>
          )}
        </div>
      </div>

      {showNavRow && (
        <NavRow
          items={navItems}
          menuOpen={openPanel === "menu"}
          onMenuOpenChange={(open) => setOpenPanel(open ? "menu" : null)}
          createOpen={openPanel === "create"}
          onCreateOpenChange={(open) => setOpenPanel(open ? "create" : null)}
          showCreate={showCreate}
          favouritesEnabled={Boolean(onFavouriteToggle)}
        />
      )}

      {openPanel === "menu" && (
        <MenuOverlay
          onClose={() => setOpenPanel(null)}
          footer={
            onCustomiseFavourites && (
              <Button
                variant="secondary-white"
                size="sm"
                icon={Settings}
                onClick={onCustomiseFavourites}
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
            onFavouriteToggle={onFavouriteToggle}
            showFavourites={Boolean(onFavouriteToggle)}
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

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => onLogout?.()}
      />
    </div>
  )
}

export { Header }
export type { HeaderProps, HeaderNavItem, HeaderDocumentMenuItem, HeaderType, ClientHeaderType }
