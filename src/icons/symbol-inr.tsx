import type { IconProps } from "./types"

// icon / Symbol / INR — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolInr({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M10.423 13.704H10.55C12.61 13.558 14.212 12.142 14.397 10.306H17.22V8.489H14.319C14.231 7.854 13.782 7.19 13.245 6.858V6.741H17.22V4.954H6.79V6.849H9.407C10.638 6.849 11.546 7.503 11.702 8.489H6.8V10.306H11.722C11.556 11.331 10.511 12.015 9.085 12.015H6.78V13.255L11.458 19.046H14.808L10.423 13.704Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.989 14L1 9.514V7.735H3.331C4.576 7.735 5.271 7.206 5.416 6.191H1V5.323H5.416C5.279 4.299 4.576 3.779 3.331 3.779H1V2H9V2.954H6.417C7.12 3.466 7.548 4.265 7.64 5.323H9V6.191H7.648C7.502 8.195 6.196 9.471 4.064 9.471H3.881L7.991 14H4.989Z" fill="currentColor" />
    </svg>
  )
}
