import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Briefcase, Check, ChevronDown, LogOut, Search, Settings } from "@/icons"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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

const SEARCH_THRESHOLD = 7

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
  const activeOrg = organizations.find((org) => org.id === value) ?? organizations[0]
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
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            data-slot="profile-menu-trigger"
            className={cn(
              "group flex min-w-0 cursor-pointer items-center gap-4 rounded-lg px-2 py-1 text-left outline-none transition-colors hover:bg-[var(--header-item-hover-bg)]",
              className
            )}
          />
        }
      >
        <span className="flex min-w-0 items-center gap-3">
          <Briefcase
            aria-hidden="true"
            className="size-6 shrink-0 text-[var(--header-icon-fg)] group-hover:text-[var(--header-hover-fg)]"
          />
          <span className="flex min-w-0 flex-col">
            <span className="min-w-0 truncate text-p1 font-medium text-[var(--header-fg)] group-hover:text-[var(--header-hover-fg)]">
              {activeOrg?.name}
            </span>
            {contactPerson && (
              <span className="min-w-0 truncate text-p3 text-[var(--header-meta-fg)]">
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

      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="profile-menu-content"
            className="w-80 origin-(--transform-origin) overflow-hidden rounded-2xl bg-[var(--header-bg)] py-2 shadow-[0_4px_12px_rgba(139,153,169,0.24)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            {isSingle ? (
              <div className="flex flex-col gap-0.5 px-4 py-2">
                <span className="text-p1 font-medium text-[var(--header-fg)]">
                  {activeOrg?.name}
                </span>
                <span className="text-p3 text-[var(--header-meta-fg)]">
                  ИНН {activeOrg?.inn} · {activeOrg?.role}
                </span>
              </div>
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
                      // arrow-key navigation and type-ahead — without this
                      // it swallows every keystroke meant for the search
                      // box instead of letting it reach the input's value.
                      onKeyDown={(event) => event.stopPropagation()}
                    />
                  </div>
                )}
                <p className="px-4 pt-1 pb-2 text-p1 font-medium text-[var(--header-fg)]">
                  {isSearching
                    ? "Мои организации — результаты поиска"
                    : `Мои организации (${organizations.length})`}
                </p>
                <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto px-2">
                  {filtered.map((org) => (
                    <MenuPrimitive.Item
                      key={org.id}
                      data-slot="profile-menu-org-item"
                      onClick={() => onValueChange?.(org.id)}
                      className="flex cursor-default items-center justify-between gap-2 rounded-xl px-2 py-2 outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="min-w-0 truncate text-p1 font-medium text-[var(--header-fg)]">
                          {org.name}
                        </span>
                        <span className="min-w-0 truncate text-p3 text-[var(--header-meta-fg)]">
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
                  {filtered.length === 0 && (
                    <p className="px-2 py-4 text-center text-p2 text-[var(--header-meta-fg)]">
                      Ничего не найдено
                    </p>
                  )}
                </div>
              </>
            )}

            {showSetting && (
              <div className="mt-2 flex flex-col gap-0.5 border-t border-[var(--header-divider)] px-2 pt-2">
                <MenuPrimitive.Item
                  data-slot="profile-menu-settings-item"
                  onClick={onSettingsClick}
                  className="flex cursor-default items-center gap-2 rounded-xl px-2 py-2 text-p1 font-medium text-[var(--header-fg)] outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"
                >
                  <Settings aria-hidden="true" className="size-6 shrink-0" />
                  Профиль и настройки
                </MenuPrimitive.Item>
                <MenuPrimitive.Item
                  data-slot="profile-menu-logout-item"
                  onClick={onLogoutClick}
                  className="flex cursor-default items-center gap-2 rounded-xl px-2 py-2 text-p1 font-medium text-[var(--header-logout-fg)] outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"
                >
                  <LogOut aria-hidden="true" className="size-6 shrink-0" />
                  Выйти
                </MenuPrimitive.Item>
              </div>
            )}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { ProfileMenu }
export type { ProfileMenuProps, ProfileMenuOrganization }
