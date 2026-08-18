import type { IconProps } from "./types"

// icon / arrow back small — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowBackSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M15.71 18.71C15.324 19.1 14.698 19.1 14.312 18.71L8.334 12.8C7.889 12.36 7.889 11.64 8.334 11.2L14.312 5.29C14.698 4.9 15.324 4.9 15.71 5.29C16.097 5.67 16.097 6.29 15.71 6.67L10.324 12L15.71 17.33C16.097 17.71 16.097 18.33 15.71 18.71Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.182 3.29C9.572 2.9 10.206 2.9 10.597 3.29C10.987 3.68 10.987 4.32 10.597 4.71L7.414 7.89L10.597 11.07C10.987 11.46 10.987 12.1 10.597 12.49C10.206 12.88 9.572 12.88 9.182 12.49L5.293 8.6C4.902 8.21 4.902 7.57 5.293 7.18L9.182 3.29Z" fill="currentColor" />
    </svg>
  )
}
