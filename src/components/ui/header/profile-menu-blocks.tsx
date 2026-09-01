import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Divider } from "@/components/ui/divider"
import { Scrollbar } from "@/components/ui/scrollbar"
import { Check, LogOut, Settings } from "@/icons"
import { cn } from "@/lib/utils"

// Содержимое меню профиля: карточка единственной организации, список
// организаций и блок настроек. Вынесено из `profile-menu.tsx` — там остаётся
// сам компонент с поиском и выбором раскладки.

interface ProfileMenuOrganization {
  id: string
  name: string
  inn: string
  role: string
}

/** Общая раскладка пункта меню — и у организации, и у действий внизу. */
const MENU_ITEM =
  "flex cursor-default items-center gap-2 rounded-xl px-2 py-2 outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"

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

export { MENU_ITEM, OrganizationList, SettingsBlock, SingleOrganization }
export type { ProfileMenuOrganization }

