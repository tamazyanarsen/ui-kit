import type { IconProps } from "./types"

// icon / Symbol / AMD — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolAmd({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M16 14v-1zm0-3.019V9.839a4.8 4.8 0 0 0-1.465-3.412A5.05 5.05 0 0 0 11 5a5.06 5.06 0 0 0-3.536 1.427A4.8 4.8 0 0 0 6 9.871h2.241a2.64 2.64 0 0 1 .808-1.901A2.78 2.78 0 0 1 11 7.183a2.8 2.8 0 0 1 1.951.787c.492.482.797 1.132.808 1.863V19H16z"/><path fill="currentColor" d="M18 11h-7v2h7m-4 1h-3v2h3"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.333 9.714v-.857zm0-2.587v-.98A4.17 4.17 0 0 0 5.167 2 4.17 4.17 0 0 0 1 6.175h1.867a2.3 2.3 0 0 1 .674-1.629 2.3 2.3 0 0 1 1.626-.675 2.3 2.3 0 0 1 1.625.675c.411.413.665.97.674 1.596V14h1.867z"/><path fill="currentColor" d="M11 7.143H5.167v1.714H11m-3.333.857h-2.5v1.715h2.5"/></svg>
  )
}
