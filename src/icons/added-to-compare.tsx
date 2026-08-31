import type { IconProps } from "./types"

// icon / added to compare — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function AddedToCompare({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M20.312 17.273a1 1 0 0 1 1.415.039 1 1 0 0 1-.039 1.415l-3.169 3a1 1 0 0 1-1.322.046l-1.831-1.5a1 1 0 0 1 1.268-1.546l1.148.941zM12 18.5a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm9-8a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zM21 3a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2 1.667a1 1 0 1 0 0 2h12a1 1 0 0 0 0-2zm0 5a1 1 0 1 0 0 2h12a1 1 0 0 0 0-2zM1 13a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1m13.688-.274a1 1 0 0 0-1.376-1.452l-1.472 1.394-.54-.442a1 1 0 0 0-1.267 1.548l1.221 1a1 1 0 0 0 1.321-.048z"/></svg>
  )
}
