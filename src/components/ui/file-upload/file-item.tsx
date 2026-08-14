import type * as React from "react"
import { CircleAlert, Download, FileIcon, LoaderCircle, X } from "@/icons"

import { cn } from "@/lib/utils"

// FileListItem — a single uploaded/uploading file row. Icon + name (+
// tooltip via `title` for truncated names) + meta line (size/date, or
// "Загрузка" while loading, or the error text) + optional retry/remove
// actions (Show Edit / Show Cross in the spec's property table).

type FileItemState = "default" | "loading" | "disabled" | "error"

/**
 * `Size` компонент-сета `ELK / files` (нода 16029:58062): L и S, каждый со
 * своей парой Desktop/Mobile. Раньше был только L, хотя в макете это
 * основная ось компонента.
 *
 * Разница снята с `Size=S / Desktop` (нода 16029:58723): вместо плитки с
 * иконкой 48px — голая иконка документа 16px, имя P3 Medium (12/16) вместо
 * P1 Medium, подпись P4 Regular (10/12) вместо P3 Medium, высота строки 28
 * вместо 48.
 */
type FileItemSize = "l" | "s"

interface FileListItemProps extends Omit<React.ComponentProps<"div">, "id"> {
  name: string
  meta?: React.ReactNode
  size?: FileItemSize
  state?: FileItemState
  errorText?: React.ReactNode
  showEdit?: boolean
  showCross?: boolean
  onRetry?: () => void
  onRemove?: () => void
}

export function FileListItem({
  className,
  name,
  meta,
  size = "l",
  state = "default",
  errorText = "Text about error here",
  showEdit = true,
  showCross = true,
  onRetry,
  onRemove,
  ...props
}: FileListItemProps) {
  const disabled = state === "disabled"
  const error = state === "error"
  const loading = state === "loading"
  const small = size === "s"
  // В S иконка стоит сама по себе, без плитки, и в трёх состояниях
  // отличается только цветом.
  const glyphSize = small ? 16 : 24
  const Glyph = loading ? LoaderCircle : error ? CircleAlert : FileIcon
  const glyphColor = loading
    ? "text-[var(--file-item-loading-fg)]"
    : error
      ? "text-[var(--file-item-error-fg)]"
      : "text-[var(--file-item-icon-fg)]"

  return (
    <div
      data-slot="file-item"
      data-size={size}
      data-disabled={disabled || undefined}
      className={cn(
        // The row is exactly its 48px thumbnail tall and reserves 16px on
        // the right for the trailing icons — `ELK / files` (16029:58062) is
        // `flex gap-16 items-center pr-16` with no vertical padding of its
        // own; spacing between rows belongs to the list that stacks them.
        "flex w-full items-center gap-4 pr-4 text-p2-regular",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {/* Design-check #23 revisited: the live "ELK / files" component shows
          a 48px thumbnail box (not 32px) with an always-present neutral
          fill, not just on error.
          Размер зависит от брейкпоинта: в анатомии File Upload строка
          `ELK / files` — 48px с миниатюрой 48 в `L / Desktop` и 40px с
          миниатюрой 40 в `M / Mobile` (маркеры spaceVertical: x=48/h=48
          против x=40/h=40). Было зафиксировано на 48 для обоих. */}
      {small ? (
        <Glyph
          size={16}
          aria-hidden="true"
          className={cn("size-4 shrink-0", loading && "animate-spin", glyphColor)}
        />
      ) : (
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-[8px] md:size-12",
            error ? "bg-[var(--file-item-error-bg)]" : "bg-[var(--file-item-icon-bg)]"
          )}
        >
          {/* All three fill the 48px thumbnail tile at 24px, so they take the
              24px drawings (Figma's `icon / document` inside ELK / files'
              tile, node 16029:61127). */}
          <Glyph
            size={glyphSize}
            aria-hidden="true"
            className={cn("size-6", loading && "animate-spin", glyphColor)}
          />
        </span>
      )}

      <span
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          small && "h-7 justify-center"
        )}
      >
        <span
          title={typeof name === "string" ? name : undefined}
          className={cn(
            "truncate",
            small ? "text-p3-medium" : "text-p1-medium",
            disabled
              ? "text-[var(--file-item-fg-disabled)]"
              : "text-[var(--file-item-fg)]"
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "truncate",
            small ? "text-p4-regular" : "text-p3-medium",
            error
              ? "text-[var(--file-item-error-fg)]"
              : "text-[var(--file-item-meta-fg)]"
          )}
        >
          {loading ? "Загрузка" : error ? errorText : meta}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-4">
        {showEdit && (
          <button
            type="button"
            aria-label="Загрузить заново"
            onClick={onRetry}
            className="flex items-center justify-center text-[var(--file-item-icon-fg)] outline-none"
          >
            <Download aria-hidden="true" className="size-4" />
          </button>
        )}
        {showCross && (
          <button
            type="button"
            aria-label="Удалить файл"
            onClick={onRemove}
            className="flex items-center justify-center text-[var(--file-item-icon-fg)] outline-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </span>
    </div>
  )
}
