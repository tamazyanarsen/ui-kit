import type { SVGProps } from "react"

export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.63139 12.0891C8.23861 12.4098 7.65876 12.387 7.29253 12.0208L1.63628 6.36354C1.24582 5.97301 1.24578 5.33997 1.63628 4.94947C2.0268 4.55927 2.65991 4.55912 3.05034 4.94947L8.00054 9.89967L12.9498 4.94947C13.3402 4.5592 13.9733 4.5592 14.3638 4.94947C14.7543 5.33994 14.7542 5.973 14.3638 6.36354L8.70659 12.0208L8.63139 12.0891Z"
        fill="currentColor"
      />
    </svg>
  )
}
