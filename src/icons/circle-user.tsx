import type { SVGProps } from "react"

export function CircleUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1C4.13401 1 1 4.13401 1 8C1 10.1361 1.9569 12.0486 3.46927 13.3287C4.06217 11.8848 5.90279 10.75 8 10.75C10.0972 10.75 11.9378 11.8848 12.5307 13.3287C14.0431 12.0486 15 10.1361 15 8C15 4.13401 11.866 1 8 1ZM8 9.25C9.24264 9.25 10.25 8.24264 10.25 7C10.25 5.75736 9.24264 4.75 8 4.75C6.75736 4.75 5.75 5.75736 5.75 7C5.75 8.24264 6.75736 9.25 8 9.25Z"
        fill="currentColor"
      />
    </svg>
  )
}
