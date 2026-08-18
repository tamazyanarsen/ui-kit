import type { IconProps } from "./types"

// icon / arrow next chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowNextChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M8.293 2.29C8.683 1.9 9.317 1.9 9.707 2.29L18.707 11.29C19.098 11.68 19.098 12.32 18.707 12.71L9.707 21.71C9.317 22.1 8.683 22.1 8.293 21.71C7.902 21.32 7.902 20.68 8.293 20.29L16.586 12L8.293 3.71C7.902 3.32 7.902 2.68 8.293 2.29Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.707 1.29C6.316 0.9 5.683 0.9 5.293 1.29C4.902 1.68 4.902 2.32 5.293 2.71L10.243 7.66L5.293 12.61C4.902 13 4.903 13.63 5.293 14.02C5.683 14.41 6.316 14.41 6.707 14.02L12.364 8.36C12.754 7.97 12.754 7.34 12.364 6.95L6.707 1.29Z" fill="currentColor" />
    </svg>
  )
}
