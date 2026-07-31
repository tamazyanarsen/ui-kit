import type { SVGProps } from "react"

export function Mail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3C1.44772 3 1 3.44772 1 4V12C1 12.5523 1.44772 13 2 13H14C14.5523 13 15 12.5523 15 12V4C15 3.44772 14.5523 3 14 3H2ZM3.2 5L8 8.5L12.8 5H3.2ZM3 6.25V11H13V6.25L8.58779 9.55915C8.24076 9.82033 7.75924 9.82033 7.41221 9.55915L3 6.25Z"
        fill="currentColor"
      />
    </svg>
  )
}
