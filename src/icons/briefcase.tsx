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
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2.5C5.17157 2.5 4.5 3.17157 4.5 4V4.5H3.5C2.39543 4.5 1.5 5.39543 1.5 6.5V12C1.5 13.1046 2.39543 14 3.5 14H12.5C13.6046 14 14.5 13.1046 14.5 12V6.5C14.5 5.39543 13.6046 4.5 12.5 4.5H11.5V4C11.5 3.17157 10.8284 2.5 10 2.5H6ZM10 4.5V4H6V4.5H10ZM3.5 6H12.5C12.7761 6 13 6.22386 13 6.5V12H3V6.5C3 6.22386 3.22386 6 3.5 6Z"
        fill="currentColor"
      />
      <path
        d="M6.75 8.5C6.75 8.08579 7.08579 7.75 7.5 7.75H8.5C8.91421 7.75 9.25 8.08579 9.25 8.5C9.25 8.91421 8.91421 9.25 8.5 9.25H7.5C7.08579 9.25 6.75 8.91421 6.75 8.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
