import type { IconProps } from "./types"

// icon / more — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function More({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M6 12C6 13.105 5.105 14 4 14C2.895 14 2 13.105 2 12C2 10.895 2.895 10 4 10C5.105 10 6 10.895 6 12Z" fill="currentColor" /> <path d="M14 12C14 13.105 13.105 14 12 14C10.895 14 10 13.105 10 12C10 10.895 10.895 10 12 10C13.105 10 14 10.895 14 12Z" fill="currentColor" /> <path d="M22 12C22 13.105 21.105 14 20 14C18.895 14 18 13.105 18 12C18 10.895 18.895 10 20 10C21.105 10 22 10.895 22 12Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 8C4 8.828 3.328 9.5 2.5 9.5C1.672 9.5 1 8.828 1 8C1 7.172 1.672 6.5 2.5 6.5C3.328 6.5 4 7.172 4 8Z" fill="currentColor" /> <path d="M9.5 8C9.5 8.828 8.828 9.5 8 9.5C7.172 9.5 6.5 8.828 6.5 8C6.5 7.172 7.172 6.5 8 6.5C8.828 6.5 9.5 7.172 9.5 8Z" fill="currentColor" /> <path d="M15 8C15 8.828 14.328 9.5 13.5 9.5C12.672 9.5 12 8.828 12 8C12 7.172 12.672 6.5 13.5 6.5C14.328 6.5 15 7.172 15 8Z" fill="currentColor" />
    </svg>
  )
}
