import { Check, Minus } from "@/icons"

import { cn } from "@/lib/utils"

// Shared visual for both real Combobox.Item indicators and the
// manually-driven parent/group row (which isn't a selectable item itself).

export type ComboboxCheckboxState = "unchecked" | "checked" | "indeterminate"

export function ComboboxCheckbox({
  state,
  disabled,
  className,
}: {
  state: ComboboxCheckboxState
  disabled?: boolean
  className?: string
}) {
  const checked = state !== "unchecked"
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        checked
          ? "border-transparent bg-[var(--checkbox-checked-bg)] text-[var(--checkbox-checked-fg)]"
          : "border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] text-transparent",
        disabled &&
          (checked
            ? "!bg-[var(--checkbox-disabled-bg)] !text-[var(--checkbox-disabled-fg)]"
            : "!border-[var(--checkbox-disabled-border)] !bg-[var(--checkbox-disabled-bg)]"),
        className
      )}
    >
      {state === "checked" && <Check className="size-3.5" strokeWidth={3} />}
      {state === "indeterminate" && (
        <Minus className="size-3.5" strokeWidth={3} />
      )}
    </span>
  )
}
