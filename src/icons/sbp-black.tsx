import type { IconProps } from "./types"

// icon / SBP black — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SbpBlack({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.514 2.13a1 1 0 0 1 1.014.02l7 4.35c.289.18.467.49.472.83s-.163.66-.447.85l-5.704 3.79 5.679 3.53c.289.18.467.49.472.83s-.163.66-.447.85l-7 4.65a.97.97 0 0 1-1.026.05A.99.99 0 0 1 11 21v-7.29l-5.447 3.62a.97.97 0 0 1-1.026.05A.99.99 0 0 1 4 16.5v-9c0-.36.197-.7.514-.87a1 1 0 0 1 1.014.02L11 10.05V3c0-.36.197-.7.514-.87M13 4.8v5.33l4.151-2.75zM6 9.3v5.33l4.151-2.75zm7 9.83V13.8l4.151 2.58z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path stroke="#000" strokeLinejoin="round" strokeWidth="2" d="M8 2v12l5-3L3 5v6l10-6z"/></svg>
  )
}
