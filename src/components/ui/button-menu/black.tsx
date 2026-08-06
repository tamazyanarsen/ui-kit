import * as React from "react"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ButtonMenuBlack — "ELK / button menu (black)" (node 700:54288, v1.0.0).
// Figma documents this as its own component, not a variant of the white
// ButtonMenu: while the user has table rows selected, this bar *replaces*
// the white one, and closing it brings the white one back ("Когда
// пользователь выделяет один или несколько элементов таблицы, Button Menu
// заменяется черной панелью").
//
// Geometry off the Button=Three symbol (4270:51380): fixed 72px tall,
// px-24/py-16, top corners rounded 16px only (it sits flush against the
// bottom edge, same as ButtonMenu), actions hugging left with an 8px gap,
// and the info bar + close cross pinned right with a 32px gap.

interface ButtonMenuBlackInfoItem {
  label: React.ReactNode
  value: React.ReactNode
  /** Figma fixes the first ("Выбрано") column at 64px; the rest size to
   * content. Pass a width class here rather than baking one in. */
  className?: string
}

interface ButtonMenuBlackProps extends React.ComponentProps<"div"> {
  /** The "Information (ELK)" bar (node 4008:20902) — label/value pairs
   * describing the current selection. Omit it entirely for the `showBar =
   * false` form. */
  info?: ButtonMenuBlackInfoItem[]
  /** Dismisses the bar. Figma draws this as a bare 24px `icon / close
   * cross`, not an `ELK / button` instance, so it stays a plain button. */
  onClose?: () => void
}

function ButtonMenuBlack({
  className,
  info,
  onClose,
  children,
  ...props
}: ButtonMenuBlackProps) {
  // Same reasoning as ButtonMenu's own sizing pass: the spec draws every
  // action at a uniform 32px pill (px-16/py-6, radius 16 — Button's `sm`),
  // and on this bar they are always the white variant against the dark
  // fill. Size is forced; variant only fills in when the caller left it
  // unset, so an intentional override still wins.
  const sizedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Button) {
      const element = child as React.ReactElement<{
        size?: string
        variant?: string
      }>
      return React.cloneElement(element, {
        size: "sm",
        variant: element.props.variant ?? "secondary-white",
      })
    }
    return child
  })

  return (
    <div
      data-slot="button-menu-black"
      className={cn(
        "flex max-h-[72px] min-h-[72px] w-full items-center justify-between rounded-tl-[16px] rounded-tr-[16px] bg-[var(--button-menu-black-bg)] px-6 py-4",
        className
      )}
      {...props}
    >
      <div
        data-slot="button-menu-black-actions"
        className="flex shrink-0 items-start gap-2"
      >
        {sizedChildren}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-8">
        {info && info.length > 0 && (
          <div
            data-slot="button-menu-black-info"
            className="flex items-center gap-8 text-p2-medium"
          >
            {info.map((item, index) => (
              <div
                key={index}
                className={cn("flex flex-col items-start", item.className)}
              >
                <span className="text-[var(--button-menu-black-muted-fg)]">
                  {item.label}
                </span>
                <span className="overflow-hidden text-ellipsis text-[var(--button-menu-black-fg)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {onClose && (
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 text-[var(--button-menu-black-fg)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X size={24} aria-hidden="true" className="size-6" />
          </button>
        )}
      </div>
    </div>
  )
}

export { ButtonMenuBlack }
export type { ButtonMenuBlackProps, ButtonMenuBlackInfoItem }
