import type { IconProps } from "./types"

// icon / arrow triangle down — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowTriangleDown({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.793 16.971a1 1 0 0 1-1.585 0L5.445 9.485a1 1 0 0 1 .793-1.61h11.525a1 1 0 0 1 .792 1.61z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8.793 10.971a1 1 0 0 1-1.585 0L4.043 6.86a1 1 0 0 1 .793-1.61h6.329a1 1 0 0 1 .792 1.61z"/></svg>
  )
}
