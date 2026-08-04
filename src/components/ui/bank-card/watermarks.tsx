import { cn } from "@/lib/utils"

import type { BankCardSkin } from "./variants"

// The "ДОМ.РФ" building glyph — traced from the same mark used whole (navy
// square + white glyph) in Header's DomRfLogo; here it's just the white
// glyph on its own, tinted/opacity'd as a background watermark instead.
function BuildingMark({ className }: { className?: string }) {
  return (
    <svg viewBox="7 6 19 21" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.6391 25.1162H8.09418V26.2646H7.0014V20.5186H14.6391V25.1162ZM25.5453 25.1162H21.1821V26.2646H20.0893V25.1162H15.725V20.5186H25.5453V25.1162ZM8.08051 23.9668H13.5336V21.668H8.08051V23.9668ZM16.8149 23.9668H20.0893V21.668H16.8149V23.9668ZM21.1821 23.9668H24.4526V21.668H21.1821V23.9668ZM25.5414 18.1484V19.2979H6.99457V18.1484H25.5414ZM11.3647 17.0322H7.0014V9.56348L9.71625 6.67871L9.71332 6.67578H11.3647V17.0322ZM16.811 17.0234H12.4477V6.67969H16.811V17.0234ZM22.2543 8.4082L23.893 6.67969H25.5287V17.0234H24.436V7.8291L22.2543 10.127V17.0234H21.1655V7.8291L18.9799 10.127V17.0234H17.8911V9.55078L20.6186 6.67969H22.2543V8.4082ZM13.5366 15.874H15.7192V7.8252H13.5366V15.874ZM8.08051 10.127V15.873H10.2631V7.8252L8.08051 10.127Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Sticker's own anatomy has no building glyph — it shows a phone-shaped
// outline with a small NFC sticker cut-out, standing in for "pay by sticker
// on your phone" rather than a physical card.
function StickerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="4" width="14" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect
        x="12.5"
        y="11.5"
        width="7"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
    </svg>
  )
}

function CloudMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.5 24C6.46 24 4 21.54 4 18.5C4 15.68 6.11 13.36 8.83 13.04C9.6 10.15 12.23 8 15.36 8C18.86 8 21.75 10.66 22.1 14.06C24.36 14.53 26.06 16.53 26.06 18.93C26.06 21.68 23.83 23.91 21.08 23.91H9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const WATERMARK_COMPONENT = {
  building: BuildingMark,
  sticker: StickerMark,
  cloud: CloudMark,
} as const

// Positioned/sized per skin type: the building glyph is large and
// right-aligned (matches the reference grid), the sticker/cloud marks are
// smaller badges tucked in the bottom-right corner instead.
function Watermark({ skin, type }: { skin: BankCardSkin; type: "building" | "sticker" | "cloud" }) {
  const Glyph = WATERMARK_COMPONENT[type]

  if (type === "building") {
    return (
      <Glyph
        className={cn(
          "pointer-events-none absolute top-1/2 right-3 h-[92px] w-[70px] -translate-y-1/2",
          skin === "metal" || skin === "grey" ? "text-black/15" : "text-white/25"
        )}
      />
    )
  }

  return (
    <Glyph className="pointer-events-none absolute right-4 bottom-4 size-6 text-white/60" />
  )
}

export { Watermark }
