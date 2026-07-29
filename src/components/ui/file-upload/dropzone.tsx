import * as React from "react"
import { CirclePlus } from "lucide-react"

import { cn } from "@/lib/utils"

// FileUploadDropzone — Drag & Drop target. States: default, hover (drag
// over — fills with Grey 100 per spec), disabled, error.

interface FileUploadDropzoneProps
  extends Omit<React.ComponentProps<"div">, "onDrop" | "onChange"> {
  subtitle?: React.ReactNode
  error?: boolean
  disabled?: boolean
  multiple?: boolean
  accept?: string
  onFilesSelected?: (files: FileList) => void
}

export function FileUploadDropzone({
  className,
  subtitle,
  error = false,
  disabled = false,
  multiple = true,
  accept,
  onFilesSelected,
  children,
  ...props
}: FileUploadDropzoneProps) {
  const [dragOver, setDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputId = React.useId()

  function openPicker() {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div
      data-slot="file-upload-dropzone"
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed px-4 py-6 text-center transition-colors",
        disabled
          ? "cursor-not-allowed border-[var(--file-upload-border-disabled)] bg-[var(--file-upload-bg-disabled)]"
          : error
            ? "cursor-pointer border-[var(--file-upload-border-error)] bg-[var(--file-upload-bg)]"
            : cn(
                "cursor-pointer border-[var(--file-upload-border)] bg-[var(--file-upload-bg)] hover:border-[var(--file-upload-border-hover)]",
                dragOver &&
                  "border-[var(--file-upload-border-hover)] bg-[var(--file-upload-bg-hover)]"
              ),
        className
      )}
      onDragOver={(event) => {
        if (disabled) return
        event.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        if (disabled) return
        event.preventDefault()
        setDragOver(false)
        if (event.dataTransfer.files.length > 0) {
          onFilesSelected?.(event.dataTransfer.files)
        }
      }}
      onClick={openPicker}
      {...props}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            onFilesSelected?.(event.target.files)
          }
          event.target.value = ""
        }}
      />
      <CirclePlus
        aria-hidden="true"
        className={cn(
          "size-4",
          disabled
            ? "text-[var(--file-upload-fg-disabled)]"
            : error
              ? "text-[var(--file-upload-border-error)]"
              : "text-[var(--file-upload-fg)]"
        )}
      />
      <span
        className={cn(
          "text-sm font-medium",
          disabled
            ? "text-[var(--file-upload-fg-disabled)]"
            : error
              ? "text-[var(--file-upload-border-error)]"
              : "text-[var(--file-upload-fg)]"
        )}
      >
        {children ?? "Перетащите или загрузите файлы"}
      </span>
      {subtitle && (
        <span
          className={cn(
            "text-xs",
            disabled
              ? "text-[var(--file-upload-subtitle-fg-disabled)]"
              : error
                ? "text-[var(--file-upload-border-error)]"
                : "text-[var(--file-upload-subtitle-fg)]"
          )}
        >
          {subtitle}
        </span>
      )}
    </div>
  )
}
