import type { IconProps } from "./types"

// 24px drawing is Figma's `icon / Bell` (node 61390:84005) as used in
// ELK / header's notification slot (46154:63324). Note it is a *stroked*
// outline at 24px — 2px round-joined — where the 16px drawing below is a
// solid fill, so the two really are separate artworks. The glyph box is
// 17.93×21 at (3.036, 2) inside the 24 box: the component's 12.5%/14.58%/
// 8.33%/14.58% insets give 17×19 at (3.5, 3), which the nested -2.73%/-5.26%
// inset then expands to cover the stroke's overflow.
const BELL_24 =
  "M5.96361 16H2.02176C1.29317 16 0.802769 15.2432 1.07614 14.5679C1.39644 13.7766 1.76269 12.7958 1.96361 12C2.58687 9.53156 1.29861 7.76371 2.46361 5.5C3.87639 2.75484 5.87625 1 8.96361 1C12.051 1 14.0508 2.75484 15.4636 5.5C16.6286 7.76371 15.3404 9.53156 15.9636 12C16.1645 12.7958 16.5308 13.7766 16.8511 14.5679C17.1245 15.2432 16.6341 16 15.9055 16H11.7136M5.96361 16C5.96361 16 5.46361 20 8.96361 20C12.4636 20 11.7136 16 11.7136 16M5.96361 16H11.7136"

export function Bell({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d={BELL_24}
          transform="translate(3.036 2)"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 1C6.89543 1 6 1.89543 6 3V3.10318C4.19814 3.56947 2.875 5.21082 2.875 7.16667V10.0503L1.86612 11.0592C1.24773 11.6776 1.68455 12.75 2.55836 12.75H13.4416C14.3155 12.75 14.7523 11.6776 14.1339 11.0592L13.125 10.0503V7.16667C13.125 5.21082 11.8019 3.56947 10 3.10318V3C10 1.89543 9.10457 1 8 1Z"
        fill="currentColor"
      />
      <path
        d="M6.25 13.5C6.25 14.4665 7.0335 15.25 8 15.25C8.9665 15.25 9.75 14.4665 9.75 13.5H6.25Z"
        fill="currentColor"
      />
    </svg>
  )
}
