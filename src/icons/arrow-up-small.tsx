import type { IconProps } from "./types"

// icon / arrow up small — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowUpSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M5.287 15.71C4.904 15.32 4.904 14.7 5.287 14.31L11.202 8.33C11.643 7.89 12.357 7.89 12.798 8.33L18.713 14.31C19.096 14.7 19.096 15.32 18.713 15.71C18.331 16.1 17.712 16.1 17.33 15.71L12 10.32L6.67 15.71C6.288 16.1 5.669 16.1 5.287 15.71Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.889 5C8.154 5 8.409 5.11 8.597 5.29L12.485 9.18C12.876 9.57 12.876 10.21 12.485 10.6C12.095 10.99 11.462 10.99 11.071 10.6L7.889 7.41L4.707 10.6C4.317 10.99 3.683 10.99 3.293 10.6C2.902 10.21 2.902 9.57 3.293 9.18L7.182 5.29C7.369 5.11 7.624 5 7.889 5Z" fill="currentColor" />
    </svg>
  )
}
