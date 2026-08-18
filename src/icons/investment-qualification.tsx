import type { IconProps } from "./types"

// icon / investment qualification — 18. Other, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function InvestmentQualification({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g> <g> <g> <path d="M9 10.5L10.8462 12L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <circle cx="12" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M17 15.5V20.523C17 21.2304 16.2855 21.7142 15.6286 21.4514L12.3714 20.1486C12.133 20.0532 11.867 20.0532 11.6286 20.1486L8.37139 21.4514C7.71453 21.7142 7 21.2304 7 20.523V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g> </g> </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.943 0C11.07 0 13.604 2.537 13.604 5.667C13.604 7.054 13.103 8.334 12.272 9.318C12.272 9.318 12.273 9.33 12.273 9.33V12.673C12.273 13.858 11.083 14.664 9.989 14.226L7.943 13.408L5.898 14.226C4.804 14.664 3.614 13.858 3.614 12.673V9.318C2.783 8.334 2.281 7.054 2.281 5.667C2.281 2.537 4.816 0 7.943 0ZM10.275 10.823C9.564 11.144 8.775 11.333 7.943 11.333C7.112 11.333 6.323 11.144 5.612 10.823V12.187L7.325 11.499L7.476 11.452C7.781 11.357 8.106 11.357 8.411 11.452L8.562 11.499L10.275 12.187V10.823ZM7.943 2.004C5.92 2.004 4.279 3.64 4.279 5.667C4.28 7.694 5.92 9.33 7.943 9.33C9.966 9.33 11.606 7.694 11.606 5.667C11.606 3.64 9.966 2.004 7.943 2.004ZM9.356 4.197C9.803 3.865 10.428 3.971 10.751 4.41C11.074 4.861 10.974 5.489 10.527 5.809L7.76 7.812C7.394 8.073 6.896 8.061 6.545 7.777L5.315 6.781C4.886 6.425 4.821 5.797 5.169 5.37C5.517 4.944 6.147 4.872 6.575 5.228L7.21 5.738L9.356 4.197Z" fill="currentColor" />
    </svg>
  )
}
