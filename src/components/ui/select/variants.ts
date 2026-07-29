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
        sm: "h-8 gap-2 rounded-lg px-3 text-xs",
        lg: "h-12 gap-2.5 rounded-2xl px-4 text-sm md:h-14 md:gap-3 md:px-5",
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
export const selectFloatingLabelClassName =
  "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 truncate text-xs text-[var(--select-label-fg)] transition-all group-data-popup-open/trigger:top-2 group-data-popup-open/trigger:translate-y-0 group-data-popup-open/trigger:text-[11px] group-[&:not([data-placeholder])]/trigger:top-2 group-[&:not([data-placeholder])]/trigger:translate-y-0 group-[&:not([data-placeholder])]/trigger:text-[11px] group-data-disabled/trigger:text-[var(--select-fg-disabled)] md:left-5 md:group-data-popup-open/trigger:top-2.5 md:group-[&:not([data-placeholder])]/trigger:top-2.5"

export const selectStaticLabelClassName =
  "pointer-events-none absolute inset-y-0 left-3 flex items-center truncate text-xs text-[var(--select-label-fg)] transition-opacity group-[&:not([data-placeholder])]/trigger:opacity-0 group-data-disabled/trigger:text-[var(--select-fg-disabled)]"

export const SELECT_ICON_SIZE = { sm: "size-3.5", lg: "size-4" } as const
