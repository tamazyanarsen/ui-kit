import * as React from "react"

import { cn } from "@/lib/utils"

// Dropdown — the popup surface Figma documents as its own separate,
// reusable component (Select's own canvas lists three distinct property
// tables: Select, Menu Point, and Dropdown — "Больше информации о
// выпадающем списке вы можете найти в разделе Select, Dropdown" is a
// cross-reference between components, not just a shared look). Every
// floating option/action list in this kit — Select, Combobox, Autocomplete,
// Button Menu's "..." overflow, Selection Button — renders through this one
// component via each primitive's own `render` prop, instead of each one
// re-deriving its own popup chrome from a shared className string.
//
// forwardRef is required, not optional: Base UI's `render` prop forwards a
// ref to the element it swaps in (for floating-ui positioning/focus
// management) — a plain function component here silently drops that ref.
const Dropdown = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  function Dropdown({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown"
        className={cn(
          "rounded-[16px] bg-popover text-popover-foreground shadow-universal outline-none origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

interface DropdownItemProps extends React.ComponentProps<"div"> {
  text: React.ReactNode
  description?: React.ReactNode
}

// The "Menu Point" item variant used by the action-list consumers above —
// title + optional description, highlighted on hover/focus. Select's own
// SelectItem has a different, checkbox-driven look (see select/item.tsx)
// and stays separate; this is specifically the plain action-row variant.
//
// Дизайн-чек №21: типографика и цвета здесь те же, что у общей строки меню
// (`@/components/ui/menu-item`) — P1 Medium на основной текст, P3 Medium на
// описание, `--menu-item-*` на цвета. Своей вёрстки строка не держит только
// потому, что у неё нет ведущего элемента: это колонка из двух строк, а не
// ряд «контрол + текст». Новые строки с чекбоксом или иконкой собирайте на
// `MenuItemContent`, как это делает Combobox.
//
// Flush, un-rounded p-4 row with a flat --menu-item-bg-highlighted (#F8F8F8)
// hover fill — confirmed
// against the literal "Menu Point (ELK)" markup inside the canonical
// "ELK / dropdown" component (node 5739:16568) and the "Уровень 2" hover
// state on the Select/Dropdown usage canvas (node 29750:55882): items are
// edge-to-edge `p-[16px]` with no border-radius of their own, the same
// #F8F8F8 highlighted-row color Select/Combobox's own items use — only the
// Dropdown container itself is rounded, and clips the flush top/bottom rows
// to follow its corners (see the `overflow-hidden` each consumer adds).
const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  function DropdownItem({ className, text, description, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown-item"
        className={cn(
          "flex cursor-default flex-col gap-0.5 p-4 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:bg-[var(--menu-item-bg-highlighted)]",
          className
        )}
        {...props}
      >
        <span className="text-p1-medium text-[var(--menu-item-fg)]">{text}</span>
        {description && (
          <span className="text-p3-medium text-[var(--menu-item-description-fg)]">{description}</span>
        )}
        {children}
      </div>
    )
  }
)

export { Dropdown, DropdownItem }
export type { DropdownItemProps }
