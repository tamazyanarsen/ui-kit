import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import zeroMascot from "@/assets/error-page/zero-mascot.png"
import noCodeMascot from "@/assets/error-page/no-code-mascot.png"

// ErrorPage — "Страница ошибок" (403/404/etc). Design-check #18/#19/#20:
// both illustrations are real assets, extracted from the Figma export's own
// embedded raster layers (ui/error-page/*.svg's <image> nodes) rather than
// redrawn from scratch. The Figma component's own "Type" property only
// enumerates three values — 403, 404, Image (generic) — and its usage
// documentation confirms every other error (500, maintenance, etc.) uses
// the generic illustration with no numeral shown at all, not a composed
// digit string. So the big numeral render is intentionally restricted to
// exactly those two codes:
// - `zeroMascot` stands in for the "0" in "403"/"404" (the spec's own
//   composed-digit examples), the other digit ("4"/"3") is bespoke vector
//   art in the source too, but per above that art only exists for these
//   two codes — there's no general digit typeface to fall back to for
//   other numbers, so any other `code` value (including plain numeric
//   strings like "500") falls back to `noCodeMascot` instead of attempting
//   to render numerals.
// - `noCodeMascot` is a distinct illustration used whenever there's no
//   403/404 code (confirmed against a separate anatomy example with no
//   flanking numerals), not a fallback/placeholder for the zero one.
interface ErrorPageProps {
  code?: string
  title?: React.ReactNode
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
  const showCode = code === "403" || code === "404"
  return (
    <div
      data-slot="error-page"
      className={cn(
        "flex flex-col items-center rounded-[8px] bg-[var(--error-page-bg)] px-6 pt-10 pb-10 text-center",
        className
      )}
    >
      {title && (
        <h1 className="text-h2 text-[var(--error-page-title-fg)]">
          {title}
        </h1>
      )}
      {description && (
        <p className="mt-2 max-w-md text-p1 font-medium text-[var(--error-page-description-fg)]">
          {description}
        </p>
      )}
      {buttonLabel && (
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onButtonClick}
          className="mt-8"
        >
          {buttonLabel}
        </Button>
      )}
      {code && showCode ? (
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
