import type { IconProps } from "./types"

// icon / burger — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Burger({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M2 4C2 3.448 2.448 3 3 3H21C21.552 3 22 3.448 22 4C22 4.552 21.552 5 21 5H3C2.448 5 2 4.552 2 4ZM2 12C2 11.448 2.448 11 3 11H17C17.552 11 18 11.448 18 12C18 12.552 17.552 13 17 13H3C2.448 13 2 12.552 2 12ZM2 20C2 19.448 2.448 19 3 19H15C15.552 19 16 19.448 16 20C16 20.552 15.552 21 15 21H3C2.448 21 2 20.552 2 20Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 12C10.552 12 11 12.448 11 13C11 13.552 10.552 14 10 14H2C1.448 14 1 13.552 1 13C1 12.448 1.448 12 2 12H10ZM12 7C12.552 7 13 7.448 13 8C13 8.552 12.552 9 12 9H2C1.448 9 1 8.552 1 8C1 7.448 1.448 7 2 7H12ZM14 2C14.552 2 15 2.448 15 3C15 3.552 14.552 4 14 4H2C1.448 4 1 3.552 1 3C1 2.448 1.448 2 2 2H14Z" fill="currentColor" />
    </svg>
  )
}
