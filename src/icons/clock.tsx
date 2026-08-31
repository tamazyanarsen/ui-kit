import type { IconProps } from "./types"

// Figma's `icon / clock` (node I40656:66204;1568:931, the pending-signature
// row in ELK / event): a clock face with hands, 14.2222×14.2222 centred in
// the 16px box. What lived here before was an *hourglass* — a leftover from
// the lucide passthrough era, not this design system's glyph, so Event's
// "awaiting signature" row was showing the wrong symbol entirely.
export function Clock({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g fill="currentColor"><path d="M8 3.475c.357 0 .647.29.647.646v3.611l1.75 1.75a.646.646 0 1 1-.915.915l-1.939-1.94A.65.65 0 0 1 7.353 8V4.121c0-.357.29-.646.647-.646"/><path fillRule="evenodd" d="M8 15.111A7.111 7.111 0 1 1 8 .89a7.111 7.111 0 0 1 0 14.222m0-1.293A5.818 5.818 0 1 0 8 2.182a5.818 5.818 0 0 0 0 11.636" clipRule="evenodd"/></g></svg>
  )
}
