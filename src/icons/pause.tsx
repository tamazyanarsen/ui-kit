import type { IconProps } from "./types"

// icon / pause — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pause({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M9 21C8.448 21 8 20.55 8 20L8 4C8 3.45 8.448 3 9 3C9.552 3 10 3.45 10 4L10 20C10 20.55 9.552 21 9 21ZM15 21C14.448 21 14 20.55 14 20L14 4C14 3.45 14.448 3 15 3C15.552 3 16 3.45 16 4L16 20C16 20.55 15.552 21 15 21Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 3C10 2.45 10.448 2 11 2C11.552 2 12 2.45 12 3V13C12 13.55 11.552 14 11 14C10.448 14 10 13.55 10 13V3Z" fill="currentColor" /> <path d="M4 3C4 2.45 4.448 2 5 2C5.552 2 6 2.45 6 3V13C6 13.55 5.552 14 5 14C4.448 14 4 13.55 4 13V3Z" fill="currentColor" />
    </svg>
  )
}
