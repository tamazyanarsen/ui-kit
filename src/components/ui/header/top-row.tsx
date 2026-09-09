import * as React from "react"

import { LogOut, Mail, Menu, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Divider } from "@/components/ui/divider"
import { Grid } from "@/components/ui/grid"

import { DomRfLogo } from "./dom-rf-logo"
import {
  HEADER_ICON_TILE_ACCENT,
  HEADER_ICON_TILE_LOGOUT,
} from "./menu-popup"
import { NotificationMenu, type NotificationMenuItem } from "./notification-menu"
import { ProfileMenu, type ProfileMenuOrganization } from "./profile-menu"
import { DocumentMenu, type HeaderDocumentMenuItem } from "./top-row-menus"
import { EmployeeUserMenu } from "./top-row-menus"

// Верхняя полоса шапки: логотип слева, кластер иконок справа. Состав
// кластера целиком определяется типом шапки — клиент, сотрудник или
// неавторизованный вход.

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

/** Гамбургер, парный к отдельному Sidebar (Show Menu у шапки сотрудника). */
function SidebarToggle({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const Glyph = open ? X : Menu
  return (
    <button
      type="button"
      aria-label={open ? "Закрыть меню" : "Открыть меню"}
      onClick={() => onOpenChange?.(!open)}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--header-meta-fg)] outline-none focus-visible:focus-ring transition-colors hover:bg-[var(--header-menu-toggle-hover-bg)]"
    >
      <Glyph size={24} aria-hidden="true" className="size-6" />
    </button>
  )
}

function MessagesButton({
  count,
  onClick,
}: {
  count: number
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label="Сообщения"
      onClick={onClick}
      className={HEADER_ICON_TILE_ACCENT}
    >
      {/* Бейдж крепится к самой иконке, а не к плитке: иначе он уезжает в
          угол блока 56×64 вместо угла глифа 24×24. */}
      <span className="relative flex">
        <Mail size={24} aria-hidden="true" className="size-6" />
        {count > 0 && (
          <Badge
            type="counter"
            color="red"
            value={count}
            className="absolute -top-1 -right-1"
          />
        )}
      </span>
    </button>
  )
}

interface ClientActionsProps {
  /** Заблокированному клиенту кластер иконок не полагается вовсе. */
  showIcons: boolean
  messageCount: number
  onMessagesClick?: () => void
  notificationItems: NotificationMenuItem[]
  documentMenuItems: HeaderDocumentMenuItem[]
  organizations: ProfileMenuOrganization[]
  organizationId?: string
  onOrganizationChange?: (id: string) => void
  contactPerson?: React.ReactNode
  showOrgSettings: boolean
  onOrgSettingsClick?: () => void
  onLogoutClick: () => void
}

function ClientActions({
  showIcons,
  messageCount,
  onMessagesClick,
  notificationItems,
  documentMenuItems,
  organizations,
  organizationId,
  onOrganizationChange,
  contactPerson,
  showOrgSettings,
  onOrgSettingsClick,
  onLogoutClick,
}: ClientActionsProps) {
  return (
    <div className="flex shrink-0 items-center">
      {showIcons && (
        <>
          <NotificationMenu
            items={notificationItems}
            unreadCount={notificationItems.length}
          />
          <MessagesButton count={messageCount} onClick={onMessagesClick} />
          {documentMenuItems.length > 0 && (
            <DocumentMenu items={documentMenuItems} />
          )}
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
          onLogoutClick={onLogoutClick}
        />
      )}
    </div>
  )
}

function EmployeeActions({
  notificationItems,
  employeeName,
  onSettingsClick,
  onLogoutClick,
  showDivider = false,
}: {
  notificationItems: NotificationMenuItem[]
  employeeName: React.ReactNode
  onSettingsClick?: () => void
  onLogoutClick: () => void
  /**
   * Разделитель между уведомлениями и подписью сотрудника.
   *
   * Есть только в шапке с закреплённым избранным (`Employee Header`, нода
   * 70396:22367): там панель иконок и подпись — два разных блока по краям
   * полосы навигации. У прежней шапки сотрудника, где ряда навигации нет
   * вовсе, они стоят вплотную, и линии между ними в макете тоже нет.
   */
  showDivider?: boolean
}) {
  return (
    <div className="flex shrink-0 items-center">
      <NotificationMenu
        items={notificationItems}
        unreadCount={notificationItems.length}
      />
      {showDivider && <TopRowDivider />}
      <EmployeeUserMenu name={employeeName} onSettingsClick={onSettingsClick} />
      <button
        type="button"
        aria-label="Выйти"
        onClick={onLogoutClick}
        className={HEADER_ICON_TILE_LOGOUT}
      >
        <LogOut size={24} aria-hidden="true" className="size-6" />
      </button>
    </div>
  )
}

/**
 * Телефон поддержки в шапке без авторизации.
 *
 * get_design_context on "ELK / header, Type=Sign Out" (12635:44122): подпись
 * — P3 Medium (12/16), номер — P1 Medium (16/24), а не `font-semibold`,
 * который в Object Sans резолвится в Heavy(800) за отсутствием начертания
 * 600.
 */
function SignOutPhone({ phoneNumber }: { phoneNumber: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-end text-right">
      <span className="text-p3-medium text-[var(--header-meta-fg)]">
        Звонок по России
      </span>
      <span className="text-p1-medium text-[var(--header-fg)]">
        {phoneNumber}
      </span>
    </div>
  )
}

/**
 * Обёртка полосы: фиксированные 64px, подложка во всю ширину, контент — по
 * сетке.
 *
 * Подложка тянется на весь `GridRoot`, а `Grid` внутри держит те же поля
 * 40 и тот же максимум 1800, что и полоса страницы. Так дизайнер и
 * формулирует правило: «хедер тянется на всю ширину, грид работает не на
 * белую подложку хедера, а на контент внутри».
 */
function TopRow({
  className,
  children,
}: {
  /**
   * Классы контентной полосы. Нужны ровно одному случаю — шапке сотрудника
   * с закреплённым избранным, где интервал между блоками 24, а не 12
   * (`Box` в ноде 70396:22367). Остальным шапкам менять его незачем: у них
   * между логотипом и правым кластером стоит распорка, и интервал не виден.
   */
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-16 w-full shrink-0 border-b border-[var(--header-border)] bg-[var(--header-bg)]">
      <Grid className={cn("flex min-w-0 items-center gap-3", className)}>
        {children}
      </Grid>
    </div>
  )
}

/**
 * Вертикальный разделитель верхней полосы: 1px во всю высоту минус 16px
 * сверху и снизу — тот же `Divider Container`, что и в ряду навигации.
 */
function TopRowDivider() {
  return (
    <div className="flex h-16 shrink-0 items-center py-4">
      <Divider orientation="vertical" />
    </div>
  )
}

export {
  ClientActions,
  EmployeeActions,
  Logo,
  SidebarToggle,
  SignOutPhone,
  TopRow,
  TopRowDivider,
}
