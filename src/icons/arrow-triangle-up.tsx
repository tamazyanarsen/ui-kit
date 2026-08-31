import type { IconProps } from "./types"

// icon / arrow triangle up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowTriangleUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.208 7.029a1 1 0 0 1 1.585 0l5.762 7.486a1 1 0 0 1-.792 1.61H6.238a1 1 0 0 1-.793-1.61z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.208 5.029a1 1 0 0 1 1.584 0l3.165 4.111a1 1 0 0 1-.793 1.61H4.836a1 1 0 0 1-.793-1.61z"/></svg>
  )
}
