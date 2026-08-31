import type { IconProps } from "./types"

// icon / arrow back chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowBackChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M15.707 21.71a1 1 0 0 1-1.414 0l-9-9a1.006 1.006 0 0 1 0-1.42l9-9a1 1 0 0 1 1.414 0c.391.39.391 1.03 0 1.42L7.414 12l8.293 8.29c.391.39.391 1.03 0 1.42" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.95 1.29a1 1 0 0 1 1.414 0c.39.39.39 1.03 0 1.42l-4.95 4.95 4.95 4.95c.39.39.39 1.02 0 1.41a1 1 0 0 1-1.414 0L4.293 8.36a.995.995 0 0 1 0-1.41z"/></svg>
  )
}
