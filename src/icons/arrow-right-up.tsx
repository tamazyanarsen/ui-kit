import type { IconProps } from "./types"

// icon / arrow right up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowRightUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M5.687 6C5.687 5.448 6.135 5 6.687 5H17C17.552 5 18 5.448 18 6V16.313C18 16.865 17.552 17.313 17 17.313C16.448 17.313 16 16.865 16 16.313V8.414L6.707 17.707C6.317 18.098 5.683 18.098 5.293 17.707C4.902 17.317 4.902 16.684 5.293 16.293L14.586 7H6.687C6.135 7 5.687 6.552 5.687 6Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3C12.552 3 13 3.448 13 4V11.272C13 11.825 12.552 12.272 12 12.272C11.448 12.272 11 11.825 11 11.272V6.414L4.707 12.707C4.316 13.098 3.683 13.098 3.293 12.707C2.902 12.317 2.902 11.683 3.293 11.293L9.586 5H4.727C4.175 5 3.727 4.552 3.727 4C3.727 3.448 4.175 3 4.727 3H12Z" fill="black" />
    </svg>
  )
}
