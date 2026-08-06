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
// Four layouts (the spec's own "Type" property, node 23980:66146):
// - label-left (default): Label left, Value right, both on one line. Each
//   gets an even flex-1 share, Label capped at 384px so a long one can't
//   shrink Value below its own share — both left-aligned within their own
//   half (design-check #33; a stray ml-auto used to shove Value flush to
//   the row's right edge instead). This is the only type that carries
//   padding and a divider: `pt-16 / pb-15 / 1px rule`, because per the
//   spec's own "Правило отступов (Label Left)" consecutive fields stack
//   with 0px between them and the rule is what separates them.
// - label-line: the same one-line layout, but Label is capped at 216px and
//   there is no padding and no divider — consecutive fields are spaced 16px
//   apart by the container ("Правило отступов (Line)").
// - label-top: Label stacked above Value (compact, for tight spaces), 4px
//   between the three lines, also spaced 16px by the container.
// - large-value: same stacking, Value at H2 (32/44) "for displaying a
//   Factoid", lines flush (0px), and a 24px copy icon.
// SubText (when present) always renders below Value.

type FieldType = "label-left" | "label-line" | "label-top" | "large-value"
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

// The 16px info glyph is not centred on its line: Figma wraps it in a box
// that is bottom-aligned with 2px above / 6px below inside the 24px line
// (`pt-[2px] pb-[6px]`), i.e. it sits 2px higher than the text's midpoint.
// The large (H2/44px line) row uses `pb-[18px]` for the same effect.
function InfoIcon({
  content,
  large = false,
}: {
  content: React.ReactNode
  large?: boolean
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-end",
        large ? "h-11 pb-[18px]" : "h-6 pb-[6px]"
      )}
    >
      <Tooltip content={content}>
        <button
          type="button"
          aria-label="Информация"
          className="flex size-4 shrink-0 items-center justify-center text-[var(--ifield-icon-fg)] outline-none"
        >
          <Info aria-hidden="true" className="size-4" />
        </button>
      </Tooltip>
    </span>
  )
}

// Per-type top offset of the copy glyph, straight off the spec's own
// "Copy (…, ELK)" frames: pt-18 for Label Left (whose content already sits
// 16px down, so 2px of its own), pt-2 for Line, pt-30 for Label Top and
// pt-33 for the large one. The glyph keeps its exact 16/24px box — the hit
// target is grown with a transparent inset pseudo-element instead, so
// enlarging it can't shift the alignment.
const COPY_OFFSET: Record<FieldType, string> = {
  "label-left": "mt-[2px]",
  "label-line": "mt-[2px]",
  "label-top": "mt-[30px]",
  "large-value": "mt-[33px]",
}

function CopyButton({
  copyValue,
  type,
}: {
  copyValue: string
  type: FieldType
}) {
  const toast = useToast()
  const large = type === "large-value"

  function handleCopy() {
    navigator.clipboard.writeText(copyValue)
    toast.add({ type: "checked", title: "Скопировано в буфер обмена" })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Копировать"
      className={cn(
        "relative flex shrink-0 items-center justify-center text-[var(--ifield-copy-fg)] outline-none transition-colors before:absolute before:-inset-2 before:content-[''] hover:text-[var(--ifield-copy-fg-hover)]",
        large ? "size-6" : "size-4",
        COPY_OFFSET[type]
      )}
    >
      <Copy aria-hidden="true" className={large ? "size-6" : "size-4"} />
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
  const large = type === "large-value"

  // Label is P1 *Medium* like the Value — the two differ only in colour.
  const labelRow = (
    <span className="flex min-w-0 items-end gap-2 text-p1-medium text-[var(--ifield-label-fg)]">
      <span className="truncate">{label}</span>
      {labelInfo && <InfoIcon content={labelInfo} />}
    </span>
  )

  const valueRow = (
    <span className="flex min-w-0 items-start gap-2">
      <span
        className={cn(
          // text-h2 (32/44) already bakes in weight 500, so it doesn't need
          // its own font-medium alongside the text-p1 branch that does.
          large ? "text-h2" : "text-p1-medium",
          VALUE_COLOR[valueStatus]
        )}
      >
        {value}
      </span>
      {valueInfo && <InfoIcon content={valueInfo} large={large} />}
    </span>
  )

  const subTextRow = subText && (
    <span className={cn("text-p2-medium", SUBTEXT_COLOR[subTextStatus])}>
      {subText}
    </span>
  )

  return (
    <div
      data-slot="item-information-field"
      data-type={type}
      className={cn(
        "flex items-start",
        // Only Label Left is a padded, ruled row; the other three are bare
        // content the container spaces out (16px) itself.
        type === "label-left"
          ? "gap-6 border-b pt-4 pb-[15px]"
          : type === "label-line"
            ? "gap-6"
            : "gap-4",
        type === "label-left" &&
          (divider ? "border-[var(--ifield-divider)]" : "border-transparent"),
        className
      )}
    >
      {stacked ? (
        <div className={cn("flex min-w-0 flex-1 flex-col", !large && "gap-1")}>
          {labelRow}
          {valueRow}
          {subTextRow}
        </div>
      ) : (
        <>
          {/* Label box: an even share of the row, but never wider than
              384px (Label Left) / 216px (Line) and never below 100px. */}
          <span
            className={cn(
              "min-w-25 flex-1",
              type === "label-left" ? "max-w-96" : "max-w-54"
            )}
          >
            {labelRow}
          </span>
          <div className="flex min-w-0 flex-1 items-start gap-4">
            {/* Value and Sub Text sit flush on these two types — only
                Label Top puts 4px between its lines. */}
            <div className="flex min-w-0 flex-1 flex-col items-start">
              {valueRow}
              {subTextRow}
            </div>
            {copyable && (
              <CopyButton
                copyValue={copyValue ?? (typeof value === "string" ? value : "")}
                type={type}
              />
            )}
          </div>
        </>
      )}

      {stacked && copyable && (
        <CopyButton
          copyValue={copyValue ?? (typeof value === "string" ? value : "")}
          type={type}
        />
      )}
    </div>
  )
}

export { ItemInformationField }
export type { ItemInformationFieldProps, FieldType, FieldStatus }
