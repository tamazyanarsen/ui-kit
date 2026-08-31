import type { IconProps } from "./types"

// icon / arrow down small — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowDownSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M18.713 8.29a.997.997 0 0 1 0 1.4l-5.915 5.98a1.13 1.13 0 0 1-1.596 0L5.287 9.69a.997.997 0 0 1 0-1.4.964.964 0 0 1 1.383 0L12 13.68l5.33-5.39a.964.964 0 0 1 1.383 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.071 5.29a1 1 0 0 1 1.414 0c.391.39.391 1.03 0 1.42L8.596 10.6a1 1 0 0 1-1.414 0L3.293 6.71a1.006 1.006 0 0 1 0-1.42 1 1 0 0 1 1.414 0l3.182 3.18z"/></svg>
  )
}
