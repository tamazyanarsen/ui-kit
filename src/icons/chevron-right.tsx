import type { SVGProps } from "react"

export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.70671 1.29292C6.31617 0.902584 5.68311 0.90246 5.29265 1.29292C4.90237 1.6834 4.90237 2.31651 5.29265 2.70698L10.2428 7.6562L5.29265 12.6064C4.9023 12.9968 4.90245 13.6299 5.29265 14.0205C5.68315 14.411 6.31618 14.4109 6.70671 14.0205L12.3639 8.36421C12.7544 7.97375 12.7543 7.34069 12.3639 6.95015L6.70671 1.29292Z"
        fill="currentColor"
      />
    </svg>
  )
}
