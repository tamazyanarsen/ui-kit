import type { IconProps } from "./types"

// icon / maximize — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Maximize({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12 2.45 12.448 2 13 2H19C20.657 2 22 3.34 22 5V11C22 11.55 21.552 12 21 12C20.448 12 20 11.55 20 11V5C20 4.45 19.552 4 19 4H13C12.448 4 12 3.55 12 3ZM3 12C3.552 12 4 12.45 4 13V19C4 19.55 4.448 20 5 20H11C11.552 20 12 20.45 12 21C12 21.55 11.552 22 11 22H5C3.343 22 2 20.66 2 19V13C2 12.45 2.448 12 3 12Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 7C2.552 7 3 7.45 3 8V12C3 12.55 3.448 13 4 13H8C8.552 13 9 13.45 9 14C9 14.55 8.552 15 8 15H4C2.343 15 1 13.66 1 12V8C1 7.45 1.448 7 2 7ZM12 1C13.657 1 15 2.34 15 4V8C15 8.55 14.552 9 14 9C13.448 9 13 8.55 13 8V4C13 3.45 12.552 3 12 3H8C7.448 3 7 2.55 7 2C7 1.45 7.448 1 8 1H12Z" fill="currentColor" />
    </svg>
  )
}
