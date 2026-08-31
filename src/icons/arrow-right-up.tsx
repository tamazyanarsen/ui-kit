import type { IconProps } from "./types"

// icon / arrow right up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowRightUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.687 6a1 1 0 0 1 1-1H17a1 1 0 0 1 1 1v10.313a1 1 0 0 1-2 0V8.414l-9.293 9.293a.999.999 0 1 1-1.414-1.414L14.586 7H6.687a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M12 3a1 1 0 0 1 1 1v7.272a1 1 0 1 1-2 0V6.414l-6.293 6.293a.999.999 0 1 1-1.414-1.414L9.586 5H4.727a1 1 0 0 1 0-2z"/></svg>
  )
}
