import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { ComboboxCheckbox, type ComboboxCheckboxState } from "./checkbox"

// Indent step for tree levels — the spec shows "Уровень 2/3/4" stepping in
// evenly, only two of which (parent/child) are actually selectable here.
const COMBOBOX_INDENT_PX = 24

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
      className={cn(
        "group/item relative flex w-full cursor-default items-start gap-2.5 rounded-md py-2 pr-3 pl-3 text-sm outline-hidden select-none data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      style={
        level ? { paddingLeft: 12 + level * COMBOBOX_INDENT_PX, ...style } : style
      }
      {...props}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] text-transparent transition-colors group-data-[selected]/item:border-transparent group-data-[selected]/item:bg-[var(--checkbox-checked-bg)] group-data-[selected]/item:text-[var(--checkbox-checked-fg)] group-data-disabled/item:!border-[var(--checkbox-disabled-border)] group-data-disabled/item:!bg-[var(--checkbox-disabled-bg)]"
      >
        <ComboboxPrimitive.ItemIndicator>
          <Check className="size-3.5" strokeWidth={3} />
        </ComboboxPrimitive.ItemIndicator>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium text-[var(--select-fg)]">
          {children}
        </span>
        {description && (
          <span className="truncate text-xs text-[var(--select-caption-fg)]">
            {description}
          </span>
        )}
      </span>
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
      className={cn(
        "relative flex w-full cursor-default items-start gap-2.5 rounded-md py-2 pr-3 pl-3 text-left text-sm outline-hidden select-none hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <ComboboxCheckbox state={state} disabled={disabled} className="mt-0.5" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium text-[var(--select-fg)]">
          {label}
        </span>
        {description && (
          <span className="truncate text-xs text-[var(--select-caption-fg)]">
            {description}
          </span>
        )}
      </span>
    </button>
  )
}
