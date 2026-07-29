import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff, Loader2, Lock, X } from "lucide-react"
import { IMaskInput } from "react-imask"

import { cn } from "@/lib/utils"

import { getImaskProps, getMaskPlaceholder, type MaskName } from "./mask"

// Design only defines two size tokens for Input: S (32px, both breakpoints)
// and L (48px mobile -> 56px desktop, mobile-first via `md:`). There is no M.
const inputBoxVariants = cva(
  "group/input relative flex w-full items-center border border-[var(--input-border)] bg-[var(--input-bg)] transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:border-[var(--input-border-disabled)] has-[:disabled]:bg-[var(--input-bg-disabled)]",
  {
    variants: {
      size: {
        sm: "h-8 gap-2 rounded-lg px-3",
        lg: "h-12 gap-2.5 rounded-2xl px-4 md:h-14 md:gap-3 md:px-5",
      },
      invalid: {
        true: "border-[var(--input-border-error)]",
        false: "",
      },
      interactive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        invalid: false,
        interactive: true,
        class:
          "hover:border-[var(--input-border-hover)] has-[input:focus]:border-[var(--input-border-hover)]",
      },
      {
        invalid: true,
        interactive: true,
        class:
          "hover:border-[var(--input-border-error-hover)] has-[input:focus]:border-[var(--input-border-error-hover)]",
      },
    ],
    defaultVariants: {
      size: "lg",
      invalid: false,
      interactive: true,
    },
  }
)

const inputFieldVariants = cva(
  "peer min-w-0 flex-1 bg-transparent text-[var(--input-fg)] outline-none placeholder:text-[var(--input-label-fg)] disabled:cursor-not-allowed disabled:text-[var(--input-fg-disabled)]",
  {
    variants: {
      size: {
        sm: "text-xs",
        lg: "text-sm",
      },
      // Floating label only exists at the L size — at S (32px) there isn't
      // room for a second line, so the design falls back to a plain
      // placeholder that disappears on input (see the S/Desktop reference).
      floating: {
        true: "placeholder:text-transparent [&:not(:placeholder-shown)]:pt-4 focus:pt-4 md:[&:not(:placeholder-shown)]:pt-5 md:focus:pt-5",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      floating: false,
    },
  }
)

const floatingLabelVariants =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 truncate text-xs text-[var(--input-label-fg)] transition-all peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[11px] group-has-[:disabled]/input:text-[var(--input-fg-disabled)] md:peer-focus:top-2.5 md:peer-[&:not(:placeholder-shown)]:top-2.5"

const ICON_SIZE = {
  sm: "size-3.5",
  lg: "size-4",
} as const

export type InputSize = "sm" | "lg"

interface InputOwnProps {
  size?: InputSize
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  locked?: boolean
  clearable?: boolean
  onClear?: () => void
  containerClassName?: string
  // Leading icon slot (calendar for Date, magnifier for Search, or any
  // custom glyph) — purely presentational, doesn't affect masking.
  iconLeft?: React.ReactNode
  // Search-style "actively looking" spinner. Takes over the trailing slot.
  loading?: boolean
  // Custom trailing icon (e.g. Промокод's validity checkmark) that replaces
  // the clear button outright — unlike clear, it doesn't react to hover.
  trailingIcon?: React.ReactNode
  // Digit-mask preset — see ./mask.ts. Reformats on every keystroke and
  // reports the formatted string back through the normal onChange.
  mask?: MaskName
}

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  Omit<VariantProps<typeof inputBoxVariants>, "invalid" | "interactive"> &
  InputOwnProps

function Input({
  className,
  containerClassName,
  size = "lg",
  label,
  comment,
  error,
  locked = false,
  clearable = true,
  disabled,
  id,
  placeholder,
  onClear,
  iconLeft,
  loading = false,
  trailingIcon,
  mask,
  type,
  onChange,
  defaultValue,
  value,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${inputId}-caption` : undefined
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const isPassword = type === "password"

  // react-imask owns the field's value once a mask is set — it reports the
  // masked display string back via onAccept, which we mirror into state so
  // the box's clear button and floating-label logic (:placeholder-shown)
  // keep working the same way they do for a plain input.
  const [maskValue, setMaskValue] = React.useState(() =>
    String(value ?? defaultValue ?? "")
  )

  // Re-syncs when a *controlled* value changes from outside (e.g. a date
  // picker pushing in the day the user just clicked in the calendar).
  // Skipped for uncontrolled usage (defaultValue only) so typing isn't
  // fought on every render.
  React.useEffect(() => {
    if (mask && value !== undefined) setMaskValue(String(value))
  }, [mask, value])

  // Floating label needs the peer's :placeholder-shown state, so at S size
  // (no floating label) the label prop just becomes the native placeholder.
  const floating = Boolean(label) && size !== "sm"
  const resolvedPlaceholder = mask
    ? getMaskPlaceholder(mask)
    : floating
      ? " "
      : (placeholder ??
        (typeof label === "string" ? label : undefined) ??
        (clearable ? " " : undefined))

  // Amount's "₽" sits right after the field instead of baked into the
  // masked value, so the field needs to shrink to the number's own width
  // instead of flex-1 filling the box. The HTML `size` attribute (character
  // count) doesn't work for that: it assumes every character is as wide as
  // "0", but the thousands-separator spaces render much narrower than a
  // digit in a proportional font, so `size={maskValue.length}` overshoots
  // more and more as the number (and its space count) grows — exactly the
  // "₽ floating in a gap after the digits" bug. Measuring the actual
  // rendered text width via a hidden same-font span and setting that as a
  // pixel width sidesteps the mismatch entirely.
  const amountMeasureRef = React.useRef<HTMLSpanElement>(null)
  const [amountWidth, setAmountWidth] = React.useState<number>()

  React.useLayoutEffect(() => {
    if (mask === "amount") {
      setAmountWidth(amountMeasureRef.current?.offsetWidth)
    }
  }, [mask, maskValue])

  function handleMaskAccept(next: string, _maskRef: unknown, e?: InputEvent) {
    setMaskValue(next)
    if (e) onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  function handleClear() {
    if (mask) {
      setMaskValue("")
      inputRef.current?.focus()
      onClear?.()
      return
    }
    const input = inputRef.current
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set
      setter?.call(input, "")
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.focus()
    }
    onClear?.()
  }

  const trailingSlot = locked ? (
    <Lock
      aria-hidden="true"
      className={cn(
        ICON_SIZE[size],
        "shrink-0 text-[var(--input-icon-fg)] group-has-[:disabled]/input:text-[var(--input-fg-disabled)]"
      )}
    />
  ) : loading ? (
    <Loader2
      aria-hidden="true"
      className={cn(ICON_SIZE[size], "shrink-0 animate-spin text-[var(--input-border-hover)]")}
    />
  ) : isPassword ? (
    <button
      type="button"
      aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
      onClick={() => setPasswordVisible((v) => !v)}
      className="shrink-0 text-[var(--input-icon-fg)] outline-none disabled:hidden"
      disabled={disabled}
    >
      {passwordVisible ? (
        <EyeOff aria-hidden="true" className={ICON_SIZE[size]} />
      ) : (
        <Eye aria-hidden="true" className={ICON_SIZE[size]} />
      )}
    </button>
  ) : trailingIcon ? (
    <span className="shrink-0 text-[var(--input-icon-fg)]">{trailingIcon}</span>
  ) : clearable ? (
    <button
      type="button"
      aria-label="Очистить поле"
      onClick={handleClear}
      className={cn(
        "hidden shrink-0 text-[var(--input-icon-fg)] outline-none peer-[&:not(:placeholder-shown)]:block",
        "disabled:hidden"
      )}
      disabled={disabled}
    >
      <X aria-hidden="true" className={ICON_SIZE[size]} />
    </button>
  ) : null

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div
        className={cn(
          inputBoxVariants({ size, invalid, interactive: !locked }),
          containerClassName
        )}
      >
        {iconLeft && (
          <span
            aria-hidden="true"
            className={cn(ICON_SIZE[size], "shrink-0 text-[var(--input-icon-fg)]")}
          >
            {iconLeft}
          </span>
        )}
        {mask ? (
          <>
            <IMaskInput
              {...getImaskProps(mask)}
              inputRef={inputRef}
              id={inputId}
              data-slot="input"
              disabled={disabled}
              readOnly={locked}
              placeholder={resolvedPlaceholder}
              aria-invalid={invalid || undefined}
              aria-describedby={captionId}
              aria-readonly={locked || undefined}
              aria-label={
                !floating && typeof label === "string" ? label : undefined
              }
              value={maskValue}
              onAccept={handleMaskAccept}
              style={
                mask === "amount" && maskValue && amountWidth !== undefined
                  ? { width: amountWidth }
                  : undefined
              }
              className={cn(
                inputFieldVariants({ size, floating }),
                mask === "amount" && maskValue && "flex-none",
                className
              )}
              {...props}
            />
            {mask === "amount" && maskValue && (
              <>
                <span
                  ref={amountMeasureRef}
                  aria-hidden="true"
                  className={cn(
                    "invisible absolute whitespace-pre",
                    size === "sm" ? "text-xs" : "text-sm"
                  )}
                >
                  {maskValue}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-[var(--input-fg)]",
                    size === "sm" ? "text-xs" : "text-sm",
                    // The field's own text sits lower than the row's
                    // vertical center once the floating label pushes it
                    // down (inputFieldVariants' floating pt-4/pt-5) — match
                    // that here too, or this sibling (centered on the full,
                    // unpadded row height) ends up floating visibly above
                    // the digits instead of sitting next to them.
                    floating && "pt-4 md:pt-5"
                  )}
                >
                  ₽
                </span>
                <span aria-hidden="true" className="flex-1" />
              </>
            )}
          </>
        ) : (
          <input
            ref={inputRef}
            id={inputId}
            data-slot="input"
            disabled={disabled}
            readOnly={locked}
            placeholder={resolvedPlaceholder}
            aria-invalid={invalid || undefined}
            aria-describedby={captionId}
            aria-readonly={locked || undefined}
            aria-label={
              !floating && typeof label === "string" ? label : undefined
            }
            type={isPassword ? (passwordVisible ? "text" : "password") : type}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            className={cn(inputFieldVariants({ size, floating }), className)}
            {...props}
          />
        )}
        {floating && (
          <label
            htmlFor={inputId}
            className={cn(
              floatingLabelVariants,
              iconLeft ? "left-[42px] md:left-12" : "left-4 md:left-5"
            )}
          >
            {label}
          </label>
        )}
        {trailingSlot}
      </div>
      {(comment || error) && (
        <p
          id={captionId}
          className={cn(
            "text-xs",
            error
              ? "text-[var(--input-caption-error-fg)]"
              : "text-[var(--input-caption-fg)]"
          )}
        >
          {error ?? comment}
        </p>
      )}
    </div>
  )
}

export {
  Input,
  inputBoxVariants,
  inputFieldVariants,
  floatingLabelVariants,
  ICON_SIZE as INPUT_ICON_SIZE,
}
