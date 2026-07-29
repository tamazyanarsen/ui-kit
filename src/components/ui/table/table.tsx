import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronsUpDown, Ellipsis } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tag, type TagColor } from "@/components/ui/tag"

// Table — "Таблица" (ui/table). Anatomy per spec: a Title Cell row (the
// header, `<thead>`) and a Cell grid of data rows (`<tbody>`/`TableRow`).
// Built on real `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` — the
// spec's cell "Type" variants (Checkbox/Icon/Text/Tag/Button) are genuinely
// heterogeneous per-column content, which real table semantics (row/column
// screen-reader navigation, `scope="col"`) support directly; nothing in the
// rest of this kit's div-based components (Item, Accordion List) covers a
// data grid like this.
//
// Row states (`ui/table/table-1.svg`'s "Line Fill" variants): Default has no
// fill, Hover is a plain CSS `:hover` (no prop needed), Active means the row
// is selected (checkbox checked + darker fill) and Added marks a just-added
// row — confirmed via the spec's own vector fills that Added reuses Hover's
// exact background rather than being a distinct color, so both are driven by
// `--table-row-hover-bg`. Selected/added are consumer-controlled props (there
// is no CSS pseudo-class for either), matching this kit's general preference
// for controlled state over embedded logic (see Select/Calendar precedent).

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(
          "w-full border-separate border-spacing-0 text-sm text-[var(--table-fg)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-[var(--table-divider)]",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-[var(--table-divider)]",
        className
      )}
      {...props}
    />
  )
}

// For `<TableBody>` rows only — its hover fill is the Line Fill spec's body-
// row behavior. The header row (inside `<TableHeader>`) should be a plain
// `<tr>`; each sortable `TableHeadCell` already carries its own Default→
// Hover/Active text-color transition, and reusing this component there would
// wash the *entire* header row in the row-hover grey instead.
interface TableRowProps extends React.ComponentProps<"tr"> {
  selected?: boolean
  added?: boolean
}

function TableRow({ className, selected, added, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected || undefined}
      data-added={added || undefined}
      className={cn(
        "transition-colors",
        selected
          ? "bg-[var(--table-row-active-bg)]"
          : added
            ? "bg-[var(--table-row-added-bg)]"
            : "hover:bg-[var(--table-row-hover-bg)]",
        className
      )}
      {...props}
    />
  )
}

// The "..." action trigger shared by Title Cell's Button type and Cell's
// Button type — a Menu built the same way as `ButtonMenuOverflow`, just at
// icon-sm size and `secondary-white` (bg white/hover Grey114/active Grey106,
// pixel-confirmed against the spec's own Default/Hover/Active kebab swatch —
// no bespoke "ghost" button variant needed).
function TableRowMenu({
  menu,
  label = "Открыть меню строки",
}: {
  menu: React.ReactNode
  label?: string
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant="secondary-white"
            size="sm"
            icon={Ellipsis}
            iconPosition="only"
            aria-label={label}
          />
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="table-row-menu-content"
            className="min-w-48 origin-(--transform-origin) rounded-2xl bg-white p-2 shadow-lg ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            {menu}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

type TableHeadCellType =
  | "checkbox"
  | "subtitle-left"
  | "subtitle-right"
  | "icon"
  | "button"

interface TableHeadCellProps
  extends Omit<React.ComponentProps<"th">, "children"> {
  type?: TableHeadCellType
  children?: React.ReactNode
  /** "Show Sort" — renders the ⇅ toggle next to Subtitle Left/Right text. */
  sortable?: boolean
  onSortClick?: () => void
  /** "Show Icon" — an optional leading icon before Subtitle text. */
  icon?: React.ReactNode
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
  menu?: React.ReactNode
}

function TableHeadCell({
  className,
  type = "subtitle-left",
  children,
  sortable = false,
  onSortClick,
  icon,
  checked,
  indeterminate,
  onCheckedChange,
  menu,
  ...props
}: TableHeadCellProps) {
  const align = type === "subtitle-right" ? "text-right" : "text-left"
  const isSubtitle = type === "subtitle-left" || type === "subtitle-right"

  return (
    <th
      data-slot="table-head-cell"
      data-type={type}
      scope="col"
      className={cn(
        "h-13 px-4 py-3 font-medium whitespace-nowrap",
        type === "checkbox" || type === "icon" || type === "button"
          ? "w-px text-center"
          : align,
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
          aria-label="Выбрать все строки"
        />
      )}

      {type === "icon" && (
        <span className="inline-flex text-[var(--table-fg)]" aria-hidden="true">
          {icon}
        </span>
      )}

      {type === "button" && menu && <TableRowMenu menu={menu} label="Настроить таблицу" />}

      {isSubtitle &&
        (sortable ? (
          <button
            type="button"
            onClick={onSortClick}
            data-slot="table-sort"
            className={cn(
              "group inline-flex cursor-pointer items-center gap-1 text-[var(--table-description-fg)] outline-none transition-colors hover:text-[var(--table-fg)] focus-visible:text-[var(--table-fg)]",
              type === "subtitle-right" && "flex-row-reverse"
            )}
          >
            {icon && <span aria-hidden="true">{icon}</span>}
            <span>{children}</span>
            <ChevronsUpDown aria-hidden="true" className="size-3.5 shrink-0" />
          </button>
        ) : (
          <span
            className={cn(
              "inline-flex items-center gap-1",
              type === "subtitle-right" && "flex-row-reverse"
            )}
          >
            {icon && (
              <span aria-hidden="true" className="text-[var(--table-fg)]">
                {icon}
              </span>
            )}
            <span>{children}</span>
          </span>
        ))}
    </th>
  )
}

type TableCellType = "checkbox" | "icon" | "text" | "tag" | "button"

interface TableCellProps extends Omit<React.ComponentProps<"td">, "children"> {
  type?: TableCellType
  children?: React.ReactNode
  /** "Show Description" — a muted second line under Text cells. */
  description?: React.ReactNode
  icon?: React.ReactNode
  tagColor?: TagColor
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  menu?: React.ReactNode
  align?: "left" | "right"
}

function TableCell({
  className,
  type = "text",
  children,
  description,
  icon,
  tagColor = "green",
  checked,
  onCheckedChange,
  menu,
  align = "left",
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      data-type={type}
      className={cn(
        "h-13 px-4 py-3 whitespace-nowrap",
        type === "checkbox" || type === "icon" || type === "button"
          ? "w-px text-center"
          : align === "right"
            ? "text-right"
            : "text-left",
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} aria-label="Выбрать строку" />
      )}

      {type === "icon" && (
        <span className="inline-flex text-[var(--table-fg)]" aria-hidden="true">
          {icon}
        </span>
      )}

      {type === "text" && (
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-[var(--table-fg)]">{children}</span>
          {description && (
            <span className="text-xs text-[var(--table-description-fg)]">
              {description}
            </span>
          )}
        </span>
      )}

      {type === "tag" && <Tag color={tagColor}>{children}</Tag>}

      {type === "button" && menu && <TableRowMenu menu={menu} />}
    </td>
  )
}

export { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell }
export type { TableRowProps, TableHeadCellProps, TableCellProps, TableHeadCellType, TableCellType }
