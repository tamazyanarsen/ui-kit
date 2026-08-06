import type { IconProps } from "./types"

// No "edit/pencil" glyph was reachable from this file's own Figma pages —
// the design system's "01 Base/Edit" icon lives in an external shared
// library that isn't fetchable by node-id from here. Hand-drawn (built from
// primitives, not traced) to match the weight/viewBox convention of the
// rest of this Figma-sourced icon set rather than pulling in lucide-react.
export function Pencil({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.4 2.4a1.4 1.4 0 0 1 1.98 0l1.22 1.22a1.4 1.4 0 0 1 0 1.98l-7.09 7.09a1.4 1.4 0 0 1-.66.37l-2.99.75a.6.6 0 0 1-.73-.73l.75-2.99a1.4 1.4 0 0 1 .37-.66l7.15-7.03Zm1.15.85-7.08 7.08a.2.2 0 0 0-.05.09l-.5 2.01 2.01-.5a.2.2 0 0 0 .09-.05l7.08-7.08a.2.2 0 0 0 0-.28l-1.27-1.27a.2.2 0 0 0-.28 0Z"
        fill="currentColor"
      />
    </svg>
  )
}
