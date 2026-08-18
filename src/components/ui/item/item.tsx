import * as React from "react"
import {
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  Ellipsis,
} from "@/icons"

import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip } from "@/components/ui/tooltip"

// Item — "Элемент": a content row, always interactive (per the spec's own
// description: clicking it selects from a list, opens a bottom sheet, or
// navigates). Two anatomy shapes stack via `text`: Value alone, or
// Text+Value+Comment. `subCategory` is the spec's "Sub Category" property —
// a 2nd-nesting-level row gets extra left indent.
//
// Right-element hit areas (per the spec's own "Активные области" section):
// Navigation/Accordion(Select)/Check/Text/None have NO separate hit area —
// the whole row is one click target. Information/Toggle/Checkbox DO have
// their own isolated hit area and must not also fire the row's onClick, so
// those three are wrapped with stopPropagation (same technique as
// AccordionListItem's nested Button/Checkbox).

type CommentColor = "grey" | "red" | "yellow"

const COMMENT_COLOR: Record<CommentColor, string> = {
  grey: "text-[var(--item-comment-grey-fg)]",
  red: "text-[var(--item-comment-red-fg)]",
  yellow: "text-[var(--item-comment-yellow-fg)]",
}

type RightElementType =
  | "none"
  | "navigation"
  | "information"
  | "select"
  | "check"
  | "text"
  | "toggle"
  | "checkbox"

interface ItemProps {
  value: React.ReactNode
  text?: React.ReactNode
  comment?: React.ReactNode
  commentColor?: CommentColor
  thumbnail?: React.ReactNode
  subCategory?: boolean
  disabled?: boolean
  divider?: boolean
  onClick?: () => void

  rightElement?: RightElementType
  informationText?: React.ReactNode
  rightText?: React.ReactNode
  toggleChecked?: boolean
  onToggleChange?: (checked: boolean) => void
  checkboxChecked?: boolean
  onCheckboxChange?: (checked: boolean) => void

  className?: string
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function DefaultThumbnail() {
  return (
    // Design-check #35: square with a capped radius, like the kit's own
    // `Thumbnail` component (ui/thumbnail) — was a small rounded-full
    // circle, which doesn't match that convention.
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--item-thumbnail-bg)] text-[var(--item-thumbnail-fg)]"
    >
      <Ellipsis size={24} className="size-6" />
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
}: Pick<
  ItemProps,
  | "disabled"
  | "informationText"
  | "rightText"
  | "toggleChecked"
  | "onToggleChange"
  | "checkboxChecked"
  | "onCheckboxChange"
> & { type: RightElementType }) {
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
        <span
          className="flex shrink-0 items-center justify-center"
          onMouseDown={stopPropagation}
          onClick={stopPropagation}
        >
          <Tooltip content={informationText}>
            <button
              type="button"
              disabled={disabled}
              aria-label="Информация"
              className={cn(
                // "активная область иконки справа 16х44 px" — tall enough to
                // hit comfortably, but only as wide as the icon so it doesn't
                // eat 28px of the row's right edge.
                "flex h-11 w-4 shrink-0 items-center justify-center outline-none",
                iconColorClass
              )}
            >
              <Info aria-hidden="true" className="size-4" />
            </button>
          </Tooltip>
        </span>
      )
    case "toggle":
      return (
        <span
          className="flex shrink-0 items-center"
          onMouseDown={stopPropagation}
          onClick={stopPropagation}
        >
          <Toggle
            checked={toggleChecked}
            onCheckedChange={onToggleChange}
            disabled={disabled}
            aria-label="Переключить"
          />
        </span>
      )
    case "checkbox":
      return (
        <span
          className="flex shrink-0 items-center"
          onMouseDown={stopPropagation}
          onClick={stopPropagation}
        >
          <Checkbox
            checked={checkboxChecked}
            onCheckedChange={onCheckboxChange}
            disabled={disabled}
            aria-label="Выбрать"
          />
        </span>
      )
    case "none":
    default:
      return null
  }
}

function Item({
  value,
  text,
  comment,
  commentColor = "grey",
  thumbnail,
  subCategory = false,
  disabled = false,
  divider = true,
  onClick,
  rightElement = "none",
  informationText,
  rightText,
  toggleChecked,
  onToggleChange,
  checkboxChecked,
  onCheckboxChange,
  className,
}: ItemProps) {
  const hasThumbnail = thumbnail !== undefined && thumbnail !== false
  const showRightGap = rightElement !== "none"

  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      data-slot="item"
      data-disabled={disabled || undefined}
      className={cn(
        // 16 above the content, 15 below it, then the 1px divider — the row
        // is 80px tall for a Value+Comment either way. Figma's Divider Off
        // variant keeps the same 15px gap and a transparent 1px line rather
        // than collapsing, so the border here is always present and only
        // changes colour; otherwise a list's last row would be 1px shorter.
        "flex w-full cursor-pointer items-center gap-6 border-b px-4 pt-4 pb-[15px] text-left outline-none transition-colors",
        // Sub Category indents the *content* by 64px relative to a normal
        // row (Figma puts `pl-[64px]` on the Box of `Сategory=True`, on top
        // of the row's own 16px side padding from the "Боковые отступы"
        // note) — so 80px here, and the divider/hover fill still span the
        // full width because the padding is on the row itself.
        subCategory && "pl-20",
        divider ? "border-[var(--item-divider)]" : "border-transparent",
        "not-data-[disabled]:hover:bg-[var(--item-hover-bg)]",
        "data-[disabled]:cursor-not-allowed",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
        className
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-4">
        {hasThumbnail && (
          <span className={cn("shrink-0", disabled && "opacity-50")}>
            {thumbnail === true ? <DefaultThumbnail /> : thumbnail}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex min-w-0 flex-col">
            {text && (
              <span
                className={cn(
                  "truncate text-p2-medium",
                  disabled
                    ? "text-[var(--item-value-fg-disabled)]"
                    : "text-[var(--item-value-fg)]"
                )}
              >
                {text}
              </span>
            )}
            {/* Value wraps up to 3 lines, Comment up to 5 — the spec's own
                "Максимальное количество строк" note; single-line `truncate`
                cut long titles that Figma shows wrapping. */}
            <span
              className={cn(
                "line-clamp-3 text-p1-medium",
                disabled
                  ? "text-[var(--item-value-fg-disabled)]"
                  : "text-[var(--item-value-fg)]"
              )}
            >
              {value}
            </span>
          </span>
          {comment && (
            <span
              className={cn(
                "line-clamp-5 text-p2-medium",
                disabled ? "text-[var(--item-value-fg-disabled)]" : COMMENT_COLOR[commentColor]
              )}
            >
              {comment}
            </span>
          )}
        </span>
      </span>

      {showRightGap && (
        <RightElement
          type={rightElement}
          disabled={disabled}
          informationText={informationText}
          rightText={rightText}
          toggleChecked={toggleChecked}
          onToggleChange={onToggleChange}
          checkboxChecked={checkboxChecked}
          onCheckboxChange={onCheckboxChange}
        />
      )}
    </div>
  )
}

export { Item }
export type { ItemProps, RightElementType, CommentColor }
