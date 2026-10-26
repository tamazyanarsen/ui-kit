import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { menuClickOpenProps } from "@/lib/menu-click-open"

import { Check } from "@/icons"
import { cn } from "@/lib/utils"
import { OverflowMeasureLayer } from "@/lib/overflow-measure"
import { NavEmptyHint, NavOverflowTriggerButton, NavRowItem } from "@/lib/nav-overflow-row"
import { useNavOverflow } from "@/lib/use-nav-overflow"
import { Dropdown } from "@/components/ui/dropdown"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import type { HeaderMenuLink } from "@/components/ui/header-menu"
import { compactList } from "@/components/ui/header-menu/compact-list"
import { NAV_POPUP_WIDTH } from "@/components/ui/button-menu/popup-width"
import { POPUP_COLLISION } from "@/lib/popup-position"

// «Избранное в навигации» — полоса закреплённых разделов в верхнем ряду
// шапки сотрудника.
//
// Это вторая половина меню сотрудника: звезда у ссылки на главной кладёт
// раздел сюда. Лежит рядом с самим меню, а не в `ui/header`, потому что
// список, порядок, «Ещё» и подсказка пустого состояния — свойства меню, а
// шапка только отводит им место.
//
// Отличий от нижнего ряда клиентской шапки (`ui/header/nav-row.tsx`) три, и
// каждое — из макета:
//
//  • ряд стоит в ВЕРХНЕЙ полосе, между разделителем у логотипа и панелью
//    иконок, а не отдельной второй строкой;
//  • подсказка пустого избранного говорит про главную, а не про меню:
//    «Наведите курсор на элемент на главной…» (кадр «Главная — Нет
//    избранного»);
//  • у строк «Ещё» есть галочка на текущем разделе — в кадре «раскрыт
//    элемент „Ещё“» отмечена «Отчётность и аналитика».

/** Ширина списка «Ещё» — `ELK / dropdown` в макете стоит на 280px. */
const MORE_WIDTH = "min-w-[280px]"

/**
 * Подсказка на месте пунктов, пока избранного нет (кадр «Главная — Нет
 * избранного»). Текст ведёт на главную, потому что закрепляют разделы
 * именно там — отдельного раскрывающегося меню у сотрудника нет.
 */
function EmptyFavouritesHint() {
  return (
    <NavEmptyHint
      slot="employee-menu-nav-empty-hint"
      before="Наведите курсор на элемент на главной и нажмите"
    />
  )
}

/** Пункты, не поместившиеся в полосу, — под общим «Ещё». */
function NavOverflow({
  links,
  activeLink,
}: {
  links: HeaderMenuLink[]
  activeLink?: string
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger {...menuClickOpenProps}
        render={<NavOverflowTriggerButton slot="employee-menu-nav-overflow-trigger" />}
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionAvoidance={POPUP_COLLISION}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="employee-menu-nav-overflow-content"
            // Не выше места до края окна: шапка сотрудника липкая, и
            // прокрутка страницы до нижних разделов не дотягивалась.
            render={<Dropdown className={cn(MORE_WIDTH, NAV_POPUP_WIDTH, "themed-scrollbar overflow-x-hidden overflow-y-auto")} />}
          >
            {links.map((link) => (
              <MenuPrimitive.Item
                key={link.value}
                data-slot="employee-menu-nav-overflow-item"
                // Галочка под `aria-hidden` — только для глаз; текущий раздел
                // объявляется атрибутом.
                aria-current={link.value === activeLink ? "page" : undefined}
                onClick={link.onClick}
                // Наведение, подсветка, нажатие и курсор — общая строка
                // списка `menu-row` (Правки UI-Kit от 25.10).
                className={menuItemRowClass("menu-row")}
              >
                <MenuItemContent
                  trailing={
                    link.value === activeLink && (
                      <Check
                        size={24}
                        aria-hidden="true"
                        className="size-6 shrink-0 text-[var(--header-check-fg)]"
                      />
                    )
                  }
                >
                  {link.label}
                </MenuItemContent>
              </MenuPrimitive.Item>
            ))}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

interface EmployeeMenuNavProps {
  /** Закреплённые разделы в порядке закрепления. */
  links?: HeaderMenuLink[]
  /** Значение текущего раздела — подсвечивается брендовым цветом. */
  activeLink?: string
  /**
   * Показывать ли подсказку, когда закреплять ещё нечего.
   *
   * Выключается там, где избранное не редактируется: полоса тогда просто
   * пустая, а не зовёт нажать звезду, которой нет.
   */
  showHint?: boolean
  className?: string
}

function EmployeeMenuNav({
  links: rawLinks = [],
  activeLink,
  showHint = true,
  className,
}: EmployeeMenuNavProps) {
  // Пустые ссылки (`[cond && {...}]`) отбрасываются: иначе `link.value` падал.
  const links = React.useMemo(() => compactList(rawLinks) ?? [], [rawLinks])
  const { containerRef, itemRefs, visibleCount, focusSentinel, floorStyle, floorClass } =
    useNavOverflow({
      count: links.length,
      overflowSelector:
        '[data-slot="employee-menu-nav-overflow-trigger"], [data-slot="employee-menu-nav-overflow-content"]',
      itemSelector: '[data-slot="employee-menu-nav-item"]',
    })
  const visibleLinks = links.slice(0, visibleCount)
  const hiddenLinks = links.slice(visibleCount)

  return (
    <div
      ref={containerRef}
      data-slot="employee-menu-nav"
      // Пока часть пунктов спрятана, ряду гарантировано место под один пункт
      // и «Ещё»: остальное отдаёт подпись сотрудника (она обрезается
      // многоточием). Без пола на узкой шапке ряд сжимался до нуля, а
      // обязательный пункт с «Ещё» ложились на колокольчик и значок профиля.
      // Пол действует на любой ширине: у шапки нет мобильной формы, и ниже
      // ~480px она шире экрана и прокручивается вбок (как шапка клиента на
      // 375) — но пункты и «Ещё» не ложатся на колокольчик и профиль.
      style={floorStyle}
      className={cn(
        "relative flex h-16 min-w-0 flex-1 items-center gap-8",
        floorClass,
        className
      )}
    >
      {links.length === 0 && showHint && <EmptyFavouritesHint />}

      {visibleLinks.map((link) => (
        <NavRowItem
          key={link.value}
          slot="employee-menu-nav-item"
          active={link.value === activeLink}
          onClick={link.onClick}
        >
          {link.label}
        </NavRowItem>
      ))}

      {focusSentinel}

      {hiddenLinks.length > 0 && (
        <NavOverflow links={hiddenLinks} activeLink={activeLink} />
      )}

      {/* Мерная копия ряда — почему она обязана существовать и почему её
          обёртка обрезает содержимое, см. в `lib/overflow-measure.tsx`. */}
      <OverflowMeasureLayer
        data-slot="employee-menu-nav-measure"
        className="gap-8"
      >
        {links.map((link, index) => (
          <div
            key={link.value}
            data-value={link.value}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="flex shrink-0 items-center gap-1 text-p1-medium whitespace-nowrap"
          >
            {link.label}
          </div>
        ))}
      </OverflowMeasureLayer>
    </div>
  )
}

export { EmployeeMenuNav }
export type { EmployeeMenuNavProps }
