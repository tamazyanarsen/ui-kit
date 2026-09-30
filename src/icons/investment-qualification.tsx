import type { IconProps } from "./types"

// icon / investment qualification — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function InvestmentQualification({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(-104 -4603)scale(1.18652)"><path strokeWidth="1.686" d="m95.236 3888.25 1.556 1.26 3.501-2.52"/><circle cx="97.765" cy="3887.83" r="5.9" strokeWidth="2"/><path strokeWidth="1.686" d="M101.979 3892.46v4.24c0 .59-.603 1-1.156.78l-2.745-1.1a.85.85 0 0 0-.626 0l-2.746 1.1a.845.845 0 0 1-1.155-.78v-4.66"/></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8 .993a5.67 5.67 0 0 1 5.666 5.671c0 1.388-.502 2.67-1.333 3.655l.001.012v3.346a1.667 1.667 0 0 1-2.286 1.554L8 14.412l-2.047.819a1.667 1.667 0 0 1-2.286-1.554v-3.358A5.67 5.67 0 0 1 8 .993m2.334 10.833a5.7 5.7 0 0 1-2.334.51c-.832 0-1.621-.19-2.333-.51v1.364l1.714-.688.151-.048c.306-.095.631-.095.937 0l.15.048 1.715.688zM8 2.998a3.664 3.664 0 0 0-3.667 3.666A3.664 3.664 0 0 0 8 10.331a3.664 3.664 0 0 0 3.666-3.667A3.663 3.663 0 0 0 8 2.998m1.414 2.195a1 1 0 0 1 1.396.213c.324.451.223 1.08-.224 1.4l-2.77 2.006c-.366.26-.865.249-1.215-.036L5.369 7.78a1.007 1.007 0 0 1-.145-1.411.995.995 0 0 1 1.407-.143l.636.51z"/></svg>
  )
}
