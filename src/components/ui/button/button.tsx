import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "@/icons"

import { cn } from "@/lib/utils"

import { GosuslugiLogo } from "./gosuslugi-logo"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:!bg-[var(--btn-muted-bg)] disabled:!text-[var(--btn-muted-fg)] disabled:!border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "[--btn-accent:var(--btn-primary-bg)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] enabled:hover:bg-[var(--btn-primary-bg-hover)] enabled:active:bg-[var(--btn-primary-bg-active)]",
        "secondary-black":
          "[--btn-accent:var(--btn-secondary-black-bg)] bg-[var(--btn-secondary-black-bg)] text-[var(--btn-secondary-black-fg)] enabled:hover:bg-[var(--btn-secondary-black-bg-hover)] enabled:active:bg-[var(--btn-secondary-black-bg-active)]",
        "secondary-grey":
          "[--btn-accent:var(--btn-secondary-grey-fg)] bg-[var(--btn-secondary-grey-bg)] text-[var(--btn-secondary-grey-fg)] enabled:hover:bg-[var(--btn-secondary-grey-bg-hover)] enabled:active:bg-[var(--btn-secondary-grey-bg-active)]",
        "secondary-white":
          "[--btn-accent:var(--btn-secondary-white-fg)] bg-[var(--btn-secondary-white-bg)] text-[var(--btn-secondary-white-fg)] enabled:hover:bg-[var(--btn-secondary-white-bg-hover)] enabled:active:bg-[var(--btn-secondary-white-bg-active)]",
        "secondary-outline":
          "[--btn-accent:var(--btn-secondary-outline-border)] border-[var(--btn-secondary-outline-border)] bg-[var(--btn-secondary-outline-bg)] text-[var(--btn-secondary-outline-fg)] enabled:hover:bg-[var(--btn-secondary-outline-bg-hover)] enabled:active:bg-[var(--btn-secondary-outline-bg-active)] disabled:!border-[var(--btn-muted-border)]",
        destructive:
          "[--btn-accent:var(--btn-destructive-bg)] bg-[var(--btn-destructive-bg)] text-[var(--btn-destructive-fg)] enabled:hover:bg-[var(--btn-destructive-bg-hover)] enabled:active:bg-[var(--btn-destructive-bg-active)]",
        // "Secondary Logo" Types (ui/button/button.png) — always paired
        // with the fixed Госуслуги glyph (see GosuslugiLogo below), never a
        // swappable icon. Black/Border-White/White pixel-match their plain
        // secondary-* counterparts exactly, so they reuse the same tokens;
        // only Grey introduces a genuinely new color.
        "secondary-logo-black":
          "[--btn-accent:var(--btn-secondary-black-bg)] bg-[var(--btn-secondary-black-bg)] text-[var(--btn-secondary-black-fg)] enabled:hover:bg-[var(--btn-secondary-black-bg-hover)] enabled:active:bg-[var(--btn-secondary-black-bg-active)]",
        "secondary-logo-border-white":
          "[--btn-accent:var(--btn-secondary-outline-border)] border-[var(--btn-secondary-outline-border)] bg-[var(--btn-secondary-outline-bg)] text-[var(--btn-secondary-outline-fg)] enabled:hover:bg-[var(--btn-secondary-outline-bg-hover)] enabled:active:bg-[var(--btn-secondary-outline-bg-active)]",
        "secondary-logo-white":
          "[--btn-accent:var(--btn-secondary-white-fg)] bg-[var(--btn-secondary-white-bg)] text-[var(--btn-secondary-white-fg)] enabled:hover:bg-[var(--btn-secondary-white-bg-hover)] enabled:active:bg-[var(--btn-secondary-white-bg-active)]",
        "secondary-logo-grey":
          "[--btn-accent:var(--btn-secondary-logo-grey-bg)] bg-[var(--btn-secondary-logo-grey-bg)] text-[var(--btn-secondary-logo-grey-fg)] enabled:hover:bg-[var(--btn-secondary-logo-grey-bg-hover)] enabled:active:bg-[var(--btn-secondary-logo-grey-bg-active)]",
      },
      size: {
        // Mobile-first: unprefixed classes are the mobile form, `md:` switches
        // to the desktop form at the 768px breakpoint.
        sm: "h-8 gap-3.5 rounded-2xl px-[17px] text-xs has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        default:
          "h-10 gap-3.5 rounded-xl px-[17px] text-xs has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 md:h-12 md:rounded-2xl md:px-[25px] md:text-sm md:has-data-[icon=inline-end]:pr-5 md:has-data-[icon=inline-start]:pl-5",
        lg: "h-12 gap-3.5 rounded-2xl px-[25px] text-xs has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 md:h-14 md:gap-3 md:px-[33px] md:text-sm md:has-data-[icon=inline-end]:pr-6 md:has-data-[icon=inline-start]:pl-6 md:[&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 rounded-xl md:size-12 md:rounded-2xl",
        "icon-sm": "size-8 rounded-2xl",
        "icon-lg":
          "size-12 rounded-2xl md:size-14 md:[&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// iconPosition="only" swaps the regular size for its square icon-button
// counterpart.
const ICON_ONLY_SIZE: Record<"sm" | "default" | "lg", "icon-sm" | "icon" | "icon-lg"> = {
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
}

type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { "data-icon"?: string }
>

interface ButtonOwnProps {
  icon?: IconComponent
  iconPosition?: "left" | "right" | "only"
  isLoading?: boolean
}

type ButtonProps = Omit<ButtonPrimitive.Props, "children" | "ref"> &
  Omit<VariantProps<typeof buttonVariants>, "size"> & {
    size?: "sm" | "default" | "lg"
  } & ButtonOwnProps & {
    children?: React.ReactNode
  }

// Base UI's own <Button> is forwardRef'd (it needs the DOM node for its own
// focus/press handling); this wrapper has to be too, or a ref passed through
// it — e.g. Base UI's own Trigger components via `render={<Button />}`, see
// TableRowMenu, ButtonMenuOverflow, ModalContent's default close button —
// never reaches the underlying element. Under React 19 this happens to work
// even without forwardRef (function components accept `ref` as a plain
// prop there), which is how this shipped unnoticed; React 18 has no such
// fallback and fails outright ("Function components cannot be given refs").
const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    icon: Icon,
    iconPosition,
    isLoading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  // "Secondary Logo" variants always carry the Госуслуги glyph as their
  // leading icon — it's fixed brand mark, not the swappable `icon` prop.
  const isLogoVariant =
    typeof variant === "string" && variant.startsWith("secondary-logo")

  const resolvedIconPosition =
    iconPosition ?? (Icon || isLoading || isLogoVariant ? "left" : undefined)
  const iconOnly = isLoading || resolvedIconPosition === "only"

  if (import.meta.env.DEV && iconOnly && !isLoading && !props["aria-label"]) {
    console.warn(
      'Button: `aria-label` is required when `iconPosition="only"`.'
    )
  }

  const resolvedSize = iconOnly ? ICON_ONLY_SIZE[size ?? "default"] : size

  const Glyph = isLoading ? LoaderCircle : isLogoVariant ? GosuslugiLogo : Icon

  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
      {...props}
    >
      {iconOnly ? (
        Glyph && (
          <Glyph
            className={isLoading ? "!text-[var(--btn-accent)] animate-spin" : undefined}
            aria-hidden="true"
          />
        )
      ) : (
        <>
          {resolvedIconPosition === "left" && Glyph && (
            <Glyph data-icon="inline-start" aria-hidden="true" />
          )}
          {children}
          {resolvedIconPosition === "right" && Glyph && (
            <Glyph data-icon="inline-end" aria-hidden="true" />
          )}
        </>
      )}
    </ButtonPrimitive>
  )
})

export { Button, buttonVariants }
export type { ButtonProps }
