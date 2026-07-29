import type * as React from "react"
import { CircleAlert, Download, FileText, LoaderCircle, X } from "lucide-react"

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
        "flex w-full items-start gap-2.5 py-2 text-sm",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
          error && "bg-[var(--file-item-error-bg)]"
        )}
      >
        {loading ? (
          <LoaderCircle
            aria-hidden="true"
            className="size-4 animate-spin text-[var(--file-item-loading-fg)]"
          />
        ) : error ? (
          <CircleAlert
            aria-hidden="true"
            className="size-4 text-[var(--file-item-error-fg)]"
          />
        ) : (
          <FileText
            aria-hidden="true"
            className="size-4 text-[var(--file-item-icon-fg)]"
          />
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span
          title={typeof name === "string" ? name : undefined}
          className={cn(
            "truncate font-medium",
            disabled
              ? "text-[var(--file-item-fg-disabled)]"
              : "text-[var(--file-item-fg)]"
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "truncate text-xs",
            error
              ? "text-[var(--file-item-error-fg)]"
              : "text-[var(--file-item-meta-fg)]"
          )}
        >
          {loading ? "Загрузка" : error ? errorText : meta}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1">
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
