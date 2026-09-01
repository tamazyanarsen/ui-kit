import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Loader2, X } from "@/icons"

import { cn } from "@/lib/utils"
import { useId } from "@/lib/use-id"
import {
  inputBoxVariants,
  inputFieldVariants,
  floatingLabelVariants,
  INPUT_ICON_SIZE,
} from "@/components/ui/input"

import { useAutocompleteAnchor } from "./root"

// The visible field itself — same box/label chrome as `Input` (reused
// directly, not re-implemented: `Combobox.Input` renders a real `<input>`,
// so Input's `:placeholder-shown`-keyed floating-label CSS applies as-is).

interface AutocompleteFieldOwnProps {
  size?: "sm" | "lg"
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  loading?: boolean
  clearable?: boolean
}

function AutocompleteField({
  className,
  size = "lg",
  label,
  comment,
  error,
  loading = false,
  clearable = true,
  id,
  placeholder,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & AutocompleteFieldOwnProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${inputId}-caption` : undefined
  const floating = Boolean(label) && size !== "sm"
  const anchorRef = useAutocompleteAnchor()

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div ref={anchorRef} className={cn(inputBoxVariants({ size, invalid, interactive: true }))}>
        <ComboboxPrimitive.Input
          id={inputId}
          data-slot="autocomplete-field"
          placeholder={floating ? " " : placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          className={cn(inputFieldVariants({ size, floating }), className)}
          {...props}
        />
        {floating && (
          <label htmlFor={inputId} className={cn(floatingLabelVariants, "left-4 desktop:left-5")}>
            {label}
          </label>
        )}
        {loading && (
          <Loader2
            aria-hidden="true"
            className={cn(INPUT_ICON_SIZE[size], "shrink-0 animate-spin text-[var(--input-border-hover)]")}
          />
        )}
        {clearable && (
          <ComboboxPrimitive.Clear
            aria-label="Очистить поле"
            className="shrink-0 text-[var(--input-icon-fg)] outline-none"
          >
            <X aria-hidden="true" className={INPUT_ICON_SIZE[size]} />
          </ComboboxPrimitive.Clear>
        )}
      </div>
      {(comment || error) && (
        <p
          id={captionId}
          className={cn(
            // Same Comment/Error caption as Input (see input.tsx) — confirmed
            // Object Sans Medium via get_design_context on ELK/input's own
            // Comment instance (1246:139719), not the browser default.
            "text-p3-medium",
            error ? "text-[var(--input-caption-error-fg)]" : "text-[var(--input-caption-fg)]"
          )}
        >
          {error ?? comment}
        </p>
      )}
    </div>
  )
}

export { AutocompleteField }
