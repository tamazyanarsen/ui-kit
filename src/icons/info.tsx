import type { IconProps } from "./types"

// 24px — отдельный рисунок `icon / information` (нода 38295:12204 внутри
// тоста типа Information): кольцо в 2px и более крупная «i». Раньше на
// 24px растягивался 16px-глиф, отчего он выглядел жирнее макета
// (дизайн-чек №3 №5).
export function Info({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M10.25 11.25a1 1 0 0 1 1-1H12a1 1 0 0 1 1 1v4.281a1 1 0 0 1-.25 1.969H12a1 1 0 0 1-1-1v-4.281a1 1 0 0 1-.75-.969" clipRule="evenodd"/><path fill="currentColor" d="M11.813 9a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0m2 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/><path fill="currentColor" d="M8 6.5a1 1 0 0 1 1 1v2.635A.999.999 0 0 1 8.5 12H8a1 1 0 0 1-1-1V8.364A.998.998 0 0 1 7.5 6.5zm-.223-.688a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/></svg>
  )
}
