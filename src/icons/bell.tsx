import type { SVGProps } from "react"

export function Bell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 1C6.89543 1 6 1.89543 6 3V3.10318C4.19814 3.56947 2.875 5.21082 2.875 7.16667V10.0503L1.86612 11.0592C1.24773 11.6776 1.68455 12.75 2.55836 12.75H13.4416C14.3155 12.75 14.7523 11.6776 14.1339 11.0592L13.125 10.0503V7.16667C13.125 5.21082 11.8019 3.56947 10 3.10318V3C10 1.89543 9.10457 1 8 1Z"
        fill="currentColor"
      />
      <path
        d="M6.25 13.5C6.25 14.4665 7.0335 15.25 8 15.25C8.9665 15.25 9.75 14.4665 9.75 13.5H6.25Z"
        fill="currentColor"
      />
    </svg>
  )
}
