export type ThumbnailSize = "l" | "m"

// "Card"-family types (card/sticker/picture) render a dark square with a
// payment-system mark or image, dimmed via opacity when disabled (confirmed
// against Figma's own Disabled samples — it's a flat opacity-50 on the whole
// tile, not a background-color swap). SBP types render that same dark tile
// but as an absolutely-positioned inner layer instead of an outer fill, so
// "sbp-card-account" can show a thin gap beneath it (its "peeking second
// card" effect). "more" is its own light-grey tile with a dark glyph — it
// is NOT part of the dark card family despite reusing a lucide "more" icon.
// The icon-status types render a light tinted square with a lucide glyph.
export type ThumbnailType =
  | "icon"
  | "card"
  | "sticker"
  | "sbp-card"
  | "sbp-card-account"
  | "picture"
  | "check"
  | "question"
  | "clock"
  | "alert"
  | "alert-red"

export type PaymentSystem = "mir" | "mastercard" | "unionpay" | "visa"

export const CARD_TYPES = new Set<ThumbnailType>(["card", "sticker", "picture"])

export const SBP_TYPES = new Set<ThumbnailType>(["sbp-card", "sbp-card-account"])

// Icon-status tints reuse Tag's secondary-color tokens (same "12% over
// white" tint family) and Informer's icon colors — confirmed by pixel
// sampling ui/thumbnail/thumbnail@2x-1.png's Check icon against
// --informer-icon-green, which matched within anti-aliasing noise.
export const ICON_STATUS_STYLE: Record<
  "check" | "question" | "clock" | "alert" | "alert-red",
  { bg: string; fg: string }
> = {
  check: { bg: "var(--tag-green-secondary-bg)", fg: "var(--informer-icon-green)" },
  question: { bg: "var(--tag-orange-secondary-bg)", fg: "var(--informer-icon-yellow)" },
  clock: { bg: "var(--tag-orange-secondary-bg)", fg: "var(--informer-icon-yellow)" },
  alert: { bg: "var(--tag-orange-secondary-bg)", fg: "var(--informer-icon-yellow)" },
  "alert-red": { bg: "var(--tag-red-secondary-bg)", fg: "var(--informer-icon-red)" },
}

export function isIconStatusType(
  type: ThumbnailType
): type is "check" | "question" | "clock" | "alert" | "alert-red" {
  return type in ICON_STATUS_STYLE
}
