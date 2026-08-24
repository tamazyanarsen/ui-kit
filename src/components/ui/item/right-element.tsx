import * as React from "react"

import { Check, ChevronDown, ChevronRight, Info } from "@/icons"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip } from "@/components/ui/tooltip"

// Right-element hit areas (per the spec's own "Активные области" section):
// Navigation/Accordion(Select)/Check/Text/None have NO separate hit area —
// the whole row is one click target. Information/Toggle/Checkbox DO have
// their own isolated hit area and must not also fire the row's onClick, so
// those three go through `IsolatedControl` (same technique as
// AccordionListItem's nested Button/Checkbox).

type RightElementType =
  | "none"
  | "navigation"
  | "information"
  | "select"
  | "check"
  | "text"
  | "toggle"
  | "checkbox"

interface RightElementProps {
  type: RightElementType
  disabled?: boolean
  informationText?: React.ReactNode
  rightText?: React.ReactNode
  toggleChecked?: boolean
  onToggleChange?: (checked: boolean) => void
  checkboxChecked?: boolean
  onCheckboxChange?: (checked: boolean) => void
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

/** Собственная зона нажатия — щелчок по ней не проваливается в строку. */
function IsolatedControl({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn("flex shrink-0 items-center", className)}
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
    >
      {children}
    </span>
  )
}

function RightElement({
  type,
  disabled,
  informationText,
  rightText,
  toggleChecked,
  onToggleChange,
  checkboxChecked,
  onCheckboxChange,
}: RightElementProps) {
  // Round-2 audit: the disabled "icon / arrow next chevron" asset on the
  // master "ELK / item" component is a distinct fill (#C8C8CB, same as
  // --item-value-fg-disabled) rather than the default's #999999 dimmed via
  // opacity — matches the same literal-recolor (not opacity-fade) pattern
  // already used for the Value/Comment text right above.
  const iconColorClass = disabled
    ? "text-[var(--item-value-fg-disabled)]"
    : "text-[var(--item-icon-fg)]"

  switch (type) {
    case "navigation":
      return (
        <ChevronRight
          aria-hidden="true"
          className={cn("size-4 shrink-0", iconColorClass)}
        />
      )

    case "select":
      return (
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 shrink-0", iconColorClass)}
        />
      )

    case "check":
      return (
        <Check
          aria-hidden="true"
          className="size-4 shrink-0 text-[var(--item-check-fg)]"
          strokeWidth={2.5}
        />
      )

    case "text":
      return (
        <span className="shrink-0 text-p1-medium text-[var(--item-right-text-fg)]">
          {rightText}
        </span>
      )

    case "information":
      return (
        <IsolatedControl className="justify-center">
          <Tooltip content={informationText}>
            <button
              type="button"
              disabled={disabled}
              aria-label="Информация"
              className={cn(
                // "активная область иконки справа 16х44 px" — tall enough to
                // hit comfortably, but only as wide as the icon so it
                // doesn't eat 28px of the row's right edge.
                "flex h-11 w-4 shrink-0 items-center justify-center outline-none",
                iconColorClass
              )}
            >
              <Info aria-hidden="true" className="size-4" />
            </button>
          </Tooltip>
        </IsolatedControl>
      )

    case "toggle":
      return (
        <IsolatedControl>
          <Toggle
            checked={toggleChecked}
            onCheckedChange={onToggleChange}
            disabled={disabled}
            aria-label="Переключить"
          />
        </IsolatedControl>
      )

    case "checkbox":
      return (
        <IsolatedControl>
          <Checkbox
            checked={checkboxChecked}
            onCheckedChange={onCheckboxChange}
            disabled={disabled}
            aria-label="Выбрать"
          />
        </IsolatedControl>
      )

    case "none":
    default:
      return null
  }
}

export { RightElement }
export type { RightElementProps, RightElementType }
