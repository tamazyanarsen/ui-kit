import type { IconProps } from "./types"

// icon / target — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Target({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m11-5a5 5 0 1 0 0 10 5 5 0 0 0 0-10m-7 5a7 7 0 1 1 14 0 7 7 0 0 1-14 0m7-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2m0 .75a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5m0 2a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5m0 .75a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m0 2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1"/></svg>
  )
}
