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
        // Round-2 audit: was size-5 (20px) — the literal "ELK / checkbox"
        // instances sampled off canvas 666:11 are 24px (size-6); rounded-md
        // already resolves to this kit's 8px scale, which matches Figma's
        // literal rounded-[8px], so that class is unchanged.
        "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors",
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
      {state === "checked" && <Check className="size-4" strokeWidth={3} />}
      {state === "indeterminate" && (
        <Minus className="size-4" strokeWidth={3} />
      )}
    </span>
  )
}
