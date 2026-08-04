import * as React from "react"
import { CircleCheck, Clock, FileText } from "@/icons"

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
  status: "success" | "attention"
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

interface EventProps {
  type?: "text" | "tag"
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
  return (
    <div data-slot="event" className={cn("flex gap-2", className)}>
      <div className="flex w-2 shrink-0 flex-col items-center">
        <span
          aria-hidden="true"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--event-connector)]"
        />
        {showConnector && (
          <span
            aria-hidden="true"
            className="mt-1 w-px flex-1 bg-[var(--event-connector)]"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            {type === "tag" ? (
              <Tag color={STATUS_TAG_COLOR[status]} size="s">
                {title}
              </Tag>
            ) : (
              <span className="text-p1 font-medium text-[var(--event-title-fg)]">
                {title}
              </span>
            )}
            {timestamp && (
              <span className="shrink-0 text-p2 font-medium text-[var(--event-meta-fg)]">
                {timestamp}
              </span>
            )}
          </div>

          {author && (
            <p className="text-p1 font-medium text-[var(--event-author-fg)]">
              {author}
            </p>
          )}
        </div>

        {signatories && signatories.length > 0 && (
          <div className="flex flex-col gap-2">
            {signatories.map((signatory, index) => {
              const Icon = signatory.status === "success" ? CircleCheck : Clock
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-p1 font-medium"
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

        {info && info.length > 0 && (
          <div className="flex flex-col gap-1 text-p1 font-medium">
            {info.map((row, index) => (
              <p key={index}>
                <span className="text-[var(--event-meta-fg)]">
                  {row.label}
                </span>{" "}
                <span className="text-[var(--event-title-fg)]">
                  {row.value}
                </span>
              </p>
            ))}
          </div>
        )}

        {comment && (
          <div className="text-p1 font-medium">
            <p className="text-[var(--event-meta-fg)]">{commentLabel}</p>
            <p className="text-[var(--event-title-fg)]">{comment}</p>
          </div>
        )}

        {documents && documents.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-p1 font-medium text-[var(--event-meta-fg)]">
              Приложенные документы:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {documents.map((doc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={doc.onClick}
                  className="flex items-center gap-4 rounded-[8px] p-1 text-left outline-none"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--event-file-bg)]">
                    <FileText
                      aria-hidden="true"
                      className="size-6 text-[var(--event-title-fg)]"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-p1 font-medium text-[var(--event-title-fg)]">
                      {doc.name}
                    </span>
                    <span className="truncate text-p3 font-medium text-[var(--event-meta-fg)]">
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
export type { EventProps, EventSignatory, EventInfoRow, EventDocument }
