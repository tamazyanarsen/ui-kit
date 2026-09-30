import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Check, ChevronDown, Star } from "@/icons"
import { cn } from "@/lib/utils"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { OverflowMeasureLayer } from "@/lib/overflow-measure"
import { Dropdown } from "@/components/ui/dropdown"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import type { HeaderMenuLink } from "@/components/ui/header-menu"
import { compactList } from "@/components/ui/header-menu/compact-list"
import { NAV_POPUP_WIDTH } from "@/components/ui/button-menu/popup-width"

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

/** Интервал между пунктами — 32px, как в `Content` макета. */
const NAV_GAP = 32

/**
 * Место, которое ряд держит про запас под пункт «Ещё».
 *
 * 56 на сам пункт (P1 Medium «Ещё» + интервал 4 + шеврон 16) плюс 32 —
 * интервал до него.
 */
const MORE_RESERVED = 88

/** Ширина списка «Ещё» — `ELK / dropdown` в макете стоит на 280px. */
const MORE_WIDTH = "min-w-[280px]"

function NavItem({ link, active }: { link: HeaderMenuLink; active: boolean }) {
  // `self-stretch`, а не вертикальные поля: `Menu Point Header (ELK)` — вся
  // высота полосы (64px), поэтому нажимается вся полоса, а не только строка
  // текста высотой 24.
  return (
    <button
      type="button"
      data-slot="employee-menu-nav-item"
      data-active={active || undefined}
      // Активный раздел объявляется и в видимом ряду, а не только когда
      // пункт спрятан в «Ещё»: раньше там стоял лишь `data-active`.
      aria-current={active ? "page" : undefined}
      onClick={link.onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap outline-none focus-visible:focus-ring transition-colors hover:text-[var(--header-hover-fg)]",
        active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
      )}
    >
      {link.label}
    </button>
  )
}

/**
 * Подсказка на месте пунктов, пока избранного нет (кадр «Главная — Нет
 * избранного»). Текст ведёт на главную, потому что закрепляют разделы
 * именно там — отдельного раскрывающегося меню у сотрудника нет.
 */
function EmptyFavouritesHint() {
  return (
    // ⚠️ Подсказка обязана обрезать себя: одна строка `whitespace-nowrap`
    // без обрезки на узкой шапке вылезала за ряд — под колокольчик и в
    // горизонтальную прокрутку страницы. Строка — ОДИН `truncate`-блок, а
    // звезда стоит в её потоке строчным элементом: при двух сжимаемых
    // кусках текста многоточие появлялось и посреди фразы («…нажмит… ☆»).
    // Отступы звезды `mx-1` повторяют прежний `gap-1` флекса, а сдвиг
    // `-0.125em` от базовой линии — прежнее центрирование (сверено в Chrome
    // до долей пикселя).
    <p
      data-slot="employee-menu-nav-empty-hint"
      className="min-w-0 flex-1 truncate text-p1-medium text-[var(--header-meta-fg)]"
    >
      Наведите курсор на элемент на главной и нажмите
      <Star
        size={16}
        aria-hidden="true"
        className="mx-1 inline-block size-4 align-[-0.125em]"
      />
      справа, чтобы добавить его сюда
    </p>
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
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            // Раскрытое «Ещё» — брендового цвета вместе с шевроном: в
            // кадре подпись «Ещё» нарисована Blue 254, а шеврон перевёрнут.
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
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
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
                className={menuItemRowClass(
                  "cursor-pointer data-highlighted:bg-[var(--menu-item-bg-highlighted)]"
                )}
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
  const { containerRef, itemRefs, visibleCount, minFitWidth } = useOverflowCount(
    links.length,
    MORE_RESERVED,
    NAV_GAP
  )
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
      style={
        hiddenLinks.length > 0
          ? ({ "--nav-min-width": `${minFitWidth}px` } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "relative flex h-16 min-w-0 flex-1 items-center gap-8 min-w-[var(--nav-min-width,0px)]",
        className
      )}
    >
      {links.length === 0 && showHint && <EmptyFavouritesHint />}

      {visibleLinks.map((link) => (
        <NavItem
          key={link.value}
          link={link}
          active={link.value === activeLink}
        />
      ))}

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
