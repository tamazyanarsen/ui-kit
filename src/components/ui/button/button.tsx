import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"

import { GosuslugiLogo } from "./gosuslugi-logo"

const buttonVariants = cva(
  // Weight now lives in each size variant's text-pN-medium suffix below
  // (all Medium, per Figma), not here — a separate font-medium class here
  // would just double up with the compound class's own baked-in weight.
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:focus-ring active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:!bg-[var(--btn-muted-bg)] disabled:!text-[var(--btn-muted-fg)] disabled:!border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] enabled:hover:bg-[var(--btn-primary-bg-hover)] enabled:active:bg-[var(--btn-primary-bg-active)]",
        "secondary-black":
          "bg-[var(--btn-secondary-black-bg)] text-[var(--btn-secondary-black-fg)] enabled:hover:bg-[var(--btn-secondary-black-bg-hover)] enabled:active:bg-[var(--btn-secondary-black-bg-active)]",
        "secondary-grey":
          "bg-[var(--btn-secondary-grey-bg)] text-[var(--btn-secondary-grey-fg)] enabled:hover:bg-[var(--btn-secondary-grey-bg-hover)] enabled:active:bg-[var(--btn-secondary-grey-bg-active)]",
        "secondary-white":
          "bg-[var(--btn-secondary-white-bg)] text-[var(--btn-secondary-white-fg)] enabled:hover:bg-[var(--btn-secondary-white-bg-hover)] enabled:active:bg-[var(--btn-secondary-white-bg-active)]",
        "secondary-outline":
          "border-[var(--btn-secondary-outline-border)] bg-[var(--btn-secondary-outline-bg)] text-[var(--btn-secondary-outline-fg)] enabled:hover:bg-[var(--btn-secondary-outline-bg-hover)] enabled:active:bg-[var(--btn-secondary-outline-bg-active)] disabled:!border-[var(--btn-muted-border)]",
        destructive:
          "bg-[var(--btn-destructive-bg)] text-[var(--btn-destructive-fg)] enabled:hover:bg-[var(--btn-destructive-bg-hover)] enabled:active:bg-[var(--btn-destructive-bg-active)]",
        // "Secondary Logo" Types (ui/button/button.png) — always paired
        // with the fixed Госуслуги glyph (see GosuslugiLogo below), never a
        // swappable icon. Black/Border-White/White pixel-match their plain
        // secondary-* counterparts exactly, so they reuse the same tokens;
        // only Grey introduces a genuinely new color.
        "secondary-logo-black":
          "bg-[var(--btn-secondary-black-bg)] text-[var(--btn-secondary-black-fg)] enabled:hover:bg-[var(--btn-secondary-black-bg-hover)] enabled:active:bg-[var(--btn-secondary-black-bg-active)]",
        "secondary-logo-border-white":
          "border-[var(--btn-secondary-outline-border)] bg-[var(--btn-secondary-outline-bg)] text-[var(--btn-secondary-outline-fg)] enabled:hover:bg-[var(--btn-secondary-outline-bg-hover)] enabled:active:bg-[var(--btn-secondary-outline-bg-active)]",
        "secondary-logo-white":
          "bg-[var(--btn-secondary-white-bg)] text-[var(--btn-secondary-white-fg)] enabled:hover:bg-[var(--btn-secondary-white-bg-hover)] enabled:active:bg-[var(--btn-secondary-white-bg-active)]",
        "secondary-logo-grey":
          "bg-[var(--btn-secondary-logo-grey-bg)] text-[var(--btn-secondary-logo-grey-fg)] enabled:hover:bg-[var(--btn-secondary-logo-grey-bg-hover)] enabled:active:bg-[var(--btn-secondary-logo-grey-bg-active)]",
      },
      size: {
        // Mobile-first: unprefixed classes are the mobile form, `desktop:` switches
        // to the desktop form at the 768px breakpoint. Radii use literal
        // px values (not rounded-xl/2xl) because the button's Figma spec
        // (16px, 12px only for M-mobile) doesn't line up with the kit's
        // shared --radius multiplier scale used by cards/inputs/etc.
        //
        // Round-2 audit fix: horizontal padding was off at every size (a
        // systematic +1px vs Figma's literal `get_design_context` values
        // for the "ELK / button" master, node 32:9064, plus `default`
        // mobile was off by a lot more — px-17 there looked like a stray
        // copy of `sm`'s value rather than the real 24px). Figma also
        // gives the icon-adjacent (has-icon) padding as a genuinely
        // different pair of numbers per side, not just the icon side —
        // and `default` and `lg`-mobile turn out to share identical
        // padding with each other/with `sm` at points where Figma's own
        // instances happen to match, so there's no desktop: padding override
        // needed for `sm`/`default` any more, only for `lg`.
        //
        // Round-3: both sides have to move together, and the smaller value
        // belongs on the *icon's* side. The anatomy (node 29161:73334)
        // measures every size's Icon Left row as 16px before the icon and
        // 20px after the text (24/32 on the 56px desktop L), mirrored for
        // Icon Right. Previously only one side was overridden, so an
        // icon-at-the-end button padded the icon side to 20 and left the
        // text side at the base — i.e. the asymmetry ran backwards.
        sm: "h-8 gap-2 rounded-[16px] px-4 text-p3-medium desktop:text-p2-medium has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-start]:pr-5 has-data-[icon=inline-end]:pl-5 has-data-[icon=inline-end]:pr-4",
        default:
          "h-10 gap-2 rounded-[12px] px-6 text-p2-medium has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-start]:pr-5 has-data-[icon=inline-end]:pl-5 has-data-[icon=inline-end]:pr-4 desktop:h-12 desktop:rounded-[16px] desktop:text-p1-medium",
        lg: "h-12 gap-2 rounded-[16px] px-6 text-p2-medium has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-start]:pr-5 has-data-[icon=inline-end]:pl-5 has-data-[icon=inline-end]:pr-4 desktop:h-14 desktop:px-8 desktop:text-p1-medium desktop:has-data-[icon=inline-start]:pl-6 desktop:has-data-[icon=inline-start]:pr-8 desktop:has-data-[icon=inline-end]:pl-8 desktop:has-data-[icon=inline-end]:pr-6 desktop:[&_svg:not([class*='size-'])]:size-6",
        icon: "size-10 rounded-[12px] desktop:size-12 desktop:rounded-[16px]",
        "icon-sm": "size-8 rounded-[16px]",
        "icon-lg":
          "size-12 rounded-[16px] desktop:size-14 desktop:[&_svg:not([class*='size-'])]:size-6",
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
  React.SVGProps<SVGSVGElement> & { "data-icon"?: string; size?: 16 | 24 }
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
    iconPosition ?? (Icon || isLogoVariant ? "left" : undefined)
  // Дизайн-чек №10: раньше `isLoading` тоже попадал сюда, и кнопка на время
  // загрузки схлопывалась в квадратную icon-кнопку. Теперь загрузка не влияет
  // на геометрию — только на содержимое (см. ниже).
  const iconOnly = resolvedIconPosition === "only"

  if (import.meta.env.DEV && iconOnly && !isLoading && !props["aria-label"]) {
    console.warn(
      'Button: `aria-label` is required when `iconPosition="only"`.'
    )
  }

  const resolvedSize = iconOnly ? ICON_ONLY_SIZE[size ?? "default"] : size

  const Glyph = isLogoVariant ? GosuslugiLogo : Icon

  // `lg` and `icon-lg` render their glyph at 24px from the desktop: breakpoint up
  // (see the size variants above), and Figma draws a separate 24px artwork
  // for most icons rather than scaling the 16px one. Pick the drawing here
  // so callers never have to remember `size={24}` — they keep writing
  // `<Button size="lg" icon={Mail}>`. It has to be a media query rather than
  // a `desktop:` class because this selects the *path*, not the box.
  const isDesktop = useIsDesktop()
  const glyphSize =
    isDesktop && (resolvedSize === "lg" || resolvedSize === "icon-lg") ? 24 : 16

  const content = iconOnly ? (
    Glyph && <Glyph size={glyphSize} aria-hidden="true" />
  ) : (
    <>
      {resolvedIconPosition === "left" && Glyph && (
        <Glyph size={glyphSize} data-icon="inline-start" aria-hidden="true" />
      )}
      {children}
      {resolvedIconPosition === "right" && Glyph && (
        <Glyph size={glyphSize} data-icon="inline-end" aria-hidden="true" />
      )}
    </>
  )

  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        buttonVariants({ variant, size: resolvedSize, className }),
        isLoading && "relative"
      )}
      {...props}
    >
      {isLoading ? (
        // Дизайн-чек №10: «кнопка в состоянии лоудинг не должна менять свою
        // ширину и должна сохранять размер, исходя из содержащегося внутри
        // текста и иконки при наличии». Поэтому обычное содержимое остаётся в
        // потоке и продолжает задавать ширину, просто становится невидимым, а
        // спиннер кладётся поверх по центру.
        //
        // Всё остальное в этом состоянии взято из макета один в один:
        // заливка grey-114 (--btn-muted-bg), высота и паддинги те же, что у
        // обычной кнопки, спиннер 24px на размере L (нода 9339:29870).
        // Расходится только ширина: символы Loading в Figma уже обычных
        // (L/Desktop/Text — 118px в Default против 88px в Loading, ноды
        // 32:9065 и 9339:29870). Это ограничение документации, а не правило:
        // дизайнер отдельно оговорил, что «на продукте при переходе кнопки в
        // состояние загрузки она не должна менять свой размер», и просил
        // прописать это в корне компонента.
        <>
          <span
            aria-hidden="true"
            className="invisible inline-flex items-center gap-2"
          >
            {content}
          </span>
          <Loader
            size={glyphSize === 24 ? "md" : "sm"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      ) : (
        content
      )}
    </ButtonPrimitive>
  )
})

export { Button, buttonVariants }
export type { ButtonProps }
