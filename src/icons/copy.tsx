import type { SVGProps } from "react"

export function Copy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C5.89543 0 5 0.895429 5 2V3.33333H3C1.89543 3.33333 1 4.22876 1 5.33333V14.6667C1 15.7712 1.89543 16.6667 3 16.6667H9C10.1046 16.6667 11 15.7712 11 14.6667V13.3333H13C14.1046 13.3333 15 12.4379 15 11.3333V2C15 0.89543 14.1046 0 13 0H7ZM11 11.3333L13 11.3333V2L7 2V3.33333H9C10.1046 3.33333 11 4.22876 11 5.33333V11.3333ZM3 5.33333L9 5.33333V14.6667L3 14.6667V5.33333Z"
        fill="currentColor"
      />
    </svg>
  )
}
