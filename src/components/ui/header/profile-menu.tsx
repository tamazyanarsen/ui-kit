import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Briefcase, ChevronDown, Search } from "@/icons"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { HeaderMenuPopup } from "./menu-popup"
import {
  OrganizationList,
  SettingsBlock,
  SingleOrganization,
  type ProfileMenuOrganization,
} from "./profile-menu-blocks"

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
            "group flex h-16 max-w-[304px] min-w-0 cursor-pointer items-center gap-4 px-4 text-left outline-none focus-visible:focus-ring transition-colors",
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
      {/* Дизайн-чек Storybook (Аня Багрова) №1: «при hover иконка чемодана и
          наименование организации окрашиваются в Blue 254… шеврон остаётся
          Grey 1514». Проверено по ассетам состояний `Profile Client Header
          (ELK)` (70303:48890 → 70303:48897): SVG шеврона в Default и Hover
          один и тот же, брендовыми становятся только кейс и название. */}
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-[var(--header-icon-fg)] transition-transform group-data-popup-open:rotate-180"
      />
    </MenuPrimitive.Trigger>
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

      {/* Ширина 400 — из мастера `Profile Menu (ELK)` (70303:49093): панель
          `w-[400px]`, скругление 16, universal shadow. Прежние 320 не давали
          длинному названию организации уложиться в две строки. */}
      <HeaderMenuPopup slot="profile-menu-content" className="w-100">
        {isSingle ? (
          <SingleOrganization organization={activeOrg} />
        ) : (
          <>
            {showSearch && (
              <div className="px-4 pt-4 pb-2">
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
            <p className="px-4 pt-4 pb-2 text-p1-medium text-[var(--header-fg)]">
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
