import type { IconProps } from "./types"

// icon / arrow down chevron — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowDownChevron({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M21.707 8.29C22.098 8.68 22.098 9.32 21.707 9.71L12.707 18.71C12.317 19.1 11.683 19.1 11.293 18.71L2.293 9.71C1.902 9.32 1.902 8.68 2.293 8.29C2.683 7.9 3.317 7.9 3.707 8.29L12 16.59L20.293 8.29C20.683 7.9 21.317 7.9 21.707 8.29Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.95 4.95C13.34 4.56 13.973 4.56 14.364 4.95C14.754 5.34 14.754 5.97 14.364 6.36L8.707 12.02C8.317 12.41 7.684 12.41 7.293 12.02L1.636 6.36C1.246 5.97 1.246 5.34 1.636 4.95C2.027 4.56 2.66 4.56 3.05 4.95L7.999 9.9L12.95 4.95Z" fill="currentColor" />
    </svg>
  )
}
