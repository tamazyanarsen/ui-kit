import type { SVGProps } from "react"

export function CircleHelp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 7C10.5331 7 9.5 8.06743 9.5 9.2C9.5 9.75229 9.05229 10.2 8.5 10.2C7.94772 10.2 7.5 9.75229 7.5 9.2C7.5 6.79795 9.60095 5 12 5C14.399 5 16.5 6.79795 16.5 9.2C16.5 11.2605 14.954 12.8765 13 13.2944V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V12.4C11 11.8477 11.4477 11.4 12 11.4C13.4669 11.4 14.5 10.3326 14.5 9.2C14.5 8.06743 13.4669 7 12 7Z"
        fill="currentColor"
      />
      <path
        d="M13 18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18Z"
        fill="currentColor"
      />
    </svg>
  )
}
