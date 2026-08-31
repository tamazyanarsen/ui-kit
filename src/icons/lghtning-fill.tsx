import type { IconProps } from "./types"

// icon / Lghtning Fill — 10. Fav Like, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function LghtningFill({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.914 4.571a.625.625 0 0 1 .323.679l-.892 4.385 3.496 1.287a.626.626 0 0 1 .237 1.017l-7 7.367a.625.625 0 0 1-1.065-.556l.893-4.385-3.497-1.287a.626.626 0 0 1-.237-1.017l7-7.367a.625.625 0 0 1 .742-.123"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.276 3.047a.42.42 0 0 1 .216.453l-.596 2.923 2.331.859a.414.414 0 0 1 .158.678l-4.666 4.91a.417.417 0 0 1-.711-.37l.596-2.923-2.331-.859a.414.414 0 0 1-.158-.678l4.666-4.91a.42.42 0 0 1 .495-.083"/></svg>
  )
}
