import type { IconProps } from "./types"

// 24px drawing is Figma's `icon / mail` as used at 24px in ELK / header's
// Letter slot (node 46154:63301). The glyph is 22×15 and sits at (1, 5)
// inside the 24 box per the component's own 20.83%/4.17%/16.67%/4.17%
// insets. Distinct from the 16px drawing below, not a scale of it.
const MAIL_24 =
  "M0 2C0 0.89543 0.895431 0 2 0H20C21.1046 0 22 0.89543 22 2V13C22 14.1046 21.1046 15 20 15H2C0.895431 15 0 14.1046 0 13V2ZM3.85078 2L10.3753 7.21962C10.7405 7.51179 11.2595 7.51179 11.6247 7.21962L18.1492 2H3.85078ZM20 3.08062L12.8741 8.78136C11.7784 9.65788 10.2216 9.65788 9.12591 8.78136L2 3.08062V13H20V3.08062Z"

export function Mail({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d={MAIL_24}
          transform="translate(1 5)"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3C1.44772 3 1 3.44772 1 4V12C1 12.5523 1.44772 13 2 13H14C14.5523 13 15 12.5523 15 12V4C15 3.44772 14.5523 3 14 3H2ZM3.2 5L8 8.5L12.8 5H3.2ZM3 6.25V11H13V6.25L8.58779 9.55915C8.24076 9.82033 7.75924 9.82033 7.41221 9.55915L3 6.25Z"
        fill="currentColor"
      />
    </svg>
  )
}
