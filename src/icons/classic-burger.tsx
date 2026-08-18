import type { IconProps } from "./types"

// icon / classic burger — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ClassicBurger({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M2 4C2 3.448 2.448 3 3 3H21C21.552 3 22 3.448 22 4C22 4.552 21.552 5 21 5H3C2.448 5 2 4.552 2 4ZM2 12C2 11.448 2.448 11 3 11H21C21.552 11 22 11.448 22 12C22 12.552 21.552 13 21 13H3C2.448 13 2 12.552 2 12ZM2 20C2 19.448 2.448 19 3 19H21C21.552 19 22 19.448 22 20C22 20.552 21.552 21 21 21H3C2.448 21 2 20.552 2 20Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 12C14.552 12 15 12.448 15 13C15 13.552 14.552 14 14 14H2C1.448 14 1 13.552 1 13C1 12.448 1.448 12 2 12H14ZM14 7C14.552 7 15 7.448 15 8C15 8.552 14.552 9 14 9H2C1.448 9 1 8.552 1 8C1 7.448 1.448 7 2 7H14ZM14 2C14.552 2 15 2.448 15 3C15 3.552 14.552 4 14 4H2C1.448 4 1 3.552 1 3C1 2.448 1.448 2 2 2H14Z" fill="currentColor" />
    </svg>
  )
}
