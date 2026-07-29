import * as React from "react"

import { cn } from "@/lib/utils"

// Shimmer — "Скелетная загрузка": a loading placeholder used wherever a
// real component reads from the database (tables, card previews, cards
// themselves) before its data has arrived. Per the spec, each real text or
// graphic element is replaced by exactly one shimmer block sized to match —
// a multi-line text block still collapses to a single skeleton line, and a
// graphic's block must match its real size exactly. There is no separate
// component/prop for "text line" vs "avatar" vs "button placeholder" (the
// spec's own "Текст"/"Фигура" split is just usage guidance for which `shape`
// and which className sizing to reach for) — width/height are entirely
// consumer-controlled via className, same as the real content being masked.
//
// Motion is a plain opacity pulse (`animate-pulse`), not a sliding shine
// sweep — the highlight is baked into the static gradient background
// instead (see the --shimmer-* token comment in index.css) — at the spec's
// own 1.8s cycle rather than Tailwind's default 2s.
interface ShimmerProps extends React.ComponentProps<"div"> {
  shape?: "square" | "circle"
}

function Shimmer({ shape = "square", className, ...props }: ShimmerProps) {
  return (
    <div
      data-slot="shimmer"
      data-shape={shape}
      aria-hidden="true"
      className={cn(
        "h-4 w-full shrink-0 animate-pulse bg-[linear-gradient(90deg,var(--shimmer-from)_0%,var(--shimmer-via)_50%,var(--shimmer-from)_100%)] [animation-duration:1.8s]",
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    />
  )
}

export { Shimmer }
export type { ShimmerProps }
