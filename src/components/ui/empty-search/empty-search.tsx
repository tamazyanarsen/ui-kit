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
  icon = <CircleAlert aria-hidden="true" />,
  largeIcon = false,
  title,
  description,
  buttonLabel,
  onButtonClick,
  className,
}: EmptySearchResultsProps) {
  return (
    <div
      data-slot="empty-search-results"
      className={cn(
        "flex flex-col items-center px-10 py-16 text-center",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "mb-6 flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--empty-search-icon-bg)] text-[var(--empty-search-icon-fg)]",
            largeIcon ? "[&_svg]:size-6" : "[&_svg]:size-4"
          )}
        >
          {icon}
        </span>
      )}
      <h3 className="text-h4 text-[var(--empty-search-title-fg)]">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-p1 font-medium text-[var(--empty-search-description-fg)]">
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
