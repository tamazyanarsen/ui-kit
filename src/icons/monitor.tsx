import type { IconProps } from "./types"

// icon / monitor — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Monitor({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M4 4C3.448 4 3 4.45 3 5V15C3 15.55 3.448 16 4 16H20C20.552 16 21 15.55 21 15V5C21 4.45 20.552 4 20 4H4ZM13 18H20C21.657 18 23 16.66 23 15V5C23 3.34 21.657 2 20 2H4C2.343 2 1 3.34 1 5V15C1 16.66 2.343 18 4 18H11V20H8C7.448 20 7 20.45 7 21C7 21.55 7.448 22 8 22H16C16.552 22 17 21.55 17 21C17 20.45 16.552 20 16 20H13V18Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C13.657 2 15 3.34 15 5V9C15 10.66 13.657 12 12 12H9.005V13H11C11.552 13 12 13.45 12 14C12 14.55 11.552 15 11 15H8.107C8.074 15 8.039 15 8.005 15C7.97 15 7.936 15 7.902 15H5C4.448 15 4 14.55 4 14C4 13.45 4.448 13 5 13H7.005V12H4C2.343 12 1 10.66 1 9V5C1 3.34 2.343 2 4 2H12ZM4 4C3.448 4 3 4.45 3 5V9C3 9.55 3.448 10 4 10H12C12.552 10 13 9.55 13 9V5C13 4.45 12.552 4 12 4H4Z" fill="black" />
    </svg>
  )
}
