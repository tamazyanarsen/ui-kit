import type { IconProps } from "./types"

// icon / arrow left up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowLeftUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.313 6C17.313 5.448 16.865 5 16.313 5L6 5C5.448 5 5 5.448 5 6L5 16.312C5 16.865 5.448 17.312 6 17.312C6.552 17.312 7 16.865 7 16.312L7 8.414L16.293 17.707C16.683 18.098 17.317 18.098 17.707 17.707C18.098 17.317 18.098 16.683 17.707 16.293L8.414 7L16.313 7C16.865 7 17.313 6.552 17.313 6Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 3C3.448 3 3 3.448 3 4V11.273C3 11.825 3.448 12.272 4 12.273C4.552 12.273 5 11.825 5 11.273V6.414L11.293 12.707C11.684 13.098 12.317 13.098 12.707 12.707C13.098 12.317 13.098 11.684 12.707 11.293L6.414 5H11.273C11.825 5 12.273 4.552 12.273 4C12.273 3.448 11.825 3 11.273 3H4Z" fill="black" />
    </svg>
  )
}
