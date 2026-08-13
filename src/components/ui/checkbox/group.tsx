import * as React from "react"

import { cn } from "@/lib/utils"

import { Checkbox } from "./checkbox"

// CheckboxGroup — a set of checkboxes driven by one array of selected values,
// with an optional parent "select all" row.
//
// Unlike Radio, Base UI has no group primitive that owns this behaviour, so
// the joint part — which children are on, and the parent's checked /
// indeterminate / unchecked tri-state derived from them — lives here. That is
// the whole point of the component: the interesting behaviour of a checkbox
// set is the relationship between the parent and its children (the same
// "Partial" state Table's select-all header uses), and it can only be
// exercised, and tested, when something owns all of them together.
//
// Layout matches RadioGroup: a 24px vertical stack, per the shared "Use"
// frame ("Вертикальный отступ ... составляет 24 px").

interface CheckboxGroupItem {
  value: string
  label?: React.ReactNode
  comment?: React.ReactNode
  disabled?: boolean
}

interface CheckboxGroupProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  items: CheckboxGroupItem[]
  /** Controlled set of checked values. */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  /** Renders a parent row above the children. Checking it selects every
   * enabled child; clearing it deselects them; a partial selection shows the
   * indeterminate state. */
  selectAllLabel?: React.ReactNode
}

function CheckboxGroup({
  className,
  items,
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  selectAllLabel,
  ...props
}: CheckboxGroupProps) {
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue)
  const selected = value ?? uncontrolled

  function commit(next: string[]) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function toggle(itemValue: string) {
    commit(
      selected.includes(itemValue)
        ? selected.filter((entry) => entry !== itemValue)
        : [...selected, itemValue]
    )
  }

  // "Select all" only ever covers the options the user could reach: a
  // disabled row must not be flipped by the parent, and must not hold the
  // parent back from reading as fully checked either.
  const selectable = items.filter((item) => !item.disabled).map((i) => i.value)
  const selectedCount = selectable.filter((entry) =>
    selected.includes(entry)
  ).length
  const allSelected = selectable.length > 0 && selectedCount === selectable.length
  const someSelected = selectedCount > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      commit(selected.filter((entry) => !selectable.includes(entry)))
      return
    }
    commit([...new Set([...selected, ...selectable])])
  }

  return (
    <div
      data-slot="checkbox-group"
      role="group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {selectAllLabel !== undefined && (
        <Checkbox
          data-slot="checkbox-group-all"
          label={selectAllLabel}
          checked={allSelected}
          indeterminate={someSelected}
          disabled={disabled || selectable.length === 0}
          onCheckedChange={toggleAll}
        />
      )}
      {items.map((item) => (
        <Checkbox
          key={item.value}
          label={item.label}
          comment={item.comment}
          checked={selected.includes(item.value)}
          disabled={disabled || item.disabled}
          onCheckedChange={() => toggle(item.value)}
        />
      ))}
    </div>
  )
}

export { CheckboxGroup }
export type { CheckboxGroupProps, CheckboxGroupItem }
