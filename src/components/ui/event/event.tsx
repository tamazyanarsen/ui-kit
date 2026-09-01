import * as React from "react"
import { CircleCheck, CircleX, Clock, FileIcon } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"

import { SIGNATORY_STATUS_COLOR, STATUS_TAG_COLOR, type EventStatus } from "./variants"

// Event — "Событие": one row of a document/status change history timeline
// (rendered inside the existing `Modal` as a list per the spec's own
// usage note — this component is just the row). Fixes a single user
// action or document move *within* one status, without changing the
// overall stage. `type="tag"` renders the title as a colored status pill
// (ЕЛК-only per the spec — status history logic doesn't apply to other
// products); `type="text"` is the plain default. Every section below the
// title (author, signatories, info, comment, documents, button) is
// optional and simply omits when its data isn't given — same pattern as
// Card/Banner's "Show X" toggles.
interface EventSignatory {
  /**
   * Свойство `Type` вложенного `Signatories (ELK)`: Done — подписано,
   * Partial — ждёт подписи, Cancel — отказ.
   *
   * Дизайн-чек Storybook (Аня Багрова) №31: третьего значения в коде не
   * было вовсе, из панели его было не достать.
   */
  status: "success" | "attention" | "error"
  name: React.ReactNode
  // Design-check #21: the spec's own signer example carries a second,
  // lighter-colored attribute after the name (e.g. "Петров П.П. — Первая
  // подпись") — was baked into one plain `text` node with no way to give it
  // a different color from the name.
  attribute?: React.ReactNode
}

interface EventInfoRow {
  label: React.ReactNode
  value: React.ReactNode
}

interface EventDocument {
  name: React.ReactNode
  meta: React.ReactNode
  onClick?: () => void
}

/**
 * Свойство `Type` вложенного `Step Event (ELK)` — где строка стоит в
 * цепочке: First (только линия вниз), Middle (линии вверх и вниз), End
 * (только линия вверх).
 */
type EventStepType = "first" | "middle" | "end"

interface EventProps {
  type?: "text" | "tag"
  stepType?: EventStepType
  title: React.ReactNode
  status?: EventStatus
  timestamp?: React.ReactNode
  author?: React.ReactNode
  signatories?: EventSignatory[]
  info?: EventInfoRow[]
  commentLabel?: React.ReactNode
  comment?: React.ReactNode
  documents?: EventDocument[]
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  showConnector?: boolean
  className?: string
}

function Event({
  type = "text",
  stepType,
  title,
  status = "attention",
  timestamp,
  author,
  signatories,
  info,
  commentLabel = "Комментарий:",
  comment,
  documents,
  buttonLabel,
  onButtonClick,
  showConnector = true,
  className,
}: EventProps) {
  // `stepType` — свойство макета, `showConnector` — прежний булев проп той же
  // оси. Задан явный тип шага — он и решает.
  const step: EventStepType = stepType ?? (showConnector ? "first" : "end")
  const lineAbove = step !== "first"
  const lineBelow = step !== "end"

  return (
    <div data-slot="event" data-step={step} className={cn("flex gap-2", className)}>
      <div className="flex w-2 shrink-0 flex-col items-center">
        {lineAbove && (
          <span
            aria-hidden="true"
            className="h-2 w-px shrink-0 rounded-b-[4px] bg-[var(--event-connector)]"
          />
        )}
        <span
          aria-hidden="true"
          // The dot sits 8px down (a 3px connector stub plus the column's own
          // 5px gap in "Step Event (ELK)"), and the stripe below it starts
          // another 5px lower with a 4px rounded top.
          className={cn(
            "size-2 shrink-0 rounded-full bg-[var(--event-connector)]",
            lineAbove ? "mt-[5px]" : "mt-2"
          )}
        />
        {lineBelow && (
          <span
            aria-hidden="true"
            className="mt-[5px] w-px flex-1 rounded-t-[4px] bg-[var(--event-connector)]"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            {/* Дизайн-чек №29: тег здесь desktop-размера (22px), а не
                mobile-огрызок. В мастере `Head Event (ELK)`, вариант
                `Type=Status` (нода 40503:42354) инстанс `ELK / tag`
                замеряется как min/max-h 22px с текстом P2 Medium 14/20 —
                это ровно Size=Desktop. Раньше это форсировалось пропом
                `size="l"`; после дизайн-чека №3 №1 размера как пропа нет,
                и тег берёт форму из общего скоупа вместе с самим Event. */}
            {type === "tag" ? (
              <Tag color={STATUS_TAG_COLOR[status]}>
                {title}
              </Tag>
            ) : (
              <span className="text-p1-medium text-[var(--event-title-fg)]">
                {title}
              </span>
            )}
            {timestamp && (
              <span className="shrink-0 text-p2-medium text-[var(--event-meta-fg)]">
                {timestamp}
              </span>
            )}
          </div>

          {author && (
            <p className="text-p1-medium text-[var(--event-author-fg)]">
              {author}
            </p>
          )}
        </div>

        {signatories && signatories.length > 0 && (
          <div className="flex flex-col gap-2">
            {signatories.map((signatory, index) => {
              const Icon =
                signatory.status === "success"
                  ? CircleCheck
                  : signatory.status === "error"
                    ? CircleX
                    : Clock
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-p1-medium"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    style={{ color: SIGNATORY_STATUS_COLOR[signatory.status] }}
                  />
                  <span className="text-[var(--event-title-fg)]">
                    {signatory.name}
                    {signatory.attribute && (
                      <span className="text-[var(--event-meta-fg)]">
                        {" "}
                        — {signatory.attribute}
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Each Information row is a two-column flex in the master
            (`I-1`/`I-2`/`I-3`: `flex gap-[4px] items-start`, label
            `shrink-0 whitespace-nowrap`, value `flex-[1_0_0]`), not one
            inline paragraph — so a value long enough to wrap keeps its own
            column instead of running back under the label. */}
        {info && info.length > 0 && (
          <div className="flex flex-col gap-1 text-p1-medium">
            {info.map((row, index) => (
              <div key={index} className="flex items-start gap-1">
                <span className="shrink-0 whitespace-nowrap text-[var(--event-meta-fg)]">
                  {row.label}
                </span>
                <span className="min-w-0 flex-1 text-[var(--event-title-fg)]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {comment && (
          <div className="text-p1-medium">
            <p className="text-[var(--event-meta-fg)]">{commentLabel}</p>
            <p className="text-[var(--event-title-fg)]">{comment}</p>
          </div>
        )}

        {documents && documents.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-p1-medium text-[var(--event-meta-fg)]">
              Приложенные документы:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {documents.map((doc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={doc.onClick}
                  // `pr-4`, not `p-1`: the master's `ELK / files` row is
                  // `gap-[16px] items-center pr-[16px]` with no padding on
                  // the other three sides, so the 48px tile lines up with
                  // the "Приложенные документы:" label above it — a uniform
                  // 4px inset pushed it out of that column.
                  className="flex items-center gap-4 overflow-hidden rounded-[8px] pr-4 text-left outline-none"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--event-file-bg)]">
                    {/* Figma nests the same `ELK / files` row here as File
                        Upload does, so the tile holds `icon / document` at
                        24px (node I40573:14011;40513:71361;16029:61127) —
                        not the FileText glyph this used before. */}
                    <FileIcon
                      size={24}
                      aria-hidden="true"
                      className="size-6 text-[var(--event-title-fg)]"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-p1-medium text-[var(--event-title-fg)]">
                      {doc.name}
                    </span>
                    <span className="truncate text-p3-medium text-[var(--event-meta-fg)]">
                      {doc.meta}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {buttonLabel && (
          <div className="pt-1">
            <Button
              type="button"
              variant="secondary-grey"
              size="sm"
              onClick={onButtonClick}
              className="self-start"
            >
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { Event }
export type { EventStepType, EventProps, EventSignatory, EventInfoRow, EventDocument }
