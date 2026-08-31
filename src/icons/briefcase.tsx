import type { IconProps } from "./types"

// 24px drawing is Figma's "icon / company" (seen at 24px in ELK / header's
// profile row, node 46138:51812): a case with two horizontal bands, placed
// at (2, 2.75) inside the 24 box per the component's own 11.46%/8.33%
// insets. It is a different drawing from the 16px one below, which uses a
// centre latch instead — hence the size switch rather than a scale.
const COMPANY_24 =
  "M5.98223 0.732233C6.45107 0.263392 7.08696 0 7.75 0H12.25C12.913 0 13.5489 0.263392 14.0178 0.732233C14.4866 1.20107 14.75 1.83696 14.75 2.5V3H18.25C19.2165 3 20 3.7835 20 4.75V16.75C20 17.7165 19.2165 18.5 18.25 18.5H1.75C0.783501 18.5 0 17.7165 0 16.75V4.75C0 3.7835 0.783502 3 1.75 3H5.25V2.5C5.25 1.83696 5.51339 1.20107 5.98223 0.732233ZM2 5V11.25H18V5H2ZM12.75 3H7.25V2.5C7.25 2.36739 7.30268 2.24022 7.39645 2.14645C7.49022 2.05268 7.61739 2 7.75 2H12.25C12.3826 2 12.5098 2.05268 12.6036 2.14645C12.6973 2.24022 12.75 2.36739 12.75 2.5V3ZM18 13.25H2V16.5H18V13.25Z"

export function Briefcase({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d={COMPANY_24}
          transform="translate(2 2.75)"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M6 2.5A1.5 1.5 0 0 0 4.5 4v.5h-1a2 2 0 0 0-2 2V12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-1V4A1.5 1.5 0 0 0 10 2.5zm4 2V4H6v.5zM3.5 6h9a.5.5 0 0 1 .5.5V12H3V6.5a.5.5 0 0 1 .5-.5" clipRule="evenodd"/><path fill="currentColor" d="M6.75 8.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75"/></svg>
  )
}
