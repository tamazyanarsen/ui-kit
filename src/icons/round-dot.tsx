import type { IconProps } from "./types"

// icon / round dot — 18. Other, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function RoundDot({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.99 7.99a4 4 0 0 1 3.996 4.007 3.997 3.997 0 0 1-7.994 0A4 4 0 0 1 11.99 7.99"/><path fill="currentColor" fillRule="evenodd" d="M11.99 0c6.621 0 11.988 5.37 11.988 11.997 0 6.615-5.367 11.985-11.988 11.985C5.368 23.982 0 18.612 0 11.997 0 5.37 5.368 0 11.99 0m0 2.003a9.99 9.99 0 0 0-9.991 9.994c0 5.512 4.472 9.981 9.991 9.981 5.517 0 9.991-4.469 9.991-9.981a9.99 9.99 0 0 0-9.991-9.994" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.992 5.334a2.66 2.66 0 0 1 2.665 2.656 2.66 2.66 0 0 1-2.665 2.667A2.66 2.66 0 0 1 5.328 7.99a2.66 2.66 0 0 1 2.664-2.656"/><path fill="currentColor" fillRule="evenodd" d="M7.992 0a7.993 7.993 0 0 1 7.993 7.99c0 4.422-3.578 8.002-7.993 8.002C3.578 15.992 0 12.412 0 7.99 0 3.58 3.578 0 7.992 0m0 2.003A5.99 5.99 0 0 0 1.998 7.99a5.99 5.99 0 0 0 5.994 5.998 5.99 5.99 0 0 0 5.995-5.998 5.99 5.99 0 0 0-5.995-5.987" clipRule="evenodd"/></svg>
  )
}
