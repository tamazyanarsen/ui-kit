import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Loader2, X } from "@/icons"

import { cn } from "@/lib/utils"
import { resolveCaption } from "@/components/ui/input/caption"
import {
  inputBoxVariants,
  inputFieldVariants,
  floatingLabelVariants,
  INPUT_ICON_SIZE,
} from "@/components/ui/input"

import { useAutocompleteAnchor } from "./root"

// Само видимое поле — коробка и подпись оформлены как у `Input` (и
// переиспользованы напрямую, а не написаны заново: `Combobox.Input` рисует
// настоящий `<input>`, поэтому CSS плавающей подписи у Input, завязанный на
// `:placeholder-shown`, применяется как есть).

interface AutocompleteFieldOwnProps {
  size?: "sm" | "lg"
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  loading?: boolean
  clearable?: boolean
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
const AutocompleteField = React.forwardRef<
  HTMLInputElement,
  Omit<ComboboxPrimitive.Input.Props, "size"> & AutocompleteFieldOwnProps
>(function AutocompleteField({
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
}, ref) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const captionId = caption ? `${inputId}-caption` : undefined
  const floating = Boolean(label) && size !== "sm"
  const anchorRef = useAutocompleteAnchor()

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div ref={anchorRef} className={cn(inputBoxVariants({ size, invalid, interactive: true }))}>
        <ComboboxPrimitive.Input
          id={inputId}
          ref={ref}
          data-slot="autocomplete-field"
          // Как у Input: на размере S плавающей подписи нет, и `label`
          // становится плейсхолдером и доступным именем поля. Раньше он
          // здесь просто пропадал — у поля не было ни видимой подписи, ни
          // имени для скринридера.
          placeholder={
            floating ? " " : (placeholder ?? (typeof label === "string" ? label : undefined))
          }
          aria-label={!floating && typeof label === "string" ? label : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          className={cn(inputFieldVariants({ size, floating }), className)}
          // Вид выключенного поля у Input и коробки идёт по `aria-disabled`
          // (см. input/variants.ts), а Base UI на `<Autocomplete disabled>`
          // ставит полю только нативный `disabled` и `data-disabled` — поле
          // не редактировалось, но выглядело рабочим. Атрибут берётся из
          // состояния примитива, куда сводятся и корень, и Field.
          render={(inputProps, state) => (
            <input {...inputProps} aria-disabled={state.disabled || undefined} />
          )}
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
            className="shrink-0 text-[var(--input-icon-fg)] outline-none focus-visible:focus-ring"
          >
            <X aria-hidden="true" className={INPUT_ICON_SIZE[size]} />
          </ComboboxPrimitive.Clear>
        )}
      </div>
      {caption && (
        <p
          id={captionId}
          className={cn(
            // Та же подпись Comment и Error, что у Input (см. input.tsx):
            // Object Sans Medium подтверждён по собственному инстансу
            // Comment у ELK/input, а не браузерное умолчание.
            "text-p3-medium",
            error ? "text-[var(--input-caption-error-fg)]" : "text-[var(--input-caption-fg)]"
          )}
        >
          {caption}
        </p>
      )}
    </div>
  )
})

export { AutocompleteField }
