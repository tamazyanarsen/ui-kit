import * as React from "react"

import { Comment } from "@/icons"
import { cn } from "@/lib/utils"

import { RightElement, type RightElementType } from "./right-element"

// Item — "Элемент": a content row, always interactive (per the spec's own
// description: clicking it selects from a list, opens a bottom sheet, or
// navigates). Two anatomy shapes stack via `text`: Value alone, or
// Text+Value+Comment. `subCategory` is the spec's "Sub Category" property —
// a 2nd-nesting-level row gets extra left indent.
//
// Правый элемент со всеми его видами и зонами нажатия — в
// `right-element.tsx`.

type CommentColor = "grey" | "red" | "yellow"

const COMMENT_COLOR: Record<CommentColor, string> = {
  grey: "text-[var(--item-comment-grey-fg)]",
  red: "text-[var(--item-comment-red-fg)]",
  yellow: "text-[var(--item-comment-yellow-fg)]",
}

/** Цвет подписи и значения у отключённой строки — один на всех. */
const DISABLED_FG = "text-[var(--item-value-fg-disabled)]"

interface ItemProps {
  value: React.ReactNode
  text?: React.ReactNode
  comment?: React.ReactNode
  commentColor?: CommentColor
  /** `true` — заглушка кита, свой узел — как есть, `false`/пусто — без него. */
  thumbnail?: React.ReactNode
  subCategory?: boolean
  disabled?: boolean
  divider?: boolean
  onClick?: () => void

  rightElement?: RightElementType
  /**
   * Панель, которую раскрывает строка, СЕЙЧАС ОТКРЫТА (`rightElement="select"`).
   *
   * Признак раскрытия обязателен: шеврон не переворачивался не из-за CSS, а
   * потому что компонент не знал, что панель открыта. Заодно это
   * `aria-expanded` на самой строке.
   */
  open?: boolean
  informationText?: React.ReactNode
  rightText?: React.ReactNode
  toggleChecked?: boolean
  onToggleChange?: (checked: boolean) => void
  checkboxChecked?: boolean
  onCheckboxChange?: (checked: boolean) => void

  className?: string
}

function DefaultThumbnail() {
  return (
    // Design-check #35: square with a capped radius, like the kit's own
    // `Thumbnail` component (ui/thumbnail) — was a small rounded-full
    // circle, which doesn't match that convention.
    //
    // ⚠️ Глиф — `comment` (пузырь с чёрточками), а НЕ `more`/`message`.
    // Имя ноды в макете врёт, содержимое — нет: плашка подписана
    // `icon / more` (это имя мастера сета), а рисует она ассет с именем
    // `imgIconComment`. Смотреть надо на имя ассета, а не на подпись слоя —
    // ровно на этом мы и поставили сюда многоточие.
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--item-thumbnail-bg)] text-[var(--item-thumbnail-fg)]"
    >
      <Comment size={24} className="size-6" />
    </span>
  )
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
  open = false,
  informationText,
  rightText,
  toggleChecked,
  onToggleChange,
  checkboxChecked,
  onCheckboxChange,
  className,
}: ItemProps) {
  const hasThumbnail = thumbnail !== undefined && thumbnail !== false
  const valueColor = disabled ? DISABLED_FG : "text-[var(--item-value-fg)]"

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
      aria-expanded={rightElement === "select" ? open : undefined}
      data-open={(rightElement === "select" && open) || undefined}
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
        "focus-visible:focus-ring-inset",
        className
      )}
    >
      {/* ⚠️ `items-start`, а не `items-center`: плашка ПРИЖАТА К ВЕРХУ,
          вровень с первой строкой значения (кит объявляет `items-start`) —
          48 × 48 на top 16, радиус 8, фон Grey 106, значок 24. По центру
          высоты строки она стояла только у однострочного значения, а на
          двух строках уезжала вниз. */}
      <span className="flex min-w-0 flex-1 items-start gap-4">
        {hasThumbnail && (
          <span className={cn("shrink-0", disabled && "opacity-50")}>
            {thumbnail === true ? <DefaultThumbnail /> : thumbnail}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex min-w-0 flex-col">
            {text && (
              <span className={cn("truncate text-p2-medium", valueColor)}>
                {text}
              </span>
            )}
            {/* Value wraps up to 3 lines, Comment up to 5 — the spec's own
                "Максимальное количество строк" note; single-line `truncate`
                cut long titles that Figma shows wrapping. */}
            <span className={cn("line-clamp-3 text-p1-medium", valueColor)}>
              {value}
            </span>
          </span>
          {comment && (
            <span
              className={cn(
                "line-clamp-5 text-p2-medium",
                disabled ? DISABLED_FG : COMMENT_COLOR[commentColor]
              )}
            >
              {comment}
            </span>
          )}
        </span>
      </span>

      {rightElement !== "none" && (
        <RightElement
          type={rightElement}
          disabled={disabled}
          open={open}
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
export type { CommentColor, ItemProps, RightElementType }
