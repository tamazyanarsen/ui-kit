import type { IconProps } from "./types"

export function ChevronUp({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.368 3.91a1 1 0 0 1 1.34.07l5.656 5.657a1 1 0 1 1-1.415 1.414L8 6.1l-4.95 4.95a1 1 0 0 1-1.414-1.414l5.657-5.658z"/></svg>
  )
}
