import type * as React from "react"

import type {
  CreateMenuItem,
  HeaderMenuGroup,
  MenuBannerProps,
} from "@/components/ui/header-menu"

import {
  compactGroups,
  compactList,
} from "@/components/ui/header-menu/compact-list"

import type { HeaderNavItem } from "./nav-row"
import type { NotificationMenuItem } from "./notification-menu"
import type { ProfileMenuOrganization } from "./profile-menu"
import type { HeaderDocumentMenuItem } from "./top-row-menus"

// Пропы `Header` — вынесены отдельно: это документация к API шапки, и её
// читают и сам компонент, и хук раскладки (`use-header-layout.ts`). Общий
// модуль типов избавляет их от ссылок друг на друга.

type HeaderType = "client" | "employee" | "sign-out"
type ClientHeaderType = "client" | "client-without-account" | "client-is-blocked"

interface HeaderProps {
  type?: HeaderType
  clientHeaderType?: ClientHeaderType
  /**
   * Пункты нижнего ряда напрямую — только для шапки без раскрытого меню.
   * Если передан `menuGroups`, ряд считается из `favourites`, а этот проп
   * игнорируется (см. комментарий об избранном в `header.tsx`).
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
  onLogout?: () => void
  phoneNumber?: React.ReactNode
  /**
   * Закрепить шапку у верха вьюпорта.
   *
   * ⚠️ Закрепляется НЕ ВСЯ шапка. Дизайн-чек от 07.09, замечание 29: «У
   * компонента Header при скролле не открепилась верхняя часть. Должна
   * открепляться, закрепляется только вторая строка с кнопками и
   * закреплённой навигацией». То есть верхний ряд (логотип, уведомления,
   * профиль) уезжает вместе со страницей, а прилипает только нижний.
   *
   * Исключение — шапки БЕЗ нижнего ряда (сотрудник, неавторизованный вход):
   * там прилипать нечему, и закрепляется вся шапка, как раньше.
   *
   * Кроме самого `sticky` это включает публикацию занятой высоты в
   * `--viewport-inset-top`: липкая шапка ТАБЛИЦЫ читает её по умолчанию и
   * поэтому не уезжает под шапку страницы. Дефект был у всех длинных
   * таблиц сразу, и чинится он здесь — странице не нужно передавать отступ
   * в каждую таблицу руками. Меряется при этом ИМЕННО ЗАКРЕПЛЁННЫЙ узел:
   * если мерить весь корень, то после того как он уедет вверх, перекрытие
   * посчитается нулевым, а нижний ряд всё ещё будет закрывать верх экрана.
   *
   * Умолчание — выключено: закрепление задаёт каркас страницы, а витрины
   * кита ставят шапку в поток.
   */
  pinned?: boolean
  className?: string
}

/** Свойства шапки со списками без пустых элементов. */
function compactHeaderProps(props: HeaderProps): HeaderProps {
  return {
    ...props,
    navItems: compactList(props.navItems),
    menuGroups: compactGroups(props.menuGroups),
    menuBanners: compactList(props.menuBanners),
    createItems: compactList(props.createItems),
    documentMenuItems: compactList(props.documentMenuItems),
    notificationItems: compactList(props.notificationItems),
    organizations: compactList(props.organizations),
  }
}

export { compactHeaderProps }
export type { ClientHeaderType, HeaderProps, HeaderType }
