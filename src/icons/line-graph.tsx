import type { IconProps } from "./types"

// icon / line graph — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function LineGraph({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="m12.824 9.765.881-.66 2.22-1.662c1.632-1.223 3.307-2.48 3.492-2.623.24-.187.558-.244.833-.228.27.016.558.107.728.282a.76.76 0 0 1 .182.352c.031.128.041.269.031.406-.02.266-.117.573-.34.755l-.005.005-7.279 5.601c-.359.27-.846.297-1.233.069L7.776 9.381l-4.547 2.393v8.997h18.657a1.115 1.115 0 0 1 0 2.229H2.115A1.115 1.115 0 0 1 1 21.886V2.114a1.115 1.115 0 0 1 2.229 0v7.142L7.287 7.12c.342-.18.752-.17 1.084.025z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2 1a1 1 0 0 1 1 1v3.382l1.553-.777a1 1 0 0 1 .943.027l2.918 1.667 3.972-3.088a1 1 0 1 1 1.228 1.578l-4.5 3.5a1 1 0 0 1-1.11.079L4.969 6.634 3 7.618V13h11a1 1 0 0 1 0 2H1V2a1 1 0 0 1 1-1"/></svg>
  )
}
