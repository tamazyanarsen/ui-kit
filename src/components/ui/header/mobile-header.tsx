import * as React from "react"

import { Menu, Plus, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type {
  CreateMenuItem,
  HeaderMenuGroup,
  MenuBannerProps,
} from "@/components/ui/header-menu"

import { CreateSheet } from "./create-sheet"
import { HeaderPanels, type HeaderPanel } from "./header-panels"
import { MobileOrganization } from "./mobile-organization"
import { NotificationMenu, type NotificationMenuItem } from "./notification-menu"
import { countUnread } from "./notification-count"
import type { ProfileMenuOrganization } from "./profile-menu"
import { Logo, MessagesButton } from "./top-row"
import { useOrganization } from "./use-organization"

// Мобильная форма шапки — `ELK / header`, `Size=Mobile` (70467:6340 …
// 70467:6353, версия 1.4.0, релиз 70.37).
//
// Одна полоса 64px вместо двух по 64: поля 16 со всех сторон (Правки UI-Kit
// от 25.10 — у символа было 16 сверху и 8 снизу, высота 56, и недостающие 8
// экраны добирали своим полем под шапкой), логотип 95×32 слева; справа (интервал 24) — колокольчик и конверт
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
// Подложки нет (Правки UI-Kit от 25.10): под шапкой фон страницы. Белой
// шапка становится только на время раскрытого меню — под шапкой и панелью
// единый белый фон, который появляется и уходит одним фейдом с панелью
// (`--duration-panel` / `--duration-panel-out`, `ease`). Линии снизу нет.
//
// Закреплена мобильная шапка только по `pinned="always"`: прозрачная
// закреплённая шапка легла бы поверх прокручиваемого содержимого.
//
// Отличия от десктопа в поведении (те же Правки):
//   • колокольчик не раскрывает список, а ведёт в раздел уведомлений
//     (`onNotificationsClick`); зоны нажатия колокольчика и писем невидимо
//     наращены на половину зазора до соседей;
//   • «+» открывает штору «Создать» (`CreateSheet`), а не панель, и в
//     крестик не превращается;
//   • организация в меню — строка `Item` со шторой (`MobileOrganization`).

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
  onNotificationsClick?: () => void
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
const MOBILE_ICON_TILE = "relative h-8 w-8"

/**
 * Невидимое наращивание зоны нажатия (Правки UI-Kit от 25.10): на половину
 * зазора до соседа во все стороны. Между значками зазор 12 — зоны по 6 и
 * сходятся встык; снаружи — до «+» 24, поэтому у писем справа 12, у
 * колокольчика слева тоже 12; сверху и снизу 6. Вид не меняется: это
 * пустой `::before`, а нажатие по псевдоэлементу — нажатие по кнопке.
 */
const BELL_HIT_AREA =
  "before:absolute before:-inset-y-1.5 before:-left-3 before:-right-1.5"
const MAIL_HIT_AREA =
  "before:absolute before:-inset-y-1.5 before:-left-1.5 before:-right-3"

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
  onNotificationsClick,
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
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)
  const { activeOrganizationId, changeOrganization } = useOrganization(
    organizations,
    organizationId,
    onOrganizationChange
  )
  const menuOpen = openPanel === "menu"

  // «Создать» пропала (организация без счетов) — штора закрывается вместе с
  // ней, как и десктопная панель в `useHeaderLayout`.
  React.useEffect(() => {
    if (!showCreate || !showActions) setCreateSheetOpen(false)
  }, [showCreate, showActions])

  return (
    <div
      {...rootProps}
      ref={rootRef}
      data-slot="header"
      data-size="mobile"
      data-menu-open={menuOpen || undefined}
      className={cn(
        "relative flex w-full flex-col bg-transparent",
        // Белый фон — только при раскрытом меню, одним фейдом с панелью:
        // переход берётся у НОВОГО состояния, поэтому появление идёт за
        // `--duration-panel`, уход — за `--duration-panel-out`.
        "transition-[background-color] duration-(--duration-panel-out) ease-[ease]",
        "data-[menu-open]:bg-[var(--header-bg)] data-[menu-open]:duration-(--duration-panel)",
        // Полоса одна — закрепляется вся шапка (у десктопа липнет только
        // нижний ряд, но его здесь нет).
        pinned && "sticky top-0 z-40",
        className
      )}
    >
      <div
        data-slot="header-mobile-row"
        className="flex h-16 w-full items-center justify-between gap-4 p-4"
      >
        <Logo />

        {showActions && (
          <div className="flex shrink-0 items-center gap-6">
            <div className="flex items-center gap-3">
              <NotificationMenu
                items={notificationItems}
                // Только непрочитанные — то же правило, что у плитки на
                // десктопе.
                unreadCount={countUnread(notificationItems)}
                // Без выпадающего списка — переход в раздел.
                asLink
                onNavigate={onNotificationsClick}
                className={cn(MOBILE_ICON_TILE, BELL_HIT_AREA)}
              />
              <MessagesButton
                count={messageCount}
                onClick={onMessagesClick}
                className={cn(MOBILE_ICON_TILE, MAIL_HIT_AREA)}
              />
            </div>
            <div className="flex items-center gap-2">
              {showCreate && (
                // Открывает штору, а не панель: в крестик не превращается и
                // раскрытости (`aria-expanded`) не объявляет — штора сама
                // диалог со своим крестиком.
                <Button
                  ref={createTriggerRef}
                  variant="primary"
                  size="sm"
                  iconPosition="only"
                  icon={Plus}
                  aria-label="Создать"
                  aria-haspopup="dialog"
                  onClick={() => {
                    onOpenPanelChange(null)
                    setCreateSheetOpen(true)
                  }}
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
              <MobileOrganization
                organizations={organizations}
                value={activeOrganizationId}
                onValueChange={changeOrganization}
                contactPerson={contactPerson}
                showSettings={showOrgSettings}
                showLogout
                onSettingsClick={() => {
                  // Переход в профиль уводит со страницы — меню закрывается.
                  onOpenPanelChange(null)
                  onOrgSettingsClick?.()
                }}
                onLogoutClick={onLogoutClick}
              />
            )
          }
        />
      )}

      {showActions && showCreate && (
        <CreateSheet
          open={createSheetOpen}
          onOpenChange={setCreateSheetOpen}
          items={createItems}
        />
      )}

      {children}
    </div>
  )
}

export { MobileHeader }
