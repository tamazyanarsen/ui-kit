import type { IconProps } from "./types"

// icon / arrow up small — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowUpSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.287 15.71a.997.997 0 0 1 0-1.4l5.915-5.98a1.13 1.13 0 0 1 1.596 0l5.915 5.98a.997.997 0 0 1 0 1.4.964.964 0 0 1-1.383 0L12 10.32l-5.33 5.39a.964.964 0 0 1-1.383 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.889 5c.265 0 .52.11.708.29l3.888 3.89c.391.39.391 1.03 0 1.42a1 1 0 0 1-1.414 0L7.889 7.41 4.707 10.6a1 1 0 0 1-1.414 0 1.006 1.006 0 0 1 0-1.42l3.889-3.89c.187-.18.442-.29.707-.29"/></svg>
  )
}
