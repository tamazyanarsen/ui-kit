import type { IconProps } from "./types"

export function CalendarDays({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2 14h12V4H2zm14 .454c0 .993-.883 1.546-1.637 1.546H1.637C.883 16 0 15.447 0 14.454V3.546C0 2.553.883 2 1.637 2h12.726C15.117 2 16 2.553 16 3.546z"/><path fill="currentColor" d="M10 4V1a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0M4 4V1a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m10 2a1 1 0 1 1 0 2H2a1 1 0 0 1 0-2z"/></svg>
  )
}
