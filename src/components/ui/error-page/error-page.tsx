import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ErrorPage — "Страница ошибок" (403/404/etc). The spec's illustration is a
// bespoke 3D mascot standing in for the middle digit (e.g. a headphone-
// shaped "0" in "403") — this is a spec-verification demo kit, not a place
// to vendor exact brand illustration work (same call as PaymentLogo/
// GosuslugiLogo elsewhere in this kit), so `code` renders as plain flat
// numerals instead of attempting to recreate the artwork.
interface ErrorPageProps {
  code?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  className?: string
}

function ErrorPage({
  code,
  title,
  description,
  buttonLabel,
  onButtonClick,
  className,
}: ErrorPageProps) {
  return (
    <div
      data-slot="error-page"
      className={cn(
        "flex flex-col items-center px-6 pt-10 pb-12 text-center",
        className
      )}
    >
      <h1 className="text-2xl font-semibold text-[var(--error-page-title-fg)]">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--error-page-description-fg)]">
          {description}
        </p>
      )}
      {buttonLabel && (
        <Button
          type="button"
          variant="primary"
          onClick={onButtonClick}
          className="mt-8"
        >
          {buttonLabel}
        </Button>
      )}
      {code && (
        <p className="mt-12 text-[160px] leading-none font-bold tracking-tight text-[var(--error-page-code-fg)]">
          {code}
        </p>
      )}
    </div>
  )
}

export { ErrorPage }
export type { ErrorPageProps }
