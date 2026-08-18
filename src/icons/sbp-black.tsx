import type { IconProps } from "./types"

// icon / SBP black — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SbpBlack({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.514 2.13C11.831 1.95 12.219 1.96 12.528 2.15L19.528 6.5C19.817 6.68 19.995 6.99 20 7.33C20.005 7.67 19.837 7.99 19.553 8.18L13.849 11.97L19.528 15.5C19.817 15.68 19.995 15.99 20 16.33C20.005 16.67 19.837 16.99 19.553 17.18L12.553 21.83C12.247 22.04 11.852 22.06 11.527 21.88C11.203 21.71 11 21.37 11 21V13.71L5.553 17.33C5.247 17.54 4.852 17.56 4.527 17.38C4.203 17.21 4 16.87 4 16.5V7.5C4 7.14 4.197 6.8 4.514 6.63C4.831 6.45 5.219 6.46 5.528 6.65L11 10.05V3C11 2.64 11.197 2.3 11.514 2.13ZM13 4.8V10.13L17.151 7.38L13 4.8ZM6 9.3V14.63L10.151 11.88L6 9.3ZM13 19.13V13.8L17.151 16.38L13 19.13Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 2V14L13 11L3 5V11L13 5L8 2Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
