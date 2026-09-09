import { cn } from "@/lib/utils"
import { Grid } from "@/components/ui/grid"
import { useMediaQuery } from "@/lib/use-media-query"
import { Scrollbar } from "@/components/ui/scrollbar"

import {
  PageGroup,
  type HeaderMenuGroup,
  type HeaderMenuLink,
} from "./header-menu-parts"
import { BannerCarousel } from "./banner-carousel"
import type { MenuBannerProps } from "./menu-banner"

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

interface HeaderMenuProps {
  groups?: HeaderMenuGroup[]
  /**
   * Сколько колонок раскладывать.
   *
   * По умолчанию НЕ фиксировано, а считается от ширины вьюпорта — дизайн-чек
   * от 08.09, замечание 3: «На вьюпорте менее 1536px меню должно строиться в
   * 3 столбца по 4 колонки грида». До правки здесь стояло жёсткое `4`, и на
   * 1440 карточки ужимались в три колонки грида каждая.
   *
   * Явное значение перекрывает расчёт — им пользуются витрины, которым нужно
   * показать обе раскладки рядом.
   */
  columns?: 2 | 3 | 4
  /** Баннеры последней колонки. Больше одного — появляется переключатель. */
  banners?: MenuBannerProps[]
  /** Значения ссылок, помеченных звездой. */
  favourites?: string[]
  onFavouriteToggle?: (value: string) => void
  /** Значение текущего раздела — подсвечивается брендовым цветом. */
  activeLink?: string
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

/** Порог из замечания 3: с него и выше — четыре колонки, ниже — три. */
const WIDE_MENU_QUERY = "(min-width: 1536px)"

function HeaderMenu({
  groups = [],
  columns: columnsProp,
  banners = [],
  favourites = [],
  onFavouriteToggle,
  activeLink,
  showFavourites = true,
  maxHeight,
  className,
}: HeaderMenuProps) {
  const wide = useMediaQuery(WIDE_MENU_QUERY)
  // Четыре колонки по три колонки грида (12/4) с 1536; ниже — три по четыре.
  const columns = columnsProp ?? (wide ? 4 : 3)

  // Баннер занимает верх последней колонки, поэтому она стартует не с нуля
  // — иначе балансировка свалит в неё столько же карточек, сколько и в
  // остальные, и колонка окажется вдвое длиннее (в макете 70303:58312
  // баннер + две группы против трёх групп в соседних).
  const offsets = Array.from({ length: columns }, (_, index) =>
    index === columns - 1 && banners.length > 0 ? 8 : 0
  )
  const buckets = distribute(groups, columns, offsets)

  const grid = (
    <Grid
      columns
      className={cn("pt-4 pb-10", maxHeight === undefined && "min-w-0")}
    >
      {buckets.map((bucket, index) => (
        <div
          key={index}
          data-slot="header-menu-column"
          className={cn("flex flex-col gap-6 self-start", COLUMN_SPAN[columns])}
        >
          {index === columns - 1 && banners.length > 0 && (
            // Карусель, а не один кадр: баннеры листаются сами и едут
            // (дизайн-чек от 08.09, замечание 4).
            <BannerCarousel banners={banners} />
          )}
          {bucket.map((group) => (
            <PageGroup
              key={group.value}
              group={group}
              favourites={favourites}
              showFavourites={showFavourites}
              activeLink={activeLink}
              onFavouriteToggle={onFavouriteToggle}
            />
          ))}
        </div>
      ))}
    </Grid>
  )

  return (
    <div
      data-slot="header-menu"
      className={cn(
        "flex w-full flex-col items-center overflow-hidden rounded-b-[32px] bg-[var(--header-bg)]",
        className
      )}
    >
      {maxHeight === undefined ? (
        grid
      ) : (
        // В макете у панели свой `ELK / scrollbar` с инсетом 8px справа
        // (нода 70303:53432) — то же, что рисует Scrollbar кита. Вариант
        // `panel` добавляет к этим восьми ещё и отступ по вертикали в 32:
        // низ панели скруглён на 32 и обрезан `overflow-hidden`, из-за чего
        // дорожка теряла весь низ (дизайн-чек от 08.09, замечание 8).
        <Scrollbar inset="panel" className="w-full" style={{ maxHeight }}>
          <div className="flex w-full justify-center">{grid}</div>
        </Scrollbar>
      )}
    </div>
  )
}

export { HeaderMenu, distribute as distributeMenuGroups }
export type { HeaderMenuProps, HeaderMenuGroup, HeaderMenuLink }
