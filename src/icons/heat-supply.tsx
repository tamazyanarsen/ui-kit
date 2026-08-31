import type { IconProps } from "./types"

// icon / heat supply — 19. Categories, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function HeatSupply({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4.171 4A3 3 0 0 1 9 2.764 3 3 0 0 1 11 2a3 3 0 0 1 2 .764A3 3 0 0 1 15 2a3 3 0 0 1 2 .764 3 3 0 0 1 4.964 1.769H23a1 1 0 0 1 0 2h-1v10.934h1a1 1 0 1 1 0 2h-1.036A3 3 0 0 1 17 21.236 3 3 0 0 1 15 22a3 3 0 0 1-2-.764A3 3 0 0 1 11 22a3 3 0 0 1-2-.764A3 3 0 0 1 4 19v-9H2a1 1 0 0 1-1-1V8a1 1 0 0 1 0-2V5a1 1 0 0 1 1-1zM4 6H3v2h1zm6 13a1 1 0 0 0 2 0V5a1 1 0 0 0-2 0zM8 5a1 1 0 0 0-2 0v14a1 1 0 0 0 2 0zm6 0v14a1 1 0 0 0 2 0V5a1 1 0 0 0-2 0m4 0v14a1 1 0 0 0 2 0V5a1 1 0 0 0-2 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.5 1a2.5 2.5 0 0 1 2.45 2H15a1 1 0 0 1 0 2h-1v6h1a1 1 0 0 1 0 2h-1.05a2.5 2.5 0 0 1-2.45 2 2.5 2.5 0 0 1-1.5-.504 2.48 2.48 0 0 1-3 0A2.5 2.5 0 0 1 5.5 15 2.5 2.5 0 0 1 3 12.5V8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2l.049.002A2.5 2.5 0 0 1 5.5 1c.563 0 1.082.188 1.5.503a2.484 2.484 0 0 1 3 0A2.5 2.5 0 0 1 11.5 1m-6 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5m3 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5m3 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5"/></svg>
  )
}
