import type { IconProps } from "./types"

// icon / passport — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Passport({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M7 15C7 14.448 7.448 14 8 14L16 14C16.552 14 17 14.448 17 15C17 15.552 16.552 16 16 16L8 16C7.448 16 7 15.552 7 15Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M9 18C9 17.448 9.448 17 10 17H14C14.552 17 15 17.448 15 18C15 18.552 14.552 19 14 19H10C9.448 19 9 18.552 9 18Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M12 6C10.895 6 10 6.895 10 8C10 9.105 10.895 10 12 10C13.105 10 14 9.105 14 8C14 6.895 13.105 6 12 6ZM8 8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8C16 10.209 14.209 12 12 12C9.791 12 8 10.209 8 8Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M2 1C2 0.448 2.448 0 3 0H18C20.209 0 22 1.791 22 4V20C22 22.209 20.209 24 18 24H3C2.448 24 2 23.552 2 23V1ZM4 2V22H18C19.105 22 20 21.105 20 20V4C20 2.895 19.105 2 18 2H4Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 0C13.657 0 15 1.343 15 3V13C15 14.657 13.657 16 12 16H2C1.448 16 1 15.552 1 15V1C1 0.448 1.448 0 2 0H12ZM3 14H12C12.552 14 13 13.552 13 13V3C13 2.448 12.552 2 12 2H3V14ZM10 11C10.552 11 11 11.448 11 12C11 12.552 10.552 13 10 13H6C5.448 13 5 12.552 5 12C5 11.448 5.448 11 6 11H10ZM8 3C9.657 3 11 4.343 11 6C11 7.657 9.657 9 8 9C6.343 9 5 7.657 5 6C5 4.343 6.343 3 8 3ZM8 5C7.448 5 7 5.448 7 6C7 6.552 7.448 7 8 7C8.552 7 9 6.552 9 6C9 5.448 8.552 5 8 5Z" fill="currentColor" />
    </svg>
  )
}
