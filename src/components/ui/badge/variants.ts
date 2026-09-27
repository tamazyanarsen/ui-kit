export type BadgeColor = "red" | "contra-red" | "dark-grey" | "light-grey" | "black"
export type BadgeType = "counter" | "point"

interface BadgeColorStyle {
  bg: string
  fg: string
  border?: string
}

// Палитра по цветам для невыключенного состояния. «contra-red» — это
// буквально красный плюс белая рамка, чтобы положить значок на поверхность
// того же цвета (или на насыщенную), где он иначе слился бы, а не другая
// заливка.
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

// Выключенное состояние сводит все цвета к одному приглушённому серому,
// кроме светло-серого (он и так самый бледный), который просто уходит на
// ступень ниже, — в точности как в колонке Disabled макета.
export function disabledBadgeStyle(color: BadgeColor): BadgeColorStyle {
  if (color === "light-grey") {
    return {
      bg: "var(--badge-disabled-light-grey-bg)",
      fg: "var(--badge-disabled-light-grey-fg)",
    }
  }
  return { bg: "var(--badge-disabled-bg)", fg: "var(--badge-disabled-fg)" }
}

// От 1 до 99 без изменений, от 100 — как «99+», по точному правилу макета.
export function formatBadgeCount(value: number): string {
  if (value > 99) return "99+"
  return String(Math.max(0, Math.trunc(value)))
}
