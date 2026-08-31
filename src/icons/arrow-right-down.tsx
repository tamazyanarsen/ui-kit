import type { IconProps } from "./types"

// icon / arrow  right down — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowRightDown({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.687 17a1 1 0 0 0 1 1H17a1 1 0 0 0 1-1V6.687a1 1 0 0 0-2 0v7.899L6.707 5.293a.999.999 0 1 0-1.414 1.414L14.586 16H6.687a1 1 0 0 0-1 1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M12 13a1 1 0 0 0 1-1V4.727a1.001 1.001 0 0 0-2 0v4.859L4.707 3.293a.999.999 0 1 0-1.414 1.414L9.586 11H4.727a1 1 0 0 0 0 2z"/></svg>
  )
}
