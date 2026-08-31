import type { IconProps } from "./types"

// icon / percent circle — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function PercentCircle({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-104 -1780)"><defs><clipPath id="percent-circle-24-clip9_70326_26"><path fill="#fff" d="M104 1780h24v24h-24z"/></clipPath></defs><g clipPath="url(#percent-circle-24-clip9_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M116 1782c-5.523 0-10 4.48-10 10s4.477 10 10 10 10-4.48 10-10-4.477-10-10-10m-12 10c0-6.63 5.373-12 12-12s12 5.37 12 12-5.373 12-12 12-12-5.37-12-12m8.667-4a.666.666 0 1 0-.002 1.328.666.666 0 0 0 .002-1.328m-2.667.67c0-1.48 1.194-2.67 2.667-2.67a2.665 2.665 0 1 1 0 5.33 2.663 2.663 0 0 1-2.667-2.66m10.874-1.54c.39.39.39 1.02 0 1.41l-8.334 8.33a1 1 0 0 1-1.414 0 .996.996 0 0 1 0-1.41l8.334-8.33a1 1 0 0 1 1.414 0m-1.541 7.54a.666.666 0 1 0 0 1.332.666.666 0 0 0 0-1.332m-2.666.66c0-1.47 1.194-2.66 2.666-2.66a2.665 2.665 0 1 1 0 5.33 2.665 2.665 0 0 1-2.666-2.67" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -1784)"><defs><clipPath id="percent-circle-16-clip10_70326_26"><path fill="#fff" d="M56 1784h16v16H56z"/></clipPath></defs><g clipPath="url(#percent-circle-16-clip10_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M64 1785.33a6.67 6.67 0 0 0 0 13.34 6.67 6.67 0 0 0 0-13.34m-8 6.67a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8m5.778-2.67a.444.444 0 1 0-.001.891.444.444 0 0 0 .001-.891m-1.778.45c0-.98.796-1.78 1.778-1.78a1.78 1.78 0 0 1 0 3.56 1.78 1.78 0 0 1-1.778-1.78m7.249-1.03c.261.26.261.68 0 .94l-5.555 5.56a.67.67 0 0 1-.943 0 .66.66 0 0 1 0-.94l5.555-5.56a.67.67 0 0 1 .943 0m-1.027 5.03a.444.444 0 1 0 0 .888.444.444 0 0 0 0-.888m-1.778.44c0-.98.796-1.78 1.778-1.78a1.78 1.78 0 0 1 0 3.56 1.78 1.78 0 0 1-1.778-1.78" clipRule="evenodd"/></g></g></svg>
  )
}
