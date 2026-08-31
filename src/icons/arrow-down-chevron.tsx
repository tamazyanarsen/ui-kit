import type { IconProps } from "./types"

// icon / arrow down chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowDownChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M21.707 8.29c.391.39.391 1.03 0 1.42l-9 9a1 1 0 0 1-1.414 0l-9-9a1.006 1.006 0 0 1 0-1.42 1 1 0 0 1 1.414 0L12 16.59l8.293-8.3a1 1 0 0 1 1.414 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.95 4.95a1 1 0 0 1 1.414 0c.39.39.39 1.02 0 1.41l-5.657 5.66a1 1 0 0 1-1.414 0L1.636 6.36a.996.996 0 0 1 0-1.41 1 1 0 0 1 1.414 0L7.999 9.9z"/></svg>
  )
}
