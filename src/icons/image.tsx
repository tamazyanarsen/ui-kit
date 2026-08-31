import type { IconProps } from "./types"

// No "image placeholder" glyph was reachable from this file's own Figma
// pages — search_design_system only turns up "icons/Placeholder/Images" in
// an external "Assets" library, same unreachable-by-node-id situation as
// Pencil. Hand-drawn (built from primitives, not traced) to match the
// weight/viewBox convention of the rest of this Figma-sourced icon set
// rather than pulling in lucide-react.
export function ImageIcon({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><rect width="13" height="11" x="1.5" y="2.5" stroke="currentColor" strokeWidth="1.2" rx="1.4"/><circle cx="5.5" cy="6" r="1.25" fill="currentColor"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="m2 11.5 3.3-3.3a1 1 0 0 1 1.4 0L9 10.5l1.6-1.6a1 1 0 0 1 1.4 0l2.5 2.6"/></svg>
  )
}
