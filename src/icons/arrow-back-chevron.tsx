import type { IconProps } from "./types"

// icon / arrow back chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowBackChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M15.707 21.71C15.317 22.1 14.683 22.1 14.293 21.71L5.293 12.71C4.902 12.32 4.902 11.68 5.293 11.29L14.293 2.29C14.683 1.9 15.317 1.9 15.707 2.29C16.098 2.68 16.098 3.32 15.707 3.71L7.414 12L15.707 20.29C16.098 20.68 16.098 21.32 15.707 21.71Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.95 1.29C10.341 0.9 10.974 0.9 11.364 1.29C11.754 1.68 11.754 2.32 11.364 2.71L6.414 7.66L11.364 12.61C11.754 13 11.754 13.63 11.364 14.02C10.974 14.41 10.341 14.41 9.95 14.02L4.293 8.36C3.902 7.97 3.903 7.34 4.293 6.95L9.95 1.29Z" fill="currentColor" />
    </svg>
  )
}
