import type { IconProps } from "./types"

// icon / arrow  right down — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowRightDown({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M5.687 17C5.687 17.552 6.135 18 6.687 18H17C17.552 18 18 17.552 18 17V6.687C18 6.135 17.552 5.687 17 5.687C16.448 5.687 16 6.135 16 6.687V14.586L6.707 5.293C6.317 4.902 5.683 4.902 5.293 5.293C4.902 5.683 4.902 6.316 5.293 6.707L14.586 16H6.687C6.135 16 5.687 16.448 5.687 17Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 13C12.552 13 13 12.552 13 12V4.727C13 4.175 12.552 3.728 12 3.727C11.448 3.727 11 4.175 11 4.727V9.586L4.707 3.293C4.316 2.902 3.683 2.902 3.293 3.293C2.902 3.683 2.902 4.316 3.293 4.707L9.586 11H4.727C4.175 11 3.727 11.448 3.727 12C3.727 12.552 4.175 13 4.727 13H12Z" fill="black" />
    </svg>
  )
}
