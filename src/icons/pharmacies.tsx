import type { IconProps } from "./types"

// icon / pharmacies — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pharmacies({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M9.667 3v5.666a1 1 0 0 1-1 1H3v4.667h5.667a1 1 0 0 1 1 1V21h4.666v-5.667a1 1 0 0 1 1-1H21V9.666h-5.667a1 1 0 0 1-1-1V3zM8.204 1.535C8.547 1.194 9.014 1 9.5 1h5a1.837 1.837 0 0 1 1.834 1.833v4.833h4.832A1.834 1.834 0 0 1 23 9.5v5a1.83 1.83 0 0 1-1.833 1.834h-4.832v4.832A1.834 1.834 0 0 1 14.5 23h-5a1.83 1.83 0 0 1-1.833-1.833v-4.832H2.833A1.833 1.833 0 0 1 1 14.5v-5a1.834 1.834 0 0 1 1.833-1.834h4.834V2.833c0-.486.193-.952.537-1.297" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 6H9a1 1 0 0 0 1 1zm4 0h1a1 1 0 0 0-1-1zm0 4v1a1 1 0 0 0 1-1zm-4 0V9a1 1 0 0 0-1 1zm0 4v1a1 1 0 0 0 1-1zm-4 0H5a1 1 0 0 0 1 1zm0-4h1a1 1 0 0 0-1-1zm-4 0H1a1 1 0 0 0 1 1zm0-4V5a1 1 0 0 0-1 1zm4 0v1a1 1 0 0 0 1-1zm0-4V1a1 1 0 0 0-1 1zm4 0h1a1 1 0 0 0-1-1zm0 4v1h4V5h-4zm4 0h-1v4h2V6zm0 4V9h-4v2h4zm-4 0H9v4h2v-4zm0 4v-1H6v2h4zm-4 0h1v-4H5v4zm0-4V9H2v2h4zm-4 0h1V6H1v4zm0-4v1h4V5H2zm4 0h1V2H5v4zm0-4v1h4V1H6zm4 0H9v4h2V2z"/></svg>
  )
}
