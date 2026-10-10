import * as React from "react"
import { ChevronDown, Star } from "@/icons"

import { cn } from "@/lib/utils"

// Общая разметка двух рядов навигации с «Ещё»: нижнего ряда клиентской
// шапки (`header/nav-row.tsx`) и полосы избранного шапки сотрудника
// (`employee-menu/employee-menu-nav.tsx`).
//
// Ряды были дословными копиями и уже разошлись (ревью 10.10, КК-2): перехват
// фокуса при исчезновении «Ещё» был только у шапки клиента, а пол ширины
// (`--nav-min-width`, чтобы обязательный пункт с «Ещё» не ложился на
// соседей) — только у шапки сотрудника. Теперь обе правки здесь и действуют
// на оба ряда.
//
// Различия, которые остаются в самих рядах, — из макета, а не дрейф: свой
// попап «Ещё» (у шапки сотрудника — с галочкой текущего раздела), свой
// текст подсказки пустого избранного и место ряда в шапке.

/** Пункт ряда. `self-stretch`: нажимается вся полоса 64px, а не строка текста. */
const NAV_ITEM_CLASS =
  "flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap outline-none focus-visible:focus-ring transition-colors hover:text-[var(--header-hover-fg)]"

function NavRowItem({
  slot,
  active,
  onClick,
  children,
}: {
  slot: string
  active: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-slot={slot}
      data-active={active || undefined}
      // Активный раздел объявляется и в видимом ряду, а не только когда
      // пункт спрятан в «Ещё»: раньше там стоял лишь `data-active`.
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        NAV_ITEM_CLASS,
        active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
      )}
    >
      {children}
    </button>
  )
}

/**
 * Кнопка «Ещё» для `Menu.Trigger render={…}`. Раскрытое «Ещё» — брендового
 * цвета вместе с перевёрнутым шевроном (макет: подпись Blue 254).
 */
const NavOverflowTriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { slot: string }
>(function NavOverflowTriggerButton({ slot, className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      data-slot={slot}
      className={cn(
        "group flex shrink-0 cursor-pointer items-center gap-1 self-stretch text-p1-medium whitespace-nowrap text-[var(--header-fg)] outline-none focus-visible:focus-ring transition-colors hover:text-[var(--header-hover-fg)] data-popup-open:text-[var(--header-hover-fg)]",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          Ещё
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
          />
        </>
      )}
    </button>
  )
})

/**
 * Подсказка на месте пунктов, пока избранного нет.
 *
 * ⚠️ Подсказка обязана обрезать себя: одна строка `whitespace-nowrap` без
 * обрезки на узкой шапке вылезала за ряд — под колокольчик и в
 * горизонтальную прокрутку страницы. Строка — ОДИН `truncate`-блок, а
 * звезда стоит в её потоке строчным элементом: при двух сжимаемых кусках
 * текста многоточие появлялось и посреди фразы («…нажмит… ☆»). Отступы
 * звезды `mx-1` повторяют прежний `gap-1` флекса, а сдвиг `-0.125em` от
 * базовой линии — прежнее центрирование.
 */
function NavEmptyHint({ slot, before }: { slot: string; before: string }) {
  return (
    <p
      data-slot={slot}
      className="min-w-0 flex-1 truncate text-p1-medium text-[var(--header-meta-fg)]"
    >
      {before}
      <Star size={16} aria-hidden="true" className="mx-1 inline-block size-4 align-[-0.125em]" />
      справа, чтобы добавить его сюда
    </p>
  )
}

export {
  NavEmptyHint,
  NavOverflowTriggerButton,
  NavRowItem,
}
