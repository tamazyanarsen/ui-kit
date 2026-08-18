import type { IconProps } from "./types"

// icon / calendar — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Calendar({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M7 1C7.552 1 8 1.448 8 2V3H16V2C16 1.448 16.448 1 17 1C17.552 1 18 1.448 18 2V3H21.091C22.044 3 23 3.718 23 4.818V21.182C23 22.282 22.044 23 21.091 23H2.909C1.956 23 1 22.282 1 21.182V4.818C1 3.718 1.956 3 2.909 3H6V2C6 1.448 6.448 1 7 1ZM6 5H3V9H21V5H18V6C18 6.552 17.552 7 17 7C16.448 7 16 6.552 16 6V5H8V6C8 6.552 7.552 7 7 7C6.448 7 6 6.552 6 6V5ZM21 11H3V21H21V11Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="60.000 120.000 16.000 16.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs><clipPath id="calendar-16-clip0_70326_26"> <rect width="16" height="16" fill="white" transform="translate(60 120)" /> </clipPath></defs><g clipPath="url(#calendar-16-clip0_70326_26)"> <g> <path d="M62 134H74V124H62V134ZM76 134.454C76 135.447 75.117 136 74.363 136H61.637C60.883 136 60 135.447 60 134.454V123.546C60 122.553 60.883 122 61.637 122H74.363C75.117 122 76 122.553 76 123.546V134.454Z" fill="currentColor" /> <path d="M70 124V121C70 120.448 70.448 120 71 120C71.552 120 72 120.448 72 121V124C72 124.552 71.552 125 71 125C70.448 125 70 124.552 70 124Z" fill="currentColor" /> <path d="M64 124V121C64 120.448 64.448 120 65 120C65.552 120 66 120.448 66 121V124C66 124.552 65.552 125 65 125C64.448 125 64 124.552 64 124Z" fill="currentColor" /> <path d="M74 126C74.552 126 75 126.448 75 127C75 127.552 74.552 128 74 128H62C61.448 128 61 127.552 61 127C61 126.448 61.448 126 62 126H74Z" fill="currentColor" /> </g> </g>
    </svg>
  )
}
