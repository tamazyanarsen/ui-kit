import type { IconProps } from "./types"

// icon / in compare — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function InCompare({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M3 1C1.895 1 1 1.895 1 3V21C1 22.105 1.895 23 3 23H21C22.105 23 23 22.105 23 21V3C23 1.895 22.105 1 21 1H3ZM18 7C18 6.448 17.552 6 17 6C16.448 6 16 6.448 16 7L16 17C16 17.552 16.448 18 17 18C17.552 18 18 17.552 18 17V7ZM7 9C7.552 9 8 9.448 8 10L8 17C8 17.552 7.552 18 7 18C6.448 18 6 17.552 6 17V10C6 9.448 6.448 9 7 9ZM13 13C13 12.448 12.552 12 12 12C11.448 12 11 12.448 11 13V17C11 17.552 11.448 18 12 18C12.552 18 13 17.552 13 17V13Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M3 1C1.895 1 1 1.895 1 3V13C1 14.105 1.895 15 3 15H13C14.105 15 15 14.105 15 13V3C15 1.895 14.105 1 13 1H3ZM12 5C12 4.448 11.552 4 11 4C10.448 4 10 4.448 10 5V11C10 11.552 10.448 12 11 12C11.552 12 12 11.552 12 11V5ZM5 5C5.552 5 6 5.448 6 6V11C6 11.552 5.552 12 5 12C4.448 12 4 11.552 4 11V6C4 5.448 4.448 5 5 5ZM9 8C9 7.448 8.552 7 8 7C7.448 7 7 7.448 7 8V11C7 11.552 7.448 12 8 12C8.552 12 9 11.552 9 11V8Z" fill="currentColor" />
    </svg>
  )
}
