import type { IconProps } from "./types"

// icon / pull — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pull({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M3 9C3 8.448 3.448 8 4 8L20 8C20.552 8 21 8.448 21 9C21 9.552 20.552 10 20 10L4 10C3.448 10 3 9.552 3 9ZM3 15C3 14.448 3.448 14 4 14L20 14C20.552 14 21 14.448 21 15C21 15.552 20.552 16 20 16L4 16C3.448 16 3 15.552 3 15Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13 10C13.552 10 14 10.448 14 11C14 11.552 13.552 12 13 12H3C2.448 12 2 11.552 2 11C2 10.448 2.448 10 3 10H13ZM13 4C13.552 4 14 4.448 14 5C14 5.552 13.552 6 13 6H3C2.448 6 2 5.552 2 5C2 4.448 2.448 4 3 4H13Z" fill="currentColor" />
    </svg>
  )
}
