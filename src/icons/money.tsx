import type { IconProps } from "./types"

// icon / money — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Money({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1.043 16.71a1 1 0 0 1 1.247-.667l15.445 4.68.784-3.919a1 1 0 0 1 1.961.392l-1 5a.997.997 0 0 1-1.27.761l-16.5-5a1 1 0 0 1-.667-1.247" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M1 5a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm2 1v10h18V6z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M16 11a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1M5 11a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1m7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M15 2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1.155l-.645 2.405a1 1 0 0 1-1.225.707L.741 13.103a1 1 0 0 1-.738-1.038L0 12V3a1 1 0 0 1 1-1zm-3.474 11.922.247-.922H8.086zM2 11h12V4H2zm6-6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M4 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2m8 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2M8 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1"/></svg>
  )
}
