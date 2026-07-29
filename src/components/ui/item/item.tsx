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
  | "accordion"
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
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--item-thumbnail-bg)] text-[var(--item-thumbnail-fg)]"
    >
      <Ellipsis className="size-4" />
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
  switch (type) {
    case "navigation":
      return (
        <ChevronRight
          aria-hidden="true"
          className="size-5 shrink-0 text-[var(--item-icon-fg)]"
        />
      )
    case "accordion":
      return (
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-[var(--item-icon-fg)]"
        />
      )
    case "check":
      return (
        <Check
          aria-hidden="true"
          className="size-5 shrink-0 text-[var(--item-check-fg)]"
          strokeWidth={2.5}
        />
      )
    case "text":
      return (
        <span className="shrink-0 text-sm font-medium text-[var(--item-right-text-fg)]">
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
              className="flex size-11 shrink-0 items-center justify-center text-[var(--item-icon-fg)] outline-none"
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
        "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left outline-none transition-colors",
        subCategory && "pl-10",
        divider && "border-b border-[var(--item-divider)]",
        "not-data-[disabled]:hover:bg-[var(--item-hover-bg)]",
        "data-[disabled]:cursor-not-allowed",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
        className
      )}
    >
      {hasThumbnail && (thumbnail === true ? <DefaultThumbnail /> : thumbnail)}

      <span className="flex min-w-0 flex-1 flex-col">
        {text && (
          <span className="truncate text-sm text-[var(--item-text-fg)]">
            {text}
          </span>
        )}
        <span
          className={cn(
            "truncate text-sm font-medium",
            disabled
              ? "text-[var(--item-value-fg-disabled)]"
              : "text-[var(--item-value-fg)]"
          )}
        >
          {value}
        </span>
        {comment && (
          <span
            className={cn(
              "truncate text-xs",
              disabled ? "text-[var(--item-value-fg-disabled)]" : COMMENT_COLOR[commentColor]
            )}
          >
            {comment}
          </span>
        )}
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
