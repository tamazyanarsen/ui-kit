import * as React from "react"
import { Info, Copy } from "@/icons"

import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/toast-message"

// Item.Information Field — "Текстовое поле": a read-only label+value row,
// used to display information the user can't interact with or edit (per
// the spec's own description). Distinct from ./item, which is always an
// interactive row.
//
// Four layouts (the spec's own "Type" property):
// - label-left (default): Label left, Value right, both on one line.
// - line: same as label-left but with a dashed rule filling the gap
//   between them (spec: "Label box width capped at 216px").
// - label-top: Label stacked above Value (compact, for tight spaces).
// - large-value: same stacking as label-top, but Value renders larger
//   ("used for displaying a Factoid").
// SubText (when present) always renders below Value.

type FieldType = "label-left" | "line" | "label-top" | "large-value"
type FieldStatus = "default" | "success" | "error" | "attention" | "information"

const VALUE_COLOR: Record<FieldStatus, string> = {
  default: "text-[var(--ifield-value-fg)]",
  success: "text-[var(--ifield-success-fg)]",
  error: "text-[var(--ifield-error-fg)]",
  attention: "text-[var(--ifield-attention-fg)]",
  information: "text-[var(--ifield-information-fg)]",
}

const SUBTEXT_COLOR: Record<Exclude<FieldStatus, "information">, string> = {
  default: "text-[var(--ifield-subtext-fg)]",
  success: "text-[var(--ifield-success-fg)]",
  error: "text-[var(--ifield-error-fg)]",
  attention: "text-[var(--ifield-attention-fg)]",
}

interface ItemInformationFieldProps {
  type?: FieldType
  label: React.ReactNode
  value: React.ReactNode
  copyValue?: string
  subText?: React.ReactNode
  valueStatus?: FieldStatus
  subTextStatus?: Exclude<FieldStatus, "information">
  labelInfo?: React.ReactNode
  valueInfo?: React.ReactNode
  copyable?: boolean
  divider?: boolean
  className?: string
}

function InfoIcon({ content }: { content: React.ReactNode }) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        aria-label="Информация"
        className="flex size-4 shrink-0 items-center justify-center text-[var(--ifield-icon-fg)] outline-none"
      >
        <Info aria-hidden="true" className="size-4" />
      </button>
    </Tooltip>
  )
}

function CopyButton({ copyValue }: { copyValue: string }) {
  const toast = useToast()

  function handleCopy() {
    navigator.clipboard.writeText(copyValue)
    toast.add({ type: "checked", title: "Скопировано в буфер обмена" })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Копировать"
      className="flex size-8 shrink-0 items-center justify-center text-[var(--ifield-copy-fg)] outline-none transition-colors hover:text-[var(--ifield-copy-fg-hover)]"
    >
      <Copy aria-hidden="true" className="size-4" />
    </button>
  )
}

function ItemInformationField({
  type = "label-left",
  label,
  value,
  copyValue,
  subText,
  valueStatus = "default",
  subTextStatus = "default",
  labelInfo,
  valueInfo,
  copyable = false,
  divider = true,
  className,
}: ItemInformationFieldProps) {
  const stacked = type === "label-top" || type === "large-value"

  const labelRow = (
    <span className="flex shrink-0 items-center gap-1.5 text-sm text-[var(--ifield-label-fg)]">
      {label}
      {labelInfo && <InfoIcon content={labelInfo} />}
    </span>
  )

  const valueRow = (
    <span className="flex items-center gap-1.5">
      <span
        className={cn(
          "font-medium",
          type === "large-value" ? "text-2xl" : "text-sm",
          VALUE_COLOR[valueStatus]
        )}
      >
        {value}
      </span>
      {valueInfo && <InfoIcon content={valueInfo} />}
    </span>
  )

  return (
    <div
      data-slot="item-information-field"
      className={cn(
        "flex items-start gap-2 px-4 py-3",
        divider && "border-b border-[var(--ifield-divider)]",
        className
      )}
    >
      {stacked ? (
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {labelRow}
          {valueRow}
          {subText && (
            <span className={cn("text-xs", SUBTEXT_COLOR[subTextStatus])}>
              {subText}
            </span>
          )}
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="max-w-54 shrink-0">{labelRow}</span>
          {type === "line" && (
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 border-b border-dashed border-[var(--ifield-divider)]"
            />
          )}
          <div className={cn("flex flex-col items-end gap-1", type === "label-left" && "ml-auto")}>
            {valueRow}
            {subText && (
              <span className={cn("text-xs", SUBTEXT_COLOR[subTextStatus])}>
                {subText}
              </span>
            )}
          </div>
        </div>
      )}

      {copyable && (
        <CopyButton copyValue={copyValue ?? (typeof value === "string" ? value : "")} />
      )}
    </div>
  )
}

export { ItemInformationField }
export type { ItemInformationFieldProps, FieldType, FieldStatus }
