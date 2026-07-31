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
// Three layouts (the spec's own "Type" property):
// - label-left (default): Label left, Value right, both on one line. Label
//   and Value each get an even flex-1 share of the row by default, Label
//   capped at 216px so a long one can't shrink Value below its own share —
//   both left-aligned within their own half (design-check #33; a stray
//   ml-auto used to shove Value flush to the row's right edge instead).
// - label-top: Label stacked above Value (compact, for tight spaces).
// - large-value: same stacking as label-top, but Value renders larger
//   ("used for displaying a Factoid").
// SubText (when present) always renders below Value. No dashed "line"
// variant (design-check #32) — not a real DS variant of this component.

type FieldType = "label-left" | "label-top" | "large-value"
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
      // Design-check #34: centered on Value's first line, not the row's
      // own top edge — the row uses items-start, which would otherwise sit
      // this size-8 hit target's center ~6px below text-sm's 20px line
      // height (half the (32-20)px difference), noticeably lower than the
      // text's optical center. Stays pinned there even when subText adds a
      // second line below.
      className="-mt-1.5 flex size-8 shrink-0 items-center justify-center text-[var(--ifield-copy-fg)] outline-none transition-colors hover:text-[var(--ifield-copy-fg-hover)]"
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
          <span className="max-w-54 min-w-0 flex-1">{labelRow}</span>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
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
