import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Briefcase, Check, ChevronDown, LogOut, Search, Settings } from "@/icons"
import { cn } from "@/lib/utils"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { Scrollbar } from "@/components/ui/scrollbar"

import { HeaderMenuPopup } from "./menu-popup"

// Profile Menu — the header's organization switcher (spec's own "Profile
// Menu" property table, separate from Header's). `organizations.length`
// alone decides the layout: 1 -> static "One" card (no search, no list
// header, per the spec's own callout that switching UI only exists once
// there's something to switch between), 2-6 -> plain list ("Two — Six"),
// 7+ -> list gains a live-filtering search box ("Seven and More"/"Search" —
// the spec draws these as two states, but "Search" is just "Seven and
// More" with a query typed in, not a separate mode). "Профиль и настройки"
// and "Выйти" are gated by one `showSetting` boolean — per the spec's own
// caption, repeated on every variant, they're "a single optional element".
interface ProfileMenuOrganization {
  id: string
  name: string
  inn: string
  role: string
}

interface ProfileMenuProps {
  organizations: ProfileMenuOrganization[]
  value: string
  onValueChange?: (id: string) => void
  contactPerson?: React.ReactNode
  showSetting?: boolean
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  className?: string
}

/** С этого числа организаций в списке появляется поиск. */
const SEARCH_THRESHOLD = 7

/** Общая раскладка пункта меню — и у организации, и у действий внизу. */
const MENU_ITEM =
  "flex cursor-default items-center gap-2 rounded-xl px-2 py-2 outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"

/** Плитка-триггер: организация, контактное лицо и шеврон. */
function ProfileMenuTrigger({
  organization,
  contactPerson,
  className,
}: {
  organization?: ProfileMenuOrganization
  contactPerson?: React.ReactNode
  className?: string
}) {
  return (
    <MenuPrimitive.Trigger
      render={
        <button
          type="button"
          data-slot="profile-menu-trigger"
          className={cn(
            // h-16 вместо py-1: в Figma `Profile Client (ELK)` — плитка
            // 304×64, такая же по высоте, как остальные в `Panel`.
            //
            // Дизайн-чек №3 №12: «нет макс ширины… элемент должен иметь
            // макс ширину, она уже есть в ките, унаследовать». Ширина
            // раньше шла по контенту, и длинное название организации
            // распирало плитку до края шапки. В мастере она ограничена
            // теми же 304px, а название обрезается многоточием — что
            // `truncate` на подписях уже умеет, ему не хватало только
            // предела у самой плитки.
            //
            // Заливки на наведении нет: у `Profile Client Header (ELK)` в
            // Hover (нода 70303:48897) фон прозрачен, меняется только цвет
            // названия и знаков — его дают `group-hover` ниже.
            "group flex h-16 max-w-[304px] min-w-0 cursor-pointer items-center gap-4 px-4 text-left outline-none transition-colors",
            className
          )}
        />
      }
    >
      <span className="flex min-w-0 items-center gap-3">
        {/* Дизайн-чек №3 №12: «Некорректная иконка». В шапке кейс идёт
            24px-начертанием (`icon / company` — контурный кейс с двумя
            полосами); без `size={24}` сюда подставлялся 16px-рисунок с
            центральной защёлкой, растянутый до 24. */}
        <Briefcase
          size={24}
          aria-hidden="true"
          className="size-6 shrink-0 text-[var(--header-icon-fg)] group-hover:text-[var(--header-hover-fg)]"
        />
        <span className="flex min-w-0 flex-col">
          <span className="min-w-0 truncate text-p1-medium text-[var(--header-fg)] group-hover:text-[var(--header-hover-fg)]">
            {organization?.name}
          </span>
          {contactPerson && (
            // get_design_context on ProfileMenuElk's "ИНН ... • Оператор"
            // subtitle (46107:44110) confirms Object Sans Medium (P3
            // Medium), not Regular, for this secondary line.
            <span className="min-w-0 truncate text-p3-medium text-[var(--header-meta-fg)]">
              {contactPerson}
            </span>
          )}
        </span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-[var(--header-icon-fg)] transition-transform group-hover:text-[var(--header-hover-fg)] group-data-popup-open:rotate-180"
      />
    </MenuPrimitive.Trigger>
  )
}

/** Единственная организация — статичная карточка без поиска и списка. */
function SingleOrganization({
  organization,
}: {
  organization?: ProfileMenuOrganization
}) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-2">
      <span className="text-p1-medium text-[var(--header-fg)]">
        {organization?.name}
      </span>
      {/* get_design_context on ProfileMenuElk (46107:44110) confirms Object
          Sans Medium for this "ИНН ... • Оператор" line. */}
      <span className="text-p3-medium text-[var(--header-meta-fg)]">
        ИНН {organization?.inn} · {organization?.role}
      </span>
    </div>
  )
}

function OrganizationList({
  organizations,
  value,
  onValueChange,
}: {
  organizations: ProfileMenuOrganization[]
  value: string
  onValueChange?: (id: string) => void
}) {
  return (
    // Figma puts an `ELK / scrollbar` inside this list (node 46107:43566 —
    // 4px track, 2px radius, 8px inset), which is what the kit's Scrollbar
    // renders.
    <Scrollbar className="flex max-h-64 flex-col gap-0.5 px-2">
      {organizations.map((org) => (
        <MenuPrimitive.Item
          key={org.id}
          data-slot="profile-menu-org-item"
          onClick={() => onValueChange?.(org.id)}
          className={cn(MENU_ITEM, "justify-between")}
        >
          <span className="flex min-w-0 flex-col">
            <span className="min-w-0 truncate text-p1-medium text-[var(--header-fg)]">
              {org.name}
            </span>
            <span className="min-w-0 truncate text-p3-medium text-[var(--header-meta-fg)]">
              ИНН {org.inn} · {org.role}
            </span>
          </span>
          {org.id === value && (
            <Check
              aria-hidden="true"
              className="size-6 shrink-0 text-[var(--header-check-fg)]"
            />
          )}
        </MenuPrimitive.Item>
      ))}
      {/* No dedicated Profile Menu "no results" frame exists in the spec;
          matches the Select/Dropdown empty-state text (get_design_context on
          29750:54209) which is Object Sans Medium, not Regular, despite the
          muted color. */}
      {organizations.length === 0 && (
        <p className="px-2 py-4 text-center text-p2-medium text-[var(--header-meta-fg)]">
          Ничего не найдено
        </p>
      )}
    </Scrollbar>
  )
}

/** «Профиль и настройки» + «Выйти» — по спецификации один опциональный блок. */
function SettingsBlock({
  onSettingsClick,
  onLogoutClick,
}: {
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}) {
  return (
    <>
      {/* Figma separates the settings block with an actual `ELK / divider`
          instance (node 46107:27187), not a border on the block itself. */}
      <Divider className="mt-2" />
      <div className="flex flex-col gap-0.5 px-2 pt-2">
        <MenuPrimitive.Item
          data-slot="profile-menu-settings-item"
          onClick={onSettingsClick}
          className={cn(MENU_ITEM, "text-p1-medium text-[var(--header-fg)]")}
        >
          <Settings size={24} aria-hidden="true" className="size-6 shrink-0" />
          Профиль и настройки
        </MenuPrimitive.Item>
        <MenuPrimitive.Item
          data-slot="profile-menu-logout-item"
          onClick={onLogoutClick}
          className={cn(
            MENU_ITEM,
            "text-p1-medium text-[var(--header-logout-fg)]"
          )}
        >
          <LogOut size={24} aria-hidden="true" className="size-6 shrink-0" />
          Выйти
        </MenuPrimitive.Item>
      </div>
    </>
  )
}

function ProfileMenu({
  organizations,
  value,
  onValueChange,
  contactPerson,
  showSetting = true,
  onSettingsClick,
  onLogoutClick,
  className,
}: ProfileMenuProps) {
  const [query, setQuery] = React.useState("")
  const activeOrg =
    organizations.find((org) => org.id === value) ?? organizations[0]
  const isSingle = organizations.length <= 1
  const showSearch = organizations.length >= SEARCH_THRESHOLD
  const isSearching = showSearch && query.trim().length > 0
  const filtered = isSearching
    ? organizations.filter((org) =>
        org.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : organizations

  return (
    <MenuPrimitive.Root
      modal={false}
      onOpenChange={(open) => {
        if (!open) setQuery("")
      }}
    >
      <ProfileMenuTrigger
        organization={activeOrg}
        contactPerson={contactPerson}
        className={className}
      />

      <HeaderMenuPopup slot="profile-menu-content" className="w-80 py-2">
        {isSingle ? (
          <SingleOrganization organization={activeOrg} />
        ) : (
          <>
            {showSearch && (
              <div className="px-3 pb-2">
                <Input
                  size="sm"
                  placeholder="Поиск"
                  aria-label="Поиск организации"
                  iconLeft={<Search />}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onClear={() => setQuery("")}
                  // Base UI Menu listens for keydown on the popup for
                  // arrow-key navigation and type-ahead — without this it
                  // swallows every keystroke meant for the search box
                  // instead of letting it reach the input's value.
                  onKeyDown={(event) => event.stopPropagation()}
                />
              </div>
            )}
            <p className="px-4 pt-1 pb-2 text-p1-medium text-[var(--header-fg)]">
              {isSearching
                ? "Мои организации — результаты поиска"
                : `Мои организации (${organizations.length})`}
            </p>
            <OrganizationList
              organizations={filtered}
              value={value}
              onValueChange={onValueChange}
            />
          </>
        )}

        {showSetting && (
          <SettingsBlock
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />
        )}
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

export { ProfileMenu }
export type { ProfileMenuOrganization, ProfileMenuProps }
