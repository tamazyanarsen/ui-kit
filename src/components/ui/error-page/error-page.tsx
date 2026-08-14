import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { ErrorPageIllustration } from "./illustration"

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
        // 592px, the width Figma gives this paragraph inside the 1008px text
        // column — `max-w-md` (448) wrapped it a line early.
        <p className="mt-2 max-w-[592px] text-p1-medium text-[var(--error-page-description-fg)]">
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
      {/* Дизайн-чек №28: иллюстрация целиком вынесена в `Image Error (ELK)`
          и собрана по мастеру — см. illustration.tsx. Раньше цифры
          рисовались текстом (не тем шрифтом), а «ноль» вставлялся отдельной
          мелкой картинкой. Отступ 48px — `gap-[48px]` блока Box в мастере
          (нода 39222:9051). */}
      <ErrorPageIllustration
        type={showCode ? (code as "403" | "404") : "image"}
        className="mt-12"
      />
    </div>
  )
}

export { ErrorPage }
export type { ErrorPageProps }
