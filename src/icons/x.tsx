import type { IconProps } from "./types"

// 24px drawing is Figma's `icon / close cross` at 24px (e.g. the black
// Button Menu's dismiss, node 4270:51386): a 16.14×16.14 glyph at
// (3.708, 3.708) per the component's 15.45%/17.29% insets. Proportionally
// thinner than the 16px drawing below — ~8.7% of the glyph width versus
// ~13% — so it is a separate artwork rather than a scale.
const CROSS_24 =
  "M0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L8.07121 6.657L14.435 0.293185C14.8256 -0.0973397 15.4587 -0.0973397 15.8492 0.293185C16.2398 0.683709 16.2398 1.31687 15.8492 1.7074L9.48543 8.07121L15.8492 14.435C16.2398 14.8256 16.2398 15.4587 15.8492 15.8492C15.4587 16.2398 14.8256 16.2398 14.435 15.8492L8.07121 9.48543L1.70711 15.8495C1.31658 16.2401 0.683418 16.2401 0.292893 15.8495C-0.0976311 15.459 -0.0976311 14.8258 0.292893 14.4353L6.657 8.07121L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893Z"

export function X({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d={CROSS_24}
          transform="translate(3.708 3.708)"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.878 2.707a1 1 0 0 1 1.414 1.415L9.413 7.999l3.879 3.88a1 1 0 1 1-1.414 1.414l-3.88-3.88-3.877 3.88a1 1 0 0 1-1.414-1.414L6.585 8 2.707 4.122A1 1 0 1 1 4.12 2.707l3.878 3.878z"/></svg>
  )
}
