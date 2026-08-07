import * as React from "react"
import { CirclePlus } from "@/icons"

import { cn } from "@/lib/utils"

// FileUploadDropzone — Drag & Drop target. States: default, hover (drag
// over — fills with Grey 100 per spec), disabled, error.

type DropzoneTone = "disabled" | "error" | "default"

// Icon and main text share the same three colors; the subtitle's
// disabled/default tokens differ from them (its own dedicated subtitle-fg
// tokens), but error still reuses the same border-error token as the rest.
const CONTENT_COLOR: Record<DropzoneTone, string> = {
  disabled: "text-[var(--file-upload-fg-disabled)]",
  error: "text-[var(--file-upload-border-error)]",
  default: "text-[var(--file-upload-fg)]",
}
// Error only recolors the icon/title (CONTENT_COLOR) — the subtitle stays
// its normal grey even in the error state, per the live Figma component.
const SUBTITLE_COLOR: Record<DropzoneTone, string> = {
  disabled: "text-[var(--file-upload-subtitle-fg-disabled)]",
  error: "text-[var(--file-upload-subtitle-fg)]",
  default: "text-[var(--file-upload-subtitle-fg)]",
}

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

  const tone: DropzoneTone = disabled ? "disabled" : error ? "error" : "default"

  let containerToneClass: string
  if (disabled) {
    containerToneClass =
      "cursor-not-allowed border-[var(--file-upload-border-disabled)] bg-[var(--file-upload-bg-disabled)]"
  } else if (error) {
    containerToneClass =
      "cursor-pointer border-[var(--file-upload-border-error)] bg-[var(--file-upload-bg)]"
  } else {
    containerToneClass = cn(
      "cursor-pointer border-[var(--file-upload-border)] bg-[var(--file-upload-bg)] hover:border-[var(--file-upload-border-hover)]",
      dragOver && "border-[var(--file-upload-border-hover)] bg-[var(--file-upload-bg-hover)]"
    )
  }

  return (
    <div
      data-slot="file-upload-dropzone"
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      // Design-check #22: measured against ui/file-upload/file-upload-1.svg
      // at native scale (icon top edge sits exactly 24px below the card's
      // own top edge — py-6 already matched). What was actually off is the
      // layout: the spec puts the icon inline with the title on one row,
      // not stacked above it, with the subtitle on its own row below.
      className={cn(
        // `p-6` and `gap-2`: the master (16029:57969) is a uniform 24px box
        // with 8px between the "Перетащите или загрузите файлы" row and the
        // format hint — the 16px sides and 4px gap were tighter than the spec.
        "relative flex w-full flex-col items-center gap-2 rounded-[24px] border border-dashed p-6 text-center transition-colors",
        containerToneClass,
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
      <span className="flex items-center gap-2">
        <CirclePlus aria-hidden="true" className={cn("size-6", CONTENT_COLOR[tone])} />
        <span className={cn("text-p2-medium md:text-p1-medium", CONTENT_COLOR[tone])}>
          {children ?? (
            <>
              {"Перетащите или "}
              {/* Figma underlines this half of the label with the "Ссылка/"
                  decoration — from-font thickness, ink-skipping off (node
                  I16029:57763;16029:57994) — which is what `text-link` is. */}
              <span className="text-link">загрузите файлы</span>
            </>
          )}
        </span>
      </span>
      {subtitle && (
        <span className={cn("text-p3-regular", SUBTITLE_COLOR[tone])}>
          {subtitle}
        </span>
      )}
    </div>
  )
}
