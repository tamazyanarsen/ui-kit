import type * as React from "react"

// Simplified approximation of the Госуслуги (ESIA) flag mark used by the
// "Secondary Logo" button variants — same call as PaymentLogo in
// ui/thumbnail: this is a spec-verification demo kit, not a place to vendor
// exact government brand artwork, so it's a small geometric stand-in (five
// colored wedges fanned into an arrow) rather than a literal trace. Colors
// pixel-sampled from ui/button/button.png's own Secondary Logo swatches.
function GosuslugiLogo({
  "data-icon": dataIcon,
  // Accepted and ignored so Button can pass `size` uniformly to whatever
  // glyph it renders — this stand-in has a single drawing.
  size: _size,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  "data-icon"?: string
  size?: 16 | 24
}) {
  return (
    <svg viewBox="0 0 16 16" fill="none" data-icon={dataIcon} {...props}>
      <path d="M3 8 L3 1 L9 3 Z" fill="#ED6F26" />
      <path d="M3 8 L9 3 L14 7 Z" fill="#D90751" />
      <path d="M3 8 L14 7 L14 9 Z" fill="#1487C9" />
      <path d="M3 8 L14 9 L9 13 Z" fill="#5B57A2" />
      <path d="M3 8 L9 13 L3 15 Z" fill="#017F36" />
    </svg>
  )
}

export { GosuslugiLogo }
