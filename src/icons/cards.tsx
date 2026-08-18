import type { IconProps } from "./types"

// icon / cards — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Cards({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M6 4V8H18.308C19.206 8 20 8.711 20 9.667V14H22V4H6ZM20 16H22.308C23.206 16 24 15.289 24 14.333V3.667C24 2.711 23.206 2 22.308 2H5.692C4.794 2 4 2.711 4 3.667V8H1.692C0.794 8 0 8.711 0 9.667V20.333C0 21.289 0.794 22 1.692 22H18.308C19.206 22 20 21.289 20 20.333V16ZM2 10V12H18V10H2ZM18 14H2V20H18V14ZM13 18C13 17.448 13.448 17 14 17H16C16.552 17 17 17.448 17 18C17 18.552 16.552 19 16 19H14C13.448 19 13 18.552 13 18Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 1C15.105 1 16 1.895 16 3V10C16 11.105 15.105 12 14 12H13V14C13 15.105 12.105 16 11 16H2C0.895 16 0 15.105 0 14V7C0 5.895 0.895 5 2 5H3V3C3 1.895 3.895 1 5 1H14ZM2 14H11V10H2V14ZM9 11C9.552 11 10 11.448 10 12C10 12.552 9.552 13 9 13H8C7.448 13 7 12.552 7 12C7 11.448 7.448 11 8 11H9ZM5 5H11C12.105 5 13 5.895 13 7V10H14V3H5V5ZM2 8H11V7H2V8Z" fill="currentColor" />
    </svg>
  )
}
