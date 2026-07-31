import type { SVGProps } from "react"

export function Briefcase(props: SVGProps<SVGSVGElement>) {
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
