import { cva } from "class-variance-authority"

// Shared style constants — reused as-is by ComboboxTrigger (same Figma
// trigger spec, different popup content), so keep these decoupled from any
// one trigger implementation.

// Same box treatment as Input: S (32px, radius 8, both breakpoints) and L
// (48px mobile -> 56px desktop via `md:`, radius 16). No M size.
export const selectTriggerVariants = cva(
  // This renders as a <div> (via the `render` prop), not a native form
  // control, so :enabled/:disabled don't apply — data-disabled:pointer-events-none
  // is what actually stops hover/focus from reaching it once disabled.
  "group/trigger relative flex w-full cursor-pointer items-center border border-[var(--select-border)] bg-[var(--select-bg)] text-left outline-none transition-colors select-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-[var(--select-border-disabled)] data-disabled:bg-[var(--select-bg-disabled)] focus-visible:ring-3 focus-visible:ring-ring/50",
  {
    variants: {
      size: {
        // Round-2 audit: was px-3 (12px) — the literal 32px-tall "ELK /
        // select" instance sampled off canvas 666:11 uses px-[16px], same
        // as the lg size, not a smaller horizontal inset.
        sm: "h-8 gap-2 rounded-[8px] px-4 text-p2-medium",
        lg: "h-12 gap-2 rounded-[16px] px-4 text-p2-medium md:h-14 md:text-p1-medium",
      },
      invalid: {
        true: "border-[var(--select-border-error)] hover:border-[var(--select-border-error-hover)] focus:border-[var(--select-border-error-hover)]",
        false:
          "hover:border-[var(--select-border-hover)] focus:border-[var(--select-border-hover)]",
      },
    },
    defaultVariants: { size: "lg", invalid: false },
  }
)

// L gets the two-line floating label (like Input's lg). S is only 32px tall —
// no room for a second line — so the label just fades out on fill, in place,
// exactly like Input's sm falls back to a plain placeholder.
//
// Floats while the popup is open (`data-popup-open`) or once there's a
// value — deliberately *not* `:focus`. For a text `<input>`, focus is a
// reliable proxy for "the user is about to type," but this is a
// click-to-open trigger: focus stays on it after the popup closes (correct
// a11y — closing shouldn't blur it), so tying the float to focus makes the
// label float indefinitely after every interaction, long after there's any
// reason to reserve room above the value.
// Design-check #15: empty-state label was flat text-xs (12px), same as the
// floated caption state — too small when there's no value yet. Matches
// Input's own fix: text-sm while empty, shrinks to text-xs once floated.
export const selectFloatingLabelClassName =
  "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 truncate text-p2-medium text-[var(--select-label-fg)] transition-all md:text-p1-medium group-data-popup-open/trigger:top-[7px] group-data-popup-open/trigger:translate-y-0 group-data-popup-open/trigger:text-p3-medium md:group-data-popup-open/trigger:text-p3-medium group-[&:not([data-placeholder])]/trigger:top-[7px] group-[&:not([data-placeholder])]/trigger:translate-y-0 group-[&:not([data-placeholder])]/trigger:text-p3-medium md:group-[&:not([data-placeholder])]/trigger:text-p3-medium group-data-disabled/trigger:text-[var(--select-fg-disabled)]"

export const selectStaticLabelClassName =
  "pointer-events-none absolute inset-y-0 left-4 flex items-center truncate text-p2-medium text-[var(--select-label-fg)] transition-opacity group-[&:not([data-placeholder])]/trigger:opacity-0 group-data-disabled/trigger:text-[var(--select-fg-disabled)]"

export const SELECT_ICON_SIZE = { sm: "size-4", lg: "size-4" } as const
