import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Check, ChevronDown, Star } from "@/icons"
import { cn } from "@/lib/utils"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { Dropdown } from "@/components/ui/dropdown"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import type { HeaderMenuLink } from "@/components/ui/header-menu"

// «Избранное в навигации» — полоса закреплённых разделов в верхнем ряду
// шапки сотрудника (нода I70396:22367;164:25333).
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
//    избранного», нода 70396:22293);
//  • у строк «Ещё» есть галочка на текущем разделе — в кадре «раскрыт
//    элемент „Ещё“» (70396:22510) отмечена «Отчётность и аналитика».

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
    <p
      data-slot="employee-menu-nav-empty-hint"
      className="flex min-w-0 flex-1 items-center gap-1 text-p1-medium whitespace-nowrap text-[var(--header-meta-fg)]"
    >
      Наведите курсор на элемент на главной и нажмите
      <span className="flex items-center pb-0.5">
        <Star aria-hidden="true" className="size-4 shrink-0" />
      </span>
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
            // Раскрытое «Ещё» — брендового цвета вместе с шевроном: в кадре
            // 70396:22510 подпись «Ещё» нарисована Blue 254, а шеврон
            // перевёрнут.
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
            render={<Dropdown className={cn(MORE_WIDTH, "overflow-hidden")} />}
          >
            {links.map((link) => (
              <MenuPrimitive.Item
                key={link.value}
                data-slot="employee-menu-nav-overflow-item"
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
  links = [],
  activeLink,
  showHint = true,
  className,
}: EmployeeMenuNavProps) {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
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
      className={cn(
        "relative flex h-16 min-w-0 flex-1 items-center gap-8",
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

      {/* Мерная копия ряда — всегда в разметке и всегда со ВСЕМИ пунктами:
          спрятанный за «Ещё» пункт иначе отдал бы ширину 0 и счёт больше
          никогда бы не вырос обратно. Обёртка `inset-0 overflow-hidden`
          снимает вклад копии в ширину прокрутки страницы — см. тот же приём
          и ту же причину в `ui/header/nav-row.tsx`. */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 overflow-hidden"
      >
        <div
          data-slot="employee-menu-nav-measure"
          className="absolute top-0 left-0 flex gap-8"
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
        </div>
      </div>
    </div>
  )
}

export { EmployeeMenuNav }
export type { EmployeeMenuNavProps }
