import type { IconProps } from "./types"

// icon / mark — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Mark({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.334 8C13.334 10.946 10.946 13.333 8 13.333C5.055 13.333 2.667 10.946 2.667 8C2.667 5.055 5.055 2.667 8 2.667C10.946 2.667 13.334 5.055 13.334 8Z" fill="currentColor" />
    </svg>
  )
}
