import type * as React from "react"
import { Star } from "@/icons"

import { cn } from "@/lib/utils"

// Части раскрытого меню: ссылка, карточка группы и переключатель баннеров.
// Вынесены из `header-menu.tsx` — там остаётся сама панель с раскладкой по
// колонкам.

interface HeaderMenuLink {
  /** Идентификатор ссылки — он же ключ «избранного». */
  value: string
  label: React.ReactNode
  onClick?: () => void
}

interface HeaderMenuGroup {
  value: string
  title: React.ReactNode
  /** Иконка 16px в шапке группы («icon / round» в макете). */
  icon?: React.ReactNode
  links: HeaderMenuLink[]
}

function PageLink({
  link,
  favourite,
  showStar,
  active,
  onFavouriteToggle,
}: {
  link: HeaderMenuLink
  favourite: boolean
  showStar: boolean
  active: boolean
  onFavouriteToggle?: (value: string) => void
}) {
  return (
    // `group/link`, а не hover на самой звезде: в макете незаполненная
    // звезда прозрачна (opacity 0) и проявляется по наведению на всю
    // строку — см. вариант `Star Container` с opacity-0 в ноде 7890:29955.
    <div data-slot="header-menu-link" className="group/link flex w-full items-start">
      <button
        type="button"
        data-active={active || undefined}
        onClick={link.onClick}
        className={cn(
          "min-w-0 flex-1 cursor-pointer pr-2 text-left text-p1-medium outline-none transition-colors hover:text-[var(--header-hover-fg)]",
          active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
        )}
      >
        {link.label}
      </button>
      {showStar && (
        <button
          type="button"
          aria-pressed={favourite}
          aria-label={favourite ? "Убрать из избранного" : "Добавить в избранное"}
          onClick={() => onFavouriteToggle?.(link.value)}
          className={cn(
            // Цвет звезды в макете один и тот же в обоих состояниях —
            // отличается только заливка контура (см. «Настройку избранного»,
            // нода 70303:58450, где добавленные разделы помечены такой же
            // серой звездой, а не брендовой).
            "flex cursor-pointer flex-col items-start py-[3px] pl-1 text-[var(--header-menu-star-fg)] outline-none transition-opacity",
            favourite
              ? "opacity-100"
              : "opacity-0 group-hover/link:opacity-100 focus-visible:opacity-100"
          )}
        >
          <Star filled={favourite} aria-hidden="true" className="size-4 shrink-0" />
        </button>
      )}
    </div>
  )
}

function PageGroup({
  group,
  favourites,
  showFavourites,
  activeLink,
  onFavouriteToggle,
}: {
  group: HeaderMenuGroup
  favourites: string[]
  showFavourites: boolean
  activeLink?: string
  onFavouriteToggle?: (value: string) => void
}) {
  return (
    <div
      data-slot="header-menu-group"
      className="flex w-full flex-col gap-6 rounded-[24px] bg-[var(--header-menu-group-bg)] p-8"
    >
      <div className="flex w-full items-start gap-2">
        {group.icon && (
          <span className="flex shrink-0 flex-col items-start pt-0.5 text-[var(--header-menu-group-fg)] [&_svg]:size-4">
            {group.icon}
          </span>
        )}
        <p className="min-w-0 flex-1 text-p1-medium text-[var(--header-menu-group-fg)]">
          {group.title}
        </p>
      </div>
      <div className="flex w-full flex-col gap-4">
        {group.links.map((link) => (
          <PageLink
            key={link.value}
            link={link}
            favourite={favourites.includes(link.value)}
            showStar={showFavourites}
            active={link.value === activeLink}
            onFavouriteToggle={onFavouriteToggle}
          />
        ))}
      </div>
    </div>
  )
}

/** «Bank / Dots» — переключатель баннеров: точки 8px с шагом 16. */
function BannerDots({
  count,
  active,
  onSelect,
}: {
  count: number
  active: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex w-full items-center justify-center">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Баннер ${index + 1}`}
          aria-current={index === active}
          onClick={() => onSelect(index)}
          className="flex cursor-pointer items-center p-1 outline-none"
        >
          <span
            className={cn(
              "size-2 rounded-full transition-colors",
              index === active
                ? "bg-[var(--header-fg)]"
                : "bg-[var(--header-menu-star-fg)]"
            )}
          />
        </button>
      ))}
    </div>
  )
}

export { BannerDots, PageGroup, PageLink }
export type { HeaderMenuGroup, HeaderMenuLink }
