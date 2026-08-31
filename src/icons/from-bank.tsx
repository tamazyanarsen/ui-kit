import type { IconProps } from "./types"

// icon / from bank — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function FromBank({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.432 1.102a1 1 0 0 1 1.147 0l10 7a1 1 0 0 1-.574 1.82h-1.983v2a1 1 0 0 1-2 0v-2h-2.65v4.141a1 1 0 0 1-2 0V9.922H10.65v7.5h.85a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2h1.011v-7.5H2.005a1 1 0 0 1-.573-1.82zm-5.421 8.82v7.5H8.65v-7.5zm-.833-2h13.655l-6.828-4.78zm14.214 6.893a1 1 0 0 1 1.414 0l2.899 2.899a1 1 0 0 1 0 1.415l-2.899 2.899a.999.999 0 1 1-1.414-1.414l1.192-1.192h-4.9a1 1 0 0 1 0-2h4.9l-1.192-1.193a1 1 0 0 1 0-1.414M0 21.422a1 1 0 0 1 1-1h12.093a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.293 10.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 1 1-1.414-1.414l.293-.293H10a1 1 0 0 1 0-2h2.586l-.293-.293a1 1 0 0 1 0-1.414M7.555 1.105a1 1 0 0 1 1.026.082l7 5A.999.999 0 0 1 15 8h-1.5l-.005.102a1 1 0 0 1-1.99 0L11.5 8h-1v2a1 1 0 0 1-2 0V8h-1v5a1 1 0 0 1-.01.129A.999.999 0 0 1 7 15H1a1 1 0 0 1 0-2h1.5V8H1a1.001 1.001 0 0 1-.581-1.813l7-5zM4.5 13h1V8h-1zm-.38-7h7.76L8 3.229z"/></svg>
  )
}
