import type { IconProps } from "./types"

// icon / arrow up chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowUpChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M2.293 15.71C1.902 15.32 1.902 14.68 2.293 14.29L11.293 5.29C11.683 4.9 12.317 4.9 12.707 5.29L21.707 14.29C22.098 14.68 22.098 15.32 21.707 15.71C21.317 16.1 20.683 16.1 20.293 15.71L12 7.41L3.707 15.71C3.317 16.1 2.683 16.1 2.293 15.71Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.368 3.91C7.761 3.59 8.341 3.61 8.707 3.98L14.364 9.64C14.754 10.03 14.754 10.66 14.364 11.05C13.973 11.44 13.34 11.44 12.95 11.05L7.999 6.1L3.05 11.05C2.66 11.44 2.026 11.44 1.636 11.05C1.246 10.66 1.246 10.03 1.636 9.64L7.293 3.98L7.368 3.91Z" fill="currentColor" />
    </svg>
  )
}
