import * as React from "react"
import { CircleAlert } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// EmptySearchResults — "Пустая поисковая выдача": a centered info block for
// "nothing found" states. Per spec it's not search-specific in practice
// ("Блок может использоваться без иконки и/или без дополнительного
// текста") — icon/description/button are all independently optional, so
// this doubles as a generic empty-state block.
interface EmptySearchResultsProps {
  icon?: React.ReactNode
  largeIcon?: boolean
  title: React.ReactNode
  description?: React.ReactNode
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  className?: string
}

function EmptySearchResults({
  icon,
  largeIcon = false,
  title,
  description,
  buttonLabel,
  onButtonClick,
  className,
}: EmptySearchResultsProps) {
  // Figma's Size Icon (ELK) has both forms (node 4109:25427/25428): the
  // large one puts `icon / alert` at 24px in the 48px tile, the small one at
  // 16px. The drawings differ, so the default icon follows `largeIcon`
  // rather than being fixed at one size.
  const resolvedIcon =
    icon === undefined ? (
      <CircleAlert size={largeIcon ? 24 : 16} aria-hidden="true" />
    ) : (
      icon
    )

  return (
    <div
      data-slot="empty-search-results"
      className={cn(
        "flex flex-col items-center px-10 py-16 text-center",
        className
      )}
    >
      {resolvedIcon && (
        <span
          className={cn(
            "mb-6 flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--empty-search-icon-bg)] text-[var(--empty-search-icon-fg)]",
            largeIcon ? "[&_svg]:size-6" : "[&_svg]:size-4"
          )}
        >
          {resolvedIcon}
        </span>
      )}
      <h3 className="text-h4 text-[var(--empty-search-title-fg)]">
        {title}
      </h3>
      {description && (
        // Full width of the block (the master's Text column is `w-full`
        // inside the 680px card), not capped at 384px — the cap made long
        // descriptions wrap two lines earlier than the spec.
        <p className="mt-1 w-full text-p1-medium text-[var(--empty-search-description-fg)]">
          {description}
        </p>
      )}
      {buttonLabel && (
        <Button
          type="button"
          variant="secondary-grey"
          size="sm"
          className="mt-6"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptySearchResults }
export type { EmptySearchResultsProps }
