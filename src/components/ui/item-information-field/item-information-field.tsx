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

// Дизайн-чек №31: иконка информации рендерится ВНУТРИ текстового потока, а
// не отдельной flex-колонкой рядом с ним. «Текст не должен уходить в
// многоточие после одной строки… вместо этого иконка информации должна
// ставиться после последнего символа в последней строке с пробелом 8
// пикселей от неё. Соответственно, иконка должна располагаться inline».
//
// В мастере иконка лежит в строке `Label` (`flex gap-[8px] items-end`,
// нода 70251:48887) — те самые 8px и выравнивание по низу строки. Для
// однострочного случая inline-элемент по baseline даёт тот же результат
// (Figma держит глиф в боксе с 2px сверху и 6px снизу внутри 24px-строки,
// а baseline 16px-текста как раз проходит в 16px от верха строки — отсюда
// поправка в 2px). Разница только в многострочном случае, который в
// документации не нарисован: flex-колонка прижала бы иконку к правому краю
// текстового блока, а inline честно едет за последним символом.
//
// Крупная строка (H2, 44px) в макете имеет `pb-[18px]`, то есть глиф стоит
// на 4px выше baseline — отсюда отрицательный сдвиг.
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
        "relative ml-2 inline-flex shrink-0 align-baseline",
        large ? "top-[-4px]" : "top-[2px]"
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
// On mobile every type stacks, so the glyph always lands just under the
// label line: 26px down (27 for the large one, whose 24px glyph sits on a
// 30px value line) — the same "+2px below the value's top" rule.
const COPY_OFFSET: Record<FieldType, string> = {
  "label-left": "mt-[26px] desktop:mt-[2px]",
  "label-line": "mt-[26px] desktop:mt-[2px]",
  "label-top": "mt-[26px] desktop:mt-[30px]",
  "large-value": "mt-[27px] desktop:mt-[33px]",
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
  const large = type === "large-value"
  // Only Label Left and Line put the label beside the value, and only from
  // `desktop:` up — Size=Mobile stacks every type (node 70240:38661).
  const sideBySide = type === "label-left" || type === "label-line"

  // Label is Medium like the Value — the two differ only in colour — and
  // steps down to 14/20 on mobile along with it.
  // `break-words` — это `[word-break:break-word]` мастера: и Label, и Value
  // там переносятся, а не обрезаются (ноды 70251:48888 и 70251:48898).
  // Заодно это чинит вторую половину дизайн-чека №31 — длинное значение
  // (например ИНН из семидесяти цифр одной строкой) больше не уезжает в
  // правый край и не перекрывает иконку копирования: сплошной «слово» без
  // пробелов теперь переносится.
  const labelRow = (
    <span className="block min-w-0 break-words text-p2-medium text-[var(--ifield-label-fg)] desktop:text-p1-medium">
      {label}
      {labelInfo && <InfoIcon content={labelInfo} />}
    </span>
  )

  const valueRow = (
    <span
      className={cn(
        // text-h2 (32/44) already bakes in weight 500, so it doesn't need
        // its own font-medium alongside the text-p1 branch that does.
        // Mobile: 22/30 for the large value, 14/20 for the rest.
        "block min-w-0 break-words",
        large ? "text-h2-mobile desktop:text-h2" : "text-p2-medium desktop:text-p1-medium",
        VALUE_COLOR[valueStatus]
      )}
    >
      {value}
      {valueInfo && <InfoIcon content={valueInfo} large={large} />}
    </span>
  )

  const subTextRow = subText && (
    <span
      className={cn(
        "text-p3-medium desktop:text-p2-medium",
        SUBTEXT_COLOR[subTextStatus]
      )}
    >
      {subText}
    </span>
  )

  return (
    <div
      data-slot="item-information-field"
      data-type={type}
      className={cn(
        "flex items-start gap-4",
        // Only Label Left is a padded, ruled row; the other three are bare
        // content the container spaces out (16px) itself.
        type === "label-left" && "border-b pt-4 pb-[15px]",
        type === "label-left" &&
          (divider ? "border-[var(--ifield-divider)]" : "border-transparent"),
        className
      )}
    >
      {/* One DOM for both breakpoints: the label is always the first child
          of this group, stacked above the value on mobile and turned into
          the left-hand column from `desktop:` up on the two side-by-side types. */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1",
          sideBySide && "desktop:flex-row desktop:items-start desktop:gap-6",
          type === "label-top" && "desktop:gap-1",
          large && "desktop:gap-0"
        )}
      >
        {/* Label box: an even share of the row, but never wider than 384px
            (Label Left) / 216px (Line) and never below 100px — widths that
            only apply once it *is* a column. */}
        <span
          className={cn(
            "min-w-0",
            sideBySide && "desktop:min-w-25 desktop:flex-1",
            type === "label-left" && "desktop:max-w-96",
            type === "label-line" && "desktop:max-w-54"
          )}
        >
          {labelRow}
        </span>
        <div
          className={cn(
            // Value and Sub Text are 4px apart on mobile (2px under the
            // large value) and flush on desktop — except Label Top, which
            // keeps 4px there too.
            "flex min-w-0 flex-col items-start gap-1",
            large && "gap-0.5 desktop:gap-0",
            sideBySide && "desktop:flex-1 desktop:gap-0",
            type === "label-top" && "desktop:gap-1"
          )}
        >
          {valueRow}
          {subTextRow}
        </div>
      </div>

      {copyable && (
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
