import type { IconProps } from "./types"

// icon / SBP color — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SbpColor({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#5b57a2" d="m3 5.79 2.665 4.76v2.91l-2.662 4.75z"/><path fill="#d90751" d="m13.229 8.82 2.498-1.53 5.109-.01-7.607 4.66z"/><path fill="#fab718" d="m13.215 5.76.014 6.31-2.67-1.65V1z"/><path fill="#ed6f26" d="m20.836 7.28-5.11.01-2.511-1.53L10.559 1z"/><path fill="#63b22f" d="M13.229 18.23v-3.05l-2.67-1.61.001 9.43z"/><path fill="#1487c9" d="M15.72 16.72 5.665 10.55 3 5.79l17.824 10.92z"/><path fill="#017f36" d="m10.56 23 2.669-4.77 2.491-1.51 5.104-.01z"/><path fill="#984995" d="m3.003 18.21 7.578-4.64L8.033 12l-2.368 1.46z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#5b57a2" d="m2 3.86 1.776 3.17v1.94l-1.774 3.17z"/><path fill="#d90751" d="m8.82 5.88 1.664-1.02h3.407L8.82 7.96z"/><path fill="#fab718" d="m8.81 3.84.01 4.2-1.781-1.09V.67z"/><path fill="#ed6f26" d="M13.891 4.86h-3.407L8.81 3.84 7.039.67z"/><path fill="#63b22f" d="M8.82 12.16v-2.04L7.039 9.04l.001 6.29z"/><path fill="#1487c9" d="M10.48 11.15 3.776 7.03 2 3.86l11.883 7.28z"/><path fill="#017f36" d="m7.04 15.33 1.78-3.17 1.66-1.01 3.403-.01z"/><path fill="#984995" d="m2.002 12.14 5.052-3.1L5.355 8l-1.579.97z"/></svg>
  )
}
