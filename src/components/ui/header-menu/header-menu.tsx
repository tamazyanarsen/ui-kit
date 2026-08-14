import * as React from "react"
import { Star } from "@/icons"

import { cn } from "@/lib/utils"
import { Scrollbar } from "@/components/ui/scrollbar"

import { MenuBanner, type MenuBannerProps } from "./menu-banner"

// HeaderMenu — «Раскрытое меню навигации» (MENU DOCS, нода 70303:53431):
// панель, которая раскрывается под шапкой по кнопке «Меню».
//
// Дизайн-чек №30 («компонент собран из разрозненных элементов… используется
// наряду с раскрывающимися списками нераскрывающиеся»): в макете у пункта
// навигации в шапке нет собственного выпадающего списка — раскрывается
// ровно одна кнопка «Меню», и раскрывается она вот в эту панель. Поэтому
// меню вынесено в отдельный компонент со своей историей, а не собирается
// из Dropdown'ов внутри Header.
//
// Геометрия панели снята с макета один в один: белый фон, скругление
// только снизу (32px), боковые отступы 40px, внутри — 12-колоночная сетка
// шириной до 1800px с интервалом 24px и отступами 16px сверху / 40 снизу.
// Карточка группы («Группа страниц», нода 8026:24678 + 8026:24629) — фон
// Grey 106, скругление 24, паддинг 32, интервал 24 между шапкой и списком
// и 16 между ссылками.

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

interface HeaderMenuProps {
  groups?: HeaderMenuGroup[]
  /** Сколько колонок раскладывать: 1920 — четыре, 1280 — три. */
  columns?: 2 | 3 | 4
  /** Баннеры последней колонки. Больше одного — появляется переключатель. */
  banners?: MenuBannerProps[]
  /** Значения ссылок, помеченных звездой. */
  favourites?: string[]
  onFavouriteToggle?: (value: string) => void
  /** Звёзды «в избранное» показываются только там, где избранное включено. */
  showFavourites?: boolean
  /** Максимальная высота панели: за ней включается собственный скролл. */
  maxHeight?: number | string
  className?: string
}

const COLUMN_SPAN: Record<2 | 3 | 4, string> = {
  2: "col-span-6",
  3: "col-span-4",
  4: "col-span-3",
}

/** Распределяет группы по колонкам, добирая каждый раз самую короткую. */
function distribute(groups: HeaderMenuGroup[], columns: number, offsets: number[]) {
  const buckets: HeaderMenuGroup[][] = Array.from({ length: columns }, () => [])
  const heights = offsets.slice()

  for (const group of groups) {
    // Высота карточки — шапка плюс ссылки; для раскладки достаточно
    // относительной оценки в строках, точные пиксели тут не нужны.
    const weight = 1 + group.links.length
    let target = 0
    for (let i = 1; i < columns; i += 1) {
      if (heights[i] < heights[target]) target = i
    }
    buckets[target].push(group)
    heights[target] += weight
  }

  return buckets
}

function PageLink({
  link,
  favourite,
  showStar,
  onFavouriteToggle,
}: {
  link: HeaderMenuLink
  favourite: boolean
  showStar: boolean
  onFavouriteToggle?: (value: string) => void
}) {
  return (
    // `group/link`, а не hover на самой звезде: в макете незаполненная
    // звезда прозрачна (opacity 0) и проявляется по наведению на всю
    // строку — см. вариант `Star Container` с opacity-0 в ноде 7890:29955.
    <div data-slot="header-menu-link" className="group/link flex w-full items-start">
      <button
        type="button"
        onClick={link.onClick}
        className="min-w-0 flex-1 cursor-pointer pr-2 text-left text-p1-medium text-[var(--header-fg)] outline-none transition-colors hover:text-[var(--header-hover-fg)]"
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
  onFavouriteToggle,
}: {
  group: HeaderMenuGroup
  favourites: string[]
  showFavourites: boolean
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

function HeaderMenu({
  groups = [],
  columns = 4,
  banners = [],
  favourites = [],
  onFavouriteToggle,
  showFavourites = true,
  maxHeight,
  className,
}: HeaderMenuProps) {
  const [bannerIndex, setBannerIndex] = React.useState(0)
  const activeBanner = banners[Math.min(bannerIndex, banners.length - 1)]

  // Баннер занимает верх последней колонки, поэтому она стартует не с нуля
  // — иначе балансировка свалит в неё столько же карточек, сколько и в
  // остальные, и колонка окажется вдвое длиннее (в макете 70303:58312
  // баннер + две группы против трёх групп в соседних).
  const offsets = Array.from({ length: columns }, (_, index) =>
    index === columns - 1 && banners.length > 0 ? 8 : 0
  )
  const buckets = distribute(groups, columns, offsets)

  const grid = (
    <div
      className={cn(
        "grid w-full max-w-[1800px] grid-cols-12 gap-6 pt-4 pb-10",
        maxHeight === undefined && "min-w-0"
      )}
    >
      {buckets.map((bucket, index) => (
        <div
          key={index}
          data-slot="header-menu-column"
          className={cn("flex flex-col gap-6 self-start", COLUMN_SPAN[columns])}
        >
          {index === columns - 1 && activeBanner && (
            <div className="flex w-full flex-col gap-2">
              <MenuBanner {...activeBanner} />
              {banners.length > 1 && (
                <BannerDots
                  count={banners.length}
                  active={bannerIndex}
                  onSelect={setBannerIndex}
                />
              )}
            </div>
          )}
          {bucket.map((group) => (
            <PageGroup
              key={group.value}
              group={group}
              favourites={favourites}
              showFavourites={showFavourites}
              onFavouriteToggle={onFavouriteToggle}
            />
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <div
      data-slot="header-menu"
      className={cn(
        "flex w-full flex-col items-center overflow-hidden rounded-b-[32px] bg-[var(--header-bg)] px-10",
        className
      )}
    >
      {maxHeight === undefined ? (
        grid
      ) : (
        // В макете у панели свой `ELK / scrollbar` с инсетом 8px справа
        // (нода 70303:53432) — то же, что рисует Scrollbar кита.
        <Scrollbar className="w-full pr-2" style={{ maxHeight }}>
          <div className="flex w-full justify-center">{grid}</div>
        </Scrollbar>
      )}
    </div>
  )
}

export { HeaderMenu }
export type { HeaderMenuProps, HeaderMenuGroup, HeaderMenuLink }
