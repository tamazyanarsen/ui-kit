import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { ChevronDown, Menu, Plus, Star, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Divider } from "@/components/ui/divider"
import { Grid } from "@/components/ui/grid"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { OverflowMeasureLayer } from "@/lib/overflow-measure"

import { HeaderMenuPopup } from "./menu-popup"

// Нижний ряд шапки — кнопки «Меню»/«Создать», разделитель и пункты
// навигации. Собран не «на глаз», а по макету `Menu Header (ELK)`: группа
// кнопок (интервал 8) → вертикальный `ELK / divider` во
// всю высоту минус 16px сверху и снизу → пункты навигации, всё с интервалом
// 32 внутри контейнера шириной до 1800px. Обе полосы шапки — ровно 64px с
// рамкой снизу.
//
// Перекрытие навигации переиспользует тот же механизм «Ещё», который уже
// сделан для Tabs и Switcher (`useOverflowCount`): по примечанию макета
// «Взаимодействие с элементом» пункты должны уходить в «Ещё» по одному, по
// мере того как кончается место, а не на фиксированных брейкпоинтах. Макет
// подтверждает это отдельным вариантом `Size=With More`, где «Ещё» —
// единственный пункт с шевроном.

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
  // `self-stretch`, а не вертикальный отступ: `Menu Point Header (ELK)` в
  // макете занимает всю высоту строки в 64px, поэтому целью нажатия служит
  // вся полоса, хотя закрашена только подпись высотой 24px.
  return (
    <button
      type="button"
      data-slot="header-nav-item"
      data-active={active || undefined}
      // Активный раздел объявляется и в видимом ряду, а не только когда
      // пункт спрятан в «Ещё»: раньше там стоял лишь `data-active`.
      aria-current={active ? "page" : undefined}
      onClick={item.onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap outline-none focus-visible:focus-ring transition-colors hover:text-[var(--header-hover-fg)]",
        active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
      )}
    >
      {item.icon}
      {item.label}
    </button>
  )
}

/**
 * Вариант `Size=None` у `Menu Header (ELK)` — подсказка
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
            // «Свёрнутое меню — избранные разделы уходят в „Ещё“»).
            className="group flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap text-[var(--header-fg)] outline-none focus-visible:focus-ring transition-colors hover:text-[var(--header-hover-fg)] data-popup-open:text-[var(--header-hover-fg)]"
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
  /** Кнопки «Меню» и «Создать» — сюда возвращается фокус по Escape. */
  menuTriggerRef?: React.Ref<HTMLButtonElement>
  createTriggerRef?: React.Ref<HTMLButtonElement>
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
  menuTriggerRef,
  createTriggerRef,
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
      // Обе полосы шапки — ровно 64px, а контент стоит по общей сетке
      // продукта (поля 40, максимум 1800) — мерено с `Menu Header (ELK)`
      // . Ширину держит `Grid`, а не локальные `px-10` +
      // `max-w-[1800px]`: см. комментарий в components/ui/grid/grid.tsx.
      // ⚠️ Нижняя граница гаснет, пока раскрыто меню или создание —
      // дизайн-чек от 08.09, замечание 7: «Нижний разделитель хедера не
      // должен быть виден при раскрытом меню или раскрытом создании». Панель
      // приезжает вплотную под ряд, и линия читалась как её собственная
      // верхняя кромка.
      //
      // Цвет гасится, а сама рамка остаётся: убери её — и ряд станет на
      // пиксель ниже, то есть панель дёрнется вверх ровно в момент
      // раскрытия. Тот же приём, что у последней строки списка в base.css.
      className={cn(
        "flex h-16 w-full shrink-0 border-b",
        menuOpen || createOpen
          ? "border-transparent"
          : "border-[var(--header-border)]"
      )}
    >
      <Grid className="flex h-full min-w-0 items-center gap-8">
        <div className="flex shrink-0 items-center gap-2">
          {/* Кнопок в макете две и обе размера S: «Меню» (secondary-black,
              `icon / classic burger`) и «Создать» (primary, `icon / plus`). */}
          <Button
            ref={menuTriggerRef}
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
              ref={createTriggerRef}
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

          {/* Закадровая копия для замеров — почему она обязана существовать
              и почему её обёртка обрезает содержимое, см. в
              `lib/overflow-measure.tsx`. */}
          <OverflowMeasureLayer data-slot="header-nav-measure" className="gap-8">
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
          </OverflowMeasureLayer>
        </div>
      </Grid>
    </div>
  )
}

export { NavRow }
export type { HeaderNavItem }
