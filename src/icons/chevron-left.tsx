import type { IconProps } from "./types"

export function ChevronLeft({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.95003 1.29292C10.3406 0.902584 10.9736 0.90246 11.3641 1.29292C11.7544 1.6834 11.7544 2.31651 11.3641 2.70698L6.41389 7.6562L11.3641 12.6064C11.7544 12.9968 11.7543 13.6299 11.3641 14.0205C10.9736 14.411 10.3406 14.4109 9.95003 14.0205L4.2928 8.36421C3.90234 7.97375 3.90246 7.34069 4.2928 6.95015L9.95003 1.29292Z"
        fill="currentColor"
      />
    </svg>
  )
}
