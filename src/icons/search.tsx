import type { SVGProps } from "react"

export function Search(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 4C7.18629 4 4.5 6.68629 4.5 10C4.5 13.3137 7.18629 16 10.5 16C13.8137 16 16.5 13.3137 16.5 10C16.5 6.68629 13.8137 4 10.5 4ZM2.5 10C2.5 5.58172 6.08172 2 10.5 2C14.9183 2 18.5 5.58172 18.5 10C18.5 12.1038 17.6879 14.0179 16.3602 15.446L21.2071 20.2929C21.5976 20.6834 21.5976 21.3166 21.2071 21.7071C20.8166 22.0976 20.1834 22.0976 19.7929 21.7071L14.8202 16.7344C13.5741 17.5354 12.0913 18 10.5 18C6.08172 18 2.5 14.4183 2.5 10Z"
        fill="currentColor"
      />
    </svg>
  )
}
