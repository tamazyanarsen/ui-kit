export type BadgeColor = "red" | "contra-red" | "dark-grey" | "light-grey" | "black"
export type BadgeType = "counter" | "point"

interface BadgeColorStyle {
  bg: string
  fg: string
  border?: string
}

// Non-disabled palette per color. "contra-red" is literally Red plus a
// white border — for laying the badge over a same-color (or busy) surface
// where it'd otherwise blend in — not a different fill.
export const BADGE_COLORS: Record<BadgeColor, BadgeColorStyle> = {
  red: { bg: "var(--badge-red-bg)", fg: "var(--badge-red-fg)" },
  "contra-red": {
    bg: "var(--badge-red-bg)",
    fg: "var(--badge-red-fg)",
    border: "var(--badge-contra-red-border)",
  },
  "dark-grey": { bg: "var(--badge-dark-grey-bg)", fg: "var(--badge-dark-grey-fg)" },
  "light-grey": { bg: "var(--badge-light-grey-bg)", fg: "var(--badge-light-grey-fg)" },
  black: { bg: "var(--badge-black-bg)", fg: "var(--badge-black-fg)" },
}

// Disabled collapses every color to one muted grey, except light-grey
// (already the palest option) which just steps down one shade — matches
// the spec's own Disabled column exactly.
export function disabledBadgeStyle(color: BadgeColor): BadgeColorStyle {
  if (color === "light-grey") {
    return {
      bg: "var(--badge-disabled-light-grey-bg)",
      fg: "var(--badge-disabled-light-grey-fg)",
    }
  }
  return { bg: "var(--badge-disabled-bg)", fg: "var(--badge-disabled-fg)" }
}

// 1–99 unchanged, 100+ shown as "99+" — per the spec's exact rule.
export function formatBadgeCount(value: number): string {
  if (value > 99) return "99+"
  return String(Math.max(0, Math.trunc(value)))
}
