import type * as React from "react"
import { Star } from "@/icons"

import { cn } from "@/lib/utils"
import { CarouselDots } from "@/components/ui/carousel-dots"

// Части раскрытого меню: ссылка, карточка группы и переключатель баннеров.
// Вынесены из `header-menu.tsx` — там остаётся сама панель с раскладкой по
// колонкам.

interface HeaderMenuLink {
  /** Идентификатор ссылки — он же ключ «избранного». */
  value: string
  label: React.ReactNode
  onClick?: () => void
  /**
   * `false` — раздел нельзя добавить в избранное: звезды у ссылки нет, и в
   * «Настройке избранного» среди добавляемых её тоже нет (Правки UI-Kit от
   * 25.10). По умолчанию можно.
   */
  favouritable?: boolean
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
  onStarHint,
  mobile = false,
}: {
  link: HeaderMenuLink
  favourite: boolean
  showStar: boolean
  active: boolean
  onFavouriteToggle?: (value: string) => void
  /**
   * Звезда не переключает избранное, а открывает подсказку «Настройте
   * избранное с компьютера» (мобильное меню, Правки UI-Kit от 25.10): на
   * телефоне избранное не настраивается, звезда только показывает состояние.
   */
  onStarHint?: () => void
  /**
   * Строка мобильного меню (`Меню / Избранное`, 70467:11707): подпись
   * P1 Medium Mobile — 14/20 вместо 16/24, а звезда видна всегда. Наведения
   * на телефоне нет, и звезда, которая проявляется по нему, там была бы
   * недоступна вовсе.
   */
  mobile?: boolean
}) {
  const star = showStar && link.favouritable !== false
  return (
    // `group/link`, а не hover на самой звезде: в макете незаполненная
    // звезда прозрачна (opacity 0) и проявляется по наведению на всю
    // строку — см. вариант `Star Container` с opacity-0 в мастере.
    <div data-slot="header-menu-link" className="group/link flex w-full items-start">
      <button
        type="button"
        data-active={active || undefined}
        // Текущий раздел — `aria-current`, а не только цвет подписи.
        aria-current={active ? "page" : undefined}
        onClick={link.onClick}
        className={cn(
          "min-w-0 flex-1 cursor-pointer pr-2 text-left [overflow-wrap:anywhere] outline-none focus-visible:focus-ring transition-colors hover:text-[var(--header-hover-fg)]",
          // На телефоне нажатие сжимает только подпись — до 0,97 к центру
          // САМОГО ТЕКСТА, а не кнопки во всю строку (Правки UI-Kit от
          // 25.10): подпись — строчный блок по ширине текста.
          mobile ? "press-scale-content text-p2-medium" : "text-p1-medium",
          active ? "text-[var(--header-hover-fg)]" : "text-[var(--header-fg)]"
        )}
      >
        {mobile ? (
          <span data-slot="header-menu-link-label" className="inline-block max-w-full">
            {link.label}
          </span>
        ) : (
          link.label
        )}
      </button>
      {star && (
        <button
          type="button"
          {...(onStarHint
            ? {
                // Звезда-подсказка: состояние — в подписи, нажатие —
                // диалог, а не переключатель.
                "aria-haspopup": "dialog" as const,
                "aria-label": favourite
                  ? "В избранном. Как настроить избранное"
                  : "Не в избранном. Как настроить избранное",
                onClick: onStarHint,
              }
            : {
                "aria-pressed": favourite,
                "aria-label": favourite
                  ? "Убрать из избранного"
                  : "Добавить в избранное",
                onClick: () => onFavouriteToggle?.(link.value),
              })}
          className={cn(
            // Цвет звезды в макете один и тот же в обоих состояниях —
            // отличается только заливка контура (см. «Настройку
            // избранного», где добавленные разделы помечены такой же серой
            // звездой, а не брендовой).
            "flex cursor-pointer flex-col items-start pl-1 text-[var(--header-menu-star-fg)] outline-none focus-visible:focus-ring",
            // На телефоне звезда при нажатии сжимается сама, до 0,92, как
            // маленькие значки (Правки UI-Kit от 25.10).
            mobile ? "press-scale [--press-scale:0.92]" : "transition-opacity",
            // У мобильной строки высотой 20 звезда стоит с полями 2
            // (`Star Container py-[2px]` макета); десктопные 3 — как были.
            mobile ? "py-0.5" : "py-[3px]",
            favourite || mobile
              ? "opacity-100"
              : "opacity-0 group-hover/link:opacity-100 focus-visible:opacity-100"
          )}
        >
          <Star size={16} filled={favourite} aria-hidden="true" className="size-4 shrink-0" />
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
        <p className="min-w-0 flex-1 text-p1-medium [overflow-wrap:anywhere] text-[var(--header-menu-group-fg)]">
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

/** «Bank / Dots» — переключатель баннеров. Правки UI-Kit от 25.10: общие
 *  точки карусели кита (CarouselDots) — те же круги 8 с шагом 16, плюс
 *  наведение Grey 284 и зона нажатия 24. `mt-1` с зазором карусели 8 даёт
 *  12 от низа баннера до кругов, как у карусели баннеров. */
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
    <CarouselDots
      count={count}
      active={active}
      onSelect={onSelect}
      aria-label="Баннеры"
      getDotLabel={(index) => `Баннер ${index + 1}`}
      className="mt-1 w-full"
    />
  )
}

export { BannerDots, PageGroup, PageLink }
export type { HeaderMenuGroup, HeaderMenuLink }
