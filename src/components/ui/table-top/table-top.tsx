import * as React from "react"

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

function TableTop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-top"
      className={cn(
        "flex w-full flex-col gap-4 rounded-2xl border border-[var(--table-divider)] bg-white p-6",
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
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    >
      <h3 className="text-h4 text-[var(--table-fg)]">{title}</h3>
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
      className={cn("flex flex-wrap items-center gap-2", className)}
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
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4 text-p2 text-[var(--table-description-fg)]">
        {info}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export { TableTop, TableTopTitle, TableTopToolbar, TableTopSummary }
export type { TableTopTitleProps, TableTopSummaryProps }
