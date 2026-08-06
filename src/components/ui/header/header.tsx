import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
  CirclePlus,
  ChevronDown,
  Briefcase,
  LogOut,
  Mail,
  Menu,
  Settings,
  Wallet,
  X,
} from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Dropdown } from "@/components/ui/dropdown"
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
// renders — a blocked client loses the nav row, payment button and the
// icon cluster entirely (just logo + org switcher), an account-less client
// keeps a reduced nav but loses the payment button, matching the spec's
// own "Меню клиента без расчётных счетов" callout. `showMenu` is the
// hamburger that pairs with a separate Sidebar component for Employee
// layouts (Show Menu: True/False in the spec) — it toggles the paired
// Sidebar's own open state, so this component only renders the icon and
// reports the click, it doesn't own a Sidebar itself.
//
// Nav overflow reuses the exact "Ещё" mechanism already built for Tabs/
// Switcher (useOverflowCount): per the spec's own "Взаимодействие с
// элементом" note, items should move into "Ещё" one at a time as space
// runs out, not at fixed breakpoints.
type HeaderType = "client" | "employee" | "sign-out"
type ClientHeaderType = "client" | "client-without-account" | "client-is-blocked"

interface HeaderNavItem {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  items?: { value: string; label: React.ReactNode; onClick?: () => void }[]
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
  onPaymentClick?: () => void
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
  const baseClassName = cn(
    "flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-p1-medium whitespace-nowrap outline-none transition-colors hover:text-[var(--header-hover-fg)]",
    item.active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
  )

  if (!item.items?.length) {
    return (
      <button type="button" onClick={item.onClick} className={baseClassName}>
        {item.icon}
        {item.label}
      </button>
    )
  }

  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={<button type="button" className={cn(baseClassName, "group")} />}
      >
        {item.icon}
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
        />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="start" sideOffset={8} className="isolate z-50">
          <MenuPrimitive.Popup
            data-slot="header-nav-item-content"
            render={<Dropdown className="min-w-56 overflow-hidden bg-[var(--header-bg)]" />}
          >
            {item.items.map((sub) => (
              <ButtonMenuOverflowItem key={sub.value} text={sub.label} onClick={sub.onClick} />
            ))}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

function NavRow({
  items,
  showPayment,
  onPaymentClick,
}: {
  items: HeaderNavItem[]
  showPayment: boolean
  onPaymentClick?: () => void
}) {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    items.length,
    ELLIPSIS_RESERVED,
    24
  )
  const visibleItems = items.slice(0, visibleCount)
  const hiddenItems = items.slice(visibleCount)

  return (
    <div
      ref={containerRef}
      data-slot="header-nav-row"
      className="relative flex min-w-0 flex-1 items-center gap-6 border-t border-[var(--header-border)] px-4 py-3"
    >
      {showPayment && (
        <Button
          variant="secondary-black"
          size="sm"
          icon={CirclePlus}
          iconPosition="left"
          className="mr-2 shrink-0 rounded-full"
          onClick={onPaymentClick}
        >
          Платёж
        </Button>
      )}

      {visibleItems.map((item) => (
        <NavItem key={item.value} item={item} />
      ))}

      {hiddenItems.length > 0 && (
        <MenuPrimitive.Root modal={false}>
          <MenuPrimitive.Trigger
            render={
              <button
                type="button"
                className="group flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-p1-medium whitespace-nowrap text-[var(--header-fg)] outline-none transition-colors hover:text-[var(--header-hover-fg)]"
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
      <div aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 flex gap-6">
        {items.map((item, index) => (
          <div
            key={item.value}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-p1-medium whitespace-nowrap"
          >
            {item.icon}
            {item.label}
            {item.items?.length ? <ChevronDown aria-hidden="true" className="size-4" /> : null}
          </div>
        ))}
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
            className="group flex shrink-0 cursor-pointer items-center gap-0.5 rounded-lg px-1.5 py-1 text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"
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
            className="group flex shrink-0 cursor-pointer items-center gap-4 rounded-lg px-2 py-1 text-[var(--header-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"
          />
        }
      >
        <span className="flex items-center gap-3">
          {/* Figma's profile row draws `icon / company` at 24px (node
              46138:51812) — the organisation's case, not a person avatar,
              which is what CircleUser rendered here before. */}
          <Briefcase size={24} aria-hidden="true" className="size-6" />
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

function Header({
  type = "client",
  clientHeaderType = "client",
  navItems = [],
  onPaymentClick,
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

  const isBlocked = type === "client" && clientHeaderType === "client-is-blocked"
  const showNavRow = type === "client" && !isBlocked
  const showPayment = type === "client" && clientHeaderType === "client"
  const showIconCluster = type === "client" && !isBlocked

  return (
    <div
      data-slot="header"
      data-type={type}
      data-client-type={type === "client" ? clientHeaderType : undefined}
      className={cn(
        "flex w-full flex-col bg-[var(--header-bg)]",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3 px-4 py-2.5">
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
          <div className="flex shrink-0 items-center gap-1">
            {showIconCluster && (
              <>
                <NotificationMenu items={notificationItems} unreadCount={notificationItems.length} />
                <button
                  type="button"
                  aria-label="Сообщения"
                  onClick={onMessagesClick}
                  className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)] hover:text-[var(--header-hover-fg)]"
                >
                  <Mail size={24} aria-hidden="true" className="size-6" />
                  {messageCount > 0 && (
                    <Badge
                      type="counter"
                      color="red"
                      value={messageCount}
                      className="absolute -top-1 -right-1"
                    />
                  )}
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
          <div className="flex shrink-0 items-center gap-1">
            <NotificationMenu items={notificationItems} unreadCount={notificationItems.length} />
            <EmployeeUserMenu name={employeeName} onSettingsClick={onOrgSettingsClick} />
            <button
              type="button"
              aria-label="Выйти"
              onClick={() => setLogoutOpen(true)}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--header-icon-fg)] outline-none transition-colors hover:bg-[var(--header-item-hover-bg)]"
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

      {showNavRow && (
        <NavRow items={navItems} showPayment={showPayment} onPaymentClick={onPaymentClick} />
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
