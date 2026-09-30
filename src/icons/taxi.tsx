import type { IconProps } from "./types"

// icon / taxi — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Taxi({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M0 7.997c0-1.103.895-1.993 2-1.993h3c1.104 0 2 .89 2 1.993V11h1.5V7.997c0-1.103.895-1.993 2-1.993h3c1.104 0 2 .89 2 1.993V11H17V7.997c0-1.103.895-1.993 2-1.993h3c1.105 0 2 .89 2 1.993V11a2.005 2.005 0 0 1-2 2.005h-2.25v2.99a2.005 2.005 0 0 1-2 2.006h-3c-1.105 0-2-.902-2-2.005v-2.99h-1.5v2.99a2.005 2.005 0 0 1-2 2.005h-3c-1.105 0-2-.902-2-2.005v-2.99H2c-1.105 0-2-.902-2-2.006zm5 0H2V11h3zm8.5 0h-3V11h3zm8.5 0h-3V11h3zM9.25 13.004h-3v2.99h3zm8.5 0h-3v2.99h3z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M0 5.328a1.33 1.33 0 0 1 1.333-1.33h2a1.33 1.33 0 0 1 1.334 1.33v2.005h1V5.328A1.33 1.33 0 0 1 7 3.998h2a1.33 1.33 0 0 1 1.333 1.33v2.005h1V5.328a1.33 1.33 0 0 1 1.334-1.33h2A1.33 1.33 0 0 1 16 5.329v2.005a1.33 1.33 0 0 1-1.333 1.329h-1.5v2.005a1.33 1.33 0 0 1-1.334 1.329h-2a1.33 1.33 0 0 1-1.333-1.33V8.662h-1v2.005a1.33 1.33 0 0 1-1.333 1.329h-2a1.33 1.33 0 0 1-1.334-1.329V8.662h-1.5A1.33 1.33 0 0 1 0 7.332zm3.333 0h-2v2.005h2zm5.667 0H7v2.005h2zm5.667 0h-2v2.005h2zm-8.5 3.334h-2v2.005h2zm5.666 0h-2v2.005h2z" clipRule="evenodd"/></svg>
  )
}
