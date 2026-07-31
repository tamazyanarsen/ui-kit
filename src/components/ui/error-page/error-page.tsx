import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import zeroMascot from "@/assets/error-page/zero-mascot.png"
import noCodeMascot from "@/assets/error-page/no-code-mascot.png"

// ErrorPage — "Страница ошибок" (403/404/etc). Design-check #18/#19/#20:
// both illustrations are real assets, extracted from the Figma export's own
// embedded raster layers (ui/error-page/*.svg's <image> nodes) rather than
// redrawn from scratch:
// - `zeroMascot` stands in for every "0" digit in `code` (the spec's own
//   403 example — "4[0]3" — replaces exactly the zero, not the whole
//   number; this generalizes to 404 for free since it also has a zero).
//   Codes with no zero at all (rare) just render as plain numerals — no
//   other digit has a bespoke illustration in the source.
// - `noCodeMascot` is a distinct illustration used when there's no error
//   code at all (confirmed against a separate anatomy example with no
//   flanking numerals), not a fallback/placeholder for the zero one.
interface ErrorPageProps {
  code?: string
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
      {code ? (
        <p className="mt-12 flex items-center text-[160px] leading-none font-bold tracking-tight text-[var(--error-page-code-fg)]">
          {[...code].map((char, i) =>
            char === "0" ? (
              <img
                key={i}
                src={zeroMascot}
                alt=""
                aria-hidden="true"
                className="h-[0.85em] w-auto"
              />
            ) : (
              <span key={i}>{char}</span>
            )
          )}
        </p>
      ) : (
        <img
          src={noCodeMascot}
          alt=""
          aria-hidden="true"
          className="mt-12 h-40 w-auto"
        />
      )}
    </div>
  )
}

export { ErrorPage }
export type { ErrorPageProps }
