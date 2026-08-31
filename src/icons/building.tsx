import type { IconProps } from "./types"

// icon / building — 18. Other, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Building({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M.373 21.408a1 1 0 0 1 1-.999h19.982a.998.998 0 0 1 0 1.999H1.373a1 1 0 0 1-1-1" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M12.89.577a1 1 0 0 1 .471.849v19.982a1 1 0 0 1-.999 1 1 1 0 0 1-.998-1V3.033L4.37 6.487v14.921a1 1 0 0 1-1.999 0V5.867a1 1 0 0 1 .557-.897L11.92.53a1 1 0 0 1 .97.047" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M11.526 4.876a1 1 0 0 1 1.382-.291l6.995 4.568c.282.185.453.499.453.837v11.418c0 .551-.449 1-1 1a1 1 0 0 1-.999-1V10.53l-6.54-4.271a1 1 0 0 1-.291-1.383m-3.16 2.545c.552 0 .999.447.999.998v.011a1 1 0 0 1-1.999 0v-.011a1 1 0 0 1 1-.998m0 2.997c.552 0 .999.447.999.999v.01a.999.999 0 1 1-1.999 0v-.01a1 1 0 0 1 1-.999m0 2.997a1 1 0 0 1 .999.999v.011a.998.998 0 0 1-1.999 0v-.011a1 1 0 0 1 1-.999m0 2.998c.552 0 .999.447.999.999v.009a1 1 0 1 1-1.999 0v-.009a1 1 0 0 1 1-.999" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.431.545a1 1 0 0 1 1.477.877v.95l5.033 3.203a1 1 0 0 1 .463.843v5.995a.998.998 0 0 1 0 1.997H1.415a.999.999 0 1 1 0-1.997V4.419a1 1 0 0 1 .521-.877zM3.413 5.012v7.401H6.91V3.104zm5.495 7.401h3.497V6.965L8.908 4.74zM5.162 9.415a1 1 0 1 1-.002 2 1 1 0 0 1 .002-2m0-2.997a1 1 0 1 1 0 1.999 1 1 0 0 1 0-1.999"/></svg>
  )
}
