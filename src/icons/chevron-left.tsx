import type { IconProps } from "./types"

export function ChevronLeft({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.95 1.293a1 1 0 0 1 1.414 1.414l-4.95 4.95 4.95 4.95A1 1 0 0 1 9.95 14.02L4.293 8.364a1 1 0 0 1 0-1.414z"/></svg>
  )
}
