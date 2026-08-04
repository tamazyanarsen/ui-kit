import type { SVGProps } from "react"

// The File Upload list-item's default-state glyph (Figma node 677:14056,
// "Варианты — File" / "Исходное состояние") is a distinct outline document
// — folded corner + 3 lines — not the solid FileText glyph used elsewhere
// (Event's attachments, the sidebar nav icon). Hand-drawn to match that
// screenshot; only used for FileListItem's default state.
export function FileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3.5 1.5H9L12.5 5V13.5C12.5 14.0523 12.0523 14.5 11.5 14.5H4.5C3.94772 14.5 3.5 14.0523 3.5 13.5V1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9 1.5V4.5C9 5.05228 9.44772 5.5 10 5.5H12.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5.5 7H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 9.25H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 11.5H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
