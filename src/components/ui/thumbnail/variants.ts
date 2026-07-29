export type ThumbnailSize = "l" | "m"

// "Card"-family types render a dark (or grey-when-disabled) square with a
// payment-system mark; the icon-status types render a light tinted square
// with a lucide glyph. "picture" is a custom illustration/fallback.
export type ThumbnailType =
  | "more"
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

export const CARD_TYPES = new Set<ThumbnailType>([
  "more",
  "card",
  "sticker",
  "sbp-card",
  "sbp-card-account",
])

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
