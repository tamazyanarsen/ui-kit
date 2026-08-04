import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff, Loader2, Lock, X } from "@/icons"
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
        // Round-2 audit: sm was px-3 (12px) — get_design_context on the S
        // Desktop symbols (215:6684 comment variant, 215:6796 empty
        // variant) both give a literal px-[16px], same horizontal padding
        // as lg, not a smaller one.
        sm: "h-8 gap-2 rounded-[8px] px-4",
        lg: "h-12 gap-2 rounded-[16px] px-4 md:h-14",
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
  "peer min-w-0 flex-1 bg-transparent font-medium text-[var(--input-fg)] outline-none placeholder:text-[var(--input-label-fg)] disabled:cursor-not-allowed disabled:text-[var(--input-fg-disabled)]",
  {
    variants: {
      size: {
        sm: "text-p2",
        lg: "text-p2 md:text-p1",
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

// Empty state matches the field's own text size (placeholder-like); once
// floated up (focused or filled) it shrinks to the kit's usual caption size.
// Design-check #3/#16/#30: was flat text-xs (12px) in both states — too
// small for the empty/unfloated label across every size except S (no
// floating label there at all, see `floating` above).
const floatingLabelVariants =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 truncate text-p2 text-[var(--input-label-fg)] transition-all md:text-p1 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-p3 md:peer-focus:text-p3 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-p3 md:peer-[&:not(:placeholder-shown)]:text-p3 group-has-[:disabled]/input:text-[var(--input-fg-disabled)] md:peer-focus:top-2.5 md:peer-[&:not(:placeholder-shown)]:top-2.5"

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

  function resolvePlaceholder(): string | undefined {
    if (mask) return getMaskPlaceholder(mask)
    if (floating) return " "
    return (
      placeholder ??
      (typeof label === "string" ? label : undefined) ??
      (clearable ? " " : undefined)
    )
  }
  const resolvedPlaceholder = resolvePlaceholder()

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

  // A one-slot-at-a-time priority order (locked beats loading beats the
  // password toggle, etc.) — early returns instead of a ternary chain make
  // that priority explicit and each branch's JSX easy to scan on its own.
  function renderTrailingSlot() {
    if (locked) {
      return (
        <Lock
          aria-hidden="true"
          className={cn(
            ICON_SIZE[size],
            "shrink-0 text-[var(--input-icon-fg)] group-has-[:disabled]/input:text-[var(--input-fg-disabled)]"
          )}
        />
      )
    }
    if (loading) {
      return (
        <Loader2
          aria-hidden="true"
          className={cn(ICON_SIZE[size], "shrink-0 animate-spin text-[var(--input-border-hover)]")}
        />
      )
    }
    if (isPassword) {
      return (
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
      )
    }
    if (trailingIcon) {
      return <span className="shrink-0 text-[var(--input-icon-fg)]">{trailingIcon}</span>
    }
    if (clearable) {
      return (
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
      )
    }
    return null
  }
  const trailingSlot = renderTrailingSlot()

  // react-imask's IMaskInput prop type is a large discriminated union keyed
  // off `mask`. TS can't reconcile it once native <input> rest props
  // (`...props`) are merged in alongside it, even though the merged shape is
  // valid at runtime — hence the cast at the end.
  const maskProps = mask
    ? ({
        ...getImaskProps(mask),
        inputRef,
        id: inputId,
        "data-slot": "input",
        disabled,
        readOnly: locked,
        placeholder: resolvedPlaceholder,
        "aria-invalid": invalid || undefined,
        "aria-describedby": captionId,
        "aria-readonly": locked || undefined,
        "aria-label":
          !floating && typeof label === "string" ? label : undefined,
        value: maskValue,
        onAccept: handleMaskAccept,
        style:
          mask === "amount" && maskValue && amountWidth !== undefined
            ? { width: amountWidth }
            : undefined,
        className: cn(
          inputFieldVariants({ size, floating }),
          mask === "amount" && maskValue && "flex-none",
          className
        ),
        ...props,
      } as unknown as React.ComponentProps<typeof IMaskInput>)
    : null

  return (
    // Round-2 audit: was gap-1.5 (6px) — every ELK/input symbol with a
    // Comment/Error caption (215:6570, 215:6676, 215:6684, 215:6680, both
    // sizes/breakpoints) gives a literal gap-[4px] between the box and the
    // caption row, not 6px.
    <div className="flex w-full flex-col gap-1">
      <div
        className={cn(
          inputBoxVariants({ size, invalid, interactive: !locked }),
          containerClassName
        )}
        onClick={() => {
          // Design-check #29: only the text itself was hit-testable —
          // clicking the box's own padding/gap area (or the leading icon)
          // silently did nothing. The field fills the box via flex-1, so
          // focusing it programmatically on any box click covers those gaps.
          if (!disabled && !locked) inputRef.current?.focus()
        }}
      >
        {iconLeft && (
          <span
            aria-hidden="true"
            className={cn(ICON_SIZE[size], "shrink-0 text-[var(--input-icon-fg)]")}
          >
            {iconLeft}
          </span>
        )}
        {mask && maskProps ? (
          <>
            <IMaskInput {...maskProps} />
            {mask === "amount" && maskValue && (
              <>
                <span
                  ref={amountMeasureRef}
                  aria-hidden="true"
                  className={cn(
                    "invisible absolute whitespace-pre",
                    size === "sm" ? "text-p3" : "text-p2"
                  )}
                >
                  {maskValue}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    // Pulls in from the box's own flex `gap` (which spaces
                    // every slot uniformly) down to ~1 space-width, per
                    // design-check #31 — the mask value and "₽" aren't
                    // separate flex slots conceptually, just closely-set text.
                    "-ml-1.5 shrink-0 font-medium text-[var(--input-fg)] md:-ml-2",
                    size === "sm" ? "text-p3" : "text-p2",
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
            // Round-2 audit: was missing font-medium — get_design_context
            // on every Comment/Error caption instance (215:6570, 215:6676)
            // wraps the <p> in a font-['Object_Sans:Medium'] parent (P3
            // Medium, weight 500), not the browser default 400.
            "text-p3 font-medium",
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
