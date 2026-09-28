import * as React from "react"

import { LogOut, Mail } from "@/icons"
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

/**
 * Счётчик на колокольчике — только НЕпрочитанные уведомления. Раньше сюда
 * уходила длина всего списка, и пять уведомлений, четыре из которых уже
 * просмотрены, показывали «5» (а подсветка счётчика срабатывала и на
 * добавление прочитанного пункта).
 */
function countUnread(items: NotificationMenuItem[]) {
  return items.filter((item) => !item.viewed).length
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

/* Дизайн-чек от 13.09, замечание 7: гамбургер шапки сотрудника («Show Menu»,
   парный к отдельному `Sidebar`) удалён. Меню сотрудника — это главный экран
   `EmployeeMenu`, а не выезжающая панель из шапки. */

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
  // Без `organizationId` выбор организации живёт здесь же: иначе клик по
  // другой организации вызывал колбэк, а триггер и галочка навсегда
  // оставались на первой.
  //
  // Свой выбор учитывается, только пока такая организация есть в списке:
  // после смены `organizations` устаревший id уходил в меню как `value`,
  // триггер откатывался на первую, а галочки в списке не было ни у кого.
  const [ownOrganizationId, setOwnOrganizationId] = React.useState<string>()
  const ownOrganizationListed = organizations.some(
    (organization) => organization.id === ownOrganizationId
  )
  const activeOrganizationId =
    organizationId ??
    (ownOrganizationListed ? ownOrganizationId : undefined) ??
    organizations[0]?.id
  function changeOrganization(id: string) {
    if (organizationId === undefined) setOwnOrganizationId(id)
    onOrganizationChange?.(id)
  }

  // Кластер сжимаемый (`min-w-0`, без `shrink-0`): плитка профиля умеет
  // обрезать название многоточием (`max-w-[304px] min-w-0` + `truncate`),
  // но жёсткий кластер вокруг не давал ей сжаться — на узкой шапке она
  // целиком уезжала за край и раздвигала страницу вбок (реестр аккредитивов
  // на 375: ширина документа 623). Иконки остаются `shrink-0` каждая.
  return (
    <div data-slot="header-client-actions" className="flex min-w-0 items-center">
      {showIcons && (
        <>
          <NotificationMenu
            items={notificationItems}
            unreadCount={countUnread(notificationItems)}
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
          value={activeOrganizationId}
          onValueChange={changeOrganization}
          contactPerson={contactPerson}
          showSetting={showOrgSettings}
          showLogout
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
   * Есть только в шапке с закреплённым избранным (`Employee Header`):
   * там панель иконок и подпись — два разных блока по краям
   * полосы навигации. У прежней шапки сотрудника, где ряда навигации нет
   * вовсе, они стоят вплотную, и линии между ними в макете тоже нет.
   */
  showDivider?: boolean
}) {
  return (
    <div className="flex shrink-0 items-center">
      <NotificationMenu
        items={notificationItems}
        unreadCount={countUnread(notificationItems)}
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
 * get_design_context on "ELK / header, Type=Sign Out": подпись
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
   * (слой `Box` мастера). Остальным шапкам менять его незачем: у них
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
  SignOutPhone,
  TopRow,
  TopRowDivider,
}
