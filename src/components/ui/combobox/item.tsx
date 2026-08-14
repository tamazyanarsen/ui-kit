import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check } from "@/icons"

import { cn } from "@/lib/utils"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import {
  COMBOBOX_CHECKBOX_BASE_CLASS,
  ComboboxCheckbox,
  type ComboboxCheckboxState,
} from "./checkbox"

// Indent step for tree levels — the spec shows "Уровень 2/3/4" stepping in
// evenly, only two of which (parent/child) are actually selectable here.
// Round-2 audit: was 24, sampled against a literal nested "Menu Point
// (ELK)" instance on canvas 666:11 (level-0 pl-[16px] -> level-1
// pl-[32px], a 16px step, not 24).
const COMBOBOX_INDENT_PX = 16

// Item — a real, selectable leaf (checkbox + Text + Description).

interface ComboboxItemOwnProps {
  description?: React.ReactNode
  level?: 0 | 1
}

export function ComboboxItem({
  className,
  children,
  description,
  level = 0,
  style,
  ...props
}: ComboboxPrimitive.Item.Props & ComboboxItemOwnProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      // Round-2 audit: matches the literal checkbox "Menu Point (ELK)"
      // instances sampled off canvas 666:11 (both the plain and tree-nested
      // dropdown examples) — p-[16px] all sides (not py-2/pr-3/pl-3),
      // gap-[16px] between the checkbox and text block (not gap-2.5), and
      // no independent corner radius (pixel-sampled against a hover-state
      // Menu Point: hard square corner, rounding only comes from the
      // popup's own clip) with #F8F8F8 highlighted background instead of
      // the generic --accent token.
      className={menuItemRowClass(
        "group/item data-highlighted:bg-[var(--menu-item-bg-highlighted)] data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      style={
        level
          ? { paddingLeft: 16 + level * COMBOBOX_INDENT_PX, ...style }
          : style
      }
      {...props}
    >
      <MenuItemContent
        description={description}
        leading={
          <span
            aria-hidden="true"
            className={cn(
              COMBOBOX_CHECKBOX_BASE_CLASS,
              // Дизайн-чек №21: `mt-0.5` больше не нужен. Чекбокс 24px и
              // первая строка основного текста (P1 Medium 16/24) теперь
              // одной высоты, поэтому `items-start` совмещает их сам.
              "border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] text-transparent group-data-[selected]/item:border-transparent group-data-[selected]/item:bg-[var(--checkbox-checked-bg)] group-data-[selected]/item:text-[var(--checkbox-checked-fg)] group-data-disabled/item:!border-[var(--checkbox-disabled-border)] group-data-disabled/item:!bg-[var(--checkbox-disabled-bg)]"
            )}
          >
            <ComboboxPrimitive.ItemIndicator>
              <Check className="size-4" strokeWidth={3} />
            </ComboboxPrimitive.ItemIndicator>
          </span>
        }
      >
        {children}
      </MenuItemContent>
    </ComboboxPrimitive.Item>
  )
}

// GroupRow — the parent/first-level checkbox in a two-level tree. Per spec
// it is *not* a selectable value of its own: it's a derived control that
// shows indeterminate/checked from its children's selection and toggles all
// of them at once. Callers compute `state` from their own selection state
// and children values.

export function ComboboxGroupRow({
  className,
  label,
  description,
  state,
  onToggle,
  disabled,
}: {
  className?: string
  label: React.ReactNode
  description?: React.ReactNode
  state: ComboboxCheckboxState
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      data-slot="combobox-group-row"
      className={menuItemRowClass(
        "hover:bg-[var(--menu-item-bg-highlighted)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <MenuItemContent
        description={description}
        leading={<ComboboxCheckbox state={state} disabled={disabled} />}
      >
        {label}
      </MenuItemContent>
    </button>
  )
}
