import type { IconProps } from "./types"

// icon / arrow left up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowLeftUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M17.313 6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v10.312a1 1 0 1 0 2 0V8.414l9.293 9.293a.999.999 0 1 0 1.414-1.414L8.414 7h7.899a1 1 0 0 0 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M4 3a1 1 0 0 0-1 1v7.273a1.001 1.001 0 0 0 2 0V6.414l6.293 6.293a.999.999 0 1 0 1.414-1.414L6.414 5h4.859a1 1 0 0 0 0-2z"/></svg>
  )
}
