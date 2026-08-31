import type { IconProps } from "./types"

// 24px drawing is Figma's real `icon / document` (node
// I16029:57773;16029:61127;7057:83475 — the glyph inside ELK / files'
// thumbnail tile): an 18×22 filled path at (3, 1) in the 24 box, per the
// component's 4.17%/12.5% insets.
//
// The 16px branch below is still the hand-drawn approximation traced off a
// screenshot before the MCP link existed — replace it too once Figma's 16px
// document variant is located. FileListItem renders at 24px, so the real
// artwork is what actually ships today.
const DOCUMENT_24 =
  "M0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893L17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V19C18 19.7957 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7957 22 15 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868ZM3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V8H11C10.4477 8 10 7.55228 10 7V2H3ZM12 3.41421L14.5858 6H12V3.41421ZM4 8C4 7.44772 4.44772 7 5 7H7C7.55228 7 8 7.44772 8 8C8 8.55228 7.55228 9 7 9H5C4.44772 9 4 8.55228 4 8ZM4 12C4 11.4477 4.44772 11 5 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H5C4.44772 13 4 12.5523 4 12ZM4 16C4 15.4477 4.44772 15 5 15H13C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H5C4.44772 17 4 16.5523 4 16Z"

export function FileIcon({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d={DOCUMENT_24}
          transform="translate(3 1)"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" d="M3.5 1.5H9L12.5 5v8.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z"/><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" d="M9 1.5v3a1 1 0 0 0 1 1h2.5"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" d="M5.5 7h1m-1 2.25h5m-5 2.25h5"/></svg>
  )
}
