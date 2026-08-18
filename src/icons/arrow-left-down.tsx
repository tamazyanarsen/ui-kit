import type { IconProps } from "./types"

// icon / arrow left down — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowLeftDown({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.313 17C17.313 17.552 16.865 18 16.313 18H6C5.448 18 5 17.552 5 17V6.687C5 6.135 5.448 5.687 6 5.687C6.552 5.687 7 6.135 7 6.687V14.586L16.293 5.293C16.683 4.902 17.317 4.902 17.707 5.293C18.098 5.683 18.098 6.316 17.707 6.707L8.414 16H16.313C16.865 16 17.313 16.448 17.313 17Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 13C3.448 13 3 12.552 3 12V4.727C3 4.175 3.448 3.728 4 3.727C4.552 3.727 5 4.175 5 4.727V9.586L11.293 3.293C11.684 2.902 12.317 2.902 12.707 3.293C13.098 3.683 13.098 4.316 12.707 4.707L6.414 11H11.273C11.825 11 12.273 11.448 12.273 12C12.273 12.552 11.825 13 11.273 13H4Z" fill="black" />
    </svg>
  )
}
