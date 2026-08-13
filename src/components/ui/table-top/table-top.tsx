import * as React from "react"
import { ChevronLeft, ChevronRight } from "@/icons"

import { useHorizontalScrollState } from "@/components/ui/table"

import { cn } from "@/lib/utils"

// Table Top — "Блок верха таблицы" (ui/table-top). Per its own spec this is
// a sibling of `Table`, not a wrapper around it — the "Использование в
// макете" mockup shows it stacked directly above a plain data table on the
// page, sharing no state/context with it. It's a pure layout shell: every
// color used across `table-top.svg`/`table-top-1.svg` (grepped for `fill=`)
// is an exact reuse of tokens that already exist elsewhere — Filter's own
// white/grey surfaces, Chips' dark "applied" pill, Button/Badge/Tabs/Input's
// palettes, and this kit's standard text greys — so this component defines
// no CSS tokens of its own; it borrows `--table-fg`/`--table-description-fg`/
// `--table-divider` from Table's namespace for its own text/border and
// leaves every interactive control (search, filter dropdowns, sort, tabs,
// download/columns actions) to be composed from existing components
// (`Input`, `Filter`, `Tabs`, `Button`, `Select`, `Badge`) rather than
// re-implementing them.
//
// The spec's "Elements" breakdown (Title / Filter Setting / Filter Select /
// Chips / Tabs) maps onto these four layout pieces plus the existing `Tabs`
// component dropped in directly between `TableTopTitle` and
// `TableTopToolbar` — no bespoke tabs wrapper needed.

// The container is *not* a card: `ELK / table-top` (node 51104:13311) is a
// transparent 16px-padded column with a single bottom rule, sitting flush
// above the table it heads — an earlier reading of the mockup turned it into
// a rounded white panel with 24px padding, which the symbol itself does not
// have.
function TableTop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-top"
      className={cn(
        "flex w-full flex-col gap-4 border-b border-[var(--table-divider)] p-4",
        className
      )}
      {...props}
    />
  )
}

interface TableTopTitleProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  /** Right-aligned action button (the spec's "Button" element). */
  action?: React.ReactNode
}

function TableTopTitle({
  className,
  title,
  action,
  ...props
}: TableTopTitleProps) {
  return (
    <div
      data-slot="table-top-title"
      className={cn("flex min-h-8 items-center justify-between gap-4", className)}
      {...props}
    >
      {/* H3 Medium (24/32) per "Title-Table (ELK)" — not H4 — and it takes the
          free space so a long title ellipsizes instead of pushing the action
          button out of the row. */}
      <h3 className="min-w-0 flex-1 truncate text-h3 text-[var(--table-fg)]">
        {title}
      </h3>
      {action}
    </div>
  )
}

// Wraps the search input, filter dropdowns, and "Ещё фильтры"/"Сбросить
// фильтры" buttons — just a wrapping flex row, all content is composed by
// the consumer (see table-top-demo.tsx for the full assembly).
function TableTopToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-top-toolbar"
      // "Group Chips (ELK)" wraps with an asymmetric gap — 8px between
      // controls in a row, 12px between wrapped rows.
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-3", className)}
      {...props}
    />
  )
}

interface TableTopSummaryProps extends React.ComponentProps<"div"> {
  /** Left-aligned text, e.g. "Выбрано фильтров: 0  Результатов: 8". */
  info?: React.ReactNode
  /** Right-aligned actions, e.g. "Скачать"/"Настроить столбцы" or a sort Select. */
  actions?: React.ReactNode
}

function TableTopSummary({
  className,
  info,
  actions,
  ...props
}: TableTopSummaryProps) {
  return (
    <div
      data-slot="table-top-summary"
      className={cn(
        "flex min-h-8 flex-wrap items-center justify-between gap-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-4 text-p2-medium">
        {info}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

interface TableTopSummaryItemProps extends React.ComponentProps<"span"> {
  label: React.ReactNode
  value: React.ReactNode
}

// One "Выбрано фильтров: 0" pair from "Result-Table (ELK)". Both halves are
// P2 Medium and differ only in color — the label is the muted grey, the value
// the standard dark text — so this is not a `<strong>`/regular contrast.
function TableTopSummaryItem({
  className,
  label,
  value,
  ...props
}: TableTopSummaryItemProps) {
  return (
    <span
      data-slot="table-top-summary-item"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <span className="text-[var(--table-description-fg)]">{label}</span>
      <span className="text-[var(--table-fg)]">{value}</span>
    </span>
  )
}

// One end-of-strip chevron. Sits over the track rather than beside it, so
// turning it on never reflows the pairs, and fades the content under itself
// out to the block's white.
function DetailsArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick: () => void
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      data-slot="table-top-details-arrow"
      data-direction={direction}
      aria-label={direction === "left" ? "Прокрутить сводку назад" : "Прокрутить сводку вперёд"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[4px] bg-[var(--table-bg)] text-[var(--table-fg)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        direction === "left" ? "left-0" : "right-0"
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  )
}

// TableTopDetails — "Сводка" (node 70279:10336), the last row inside
// `ELK / table-top` (its `Details` slot, 70279:10367). A muted "Сводка"
// label pinned on the left and a scrolling strip of `label: value` pairs
// separated by a 12px-wide Grey 166 rule.
//
// The spec calls it "Дополнительная функция, наличие определяется при
// разработке конкретного продукта", and shows three states of the strip
// (Начало / Середина / Конец ленты) — it scrolls horizontally on its own
// when the pairs don't fit, independently of the table below it.
interface TableTopDetailsProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode
  items: { label: React.ReactNode; value: React.ReactNode }[]
}

function TableTopDetails({
  className,
  label = "Сводка",
  items,
  ...props
}: TableTopDetailsProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const { scrolledFromStart, scrolledFromEnd } = useHorizontalScrollState(trackRef)

  function scrollBy(direction: -1 | 1) {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div
      data-slot="table-top-details"
      className={cn("flex min-h-8 items-center gap-4 text-p2-medium", className)}
      {...props}
    >
      <span className="shrink-0 text-[var(--table-description-fg)]">
        {label}
      </span>
      {/* The spec draws the strip in four states — "Сводка поместилась",
          "Начало ленты", "Середина ленты", "Конец ленты" (node 70279:10340) —
          which differ only by which chevron is showing: none when everything
          fits, then one per side that still has content behind it. Same edge
          rule as the pinned columns, so it reuses their scroll hook. */}
      <div className="relative flex min-w-0 flex-1 items-center">
        {scrolledFromStart && (
          <DetailsArrow direction="left" onClick={() => scrollBy(-1)} />
        )}
        {/* rounded-[16px] + overflow on the track is Figma's own Row frame —
            it clips the strip's ends flush with the block's radius.
            `scrollbar-none`: the strip is driven by the chevrons, and the
            spec draws no bar under it. */}
        <div
          ref={trackRef}
          data-slot="table-top-details-track"
          className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto rounded-[16px] px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <span
              key={index}
              className="flex shrink-0 items-center gap-1 text-[var(--table-fg)]"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="h-5 w-3 border-l border-[var(--table-summary-divider)]"
                />
              )}
              <span>{item.label}:</span>
              <span>{item.value}</span>
            </span>
          ))}
        </div>
        {scrolledFromEnd && (
          <DetailsArrow direction="right" onClick={() => scrollBy(1)} />
        )}
      </div>
    </div>
  )
}

export {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopDetails,
}
export type {
  TableTopTitleProps,
  TableTopSummaryProps,
  TableTopSummaryItemProps,
  TableTopDetailsProps,
}
