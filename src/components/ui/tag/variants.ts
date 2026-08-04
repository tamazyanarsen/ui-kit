export type TagStatusColor = "green" | "orange" | "red" | "blue" | "grey"
export type TagSignColor = "black" | "white" | "grey-info"
export type TagColor = TagStatusColor | TagSignColor
export type TagVariant = "main" | "secondary"
export type TagSize = "l" | "s"

interface TagStyle {
  bg: string
  fg: string
  border?: string
}

const STATUS_COLORS: Record<TagStatusColor, { main: TagStyle; secondary: TagStyle }> = {
  green: {
    main: { bg: "var(--tag-green-bg)", fg: "var(--tag-green-fg)" },
    secondary: {
      bg: "var(--tag-green-secondary-bg)",
      fg: "var(--tag-green-bg)",
      border: "var(--tag-green-bg)",
    },
  },
  orange: {
    main: { bg: "var(--tag-orange-bg)", fg: "var(--tag-orange-fg)" },
    secondary: {
      bg: "var(--tag-orange-secondary-bg)",
      fg: "var(--tag-orange-bg)",
      border: "var(--tag-orange-bg)",
    },
  },
  red: {
    main: { bg: "var(--tag-red-bg)", fg: "var(--tag-red-fg)" },
    secondary: {
      bg: "var(--tag-red-secondary-bg)",
      fg: "var(--tag-red-bg)",
      border: "var(--tag-red-bg)",
    },
  },
  blue: {
    main: { bg: "var(--tag-blue-bg)", fg: "var(--tag-blue-fg)" },
    secondary: {
      bg: "var(--tag-blue-secondary-bg)",
      fg: "var(--tag-blue-bg)",
      border: "var(--tag-blue-bg)",
    },
  },
  // Draft/grey is the one status color whose secondary isn't a tint of
  // itself — spec shows it as a plain white chip with a grey border
  // instead, matching the other "outline" signs rather than green/orange/
  // red/blue's tinted-background pattern.
  grey: {
    main: { bg: "var(--tag-grey-bg)", fg: "var(--tag-grey-fg)" },
    secondary: {
      bg: "var(--tag-grey-secondary-bg)",
      fg: "var(--tag-grey-secondary-fg)",
      border: "var(--tag-grey-bg)",
    },
  },
}

// Sign colors (Признаки) have a single fixed look — spec shows no
// secondary/outline variant for them, unlike the status colors.
const SIGN_COLORS: Record<TagSignColor, TagStyle> = {
  black: { bg: "var(--tag-black-bg)", fg: "var(--tag-black-fg)" },
  white: { bg: "var(--tag-white-bg)", fg: "var(--tag-white-fg)", border: "var(--tag-white-border)" },
  "grey-info": { bg: "var(--tag-grey-info-bg)", fg: "var(--tag-grey-info-fg)" },
}

const SIGN_COLOR_SET = new Set<string>(["black", "white", "grey-info"])

export function isTagSignColor(color: TagColor): color is TagSignColor {
  return SIGN_COLOR_SET.has(color)
}

export function getTagStyle(color: TagColor, variant: TagVariant): TagStyle {
  if (isTagSignColor(color)) return SIGN_COLORS[color]
  return STATUS_COLORS[color][variant]
}
