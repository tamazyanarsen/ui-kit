import type { IconProps } from "./types"

export function Menu({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.5 4C1.5 3.44772 1.94772 3 2.5 3H13.5C14.0523 3 14.5 3.44772 14.5 4C14.5 4.55228 14.0523 5 13.5 5H2.5C1.94772 5 1.5 4.55228 1.5 4Z"
        fill="currentColor"
      />
      <path
        d="M1.5 8C1.5 7.44772 1.94772 7 2.5 7H13.5C14.0523 7 14.5 7.44772 14.5 8C14.5 8.55228 14.0523 9 13.5 9H2.5C1.94772 9 1.5 8.55228 1.5 8Z"
        fill="currentColor"
      />
      <path
        d="M2.5 11C1.94772 11 1.5 11.4477 1.5 12C1.5 12.5523 1.94772 13 2.5 13H13.5C14.0523 13 14.5 12.5523 14.5 12C14.5 11.4477 14.0523 11 13.5 11H2.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
