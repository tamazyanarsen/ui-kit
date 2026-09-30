import type { IconProps } from "./types"

// icon / building — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Building({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M1 22a1 1 0 0 1 1-1h20a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1"/><path d="M13.527 1.15A1 1 0 0 1 14 2v20a1 1 0 0 1-2 0V3.61L5 7.065V22a1 1 0 0 1-2 0V6.445a1 1 0 0 1 .557-.897l9-4.445a1 1 0 0 1 .97.048"/><path d="M12.163 5.453a1 1 0 0 1 1.383-.29l7 4.57c.283.186.454.5.454.839V22a1.001 1.001 0 0 1-2 0V11.113l-6.547-4.275a1 1 0 0 1-.29-1.385M9 8a1 1 0 0 1 1 1v.01a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1m0 3a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1m0 3a1 1 0 0 1 1 1v.01a1 1 0 0 1-2 0V15a1 1 0 0 1 1-1m0 3a1 1 0 0 1 1 1v.01a1 1 0 0 1-2 0V18a1 1 0 0 1 1-1"/></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8.021 1.122A1 1 0 0 1 9.499 2v.95l5.038 3.206A1 1 0 0 1 15 7v6a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2V5c0-.366.2-.703.521-.879zM4 5.592V13h3.5V3.684zM9.5 13H13V7.548L9.5 5.321zm-3.75-3a1.001 1.001 0 1 1-.002 2.002 1.001 1.001 0 0 1 .002-2.003m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
  )
}
