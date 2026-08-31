import type { IconProps } from "./types"

// icon / arrow up chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowUpChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.293 15.71a1.006 1.006 0 0 1 0-1.42l9-9a1 1 0 0 1 1.414 0l9 9c.391.39.391 1.03 0 1.42a1 1 0 0 1-1.414 0L12 7.41l-8.293 8.3a1 1 0 0 1-1.414 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.368 3.91a.997.997 0 0 1 1.339.07l5.657 5.66c.39.39.39 1.02 0 1.41a1 1 0 0 1-1.414 0L7.999 6.1 3.05 11.05a1 1 0 0 1-1.414 0 .996.996 0 0 1 0-1.41l5.657-5.66z"/></svg>
  )
}
