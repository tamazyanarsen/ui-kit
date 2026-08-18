import type { IconProps } from "./types"

// icon / arrow down small — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowDownSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M18.713 8.29C19.096 8.68 19.096 9.3 18.713 9.69L12.798 15.67C12.357 16.11 11.643 16.11 11.202 15.67L5.287 9.69C4.904 9.3 4.904 8.68 5.287 8.29C5.669 7.9 6.288 7.9 6.67 8.29L12 13.68L17.33 8.29C17.712 7.9 18.331 7.9 18.713 8.29Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.071 5.29C11.462 4.9 12.095 4.9 12.485 5.29C12.876 5.68 12.876 6.32 12.485 6.71L8.596 10.6C8.205 10.99 7.572 10.99 7.182 10.6L3.293 6.71C2.902 6.32 2.902 5.68 3.293 5.29C3.683 4.9 4.316 4.9 4.707 5.29L7.889 8.47L11.071 5.29Z" fill="currentColor" />
    </svg>
  )
}
