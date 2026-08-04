import { Check, Minus } from "@/icons"

import { cn } from "@/lib/utils"

// Shared visual for both real Combobox.Item indicators and the
// manually-driven parent/group row (which isn't a selectable item itself).
//
// Round-2 audit: was size-5 (20px) — the literal "ELK / checkbox" instances
// sampled off canvas 666:11 are 24px (size-6); rounded-md already resolves
// to this kit's 8px scale, which matches Figma's literal rounded-[8px], so
// that class is unchanged.
export const COMBOBOX_CHECKBOX_BASE_CLASS =
  "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors"

export type ComboboxCheckboxState = "unchecked" | "checked" | "indeterminate"

// `ComboboxItem`'s own inline checkbox (item.tsx) can't render this
// component directly: Base UI's `Combobox.Item` only exposes `selected` via
// the `data-selected` CSS attribute (see `ComboboxItemDataAttributes`), not
// as a plain boolean prop or render-callback — the internal context that
// does carry a boolean (`ComboboxItemContext`/`useComboboxItemContext`)
// isn't part of the package's public API. So that item necessarily stays
// CSS-attribute-driven (`group-data-[selected]/item:...`) rather than
// JS-`state`-driven like this component; it reuses `COMBOBOX_CHECKBOX_BASE_CLASS`
// above instead, to at least keep the shared box treatment as a single
// source of truth.
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
        COMBOBOX_CHECKBOX_BASE_CLASS,
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
