import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { ChevronDown, Menu, Plus, Star, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Divider } from "@/components/ui/divider"
import { useOverflowCount } from "@/lib/use-overflow-count"

import { HeaderMenuPopup } from "./menu-popup"

// Нижний ряд шапки — кнопки «Меню»/«Создать», разделитель и пункты
// навигации. Собран не «на глаз», а по макету `Menu Header (ELK)` (нода
// 70303:48974): группа кнопок (интервал 8) → вертикальный `ELK / divider` во
// всю высоту минус 16px сверху и снизу → пункты навигации, всё с интервалом
// 32 внутри контейнера шириной до 1800px. Обе полосы шапки — ровно 64px с
// рамкой снизу.
//
// Nav overflow reuses the exact "Ещё" mechanism already built for Tabs/
// Switcher (useOverflowCount): per the spec's own "Взаимодействие с
// элементом" note, items should move into "Ещё" one at a time as space runs
// out, not at fixed breakpoints. Макет подтверждает это отдельным вариантом
// `Size=With More`, где «Ещё» — единственный пункт с шевроном.

interface HeaderNavItem {
  value: string
  label: React.ReactNode
  /** «Show Logotype» в макете — иконка 24px перед названием (например, СБП). */
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
}

/** Место, которое ряд держит про запас под пункт «Ещё». */
const ELLIPSIS_RESERVED = 72

/** Интервал между пунктами в `Menu Header (ELK)` — 32px, не 24. */
const NAV_GAP = 32

function NavItem({ item, active }: { item: HeaderNavItem; active: boolean }) {
  // `self-stretch`, not a vertical padding: Figma's `Menu Point Header (ELK)`
  // is the full 64px height of the row, so the whole band is the hit target
  // even though only the 24px label is inked.
  return (
    <button
      type="button"
      data-slot="header-nav-item"
      data-active={active || undefined}
      onClick={item.onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap outline-none transition-colors hover:text-[var(--header-hover-fg)]",
        active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
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

/** Пункты, не поместившиеся в ряд, — под общим «Ещё». */
function NavOverflow({ items }: { items: HeaderNavItem[] }) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            // Раскрытое «Ещё» — брендового цвета вместе с шевроном (макет
            // «Свёрнутое меню — избранные разделы уходят в „Ещё“», нода
            // 70303:58398).
            className="group flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap text-[var(--header-fg)] outline-none transition-colors hover:text-[var(--header-hover-fg)] data-popup-open:text-[var(--header-hover-fg)]"
          />
        }
      >
        Ещё
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
        />
      </MenuPrimitive.Trigger>
      <HeaderMenuPopup slot="header-nav-overflow-content" align="start">
        {items.map((item) => (
          <ButtonMenuOverflowItem
            key={item.value}
            text={item.label}
            onClick={item.onClick}
          />
        ))}
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

interface NavRowProps {
  items: HeaderNavItem[]
  activeSection?: string
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
  createOpen: boolean
  onCreateOpenChange: (open: boolean) => void
  showCreate: boolean
  favouritesEnabled: boolean
}

function NavRow({
  items,
  activeSection,
  menuOpen,
  onMenuOpenChange,
  createOpen,
  onCreateOpenChange,
  showCreate,
  favouritesEnabled,
}: NavRowProps) {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    items.length,
    ELLIPSIS_RESERVED,
    NAV_GAP
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
          {/* Кнопок в макете две и обе размера S: «Меню» (secondary-black,
              `icon / classic burger`) и «Создать» (primary, `icon / plus`). */}
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
            <NavItem
              key={item.value}
              item={item}
              active={item.active ?? item.value === activeSection}
            />
          ))}

          {hiddenItems.length > 0 && <NavOverflow items={hiddenItems} />}

          {/* Off-screen measurement copy — see Switcher/Tabs' own comment on
              why this needs to exist as an always-rendered duplicate row. */}
          <div
            aria-hidden="true"
            data-slot="header-nav-measure"
            className="pointer-events-none invisible absolute top-0 left-0 flex gap-8"
          >
            {items.map((item, index) => (
              <div
                key={item.value}
                data-value={item.value}
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

export { NavRow }
export type { HeaderNavItem }
