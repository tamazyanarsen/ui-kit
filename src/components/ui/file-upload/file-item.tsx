import type * as React from "react"
import { CircleAlert, Download, FileIcon, LoaderCircle, X } from "@/icons"

import { cn } from "@/lib/utils"

// FileListItem — a single uploaded/uploading file row. Icon + name (+
// tooltip via `title` for truncated names) + meta line (size/date, or
// "Загрузка" while loading, or the error text) + optional retry/remove
// actions (Show Edit / Show Cross in the spec's property table).

type FileItemState = "default" | "loading" | "disabled" | "error"

interface FileListItemProps extends Omit<React.ComponentProps<"div">, "id"> {
  name: string
  meta?: React.ReactNode
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

  return (
    <div
      data-slot="file-item"
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
          fill, not just on error. */}
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-[8px]",
          error ? "bg-[var(--file-item-error-bg)]" : "bg-[var(--file-item-icon-bg)]"
        )}
      >
        {/* All three fill the 48px thumbnail tile at 24px, so they take the
            24px drawings (Figma's `icon / document` inside ELK / files'
            tile, node 16029:61127). */}
        {loading ? (
          <LoaderCircle
            size={24}
            aria-hidden="true"
            className="size-6 animate-spin text-[var(--file-item-loading-fg)]"
          />
        ) : error ? (
          <CircleAlert
            size={24}
            aria-hidden="true"
            className="size-6 text-[var(--file-item-error-fg)]"
          />
        ) : (
          <FileIcon
            size={24}
            aria-hidden="true"
            className="size-6 text-[var(--file-item-icon-fg)]"
          />
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span
          title={typeof name === "string" ? name : undefined}
          className={cn(
            "truncate text-p1-medium",
            disabled
              ? "text-[var(--file-item-fg-disabled)]"
              : "text-[var(--file-item-fg)]"
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "truncate text-p3-medium",
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
