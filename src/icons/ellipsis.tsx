import type { IconProps } from "./types"

// Figma's `icon / more` (node I16029:57773;16029:58070 in ELK / files):
// three r=1.5 dots on a 14×3 strip placed at (1, 6.5) inside the 16px box.
// Previously this was a 24-grid drawing left over from the lucide
// passthrough — visually close, but off the kit's 16px grid, so it never
// aligned optically with the Figma-sourced icons beside it.
export function Ellipsis({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M15 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
  )
}
