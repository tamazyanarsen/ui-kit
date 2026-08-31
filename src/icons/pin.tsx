import type { IconProps } from "./types"

// icon / pin — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pin({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12m0-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8 14.667s5.334-4.667 5.334-8a5.334 5.334 0 1 0-10.667 0c0 3.333 5.333 8 5.333 8m0-5.334a2.666 2.666 0 1 0 .002-5.332A2.666 2.666 0 0 0 8 9.333" clipRule="evenodd"/></svg>
  )
}
