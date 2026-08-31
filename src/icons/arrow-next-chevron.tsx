import type { IconProps } from "./types"

// icon / arrow next chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowNextChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.293 2.29a1 1 0 0 1 1.414 0l9 9c.391.39.391 1.03 0 1.42l-9 9a1 1 0 0 1-1.414 0 1.006 1.006 0 0 1 0-1.42L16.586 12 8.293 3.71a1.006 1.006 0 0 1 0-1.42" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6.707 1.29a1 1 0 0 0-1.414 0 1.006 1.006 0 0 0 0 1.42l4.95 4.95-4.95 4.95a.995.995 0 0 0 0 1.41 1 1 0 0 0 1.414 0l5.657-5.66a.996.996 0 0 0 0-1.41z"/></svg>
  )
}
