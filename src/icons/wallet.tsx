import type { SVGProps } from "react"

export function Wallet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 4.5C2 3.67157 2.67157 3 3.5 3H12.5C13.3284 3 14 3.67157 14 4.5V5H14.5C14.7761 5 15 5.22386 15 5.5V10.5C15 10.7761 14.7761 11 14.5 11H14V11.5C14 12.3284 13.3284 13 12.5 13H3.5C2.67157 13 2 12.3284 2 11.5V4.5ZM12.5 5V4.5H3.5V11.5H12.5V11H10.5C9.67157 11 9 10.3284 9 9.5V6.5C9 5.67157 9.67157 5 10.5 5H12.5ZM10.5 6.5H13.5V9.5H10.5V6.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
