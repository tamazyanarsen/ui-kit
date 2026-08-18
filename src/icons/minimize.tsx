import type { IconProps } from "./types"

// icon / minimize — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Minimize({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M13 2C13.552 2 14 2.45 14 3L14 9C14 9.55 14.448 10 15 10L21 10C21.552 10 22 10.45 22 11C22 11.55 21.552 12 21 12L15 12C13.343 12 12 10.66 12 9L12 3C12 2.45 12.448 2 13 2ZM2 13C2 12.45 2.448 12 3 12L9 12C10.657 12 12 13.34 12 15L12 21C12 21.55 11.552 22 11 22C10.448 22 10 21.55 10 21L10 15C10 14.45 9.552 14 9 14L3 14C2.448 14 2 13.55 2 13Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.5 7.5C7.157 7.5 8.5 8.84 8.5 10.5V14.5C8.5 15.05 8.052 15.5 7.5 15.5C6.948 15.5 6.5 15.05 6.5 14.5V10.5C6.5 9.95 6.052 9.5 5.5 9.5H1.5C0.948 9.5 0.5 9.05 0.5 8.5C0.5 7.95 0.948 7.5 1.5 7.5H5.5ZM8.5 0.5C9.052 0.5 9.5 0.95 9.5 1.5V5.5C9.5 6.05 9.948 6.5 10.5 6.5H14.5C15.052 6.5 15.5 6.95 15.5 7.5C15.5 8.05 15.052 8.5 14.5 8.5H10.5C8.843 8.5 7.5 7.16 7.5 5.5V1.5C7.5 0.95 7.948 0.5 8.5 0.5Z" fill="currentColor" />
    </svg>
  )
}
