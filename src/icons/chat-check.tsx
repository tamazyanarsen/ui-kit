import type { IconProps } from "./types"

// icon / Chat check — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ChatCheck({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#82bf00" d="M15.361 5.023a1.5 1.5 0 0 1 2.278 1.953l-9 10.5a1.5 1.5 0 0 1-2.2.084l-4.5-4.5a1.5 1.5 0 0 1 0-2.121 1.5 1.5 0 0 1 2.121 0l3.355 3.355z"/><path fill="#c8c8cb" d="M20.611 5.773a1.5 1.5 0 0 1 2.278 1.953l-9 10.5a1.501 1.501 0 0 1-2.278-1.953z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#82bf00" d="M10.241 3.35a.998.998 0 1 1 1.518 1.301l-6 7a1 1 0 0 1-1.466.056l-3-3a1 1 0 1 1 1.414-1.414L4.943 9.53z"/><path fill="#c8c8cb" d="M13.742 3.85a.998.998 0 1 1 1.517 1.301l-6 7a1 1 0 0 1-1.517-1.301z"/></svg>
  )
}
