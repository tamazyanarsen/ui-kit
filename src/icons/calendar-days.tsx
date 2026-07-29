import type { SVGProps } from "react"

export function CalendarDays(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2 14H14V4H2V14ZM16 14.4541C16 15.4467 15.1168 16 14.3633 16H1.63672C0.883154 16 0 15.4467 0 14.4541V3.5459C0 2.5533 0.883154 2 1.63672 2H14.3633C15.1168 2 16 2.5533 16 3.5459V14.4541Z"
        fill="currentColor"
      />
      <path
        d="M10 4V1C10 0.447715 10.4477 0 11 0C11.5523 0 12 0.447715 12 1V4C12 4.55228 11.5523 5 11 5C10.4477 5 10 4.55228 10 4Z"
        fill="currentColor"
      />
      <path
        d="M4 4V1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1V4C6 4.55228 5.55228 5 5 5C4.44772 5 4 4.55228 4 4Z"
        fill="currentColor"
      />
      <path
        d="M14 6C14.5523 6 15 6.44772 15 7C15 7.55228 14.5523 8 14 8H2C1.44772 8 1 7.55228 1 7C1 6.44772 1.44772 6 2 6H14Z"
        fill="currentColor"
      />
    </svg>
  )
}
