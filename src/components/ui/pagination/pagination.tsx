import * as React from "react"
import { ChevronLeft, ChevronRight, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"

import { useNavFocusHandoff } from "./use-nav-focus"
import { getCompactPageList, useCompactPages } from "./use-compact-pages"

// Pagination («Paginator») — навигация по номерам страниц плюс выбор
// размера страницы справа. По макету две раскладки: «L» (одна строка,
// выбор размера в той же строке справа) и «M» (выбор переносится вниз и
// прижимается влево). Макет описывает M как адаптивный запасной вариант
// («применяется, когда по горизонтали осталось меньше 16px»), а не как
// фиксированный размер, поэтому она сделана обычным переносом flex, а не
// отдельным пропсом.
//
// Сама внешняя полоса несёт оформление в обоих мастерах, и L и M (у обоих
// одинаково, плюс снято пипеткой с примера «пагинатор, приклеенный к низу
// таблицы»): белый фон, верхняя рамка 1px и отступы 16px по горизонтали и
// 4px по вертикали. Это собственная рамка компонента в стиле подвала, а не
// то, во что вызывающий код должен его оборачивать.
//
// Текст на всех таблетках страниц и размеров (во всех состояниях) и
// подпись «Показать на странице» идут в насыщенности Medium (500) по
// макету, а не только активная таблетка: числовые таблетки Default, Hover
// и Onclick тоже дают font-medium, у них меняется лишь фон.
//
// Сокращение (Begin/Middle/End, снято с собственных образцов значений в
// макете):
// - totalPages <= 7: показываем все страницы, без многоточия.
// - текущая рядом с началом («Begin»): 1 2 3 4 5 … последняя
// - текущая рядом с концом («End»):    1 … п-4 п-3 п-2 п-1 последняя
// - иначе («Middle»):                  1 … т-1 текущая т+1 … последняя
// - полоса уже полного ряда (узкий экран): 1 … текущая … последняя
//   (см. use-compact-pages).

/**
 * Дизайн-чек №4 №7: элемент «Page Count (ELK)» имеет
 * ровно два значения `Value` — «100 (Without 75)» и «100», поэтому набор
 * записей на странице задаётся выбором из них, а не произвольным массивом.
 */
const PAGE_COUNT_OPTIONS = {
  "100 (Without 75)": [25, 50, 100],
  "100": [25, 50, 75, 100],
} satisfies Record<string, number[]>

type PaginationPageCount = keyof typeof PAGE_COUNT_OPTIONS

/** Порядок как в макете. Отдельным массивом, а не `Object.keys`: ключ «100»
 *  похож на целое число, и в объекте JS поднимает его выше «100 (Without
 *  75)» — перечисление ключей порядок из макета не сохраняет. */
const PAGE_COUNTS: PaginationPageCount[] = ["100 (Without 75)", "100"]

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
  pageSize?: number
  /** «Page Count» — набор вариантов числа записей на странице. */
  pageCount?: PaginationPageCount
  onPageSizeChange?: (size: number) => void
  /**
   * Показывать ли блок переключения страниц.
   *
   * Дизайн-чек №36: «должна быть возможность полного отключения страниц для
   * тех ситуаций, когда всё уместилось на одной странице. Сейчас это
   * проверить нельзя». Раньше симметричный `showPageSize` был, а этого не
   * было — блок страниц отключить было нечем.
   *
   * Документация компонента описывает два случая:
   * «если все записи отображаются на одной странице, в правой части
   * пагинатора должен оставаться только один активный элемент — текущая
   * страница» (это `totalPages = 1`, стрелки прячутся сами) и «в случае,
   * если система возвращает пустое значение, пагинатор также отображается,
   * но отображается только правая часть (с выбором числа записей на
   * странице)» — вот для второго случая и нужен `showPages={false}`.
   *
   * Дизайн-чек №4 №6: при `showPages={false}` блок «Показать на странице»
   * остаётся на своём месте (справа в Size=L), а не переезжает влево — сам
   * блок Page Count отключать нечем (дизайн-чек №4 №7).
   */
  showPages?: boolean
  /**
   * Свойство `Size` компонент-сета «ELK / paginator»: `L` — всё в одну
   * строку, `M` — «используется когда между
   * переключением страниц и выбором числа записей на странице остаётся
   * менее 16 пикселей по горизонтали: выбор числа записей перемещается вниз
   * на левую сторону».
   */
  size?: "L" | "M"
  className?: string
}

function getPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages]
  }
  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages]
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="pagination-page"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        // pt-[9px] и pb-[7px] вместо отцентрованного h-9: в макете у
        // Paginator Numbers строка высотой 20px стоит на 1px ниже центра
        // своей коробки 36px. Высота по-прежнему складывается в 36
        // (9 + 20 + 7), ширина — в 44 (8 + 28 + 8).
        "flex min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 pt-[9px] pb-[7px] text-p2-medium text-[var(--pagination-fg)] outline-none focus-visible:focus-ring transition-colors",
        "not-data-active:hover:bg-[var(--pagination-hover-bg)]",
        "not-data-active:active:bg-[var(--pagination-onclick-bg)]",
        "data-active:bg-[var(--pagination-active-bg)]"
      )}
    >
      {page}
    </button>
  )
}

function NavButton({
  icon: Icon,
  disabled,
  onClick,
  label,
  ...focusProps
}: {
  icon: typeof ChevronLeft
  disabled?: boolean
  onClick?: () => void
  label: string
  onFocus?: () => void
  onBlur?: (event: React.FocusEvent) => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      {...focusProps}
      data-slot="pagination-nav"
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--pagination-fg)] outline-none focus-visible:focus-ring transition-colors not-disabled:hover:bg-[var(--pagination-hover-bg)] disabled:cursor-not-allowed disabled:text-[var(--pagination-disabled-fg)]"
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  )
}

function SizeButton({
  size,
  active,
  onClick,
}: {
  size: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="pagination-size"
      data-active={active || undefined}
      className={cn(
        // pt-[9px] и pb-[7px] вместо отцентрованного h-9: в макете у
        // Paginator Numbers строка высотой 20px стоит на 1px ниже центра
        // своей коробки 36px. Высота по-прежнему складывается в 36
        // (9 + 20 + 7), ширина — в 44 (8 + 28 + 8).
        "flex min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 pt-[9px] pb-[7px] text-p2-medium text-[var(--pagination-fg)] outline-none focus-visible:focus-ring transition-colors",
        "not-data-active:hover:bg-[var(--pagination-hover-bg)]",
        "not-data-active:active:bg-[var(--pagination-onclick-bg)]",
        "data-active:bg-[var(--pagination-active-bg)]"
      )}
    >
      {size}
    </button>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize = 25,
  pageCount = "100 (Without 75)",
  onPageSizeChange,
  showPages = true,
  size = "L",
  className,
}: PaginationProps) {
  const showNav = totalPages > 1
  const pageSizeOptions = PAGE_COUNT_OPTIONS[pageCount]
  const { listRef, navFocusProps } = useNavFocusHandoff(page, totalPages)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const compact = useCompactPages(rootRef, listRef, {
    enabled: showPages,
    page,
    totalPages,
    size,
  })
  const pages =
    totalPages <= 0
      ? [1]
      : compact
        ? getCompactPageList(page, totalPages)
        : getPageList(page, totalPages)

  // Цель прижимается к существующим страницам, а не отбрасывается. Если
  // страниц стало меньше, чем номер текущей (отбор сузил выдачу, а родитель
  // `page` не поправил), «Предыдущая» выглядит активной — и раньше молча
  // ничего не делала: `page - 1` тоже лежало за концом списка.
  function goTo(next: number) {
    const target = Math.min(Math.max(next, 1), Math.max(totalPages, 1))
    if (target === page) return
    onPageChange?.(target)
  }

  return (
    <div
      ref={rootRef}
      data-slot="pagination"
      data-size={size}
      data-compact={compact || undefined}
      className={cn(
        "flex border-t border-[var(--pagination-border)] bg-white px-4 py-1",
        // Size=M: выбор числа записей уходит на вторую строку и влево.
        size === "M"
          ? "flex-col items-start gap-y-2"
          : "flex-wrap items-center justify-between gap-x-6 gap-y-2",
        className
      )}
    >
      {showPages && (
        <div ref={listRef} data-slot="pagination-pages" className="flex items-center gap-1">
          {showNav && (
            <NavButton
              icon={ChevronLeft}
              label="Предыдущая страница"
              disabled={page <= 1}
              onClick={() => goTo(page - 1)}
              {...navFocusProps}
            />
          )}
          {pages.map((entry, index) =>
            entry === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                data-slot="pagination-ellipsis"
                className="flex size-9 shrink-0 items-center justify-center text-[var(--pagination-fg)]"
              >
                <Ellipsis aria-hidden="true" className="size-4" />
              </span>
            ) : (
              <PageButton
                key={entry}
                page={entry}
                active={entry === page}
                onClick={() => goTo(entry)}
              />
            )
          )}
          {showNav && (
            <NavButton
              icon={ChevronRight}
              label="Следующая страница"
              disabled={page >= totalPages}
              onClick={() => goTo(page + 1)}
              {...navFocusProps}
            />
          )}
        </div>
      )}

      {/* Page Count — обязательный блок: отключать его нечем, а при
          выключенном блоке страниц он остаётся на своём месте (в Size=L —
          справа, `ml-auto`).

          В мобильной форме блок переносится: подпись и четыре кнопки
          размера (25/50/75/100) шире полосы 343 на 33px и давали
          горизонтальную прокрутку. На десктопе ряд без переноса — иначе
          минимальная ширина блока падала бы, и в контейнере по содержимому
          кнопки уходили бы под подпись (урок Informer, r9).

          Зазор в мобильной форме 12, а не 16: подпись и три кнопки
          (умолчание) занимают 312px при полосе 311, и с зазором 16 блок
          переносился из-за одного пикселя. Мобильного макета у пагинатора
          нет, на десктопе зазор прежний. */}
      <div
        data-slot="pagination-page-count"
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-2 desktop:flex-nowrap desktop:gap-x-4",
          size === "L" && "ml-auto"
        )}
      >
        <span className="text-p2-medium whitespace-nowrap text-[var(--pagination-caption-fg)]">
          Показать на странице
        </span>
        <div className="flex items-center gap-1">
          {pageSizeOptions.map((option) => (
            <SizeButton
              key={option}
              size={option}
              active={option === pageSize}
              onClick={() => onPageSizeChange?.(option)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Pagination, PAGE_COUNT_OPTIONS, PAGE_COUNTS }
export type { PaginationProps, PaginationPageCount }
